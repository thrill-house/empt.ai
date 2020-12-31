import pluralize from "pluralize";
import numeral from "numeral";
import {
  ceil,
  clamp,
  defaults,
  filter,
  find,
  groupBy,
  head,
  isArray,
  isEmpty,
  keyBy,
  map,
  mapKeys,
  mapValues,
  mergeWith,
  nth,
  omitBy,
  reduce,
  reduceRight,
  reverse,
  sortBy,
  tail,
} from "lodash-es";

export default {
  namespaced: true,
  state: () => ({
    // Start time
    interval: null,
    currentTime: Date.now() / 1000,
    startTime: Date.now() / 1000,
    updateTime: Date.now() / 1000,

    resources: {
      confidence: 0,
      data: 0,
    },

    // Bases
    currentBases: {
      influence: 0,
      bandwidth: 0,
    },

    // Factors
    currentFactors: {
      influence: 0,
      bandwidth: 0,
    },
  }),
  getters: {
    // Elapsed
    elapsed: (state) => state.currentTime - state.updateTime,

    // Resources
    currentResources: (state, getters) =>
      // TODO: Complicated resource calculation including changes to frequencies over time
      ({
        confidence:
          state.resources.confidence +
          getters.elapsed * getters.currentFrequencies.influence,
        data:
          state.resources.data +
          getters.elapsed * getters.currentFrequencies.bandwidth,
      }),

    // Frequencies
    currentFrequencies: (state) => ({
      influence:
        state.currentBases.influence * (1 + state.currentFactors.influence),
      bandwidth:
        state.currentBases.bandwidth * (1 + state.currentFactors.bandwidth),
    }),

    currentEra: (state, getters, rootState, rootGetters) => {
      const sources = filter(getters.transitioned(), { document: "Sources" });
      const sourcesByEra = mapValues(
        mapKeys(
          groupBy(sources, "reference.eraId"),
          (eraSources, id) => rootGetters["labels/era"](id)?.stage
        ),
        (eraSources) => eraSources.length
      );

      const era = reduce(
        sourcesByEra,
        (accum, sourceLength, eraStage) => {
          if (
            (eraStage < 2 && sourceLength === 1) ||
            (eraStage > 1 && sourceLength === 3)
          ) {
            accum = numeral(eraStage)
              .add(1)
              .value();
          }

          return accum;
        },
        1
      );

      return clamp(era, 1, 5);
    },

    // Feelings
    currentFeelings: (state, getters, rootState, rootGetters) => {
      const slotted = rootGetters["system/slotted"]();
      const emotions = reduce(
        slotted,
        (accum, slot) => {
          const model = rootGetters["inventory/model"](slot.modelId);
          const feelings = mapValues(
            keyBy(model.feelings, "emotionId"),
            "value"
          );
          mergeWith(
            accum,
            feelings,
            (accumFeeling, feeling) => (accumFeeling || 0) + feeling
          );

          return accum;
        },
        {}
      );

      return map(emotions, (value, emotionId) => ({ emotionId, value }));
    },

    transitions: (state, getters, rootState, rootGetters) => {
      const transitions = referenceTransitions({
        transitions: {
          ...rootGetters["system/slotted"](),
          ...rootGetters["inventory/sourced"](),
          ...rootGetters["system/trained"](),
          ...rootGetters["inventory/modeled"](),
        },
        getAbility: rootGetters["inventory/ability"],
        getSocket: rootGetters["inventory/socket"],
      });

      return transitions;
    },

    transitioned: (state, getters) => (before) =>
      filter(
        getters.transitions,
        ({ transition }) =>
          before === undefined || transition.$createdAt < before
      ),
  },
  mutations: {
    interval: (state, payload) => {
      state.interval = payload;
    },
    startTime: (state, payload) => {
      state.startTime = payload;
    },
    currentTime: (state, payload) => {
      state.currentTime = payload;
    },
    updateTime: (state, payload) => {
      state.updateTime = payload;
    },
    resources: (state, payload) => {
      state.resources = payload;
    },
    currentBases: (state, payload) => {
      state.currentBases = payload;
    },
    currentFactors: (state, payload) => {
      state.currentFactors = payload;
    },
  },
  actions: {
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters["game"];

      if (game) {
        await dispatch("setStartTime", game?.$createdAt / 1000);

        await dispatch("calculateResources");
        await dispatch("calculateFrequencies");

        await dispatch("startTimer");
      }
    },

    setStartTime: async ({ commit }, payload) => {
      commit("startTime", payload);
    },

    startTimer: async ({ commit }) => {
      const interval = setInterval(() => {
        commit("currentTime", ceil(Date.now() / 1000));
      }, 1000);

      commit("interval", interval);
    },
    stopTimer: async ({ commit, state }) => {
      clearInterval(state.interval);
      commit("interval", null);
    },

    calculateResources: async ({ state, getters, commit }) => {
      const accruals = reduceRight(
        getters.transitions,
        (accum, { transition }) => {
          const transitionsBefore = getters.transitioned(
            transition.$createdAt + 1
          );
          const first = head(transitionsBefore)?.transition;
          const second = nth(transitionsBefore, 1)?.transition;
          const elapsed =
            (first?.$createdAt - (second?.$createdAt || first?.$createdAt)) /
            1000;

          const accrual = calculateAccruals({
            transitions: tail(transitionsBefore),
          });

          accum.confidence +=
            elapsed * accrual.bases.influence * (1 + accrual.factors.influence);
          accum.data +=
            elapsed * accrual.bases.bandwidth * (1 + accrual.factors.bandwidth);

          return accum;
        },
        { confidence: 0, data: 0 }
      );

      const sums = calculateSums({
        transitions: state.transitions,
      });

      const resources = reduce(
        [sums.costs, sums.bonuses, accruals],
        (accum, total) => {
          accum.confidence += total.confidence;
          accum.data += total.data;

          return accum;
        },
        { confidence: 0, data: 0 }
      );

      if (state.transitions) {
        commit(
          "updateTime",
          head(state.transitions)?.transition?.$createdAt / 1000
        );
      }
      commit("resources", resources);
    },

    calculateFrequencies: async ({ commit, rootGetters }) => {
      const frequencies = calculateAccruals({
        transitions: referenceTransitions({
          transitions: {
            ...rootGetters["system/slotted"](),
            ...rootGetters["inventory/sourced"](),
          },
          getAbility: rootGetters["inventory/ability"],
          getSocket: rootGetters["inventory/socket"],
        }),
      });

      commit("currentBases", frequencies.bases);
      commit("currentFactors", frequencies.factors);
    },
  },
};

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

