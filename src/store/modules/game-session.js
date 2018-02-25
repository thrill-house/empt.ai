const state = {
  start: _.now(),
  now: _.now()
}

// mutations
const mutations = {
  setStart: (state) => (timestamp) => {
    console.log('SETSTART');
    state.start = timestamp;
  },
  setNow: (state) => {
    state.now = _.now();
  }
}

export default {
	state,
	mutations
}