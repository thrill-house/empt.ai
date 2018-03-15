const state =  {
	start: _.now(),
  now: _.now(),
  events: {}
}

// getters
const getters = {
  getNow: (state) => () => {
  	return state.now;
  },
  getDuration: (state)  => (start = state.start, end = state.now) => {
  	return _.round((end - start) / 1000);
  },
  getEvents: (state) => (before = state.now) => {
  	return _.sortBy(_.filter(state.events, function(value) { return value.timestamp < before; }), 'timestamp');
  },
  getEventOfType: (state, getters) => (label, type, id = 'label') => {
		return _.find(getters.getEvents(), { [id]: label, type: type });
	}
}

// mutations
const mutations = {
  setStart: (state, start = _.now()) => {
	  state.start = start;
  },
  setNow: (state, now = _.now()) => {
    state.now = now;
  },
  addEvent: (state, event, timestamp = _.now()) => {
    state.events[timestamp] = event;
  },
  setEvents: (state, events) => {
    if(events !== undefined) {
		  state.events = events;
	  }
  }
}

// actions
const actions = {
  startSession: (context) => {
	  window.setInterval(function() {
		  context.commit('setNow');
		}, 1000);
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}