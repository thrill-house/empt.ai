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
  getEventsOfType: (state, getters) => (label, type, id = 'label') => {
		return _.filter(getters.getEvents(), { [id]: label, type: type });
	},
  getEventOfType: (state, getters) => (label, type, id = 'label') => {
		return _.head(getters.getEventsOfType(label, type, id));
	},
  getEventObject: (state, getters) => (event, id = 'label') => {
		var functionName = 'get' + _.upperFirst(_.camelCase(event.type));
		return getters[functionName](event[id]);
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