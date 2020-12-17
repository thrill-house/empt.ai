export default {
  namespaced: true,
  state: () => ({
    // Slots
    slots: {},

    // Trainings
    trainings: {},

    // Events
    // events: {}, // Maybe one day ;)

    // Install
    slotting: {
      gameId: null,
      modelId: null,
      sourceId: null,
      abilityId: null,
      socketId: null,
      slotId: null,
      slotIndex: null,
    },
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

    // Get install
    slotting: (state) => state.slotting,
  },
  mutations: {
    slots: (state, payload) => {
      state.abilities = payload;
    },
    trainings: (state, payload) => {
      state.models = payload;
    },
    slotting: (state, payload) => {
      state.slotting = payload;
    },
  },
  actions: {
    /*
     ** Init action
     */
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters["game"];

      if (game) {
        dispatch("slottingReset");

        await dispatch("fetchSlots");
        await dispatch("fetchTrainings");
      }
    },

    /*
     ** Installation actions
     */
    slottingReset: ({ commit, rootState }) => {
      commit("slotting", {
        gameId: rootState.gameId,
        modelId: null,
        abilityId: null,
        sourceId: null,
        socketId: null,
        eraId: null,
        treeId: null,
        slotId: null,
        slotIndex: null,
      });
    },

    slottingModel: ({ commit, rootGetters, state }, payload) => {
      const model = rootGetters["inventory/model"](payload);
      const ability = rootGetters["inventory/modelAbility"](payload);

      if (model.$id && ability.$id) {
        const newSlotting = {
          ...state.install,
          modelId: model.$id,
          abilityId: ability.$id,
        };

        commit("slotting", newSlotting);
      }
    },

    slottingSource: ({ commit, rootGetters, state }, ...payload) => () => {
      const [id = null, slotIndex = null, slotId = null] = payload;

      const source = rootGetters["inventory/source"](id);
      const socket = rootGetters["inventory/sourceSocket"](id);

      if (source.$id && socket.$id && slotIndex) {
        const newSlotting = {
          ...state.install,
          sourceId: source.$id,
          socketId: socket.$id,
          eraId: socket.eraId,
          treeId: socket.treeId,
          slotId,
          slotIndex,
        };

        commit("slotting", newSlotting);
      }
    },

    /*
     ** Fetching actions
     */
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
