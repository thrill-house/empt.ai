import pluralize from "pluralize";
import Big from "big.js";
import {
  ceil,
  defaults,
  filter,
  find,
  head,
  isEmpty,
  map,
  mergeWith,
  nth,
  omitBy,
  reduce,
  reduceRight,
  reverse,
  sortBy,
  tail,
  uniq,
} from "lodash-es";

export const DIFFICULTY_COEFFICIENT = 5;
export const INITIAL_SUMS = { confidence: 0, data: 0 };
export const INITIAL_ACCRUALS = { influence: 0, bandwidth: 0 };

export const referenceTransitions = (payload) => {
  const { transitions, getAbility, getSocket } = payload;

  const values = reverse(
    sortBy(
      map(transitions, (transition) => {
        let reference = null;
        let types = [];

        switch (transition.$type) {
          case "Slots":
          case "Models":
            reference = getAbility(transition.abilityId);
            break;

          case "Sources":
          case "Trainings":
            reference = getSocket(transition.socketId);
            break;
        }

        switch (transition.$type) {
          case "Slots":
            types = ["cost", "base", "factor"];
            break;
          case "Models":
            types = ["cost"];
            break;
          case "Sources":
            types = ["cost", "base", "factor"];
            break;
          case "Trainings":
            types = ["bonus"];
            break;
        }

        return { document: transition.$type, transition, reference, types };
      }),
      "transition.$createdAt"
    )
  );

  return values;
};

export const extractDependencyIds = (dependencies, type) =>
  reduce(
    dependencies,
    (result, dependency) => {
      const dependantId = find(dependency?.dependency?.conditions || [], {
        field: type,
      })?.id;

      if (dependantId) {
        result.push(dependantId);
      }

      return uniq(result);
    },
    []
  );

export const adjustValues = (payload) => {
  const { transitions, initial } = payload;

  const values = reduceRight(
    transitions,
    (accum, { reference, types }, transitionKey, collection) => {
      const transitionValues = reduce(
        types,
        (accumValues, type) => {
          const includeTransitions = type !== "cost" || transitionKey === 0;

          const typeValues = tabulateValues({
            values: reference?.[pluralize(type)],
            type,
            transitions: includeTransitions ? collection : [],
          });

          accumValues[pluralize(type)] = typeValues;

          return accumValues;
        },
        {}
      );

      mergeWith(accum, transitionValues, (accumValue, transitionValue, key) => {
        if (initial?.[key]) {
          return tallyValues({
            initial: accumValue,
            additional: transitionValue,
          });
        }

        return null;
      });

      return accum;
    },
    initial
  );

  return omitBy({ ...values, ...initial }, isEmpty);
};

export const tabulateValues = (payload) => {
  const { values, type, transitions = false } = payload;

  const transitionsTypes = {
    models: map(filter(transitions, { document: "Models" }), "transition"),
    slots: map(filter(transitions, { document: "Slots" }), "transition"),
    sources: map(filter(transitions, { document: "Sources" }), "transition"),
    trainings: map(
      filter(transitions, { document: "Trainings" }),
      "transition"
    ),
  };

  const results = reduce(
    values,
    (accum, typeValue) => {
      const dependency = transitions !== false && typeValue?.dependency;
      const multiplier = transitions !== false && typeValue?.multiplier;
      const comparison = dependency || multiplier || false;
      const previousValue = accum[typeValue.type] || 0;
      let addedValue = typeValue[type] || 0;
      let comparisons = [];

      if (comparison) {
        comparisons = filter(
          transitionsTypes[comparison.document],
          reduce(
            comparison.conditions,
            (accumConditions, condition) => {
              accumConditions[condition.field] = condition.id;

              return accumConditions;
            },
            {}
          )
        );
      }

      const comparisonsCount = comparisons.length;

      if (dependency && !multiplier) {
        if (comparisonsCount === 0) {
          addedValue = 0;
        }
      }

      if (multiplier && !dependency) {
        if (comparisonsCount > 0) {
          addedValue = Big(addedValue)
            .times(Big(DIFFICULTY_COEFFICIENT).pow(comparisonsCount))
            .minus(addedValue)
            .toNumber();
        } else {
          addedValue = 0;
        }
      }

      accum[typeValue.type] = Big(previousValue)
        .plus(addedValue)
        .toNumber();

      return accum;
    },
    {}
  );

  return results;
};

export const tallyValues = (payload) => {
  const { initial, additional } = payload;
  const result = mergeWith(
    { ...initial },
    additional,
    (initialValue, additionalValue) =>
      Big(initialValue || 0)
        .plus(additionalValue || 0)
        .toNumber()
  );

  return result;
};

export const calculateSums = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      costs: INITIAL_SUMS,
      bonuses: INITIAL_SUMS,
    },
    transitions: [],
  });

  return adjustValues({ transitions, initial });
};

export const calculateAccruals = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      bases: INITIAL_ACCRUALS,
      factors: INITIAL_ACCRUALS,
    },
    transitions: [],
  });

  return adjustValues({ transitions, initial });
};

export const sumAccruals = (payload) => {
  const { transitions, getTransitioned } = payload;

  const accruals = reduceRight(
    transitions,
    (accum, { transition }) => {
      const transitionsBefore = getTransitioned(transition.$createdAt + 1);
      const first = head(transitionsBefore)?.transition;
      const second = nth(transitionsBefore, 1)?.transition;
      const currentElapsed = ceil(
        (first?.$createdAt - (second?.$createdAt || first?.$createdAt)) / 1000
      );

      const accrual = calculateAccruals({
        transitions: tail(transitionsBefore),
      });

      accum.confidence += Big(accrual.factors.influence)
        .plus(1)
        .times(accrual.bases.influence)
        .times(currentElapsed)
        .toNumber();

      accum.data += Big(accrual.factors.bandwidth)
        .plus(1)
        .times(accrual.bases.bandwidth)
        .times(currentElapsed)
        .toNumber();

      return accum;
    },
    { ...INITIAL_SUMS }
  );

  return accruals;
};
