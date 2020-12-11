export default {
  namespaced: true,
  state: () => ({
    // Slots
    slots: {},

    // Trainings
    trainings: {},

    // Events
    // events: {}, // Maybe one day ;)
  }),
  getters: {
    // Get one ability
    slots: (state) => state.slots,

    // Get one training
    trainings: (state) => state.trainings,

    // Get one slot
    slot: (state, getters) => (id) => getters.slots?.[id],

    // Get one training
    training: (state, getters) => (id) => getters.trainings?.[id],
  },
  mutations: {
    slots: (state, payload) => {
      state.abilities = payload;
    },
    trainings: (state, payload) => {
      state.models = payload;
    },
  },
  actions: {
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters["game"];

      if (game) {
        await dispatch("fetchSlots");
        await dispatch("fetchTrainings");
      }
    },

    fetchSlots: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Slots/all", null, { root: true });
      commit("slots", rootGetters["Game/Slots/all"]);
    },
    fetchTrainings: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Trainings/all", null, { root: true });
      commit("trainings", rootGetters["Game/Trainings/all"]);
    },
  },
};
