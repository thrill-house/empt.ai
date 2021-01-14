import Big from "big.js";
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
  sumValues,
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
            accum = eraStage + 1;
          }

          return accum;
        },
        1
      );

      return clamp(era, 1, 5);
    },

    // Feelings
    currentFeelings: (state, getters, rootState, rootGetters) => {
      const slotted = rootGetters["system/adjustSlotted"]();
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

    transitioned: (state, getters, rootState, rootGetters) => (before) => {
      const transitions = referenceTransitions({
        transitions: {
          ...rootGetters["system/adjustSlotted"](before),
          ...rootGetters["inventory/sourced"](before),
          ...rootGetters["system/trained"](before),
          ...rootGetters["inventory/modeled"](before),
        },
        getAbility: rootGetters["inventory/ability"],
        getSocket: rootGetters["inventory/socket"],
      });

      return transitions;
    },
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

    traverseTransitions: async ({ getters }) => {
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

          accum.confidence += Big(accrual.factors.influence)
            .plus(1)
            .times(accrual.bases.influence)
            .times(elapsed)
            .toNumber();

          accum.data += Big(accrual.factors.bandwidth)
            .plus(1)
            .times(accrual.bases.bandwidth)
            .times(elapsed)
            .toNumber();

          return accum;
        },
        { confidence: 0, data: 0 }
      );

      return accruals;
    },

    calculateResources: async ({ getters, commit, dispatch }) => {
      const traversedAccruals = await dispatch("traverseTransitions");

      const sums = calculateSums({
        transitions: getters.transitions,
      });

      const resources = reduce(
        [sums.costs, sums.bonuses, traversedAccruals],
        (accum, additional) => {
          return sumValues({
            initial: accum,
            additional,
          });
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
            ...rootGetters["system/adjustSlotted"](),
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
