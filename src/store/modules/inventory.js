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
  }),
  getters: {
    // Get all abilities
    getAbilities: (state) => state.abilities,

    // Get all models
    getModels: (state) => state.models,

    // Get one ability
    getAbility: (state) => (id) => state.abilities?.[id],

    // Get one model
    getModel: (state) => (id) => state.models?.[id],

    // Get ability for model
    getModelAbility: (state, getters) => (id) =>
      getters.getAbility(getters.getModel(id)?.abilityId),

    // Get all models for ability
    getAbilityModels: (state) => (id) =>
      pickBy(state.models, { abilityId: id }),

    // Get dependee abilities
    getAbilityDependees: (state, getters) => (id) =>
      pickBy(
        state.abilities,
        ({ $id }, a) =>
          a !== id &&
          includes(
            extractDependencyIds(
              getters.getAbilityFactors(id) || [],
              "abilityId"
            ),
            $id
          )
      ),

    // Get dependant abilities
    getAbilityDependants: (state) => (id) =>
      pickBy(
        state.abilities,
        ({ factors }, a) =>
          a !== id && includes(extractDependencyIds(factors, "abilityId"), id)
      ),

    getAbilitySymbiosis: (state, getters) => (fromId, toId) =>
      filter(getters.getAbilityFactors(fromId), ({ dependency }) =>
        some(
          dependency?.where,
          (where) => where[0] === "abilityId" && where[2] === toId
        )
      ),

    getAbilityFactors: (state, getters) => (id) =>
      getters.getAbility(id)?.factors,

    // It's possible for these to exist, but UI doesn't handle it, so ignore for now.
    // getAbilityBaseFactors: (state, getters) => (id) =>
    //   filter(
    //     getters.getAbilityFactors(id),
    //     ({ dependency }) => dependency === undefined
    //   ),

    getAbilityTreeFactors: (state, getters) => (id) =>
      filter(getters.getAbilityFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "treeId")
      ),

    getAbilityEraFactors: (state, getters) => (id) =>
      filter(getters.getAbilityFactors(id), ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "eraId")
      ),

    getAbilityCosts: (state, getters) => (id) => getters.getAbility(id)?.costs,

    getAbilityConfidenceCosts: (state, getters) => (id) =>
      getters.getAbilityCosts(id)?.confidence,

    getAbilityDataCosts: (state, getters) => (id) =>
      getters.getAbilityCosts(id)?.data,
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
    abilities: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Abilities/all", null, { root: true });
      commit("abilities", rootGetters["App/Abilities/all"]);
    },
    models: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Models/all", null, { root: true });
      commit("models", rootGetters["Game/Models/all"]);
    },
    sockets: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Sockets/all", null, { root: true });
      commit("sockets", rootGetters["App/Sockets/all"]);
    },
    sources: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("Game/Sources/all", null, { root: true });
      commit("sources", rootGetters["Game/Sources/all"]);
    },
  },
};
