import numeral from "numeral";
import {
  ceil,
  clamp,
  filter,
  groupBy,
  head,
  keyBy,
  map,
  mapKeys,
  mapValues,
  mergeWith,
  nth,
  reduce,
  reduceRight,
  tail,
} from "lodash-es";

import {
  referenceTransitions,
  calculateSums,
  calculateAccruals,
} from "../../api";

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

      if (getters.transitions) {
        commit(
          "updateTime",
          head(getters.transitions)?.transition?.$createdAt / 1000
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
