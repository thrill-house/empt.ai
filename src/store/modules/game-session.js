const state =  {
	start: _.now(),
  now: _.now(),
  interval: false,
  events: {},
}

// getters
const getters = {
  getStart: (state) => () => {
  	return state.start;
  },
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
	},
  getEventCosts: (state, getters) => (event, id = 'label') => {
		var functionName = 'get' + _.upperFirst(_.camelCase(event.type)) + 'Costs';
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
  setInterval: (state, interval = false) => {
    state.interval = interval;
  },
  addEvent: (state, event) => {
	  if(event !== undefined) {
		  state.events[event.timestamp] = event;
	  }
  }
}

// actions
const actions = {
  addEvent: ({ commit, dispatch, getters }, event, timestamp = _.now()) => {
	  var eventObject = getters.getEventObject(event);
	  var scores = getters.getScores(timestamp);
	  var costs = getters.getEventCosts(event);
	  
	  var match = _.isMatchWith(costs, scores, function(cost, score) { return cost <= score; });
	  
	  if(match) {
		  event.timestamp = timestamp;
		  commit('addEvent', event);
		  
		  return true;
	  } else {
		  alert('You can’t afford that');
		  
		  return false;
	  }
  },
  setEvents: ({ dispatch }, events) => {
	  _.each(events, function(event) {
		  dispatch('addEvent', event, event.timestamp);
	  });
  },
  startSession: (context) => {
		context.commit('setInterval',
			window.setInterval(function() {
			  context.commit('setNow');
			}, 1000)
		);
  },
  stopSession: (context) => {
	  window.clearInterval(context.state.interval);
	  context.commit('setInterval');
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}