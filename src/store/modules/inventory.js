import {
  find,
  filter,
  includes,
  keyBy,
  map,
  pickBy,
  reduce,
  reverse,
  some,
  sortBy,
  uniq,
} from "lodash-es";
import { extractValues, referenceTransitions } from "./score";

export const extractDependencyIds = (dependencies, type) =>
  reduce(
    dependencies,
    (result, dependency) => {
      const dependantId = find(dependency?.dependency?.conditions || [], {
        field: type,
      })?.id;

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

    // Get currently sourced
    sourced: (state, getters) => (before) => {
      const sources = reverse(sortBy(getters.sources, "$createdAt"));

      const filteredBefore = filter(
        sources,
        (source) => before === undefined || source.$createdAt < before
      );

      return keyBy(filteredBefore, "$id");
    },

    // Get currently modeled
    modeled: (state, getters) => (before) => {
      const models = reverse(sortBy(getters.models, "$createdAt"));

      const filteredBefore = filter(
        models,
        (model) => before === undefined || model.$createdAt < before
      );

      return keyBy(filteredBefore, "$id");
    },

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
          dependency?.conditions,
          (conditions) =>
            conditions.field === "abilityId" && conditions.id === toId
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
        some(
          dependency?.conditions,
          (condition) => condition.field === "treeId"
        )
      ),

    abilityEraFactors: (state, getters) => (id) =>
      filter(getters.abilityFactors(id), ({ dependency }) =>
        some(dependency?.conditions, (condition) => condition.field === "eraId")
      ),

    abilityCosts: (state, getters) => (id) => getters.ability(id)?.costs,

    abilityCoreCosts: (state, getters) => (id) =>
      filter(
        getters.abilityCosts(id),
        ({ multiplier }) => multiplier === undefined
      ),

    abilityAdjustedCosts: (state, getters) => (id, transitions) => {
      const abilityTransitions = referenceTransitions({
        transitions,
        getAbility: getters["ability"],
        getSocket: getters["socket"],
      });

      const abilityCoreCosts = reduce(
        getters.abilityCosts(id),
        (accum, { type, cost }) => {
          accum[type] = cost;
          return accum;
        },
        {}
      );

      const adjustedCosts = extractValues({
        transitions: abilityTransitions,
        initial: { costs: abilityCoreCosts },
      });

      return adjustedCosts.costs;
    },

    abilityConfidenceCosts: (state, getters) => (id) => {
      const abilityModels = map(getters["abilityModels"](id));
      return getters.abilityAdjustedCosts(id, abilityModels)?.confidence;
    },

    abilityDataCosts: (state, getters, rootState, rootGetters) => (id) => {
      const abilitySlots = map(rootGetters["system/abilitySlots"](id));
      return getters.abilityAdjustedCosts(id, abilitySlots)?.data;
    },

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
        some(
          dependency?.conditions,
          (condition) => condition.field === "treeId"
        )
      ),

    socketEraBases: (state, getters) => (id) =>
      filter(getters.socketBases(id), ({ dependency }) =>
        some(dependency?.conditions, (condition) => condition.field === "eraId")
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
        some(
          dependency?.conditions,
          (condition) => condition.field === "treeId"
        )
      ),

    socketEraFactors: (state, getters) => (id) =>
      filter(getters.socketFactors(id), ({ dependency }) =>
        some(dependency?.conditions, (condition) => condition.field === "eraId")
      ),

    // Socket costs

    socketCosts: (state, getters) => (id) => getters.socket(id)?.costs,

    socketCoreCosts: (state, getters) => (id) =>
      filter(
        getters.socketCosts(id),
        ({ multiplier }) => multiplier === undefined
      ),

    socketAdjustedCosts: (state, getters) => (id, transitions) => {
      const socketTransitions = referenceTransitions({
        transitions,
        getAbility: getters["ability"],
        getSocket: getters["socket"],
      });

      const socketCoreCosts = reduce(
        getters.socketCoreCosts(id),
        (accum, { type, cost }) => {
          accum[type] = cost;
          return accum;
        },
        {}
      );

      const adjustedCosts = extractValues({
        transitions: socketTransitions,
        initial: { costs: socketCoreCosts },
      });

      return adjustedCosts.costs;
    },

    socketConfidenceCosts: (state, getters) => (id) => {
      const socketSource = getters["socketSource"](id);
      return getters.socketAdjustedCosts(id, socketSource ? [socketSource] : [])
        ?.confidence;
    },

    socketDataCosts: (state, getters) => (id) => {
      return getters.socketAdjustedCosts(id, [])?.data;
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
