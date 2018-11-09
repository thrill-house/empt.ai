const state = {
  student: {
    name: "Student",
    active: false,
    enables: "influence"
  },
  university: {
    name: "University",
    active: false
  },
  business: {
    name: "Business",
    active: false
  },
  government: {
    name: "Government",
    active: false
  },
  consciousness: {
    name: "Consciousness",
    active: false
  }
};

// getters
const getters = {
  getEra: (state, getters) => label => {
    return state[label];
  },
  isEraActive: (state, getters) => label => {
    var era = getters.getEra(label);
    return era["active"] !== undefined && era.active;
  }
};

// mutations
const mutations = {
  activateEra: (state, era) => {
    state[era].active = true;
  }
};

// actions
const actions = {
  activateEra: ({ state, commit }, era = "student") => {
    commit("activateEra", era);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
