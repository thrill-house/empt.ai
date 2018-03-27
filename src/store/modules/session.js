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
		return _.last(getters.getEventsOfType(label, type, id));
	},
  getEventObject: (state, getters) => (event, id = 'label') => {
	  var target = event.type;
	  
	  if(event.target !== undefined) {
		  if(event.target) {
				var target = event.target;
				id = event.target;
			} else {
				return {};
			}
		}
		
		var functionName = 'get' + _.upperFirst(_.camelCase(target));
		
		return getters[functionName](event[id]);
	},
  getEventCosts: (state, getters, rootState) => (event) => {
		var functionName = 'get' + _.upperFirst(_.camelCase(event.type)) + 'Costs';
		return getters[functionName](event);
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
			return true;
	  }
	  
	  return false;
  },
  resetEvents: (state, events) => {
	  state.events = {};
  }
}

// actions
const actions = {
  addEvent: ({ commit, dispatch, getters }, event) => {
		return new Promise((resolve, reject) => {
      if(event.timestamp === undefined) {
			  event['timestamp'] = _.now();
		  }
		  
		  var eventObject = getters.getEventObject(event);
		  var scores = getters.getScores(event.timestamp);
		  var costs = getters.getEventCosts(event);
		  var match = _.isMatchWith(costs, scores, function(cost, score) { return cost <= score; });
		  
		  if(match) {
			  commit('addEvent', event);
			  resolve();
		  } else {
			  alert('You can’t afford that');
			  reject();
		  }
    });
  },
  setEvents: ({ dispatch, commit }, events) => {
	  commit('resetEvents');
	  
	  _.each(events, function(event) {
		  dispatch('addEvent', event);
	  });
  },
  startSession: ({ commit }) => {
		commit('setInterval', window.setInterval(function() {
			  commit('setNow');
			}, 1000)
		);
  },
  stopSession: ({ state, commit }) => {
	  window.clearInterval(state.interval);
	  commit('setInterval');
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}