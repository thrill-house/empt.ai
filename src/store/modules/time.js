import _ from 'lodash';

const state = {
  start: _.now(),
  now: _.now(),
  updated: _.now(),
  interval: false,
};

// getters
const getters = {
  getStart: (state) => () => {
    return state.start;
  },
  getNow: (state) => () => {
    return state.now;
  },
  getUpdated: (state) => () => {
    return state.updated;
  },
  getDuration: (state) => (start = state.start, end = state.now) => {
    return _.round((end - start) / 1000);
  },
};

// mutations
const mutations = {
  setStart: (state, start = _.now()) => {
    state.start = start;
  },
  setNow: (state, now = _.now()) => {
    state.now = now;
  },
  setUpdated: (state, updated = _.now()) => {
    state.updated = updated;
  },
  setInterval: (state, interval = false) => {
    state.interval = interval;
  },
};

// actions
const actions = {
  startSession: ({ commit }) => {
    commit(
      'setInterval',
      window.setInterval(function() {
        commit('setNow');
      }, 1000)
    );
  },
  stopSession: ({ state, commit }) => {
    window.clearInterval(state.interval);
    commit('setInterval');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
