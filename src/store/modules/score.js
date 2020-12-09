import { ceil, random, reduce } from "lodash-es";

export const getScores = (getters) => {
  const sources = getters["Game/Sources/all"];
  const slots = getters["Game/Slots/all"];
  const trainings = getters["Game/Trainings/all"];

  return { sources, slots, trainings };
};

export const calculateBases = ({ sources, slots, trainings }) => {
  const fromSources = reduce(
    sources,
    (result, source) => {
      // TODO: Get actual impact on bases from this source event.
      console.debug(source);
      return {
        influence: result.influence + 1,
        bandwidth: result.bandwidth + 1,
      };
    },
    {
      influence: 1,
      bandwidth: 1,
    }
  );

  const fromSlots = reduce(
    slots,
    (result, slot) => {
      // TODO: Get actual impact on bases from this slot event.
      console.debug(slot);
      return {
        influence: result.influence + 1,
        bandwidth: result.bandwidth + 1,
      };
    },
    fromSources
  );

  const fromTrainings = reduce(
    trainings,
    (result, training) => {
      // TODO: Get actual impact on bases from this training event.
      console.debug(training);
      return {
        influence: result.influence + 1,
        bandwidth: result.bandwidth + 1,
      };
    },
    fromSlots
  );

  return fromTrainings;
};

export const calculateFactors = ({ sources, slots, trainings }) => {
  const fromSources = reduce(
    sources,
    (result, source) => {
      // TODO: Get actual impact on factors from this source event.
      console.debug(source);
      return {
        influence: result.influence + 0.1,
        bandwidth: result.bandwidth + 0.1,
      };
    },
    {
      influence: 0,
      bandwidth: 0,
    }
  );

  const fromSlots = reduce(
    slots,
    (result, slot) => {
      // TODO: Get actual impact on factors from this slot event.
      console.debug(slot);
      return {
        influence: result.influence + 0.1,
        bandwidth: result.bandwidth + 0.1,
      };
    },
    fromSources
  );

  const fromTrainings = reduce(
    trainings,
    (result, training) => {
      // TODO: Get actual impact on factors from this training event.
      console.debug(training);
      return {
        influence: result.influence + 0.1,
        bandwidth: result.bandwidth + 0.1,
      };
    },
    fromSlots
  );

  return fromTrainings;
};

export default {
  namespaced: true,
  state: () => ({
    // Start time
    interval: null,
    currentTime: Date.now() / 1000,
    startTime: Date.now() / 1000,

    // Bases
    bases: {
      influence: 0,
      bandwidth: 0,
    },

    // factors
    factors: {
      influence: 0,
      bandwidth: 0,
    },
  }),
  getters: {
    // Elapsed
    elapsed: (state) => state.currentTime - state.startTime,

    // Resources
    resources: (state, getters) =>
    // TODO: Complicated resource calculation including changes to frequencies over time
    ({
      data: getters.elapsed * getters.frequencies.influence,
      confidence: getters.elapsed * getters.frequencies.bandwidth,
    }),

    // Frequencies
    frequencies: (state) => ({
      influence: state.bases.influence * (1 + state.factors.influence),
      bandwidth: state.bases.bandwidth * (1 + state.factors.bandwidth),
    }),

    // Emotions
    emotions: () =>
    // TODO: Complicated emotion calculation based on currently slotted models
    ({
      happiness: random(1, 7),
      sadness: random(1, 7),
      excitement: random(1, 7),
      fear: random(1, 7),
      tenderness: random(1, 7),
      anger: random(1, 7),
    }),
  },
  mutations: {
    setInterval: (state, payload) => {
      state.interval = payload;
    },
    setStartTime: (state, payload) => {
      state.startTime = payload;
    },
    setCurrentTime: (state, payload) => {
      state.currentTime = payload;
    },
    setBases: (state, payload) => {
      state.bases = payload;
    },
    setFactors: (state, payload) => {
      state.factors = payload;
    },
  },
  actions: {
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters['game'];

      if (game) {
        await dispatch("setStartTime", game?.$createdAt / 1000);

        await dispatch("calculateBases");
        await dispatch("calculateFactors");

        await dispatch("startTimer");
      }
    },

    setStartTime: async ({ commit }, payload) => {
      commit("setStartTime", payload);
    },

    startTimer: async ({ commit }) => {
      const interval = setInterval(() => {
        commit("setCurrentTime", ceil(Date.now() / 1000));
      }, 1000);

      commit("setInterval", interval);
    },
    stopTimer: async ({ commit, state }) => {
      clearInterval(state.interval);
      commit("setInterval", null);
    },

    calculateBases: async ({ commit }) => {
      // TODO: Pass in real events
      const bases = calculateBases({
        sources: [1, 2, 3],
        slots: [1, 2, 3],
        trainings: [1, 2, 3],
      });

      commit("setBases", bases);
    },
    calculateFactors: async ({ commit }) => {
      // TODO: Pass in real events
      const factors = calculateFactors({
        sources: [1, 2, 3],
        slots: [1, 2, 3],
        trainings: [1, 2, 3],
      });

      commit("setFactors", factors);
    },
  },
};
