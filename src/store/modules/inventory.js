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
  state: {},
  getters: {
    /*
     ** Get all, mapping to Dash root states
     */

    abilities: (state, getters, rootState, rootGetters) =>
      rootGetters["App/Abilities/all"],
    models: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Models/all"],
    sockets: (state, getters, rootState, rootGetters) =>
      rootGetters["App/Sockets/all"],
    sources: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Sources/all"],

    /*
     ** Get one, mapping to Dash root states
     */

    ability: (state, getters, rootState, rootGetters) =>
      rootGetters["App/Abilities/one"],
    model: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Models/one"],
    socket: (state, getters, rootState, rootGetters) =>
      rootGetters["App/Sockets/one"],
    source: (state, getters, rootState, rootGetters) =>
      rootGetters["Game/Sources/one"],

    /*
     ** Model & Ability helpers
     */

    // Get ability for model
    modelAbility: (state, getters) => (id) =>
      getters.ability(getters.model(id)?.abilityId),

    // Get all models for ability
    abilityModels: (state, getters) => (id) =>
      pickBy(getters.models, { abilityId: id }),

    // Get dependee abilities
    abilityDependees: (state, getters) => (id) =>
      pickBy(
        getters.abilities,
        ({ $id }, a) =>
          a !== id &&
          includes(
            extractDependencyIds(getters.abilityFactors(id) || [], "abilityId"),
            $id
          )
      ),

    // Get dependant abilities
    abilityDependants: (state, getters) => (id) =>
      pickBy(
        getters.abilities,
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

    abilityBases: (state, getters) => (id) => getters.ability(id)?.bases,

    abilityCoreBases: (state, getters) => (id) =>
      filter(
        getters.abilityBases(id),
        ({ dependency }) => dependency === undefined
      ),

    abilityFactors: (state, getters) => (id) => getters.ability(id)?.factors,

    // It's possible for these to exist, but UI doesn't handle it, so ignore for now.
    // abilityCoreFactors: (state, getters) => (id) =>
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

    // Socket sources
    socketSource: (state, getters) => (id) =>
      find(getters.sources, { socketId: id }),

    sourceSocket: (state, getters) => (id) =>
      getters.socket(getters.source(id)?.socketId),

    // Socket Factors

    socketBases: (state, getters) => (id) => getters.socket(id)?.bases,

    socketCoreBases: (state, getters) => (id) =>
      filter(
        getters.socketBases(id),
        ({ dependency }) => dependency === undefined
      ),

    socketTreeBases: (state, getters) => (id) =>
      filter(getters.socketBases(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "treeId")
      ),

    socketEraBases: (state, getters) => (id) =>
      filter(getters.socketBases(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "eraId")
      ),

    // Socket Factors

    socketFactors: (state, getters) => (id) => getters.socket(id)?.factors,

    socketBaseFactors: (state, getters) => (id) =>
      filter(
        getters.socketFactors(id),
        ({ dependency }) => dependency === undefined
      ),

    socketTreeFactors: (state, getters) => (id) =>
      filter(getters.socketFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "treeId")
      ),

    socketEraFactors: (state, getters) => (id) =>
      filter(getters.socketFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "eraId")
      ),

    // Socket costs

    socketCosts: (state, getters) => (id) => getters.socket(id)?.costs,

    socketConfidenceCosts: (state, getters) => (id) =>
      getters.socketCosts(id)?.confidence,

    socketDataCosts: (state, getters) => (id) => getters.socketCosts(id)?.data,
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
  },
  actions: {
    /*
     ** Init action
     */
    init: async ({ dispatch, rootGetters }) => {
      const game = rootGetters["game"];

      if (game) {
        await dispatch("fetchAbilities");
        await dispatch("fetchModels");
        await dispatch("fetchSockets");
        await dispatch("fetchSources");
      }
    },

    /*
     ** Fetching actions
     */
    fetchAbilities: async ({ dispatch }) => {
      await dispatch("App/Abilities/all", null, { root: true });
    },
    fetchModels: async ({ dispatch }) => {
      await dispatch("Game/Models/all", null, { root: true });
    },
    fetchSockets: async ({ dispatch }) => {
      await dispatch("App/Sockets/all", null, { root: true });
    },
    fetchSources: async ({ dispatch }) => {
      await dispatch("Game/Sources/all", null, { root: true });
    },
  },
};