export const extractValues = (payload) => {
  const { transitions, initial } = payload;

  const values = reduceRight(
    transitions,
    (accum, { reference, types }, key, collection) => {
      const dependencies = {
        slots: map(filter(collection, { document: "Slots" }), "transition"),
        trainings: map(
          filter(collection, { document: "Trainings" }),
          "transition"
        ),
      };

      const transitionValues = reduce(
        types,
        (accumValues, type) => {
          let typeValues = reference?.[pluralize(type)];

          // If it's an array, it's not a cost
          if (isArray(typeValues)) {
            typeValues = reduce(
              typeValues,
              (typeValuesAccum, typeValue) => {
                let valid = true;

                if (typeValue?.dependency?.document) {
                  valid = !!find(
                    dependencies[typeValue.dependency.document],
                    reduce(
                      typeValue.dependency.where,
                      (accumWhere, where) => {
                        accumWhere[where[0]] = where[2];
                        return accumWhere;
                      },
                      {}
                    )
                  );
                }

                if (valid) {
                  typeValuesAccum[typeValue.type] = numeral(
                    typeValuesAccum[typeValue.type] || 0
                  )
                    .add(typeValue[type] || 0)
                    .value();
                }

                return typeValuesAccum;
              },
              {}
            );

            // Turn costs into negatives
            // TODO: Refactor this once costs have the same format as bases, factors and bonuses in data contract
            // TODO: Costs should increase exponentially and be factored in here
          } else {
            typeValues = mapValues(
              typeValues,
              (typeValue) => Math.abs(typeValue) * -1
            );
          }

          accumValues[pluralize(type)] = typeValues;

          return accumValues;
        },
        {}
      );

      mergeWith(accum, transitionValues, (accumValue, transitionValue, key) => {
        if (initial?.[key]) {
          return mergeWith(accumValue, transitionValue, (aV, tV) => {
            return numeral(aV || 0)
              .add(tV || 0)
              .value();
          });
        }

        return null;
      });

      return accum;
    },
    initial
  );

  return omitBy(values, isEmpty);
};

export const calculateSums = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      costs: { confidence: 0, data: 0 },
      bonuses: { confidence: 0, data: 0 },
    },
    transitions: [],
  });

  return extractValues({ transitions, initial });
};

export const calculateAccruals = (payload) => {
  const { transitions, initial } = defaults(payload, {
    initial: {
      bases: { influence: 0, bandwidth: 0 },
      factors: { influence: 0, bandwidth: 0 },
    },
    transitions: [],
  });

  return extractValues({ transitions, initial });
};
