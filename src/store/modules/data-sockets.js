const state = {
  'root': {
	  name: 'Root',
	  type: 'neutral',
	  era: 'student',
	  parent: false,
	  slots: {
	  	'root-1': { position: 'top-right' },
	  	'root-2': { position: 'bottom-right' },
	  	'root-3': { position: 'left' }
	  },
	  multipliers: {
		  bandwidth: 1,
		  influence: 1
	  },
	  costs: {
		  data: 1
	  }
  },
	'science-university': {
	  name: 'Science (Uni)',
	  type: 'science',
	  era: 'university',
	  enables: 'journalCitations',
	  parent: 'root',
		slots: {
	  	'science-1-1': { position: 'top-left' },
	  	'science-1-2': { position: 'right' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'science-business': {
	  name: 'Science (Biz)',
	  type: 'science',
	  era: 'business',
	  parent: 'science-1-root',
		slots: {
	  	'science-2-1': { position: 'right' },
	  	'science-2-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'science-government': {
	  name: 'Science (Gov)',
	  type: 'science',
	  era: 'government',
	  parent: 'science-2-root',
		slots: {
	  	'science-3-1': { position: 'top-left' },
	  	'science-3-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 5000
	  }
  },
	'science-consciousness': {
	  name: 'Science (Brain)',
	  type: 'science',
	  era: 'consciousness',
	  parent: 'science-3-root',
		slots: {
	  	'science-3-1': { position: 'top-left' },
	  	'science-3-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 8000
	  }
  },
	'economy-university': {
	  name: 'Economy (Uni)',
	  type: 'economy',
	  era: 'university',
	  enables: 'returnOnInvestment',
	  parent: 'root',
		slots: {
	  	'economy-1-1': { position: 'top-left' },
	  	'economy-1-2': { position: 'right' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'economy-business': {
	  name: 'Economy (Biz)',
	  type: 'economy',
	  era: 'business',
	  parent: 'economy-1-socket',
		slots: {
	  	'economy-2-1': { position: 'right' },
	  	'economy-2-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'economy-government': {
	  name: 'Economy (Gov)',
	  type: 'economy',
	  era: 'government',
	  parent: 'economy-2-socket',
		slots: {
	  	'economy-3-1': { position: 'top-left' },
	  	'economy-3-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 5000
	  }
  },
	'economy-consciousness': {
	  name: 'Economy (Brain)',
	  type: 'economy',
	  era: 'consciousness',
	  parent: 'economy-3-socket',
		slots: {
	  	'economy-4-1': { position: 'top-left' },
	  	'economy-4-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 8000
	  }
  },
	'society-university': {
	  name: 'Society (Uni)',
	  type: 'society',
	  era: 'university',
	  enables: 'approvalRating',
	  parent: 'root',
		slots: {
	  	'society-1-1': { position: 'top-left' },
	  	'society-1-2': { position: 'right' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'society-business': {
	  name: 'Society (Biz)',
	  type: 'society',
	  era: 'business',
	  parent: 'society-1-socket',
		slots: {
	  	'society-2-1': { position: 'right' },
	  	'society-2-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'society-government': {
	  name: 'Society (Gov)',
	  type: 'society',
	  era: 'government',
	  parent: 'society-2-socket',
		slots: {
	  	'society-3-1': { position: 'top-left' },
	  	'society-3-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 5000
	  }
  },
	'society-consciousness': {
	  name: 'Society (Brain)',
	  type: 'society',
	  era: 'consciousness',
	  parent: 'society-3-socket',
		slots: {
	  	'society-4-1': { position: 'top-left' },
	  	'society-4-2': { position: 'bottom-left' }
	  },
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 8000
	  }
  }
}

// getters
const getters = {
  getDataSocket: (state, getters) => (id) => {
		return state[id];
	},
	getActiveDataSockets: (state, getters) => () => {
		return _.filter(getters.getEvents(), { type: 'data-socket' });
	},
	getDataSocketCosts: (state, getters, rootState) => (id) => {
		var dataSocket = getters.getDataSocket(id);
		var activeLength = getters.getActiveDataSockets().length;
		var dataSocketCosts = {};
		_.forIn(dataSocket.costs, (cost, key, object) => {
			dataSocketCosts[key] = cost * Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength);
		});
		
		return _.defaults(dataSocketCosts, rootState.scores.COSTS_INIT);
	},
	getSlots: (state, getters) => () => {
		return _.flattenDeep(_.map(state, function(o) { return _.keysIn(o.slots) }));
	},
	getSocketForSlot: (state, getters) => (slot) => {
		return _.find(state, function(o) { return _.includes(_.keys(o.slots), slot) });
	}
}

// mutations
const mutations = {
  activateDataSocket: (state, label) => {
	  state[label].active = true;
  },
}

// actions
const actions = {
  addDataSocketEvent: ({ dispatch, commit, getters }, event) => {
	  dispatch('addEvent', event).then((success) => {
		  if(success) {
			  var dataSocket = getters.getEventObject(event);
			  commit('activateInitFactor', dataSocket.enables, { root: true });
			  commit('activateEra', dataSocket.era, { root: true });
      }
    });
  }
}

export default {
	state,
	getters,
	actions
}