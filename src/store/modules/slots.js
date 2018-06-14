const state = {
  'root-1': {
	  socket: 'root',
	  position: 'top-right'
	},
	'root-2': {
	  socket: 'root',
	  position: 'bottom-right'
	},
	'root-3': {
	  socket: 'root',
	  position: 'left'
	},
	'science-university-1': {
		socket: 'science-university',
	  position: 'top-left'
	},
	'science-university-2': {
		socket: 'science-university',
	  position: 'right'
	},
	'economy-university-1': {
	  socket: 'economy-university',
	  position: 'right'
	},
	'economy-university-2': {
	  socket: 'economy-university',
	  position: 'bottom-left'
	},
	'society-university-1': {
	  socket: 'society-university',
	  position: 'top-left'
	},
	'society-university-2': {
	  socket: 'society-university',
	  position: 'bottom-left'
	}
}

// getters
const getters = {
  getSlot: (state, getters) => (label) => {
		return state[label];
	},
	getSlotEvents: (state, getters) => (label) => {
		return _.filter(getters.getEvents(), { type: 'slot', label: label });
	},
	getSlotCosts: (state, getters, rootState) => (event) => {
		var ability = getters.getAbility(event.ability);
		var activeLength = getters.getAbilityEvents(event.ability).length;
		var slotCosts = {};
		
		if(ability) {
			_.forIn(ability.costs, (cost, key) => {
				slotCosts[key] = cost;
				
				if(activeLength > 1) {
					slotCosts[key] *= Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength);
				}
			});
		}
		
		return _.defaults({ confidence: 0 }, slotCosts, rootState.scores.COSTS_INIT);
	},
	getSlotsForSocket: (state, getters) => (socket) => {
		return _.pickBy(state, (slot) => { return slot.socket == socket; });
	},
	getSocketForSlot: (state, getters) => (slot) => {
		return getters.getSocket(getters.getSlot(slot).socket);
	}
}

// actions
const actions = {
  addSlotEvent: ({ getters, dispatch }, eventValues) => {
	  // Set instance to provided instance
	  var instance = eventValues.instance,
	  positive = true,
	  slotEvents = getters.getSlotEvents(eventValues.label),
	  // Get the last event for this instance, if it exists.
	  instanceEvent = _.last(_.filter(slotEvents, {instance: instance})),
	  // Get the last event for this slot, regardless of positive or negative.
	  slotEvent = _.last(slotEvents);
	  
	  // If instance is blank
	  if(!instance) {
	  	// If there is a previous instance, and it was positive, then set the instance to this instead.
	  	if(slotEvent && slotEvent.positive) {
		  	instance = slotEvent.instance;
		  	positive = false;
	  	// Exit, we don't want to add in a blank event, and there's no need to cancel something that doesn't exist.
	  	} else {
		  	return false;
	  	}
	  // If something has been slotted here before
	  // + That slotting was positive
	  // + The instance we're trying to slot is already in the slot
	  // + There is a previous instance event (there should be at this point, but checking for sanity)
	  // + The instance event was also positive
	  // + The instance event is not the same as the slot event
	  // + The slot event came after the instance event
    } else if(slotEvent && slotEvent.positive && instance === slotEvent.instance && instanceEvent && instanceEvent.positive && !_.isMatch(slotEvent, instanceEvent) && slotEvent.timestamp > instanceEvent.timestamp) {
	    positive = false;
    }
    
    var event = {
      type: 'slot',
      target: 'ability',
      label: eventValues.label,
      ability: eventValues.ability,
      instance: instance,
      positive: positive
    };
    
    if(event.positive) {
	    event.negated = [{
	      type: 'slot',
	      instance: instance
	    }];
    }
	  
	  dispatch('addEvent', event);
  }
}

export default {
	state,
	getters,
	actions
}