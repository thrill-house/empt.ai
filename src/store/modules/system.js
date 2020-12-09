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
    getSlots: (state) => state.slots,

    // Get one training
    getTrainings: (state) => state.trainings,

    // Get one slot
    getSlot: (state, getters) => (id) => getters.getSlots()?.[id],

    // Get one training
    getTraining: (state, getters) => (id) => getters.getTrainings()?.[id],
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
    slots: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Slots/all", null, { root: true });
      commit("slots", rootGetters["Game/Slots/all"]);
    },
    trainings: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Trainings/all", null, { root: true });
      commit("trainings", rootGetters["Game/Trainings/all"]);
    },
  },
};
