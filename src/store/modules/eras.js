import _ from "lodash-es";

const state = {
  student: {
    name: "Student",
    stage: 1,
    active: false,
    enables: "influence",
  },
  university: {
    name: "University",
    stage: 2,
    active: false,
  },
  business: {
    name: "Business",
    stage: 3,
    active: false,
  },
  government: {
    name: "Government",
    stage: 4,
    active: false,
  },
  consciousness: {
    name: "Consciousness",
    stage: 5,
    active: false,
  },
};

// getters
const getters = {
  getEras: (state) => () => {
    return state;
  },
  getEra: (state, getters) => (label) => {
    return getters.getEras()[label];
  },
  getStage: (state, getters) => (label) => {
    return getters.getEra(label).stage;
  },
  getStages: (state, getters) => () => {
    return _.keys(getters.getEras()).length;
  },
  getIsEraActive: (state, getters) => (label) => {
    let era = getters.getEra(label);
    return era["active"] !== undefined && era.active;
  },
};

// mutations
const mutations = {
  activateEra: (state, era) => {
    state[era].active = true;
  },
};

// actions
const actions = {
  activateEra: ({ commit }, era = "student") => {
    commit("activateEra", era);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
