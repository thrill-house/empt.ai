import {
  filter,
  find,
  includes,
  keyBy,
  map,
  pickBy,
  reverse,
  sortBy,
  uniq,
  without,
} from "lodash-es";

export default {
  namespaced: true,
  state: () => ({
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
    /*
     ** Get all, mapping to Dash root states
     */

    slots: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Slots/all"],
    trainings: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Trainings/all"],

    /*
     ** Get one, mapping to Dash root states
     */

    slot: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Slots/one"],
    training: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Trainings/one"],

    // Get slotting
    slotting: (state) => state.slotting,

    // Get currently slotted
    slotted: (state, getters) => (before) => {
      const slots = getters.slots;
      const sorted = sortBy(slots, "$createdAt");
      const reversed = reverse(sorted);
      const filteredBefore = filter(
        reversed,
        (slot) => before === undefined || slot.$createdAt < before
      );
      let modelKeys = uniq(map(filteredBefore, "modelId"));
      const slotKeys = uniq(map(filteredBefore, "slotId"));
      const filterModels = filter(filteredBefore, (slot) => {
        if (includes(modelKeys, slot.modelId)) {
          modelKeys = without(modelKeys, slot.modelId);
          return true;
        }

        return false;
      });
      const filterSlots = filter(
        filterModels,
        (slot) => !includes(slotKeys, slot.$id)
      );

      return keyBy(filterSlots, "$id");
    },

    // Get all slots, given a source
    sourceSlots: (state, getters) => (sourceId) =>
      pickBy(getters.slotted(), {
        sourceId,
      }),

    // Get a slot, given a source and index
    sourceSlot: (state, getters) => (sourceId, slotIndex) =>
      find(getters.sourceSlots(sourceId), {
        slotIndex,
      }),

    // Get a slots, given a model
    modelSlot: (state, getters) => (modelId) =>
      find(getters.slotted(), {
        modelId,
      }),

    // Get all slots, given a model
    abilitySlots: (state, getters) => (abilityId) =>
      pickBy(getters.slotted(), {
        abilityId,
      }),
  },
  mutations: {
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
    fetchSlots: async ({ dispatch }) => {
      await dispatch("Game/Slots/all", null, { root: true });
    },
    fetchTrainings: async ({ dispatch }) => {
      await dispatch("Game/Trainings/all", null, { root: true });
    },
  },
};
