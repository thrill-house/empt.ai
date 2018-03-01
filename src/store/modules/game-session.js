const state =  {
	start: _.now(),
  now: _.now(),
  events: {}
}

// getters
const getters = {
  getDuration: (state)  => (start = state.start, end = state.now) => {
  	return _.round(end - start);
  },
  getEvents: (state) => (type, before = state.now) => {
  	var events = _.filter(state.events, function(value) { return value.timestamp < before; });
	  
    if(type !== undefined) {
	    events = _.filter(events, { type: type });
    }
    
    return _.sortBy(events, 'timestamp');
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