const state =  {
	start: _.now(),
  now: _.now(),
  interval: false,
  events: {},
  interactions: {
	  selectedAbility: false
  },
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
	getValidEvents: (state, getters) => (before = state.now) => {
		var events = getters.getEvents(before);
		var negatedEvents = [];
		
		_.each(events, function(event) {
			_.each(event.negated, function(negated) {
				var negatedEvent = _.last(_.filter(getters.getEvents(event.timestamp), negated));
				if(negatedEvent && negatedEvent.positive && !_.isMatch(event, negatedEvent)) {
					negatedEvents.push(negatedEvent);
				}
			});
			
			if(event.positive !== undefined && !event.positive) {
				var negatedEvent = _.last(_.filter(getters.getEvents(event.timestamp), {type: event.type, instance: event.instance, positive: true}));
				negatedEvents.push(event);
				negatedEvents.push(negatedEvent);
			}
		});
		
		return _.difference(events, negatedEvents);
	},
  getAllEventsOfType: (state, getters) => (type, events = getters.getEvents()) => {
		return _.filter(events, { type: type });
	},
  getEventsOfType: (state, getters) => (label, type, id = 'label') => {
		return _.filter(getters.getAllEventsOfType(type), { [id]: label });
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
  getEventObjects: (state, getters) => (events, id = 'label') => {
	  var objects = [];
	  
	  _.each(events, function(event) {
		  objects.push(getters.getEventObject(event, id));
	  });
	  
	  return objects;
	},
  getEventCosts: (state, getters, rootState) => (event) => {
		var functionName = 'get' + _.upperFirst(_.camelCase(event.type)) + 'Costs';
		return getters[functionName](event);
	},
  getEventAffordability: (state, getters, rootState) => (event) => {
		var eventObject = getters.getEventObject(event);
	  var scores = getters.getScores(event.timestamp);
	  var costs = getters.getEventCosts(event);
	  
	  if(_.isMatchWith(costs, scores, function(cost, score) { return cost <= score; })) {
		  return costs;
	  } else {
		  return false;
	  }
	},
  getInteraction: (state) => (label) => {
  	return state.interactions[label];
  },
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
  },
  setInteraction: (state, interaction) => {
    if(interaction !== undefined && interaction.interaction !== undefined) {
	    state.interactions[interaction.interaction] = interaction;
	    return true;
    }
	  
	  return false;
  },
  resetInteraction: (state, interactionLabel) => {
    state.interactions[interactionLabel] = false;
  }
}

// actions
const actions = {
  addEvent: ({ commit, dispatch, getters }, event) => {
		if(event.timestamp === undefined) {
		  event.timestamp = _.now();
	  }
	  
	  var affordable = getters.getEventAffordability(event);
	  
	  if(affordable) {
		  event.id = _.uniqueId();
		  event.costs = affordable;
		  commit('addEvent', event);
	  } else {
		  alert('You can’t afford that');
	  }
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
  },
  setInteraction: ({ commit }, interaction) => {
    commit('setInteraction', interaction);
  },
  resetInteraction: ({ commit }, interactionLabel) => {
    commit('resetInteraction', interactionLabel);
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}