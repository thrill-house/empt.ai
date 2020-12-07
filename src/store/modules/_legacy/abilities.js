import _ from "lodash-es";
import api from "../../api";

// state
const state = {
  list: {},
};

// getters
const getters = {
  getAbilities: (state) => () => {
    return state.list;
  },
  getAbility: (state, getters) => (label) => {
    return getters.getAbilities()[label] || false;
  },
  getAbilityDependants: (state, getters) => (label) => {
    if (getters.getAbilities()) {
      let dependantAbilities = _.pickBy(
        _.pickBy(
          state.list,
          (ability) =>
            ability.factors.influence && ability.factors.influence.dependencies
        ),
        (ability) =>
          _.includes(_.keys(ability.factors.influence.dependencies), label)
      );

      return getters.getSortedSynergies(dependantAbilities, label);
    }

    return {};
  },
  getSortedSynergies: (state, getters) => (synergies, label) => {
    if (synergies) {
      let sortedSynergies = _.transform(
        _.sortBy(synergies, [
          (synergy) => _.indexOf(_.keys(getters.getEras()), synergy.era),
        ]),
        (result, value) => {
          result[value.label] = value;
        },
        {}
      );

      if (_.size(sortedSynergies)) {
        return _.mapValues(
          sortedSynergies,
          (sortedSynergy) => sortedSynergy.factors.influence.dependencies[label]
        );
      }
    }

    return {};
  },
  getAbilityEvents: (state, getters) => (label) => {
    return getters.getEventsOfType(label, "ability");
  },
  getValidAbilityEvents: (state, getters) => (label) => {
    return getters.getValidEventsOfType(label, "ability");
  },
  getAbilityCosts: (state, getters, rootState) => (event) => {
    let ability = getters.getAbility(event.label),
      activeLength = getters.getAbilityEvents(event.label).length,
      abilityCosts = {};

    if (ability) {
      _.forIn(ability.costs, (cost, key) => {
        abilityCosts[key] = cost;

        if (activeLength > 1) {
          abilityCosts[key] *= Math.pow(
            rootState.scores.MULTIPLIER_RATE,
            activeLength
          );
        }
      });
    }

    return _.defaults({ data: 0 }, abilityCosts, rootState.scores.COSTS_INIT);
  },
};

// actions
const mutations = {
  initAbilities(state, abilities) {
    state.list = abilities;
  },
};

// actions
const actions = {
  initAbilities({ commit }) {
    return api.get("abilities.json").then(function(response) {
      commit("initAbilities", _.keyBy(response.data.data, "label"));
    });
  },
  addAbilityEvent({ dispatch }, event) {
    dispatch("addEvent", event);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
