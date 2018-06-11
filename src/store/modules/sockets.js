const state = {
  'root': {
	  name: 'Root',
	  type: 'neutral',
	  era: 'student',
	  parent: false,
	  multipliers: {
		  bandwidth: 1,
		  //influence: 1
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
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'economy-university': {
	  name: 'Economy (Uni)',
	  type: 'economy',
	  era: 'university',
	  enables: 'returnOnInvestment',
	  parent: 'root',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'society-university': {
	  name: 'Society (Uni)',
	  type: 'society',
	  era: 'university',
	  enables: 'approvalRating',
	  parent: 'root',
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
	  parent: 'science-university',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'economy-business': {
	  name: 'Economy (Biz)',
	  type: 'economy',
	  era: 'business',
	  parent: 'economy-university',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'society-business': {
	  name: 'Society (Biz)',
	  type: 'society',
	  era: 'business',
	  parent: 'society-university',
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
	  parent: 'science-business',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 5000
	  }
  },
	'economy-government': {
	  name: 'Economy (Gov)',
	  type: 'economy',
	  era: 'government',
	  parent: 'economy-business',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 5000
	  }
  },
	'society-government': {
	  name: 'Society (Gov)',
	  type: 'society',
	  era: 'government',
	  parent: 'society-business',
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
	  parent: 'science-government',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 8000
	  }
  },
	'economy-consciousness': {
	  name: 'Economy (Brain)',
	  type: 'economy',
	  era: 'consciousness',
	  parent: 'economy-government',
	  multipliers: {
		  bandwidth: 2,
		  influence: 2
	  },
	  costs: {
		  confidence: 8000
	  }
  },
	'society-consciousness': {
	  name: 'Society (Brain)',
	  type: 'society',
	  era: 'consciousness',
	  parent: 'society-government',
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
  getSocket: (state, getters) => (label) => {
		return state[label];
	},
	getActiveSockets: (state, getters) => () => {
		return _.filter(getters.getEvents(), { type: 'socket' });
	},
	getSocketCosts: (state, getters, rootState) => (event) => {
		var socket = getters.getSocket(event.label);
		var activeLength = getters.getActiveSockets().length;
		var socketCosts = {};
		
		if(socket) {
			_.forIn(socket.costs, (cost, key) => {
				socketCosts[key] = cost;
				
				if(activeLength > 0) {
					socketCosts[key] *= Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength - 1);
				}
			});
		}
		
		return _.defaults(socketCosts, rootState.scores.COSTS_INIT);
	}
}

// mutations
const mutations = {
  activateSocket: (state, label) => {
	  state[label].active = true;
  },
}

// actions
const actions = {
  addSocketEvent: ({ dispatch, commit, getters }, event) => {
	  return dispatch('addEvent', event).then((success) => {
		  var socket = getters.getEventObject(event);
		  commit('activateEra', socket.era, { root: true });
    });
  }
}

export default {
	state,
	getters,
	actions
}