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
  addSlotEvent: ({ dispatch, commit }, event) => {
	  return dispatch('addEvent', event).then(() => {
		  commit('activateInitFactor', 'influence', { root: true });
    });
  }
}

export default {
	state,
	getters,
	actions
}