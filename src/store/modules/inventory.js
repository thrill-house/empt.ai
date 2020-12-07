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
  }),
  getters: {
    // Get one ability
    getAbilities: (state) => state.abilities,

    // Get one model
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
              getters.getAbility(id)?.factors || [],
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
      filter(getters.getAbility(fromId)?.factors, ({ dependency }) =>
        some(
          dependency?.where,
          (where) => where[0] === "abilityId" && where[2] === toId
        )
      ),

    // It's possible for these to exist, but UI doesn't handle it, so ignore for now.
    // getAbilityBaseFactors: (state, getters) => (id) =>
    //   filter(
    //     getters.getAbility(id)?.factors,
    //     ({ dependency }) => dependency === undefined
    //   ),

    getAbilityTreeFactors: (state, getters) => (id) =>
      filter(getters.getAbility(id)?.factors, ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "treeId")
      ),

    getAbilityEraFactors: (state, getters) => (id) =>
      filter(getters.getAbility(id)?.factors, ({ dependency }) =>
        some(dependency?.where, (where) => where[0] === "eraId")
      ),
  },
  mutations: {
    abilities: (state, payload) => {
      state.abilities = payload;
    },
    models: (state, payload) => {
      state.models = payload;
    },
  },
  actions: {
    abilities: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("app/Abilities/all", null, { root: true });
      commit("abilities", rootGetters["app/Abilities/all"]);
    },
    models: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("game/Models/all", null, { root: true });
      commit("models", rootGetters["game/Models/all"]);
    },
  },
};
