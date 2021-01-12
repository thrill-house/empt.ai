import pluralize from "pluralize";
import numeral from "numeral";
import {
  defaults,
  filter,
  isEmpty,
  map,
  mergeWith,
  omitBy,
  reduce,
  reduceRight,
  reverse,
  sortBy,
} from "lodash-es";

export const DIFFICULTY = 1.1;
export const COSTS = { confidence: 0, data: 0 };
export const BONUSES = { confidence: 0, data: 0 };
export const BASES = { influence: 0, bandwidth: 0 };
export const FACTORS = { influence: 0, bandwidth: 0 };

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

export const adjustValues = (payload) => {
  const { transitions, initial } = payload;

  const values = reduceRight(
    transitions,
    (accum, { reference, types }, transitionKey, collection) => {
      const transitionValues = reduce(
        types,
        (accumValues, type) => {
          const includeTransitions = type !== "cost" || transitionKey === 0;

          const typeValues = extractValues({
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
          return sumValues({
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

export const extractValues = (payload) => {
  const { values, type, transitions = [], compare = true } = payload;

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
      const dependency = compare && typeValue?.dependency;
      const multiplier = compare && typeValue?.multiplier;
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
          addedValue = numeral(addedValue)
            .multiply(Math.pow(DIFFICULTY, comparisonsCount))
            .subtract(addedValue)
            .value();
        } else {
          addedValue = 0;
        }
      }

      accum[typeValue.type] = numeral(previousValue)
        .add(addedValue)
        .value();

      return accum;
    },
    {}
  );

  return results;
};

export const sumValues = (payload) => {
  const { initial, additional } = payload;
  const result = mergeWith(
    { ...initial },
    additional,
    (initialValue, additionalValue) =>
      numeral(initialValue || 0)
        .add(additionalValue || 0)
        .value()
  );

  return result;
};

export const calculateSums = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      costs: COSTS,
      bonuses: BONUSES,
    },
    transitions: [],
  });

  return adjustValues({ transitions, initial });
};

export const calculateAccruals = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      bases: BASES,
      factors: FACTORS,
    },
    transitions: [],
  });

  return adjustValues({ transitions, initial });
};
