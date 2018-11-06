const state = {
  // Student
  'root-1': {
	  socket: 'root',
	  type: 'neutral',
	  position: 'top-right'
	},
	'root-2': {
	  socket: 'root',
	  type: 'neutral',
	  position: 'bottom-right'
	},
	'root-3': {
	  socket: 'root',
	  type: 'neutral',
	  position: 'left'
	},
	
	// University
	'science-university-1': {
		socket: 'science-university',
	  type: 'science',
	  position: 'top-left'
	},
	'science-university-2': {
		socket: 'science-university',
	  type: 'science',
	  position: 'right'
	},
	
	'economy-university-1': {
	  socket: 'economy-university',
	  type: 'economy',
	  position: 'right'
	},
	'economy-university-2': {
	  socket: 'economy-university',
	  type: 'economy',
	  position: 'bottom-left'
	},
	
	'society-university-1': {
	  socket: 'society-university',
	  type: 'society',
	  position: 'top-left'
	},
	'society-university-2': {
	  socket: 'society-university',
	  type: 'society',
	  position: 'bottom-left'
	},
	
	// Business
	'science-business-1': {
		socket: 'science-business',
	  type: 'science',
	  position: 'top-left'
	},
	'science-business-2': {
		socket: 'science-business',
	  type: 'science',
	  position: 'right'
	},
	'science-business-3': {
		socket: 'science-business',
	  type: 'science',
	  position: 'right'
	},
	
	'economy-business-1': {
	  socket: 'economy-business',
	  type: 'economy',
	  position: 'right'
	},
	'economy-business-2': {
	  socket: 'economy-business',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-business-3': {
	  socket: 'economy-business',
	  type: 'economy',
	  position: 'bottom-left'
	},
	
	'society-business-1': {
	  socket: 'society-business',
	  type: 'society',
	  position: 'top-left'
	},
	'society-business-2': {
	  socket: 'society-business',
	  type: 'society',
	  position: 'bottom-left'
	},
	'society-business-3': {
	  socket: 'society-business',
	  type: 'society',
	  position: 'bottom-left'
	},
	
	// Government
	'science-government-1': {
		socket: 'science-government',
	  type: 'science',
	  position: 'top-left'
	},
	'science-government-2': {
		socket: 'science-government',
	  type: 'science',
	  position: 'right'
	},
	'science-government-3': {
		socket: 'science-government',
	  type: 'science',
	  position: 'right'
	},
	'science-government-4': {
		socket: 'science-government',
	  type: 'science',
	  position: 'right'
	},
	
	'economy-government-1': {
	  socket: 'economy-government',
	  type: 'economy',
	  position: 'right'
	},
	'economy-government-2': {
	  socket: 'economy-government',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-government-3': {
	  socket: 'economy-government',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-government-4': {
	  socket: 'economy-government',
	  type: 'economy',
	  position: 'bottom-left'
	},
	
	'society-government-1': {
	  socket: 'society-government',
	  type: 'society',
	  position: 'top-left'
	},
	'society-government-2': {
	  socket: 'society-government',
	  type: 'society',
	  position: 'bottom-left'
	},
	'society-government-3': {
	  socket: 'society-government',
	  type: 'society',
	  position: 'bottom-left'
	},
	'society-government-4': {
	  socket: 'society-government',
	  type: 'society',
	  position: 'bottom-left'
	},
	
	// Consciousness
	'science-consciousness-1': {
		socket: 'science-consciousness',
	  type: 'science',
	  position: 'top-left'
	},
	'science-consciousness-2': {
		socket: 'science-consciousness',
	  type: 'science',
	  position: 'right'
	},
	'science-consciousness-3': {
		socket: 'science-consciousness',
	  type: 'science',
	  position: 'right'
	},
	'science-consciousness-4': {
		socket: 'science-consciousness',
	  type: 'science',
	  position: 'right'
	},
	'science-consciousness-5': {
		socket: 'science-consciousness',
	  type: 'science',
	  position: 'right'
	},
	
	'economy-consciousness-1': {
	  socket: 'economy-consciousness',
	  type: 'economy',
	  position: 'right'
	},
	'economy-consciousness-2': {
	  socket: 'economy-consciousness',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-consciousness-3': {
	  socket: 'economy-consciousness',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-consciousness-4': {
	  socket: 'economy-consciousness',
	  type: 'economy',
	  position: 'bottom-left'
	},
	'economy-consciousness-5': {
	  socket: 'economy-consciousness',
	  type: 'economy',
	  position: 'bottom-left'
	},
	
	'society-consciousness-1': {
	  socket: 'society-consciousness',
	  type: 'society',
	  position: 'top-left'
	},
	'society-consciousness-2': {
	  socket: 'society-consciousness',
	  type: 'society',
	  position: 'top-right'
	},
	'society-consciousness-3': {
	  socket: 'society-consciousness',
	  type: 'society',
	  position: 'left'
	},
	'society-consciousness-4': {
	  socket: 'society-consciousness',
	  type: 'society',
	  position: 'bottom-left'
	},
	'society-consciousness-5': {
	  socket: 'society-consciousness',
	  type: 'society',
	  position: 'bottom-right'
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
	getValidSlotEvents: (state, getters, rootState) => (abilityLabel = '') => {
		var filter = {type: 'slot', target: 'ability'};
		
		if(abilityLabel) {
			filter['ability'] = abilityLabel;
		}
		
		return _.filter(getters.getValidEvents(), filter);
	},
	hasValidSlotEvents: (state, getters) => (abilityLabel = '') => {
		return (getters.getValidSlotEvents(abilityLabel).length)? true: false;
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