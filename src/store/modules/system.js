import { find } from "lodash-es";

export default {
  namespaced: true,
  state: () => ({
    // Slots
    slots: {},

    // Trainings
    trainings: {},

    // Events
    // events: {}, // Maybe one day ;)

    // Slotting
    slotting: {
      gameId: null,
      modelId: null,
      sourceId: null,
      abilityId: null,
      socketId: null,
      slotId: "11111111111111111111111111111111111111111111",
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

    // Get one slot
    sourceSlot: (state) => (sourceId, slotIndex) =>
      find(state.slots, { sourceId, slotIndex }),
  },
  mutations: {
    slots: (state, payload) => {
      state.slots = payload;
    },
    trainings: (state, payload) => {
      state.trainings = payload;
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
     ** Slotting actions
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
        slotId: "11111111111111111111111111111111111111111111",
        slotIndex: null,
      });
    },

    slottingModel: ({ commit, rootGetters, state }, payload) => {
      const model = rootGetters["inventory/model"](payload);
      const ability = rootGetters["inventory/modelAbility"](payload);

      if (model.$id && ability.$id) {
        const newSlotting = {
          ...state.slotting,
          modelId: model.$id,
          abilityId: ability.$id,
        };

        commit("slotting", newSlotting);
      }
    },

    slottingSource: ({ commit, rootGetters, state }, payload) => {
      const source = rootGetters["inventory/source"](payload);
      const socket = rootGetters["inventory/sourceSocket"](payload);

      if (source.$id && socket.$id) {
        const newSlotting = {
          ...state.slotting,
          sourceId: source.$id,
          socketId: socket.$id,
          eraId: socket.eraId,
          treeId: socket.treeId,
        };

        commit("slotting", newSlotting);
      }
    },

    slottingIndex: ({ commit, state }, payload) => {
      const newSlotting = {
        ...state.slotting,
        slotIndex: payload,
      };

      commit("slotting", newSlotting);
    },

    slottingSlot: ({ commit, state }, payload) => {
      const newSlotting = {
        ...state.slotting,
        slotId: payload,
      };

      commit("slotting", newSlotting);
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
