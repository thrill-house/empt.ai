import { find, filter, includes, pickBy, reduce, some, uniq } from "lodash-es";

export const extractDependencyIds = (dependencies, type) =>
  reduce(
    dependencies,
    (result, dependency) => {
      const dependantId = find(
        dependency?.dependency?.where || [],
        (where) => where[0] === type
      )?.[2];

      if (dependantId) {
        result.push(dependantId);
      }

      return uniq(result);
    },
    []
  );

export default {
  namespaced: true,
  state: () => ({
    // Abilities
    abilities: {},

    // Models
    models: {},

    // Sockets
    sockets: {},

    // Sources
    sources: {},

    // Install
    installing: {
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
    /*
     ** Get All
     */

    // Get all abilities
    abilities: (state) => state.abilities,

    // Get all models
    models: (state) => state.models,

    // Get all sockets
    sockets: (state) => state.sockets,

    // Get all sources
    sources: (state) => state.sources,

    /*
     ** Get All
     */

    // Get one ability
    ability: (state) => (id) => state.abilities?.[id],

    // Get one model
    model: (state) => (id) => state.models?.[id],

    // Get one socket
    socket: (state) => (id) => state.sockets?.[id],

    // Get one source
    source: (state) => (id) => state.sources?.[id],

    // Get install
    installing: (state) => state.installing,

    /*
     ** Model & Ability helpers
     */

    // Get ability for model
    modelAbility: (state, getters) => (id) =>
      getters.ability(getters.model(id)?.abilityId),

    // Get all models for ability
    abilityModels: (state) => (id) => pickBy(state.models, { abilityId: id }),

    // Get dependee abilities
    abilityDependees: (state, getters) => (id) =>
      pickBy(
        state.abilities,
        ({ $id }, a) =>
          a !== id &&
          includes(
            extractDependencyIds(getters.abilityFactors(id) || [], "abilityId"),
            $id
          )
      ),

    // Get dependant abilities
    abilityDependants: (state) => (id) =>
      pickBy(
        state.abilities,
        ({ factors }, a) =>
          a !== id && includes(extractDependencyIds(factors, "abilityId"), id)
      ),

    abilitySymbiosis: (state, getters) => (fromId, toId) =>
      filter(getters.abilityFactors(fromId), ({ dependency }) =>
        some(
          dependency?.where,
          (where) => where[0] === "abilityId" && where[2] === toId
        )
      ),

    abilityFactors: (state, getters) => (id) => getters.ability(id)?.factors,

    // It's possible for these to exist, but UI doesn't handle it, so ignore for now.
    // abilityBaseFactors: (state, getters) => (id) =>
    //   filter(
    //     getters.abilityFactors(id),
    //     ({ dependency }) => dependency === undefined
    //   ),

    abilityTreeFactors: (state, getters) => (id) =>
      filter(getters.abilityFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "treeId")
      ),

    abilityEraFactors: (state, getters) => (id) =>
      filter(getters.abilityFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "eraId")
      ),

    abilityCosts: (state, getters) => (id) => getters.ability(id)?.costs,

    abilityConfidenceCosts: (state, getters) => (id) =>
      getters.abilityCosts(id)?.confidence,

    abilityDataCosts: (state, getters) => (id) =>
      getters.abilityCosts(id)?.data,

    /*
     ** Socket & Source helpers
     */
  },
  mutations: {
    abilities: (state, payload) => {
      state.abilities = payload;
    },
    models: (state, payload) => {
      state.models = payload;
    },
    sockets: (state, payload) => {
      state.sockets = payload;
    },
    sources: (state, payload) => {
      state.sources = payload;
    },
    installing: (state, payload) => {
      console.log({ payload });
      state.installing = payload;
    },
  },
  actions: {
    /*
     ** Init action
     */
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters["game"];

      if (game) {
        dispatch("resetInstalling");

        await dispatch("fetchAbilities");
        await dispatch("fetchModels");
        await dispatch("fetchSockets");
        await dispatch("fetchSources");
      }
    },

    /*
     ** Installation actions
     */
    resetInstalling: ({ commit, rootState }) => {
      commit("installing", {
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

    installingModel: ({ commit, getters, state }, payload) => {
      const model = getters.model(payload);
      const ability = getters.modelAbility(payload);

      console.log({ model: model.$id, ability: ability.$id });

      if (model.$id && ability.$id) {
        const newInstalling = {
          ...state.install,
          modelId: model.$id,
          abilityId: ability.$id,
        };

        console.log({ newInstalling });

        commit("installing", newInstalling);
      }
    },

    installingSource: ({ commit, getters, state }, ...payload) => () => {
      const [id = null, slotIndex = null, slotId = null] = payload;

      const source = getters.source(id);
      const socket = getters.sourceSocket(id);

      if (source.$id && socket.$id && slotIndex) {
        const newInstalling = {
          ...state.install,
          sourceId: source.$id,
          socketId: socket.$id,
          eraId: socket.eraId,
          treeId: socket.treeId,
          slotId,
          slotIndex,
        };

        commit("installing", newInstalling);
      }
    },

    /*
     ** Fetching actions
     */
    fetchAbilities: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Abilities/all", null, { root: true });

      commit("abilities", rootGetters["App/Abilities/all"]);
    },
    fetchModels: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Models/all", null, { root: true });

      commit("models", rootGetters["Game/Models/all"]);
    },
    fetchSockets: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Sockets/all", null, { root: true });

      commit("sockets", rootGetters["App/Sockets/all"]);
    },
    fetchSources: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Sources/all", null, { root: true });

      commit("sources", rootGetters["Game/Sources/all"]);
    },
  },
};
