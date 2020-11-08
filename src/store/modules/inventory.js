import { filter, find, includes, reduce, uniq } from "lodash-es";

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
    getAbility: (state) => (id) => state.abilities[id],

    // Get one model
    getModel: (state) => (id) => state.models[id],

    // Get ability for model
    getModelAbility: (state, getters) => (id) =>
      getters.getAbility(getters.getModel(id).abilityId),

    // Get all models for ability
    getAbilityModels: (state) => (id) =>
      filter(state.models, { abilityId: id }),

    // Get symbiotic abilities
    getAbilitySymbiotes: (state) => (id) => {
      return filter(state.abilities, (ability) => {
        const dependantAbilities = extractDependencyIds(
          ability.factors,
          "abilityId"
        );

        return includes(dependantAbilities, id);
      });
    },
    // Get dependant abilities
    getAbilityDependents: (state, getters) => (id) => {
      const dependantAbilities = extractDependencyIds(
        getters.getAbility(id).factors,
        "abilityId"
      );

      return filter(state.abilities, ({ $id }) => {
        return includes(dependantAbilities, $id);
      });
    },

    getAbilityDependencyIds: (state) => (id) =>
      filter(state.models, { abilityId: id }),
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
      const allAbilities = rootGetters["app/Abilities/all"];
      // TODO: Filter abilities based on game era and other conditions

      commit("abilities", allAbilities);
    },
    models: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("game/Models/all", null, { root: true });
      const allModels = rootGetters["game/Models/all"];

      commit("models", allModels);
    },
  },
};
