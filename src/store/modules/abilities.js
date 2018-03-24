const state = {
  'neutral-1': {
	  name: 'Neutral (1)',
	  type: 'neutral',
	  era: 'student',
	  multipliers: {
		  influence: 1.5
		},
		costs: {
		  confidence: 10,
		  data: 5
	  }
	},
	'neutral-2': {
	  name: 'Neutral (2)',
	  type: 'neutral',
	  era: 'student',
		multipliers: {
		  influence: 1.5
		},
		costs: {
		  data: 5,
		  confidence: 20
	  }
	},
	'neutral-3': {
	  name: 'Neutral (3)',
	  type: 'neutral',
	  era: 'student',
		multipliers: {
		  influence: 1.5
		},
		costs: {
		  data: 5,
		  confidence: 20
	  }
	},
	'science-1': {
	  name: 'Science (1)',
	  type: 'science',
	  era: 2,
		multipliers: {
			influence: 2,
			journalCitations: 1.02
		},
		costs: {
		  data: 10,
		  confidence: 1
	  }
	},
	'science-2': {
	  name: 'Science (2)',
	  type: 'science',
	  era: 2,
		multipliers: {
			influence: 3,
			journalCitations: 1.2
		},
		costs: {
		  data: 15,
		  confidence: 80
	  }
	},
	'economy-1': {
	  name: 'Economy (1)',
	  type: 'economy',
	  era: 2,
		multipliers: {
			influence: 3,
			returnOnInvestment: 1.2
		},
		costs: {
		  data: 10,
		  confidence: 10
	  }
	},
	'economy-2': {
	  name: 'Economy (2)',
	  type: 'economy',
	  era: 2,
		multipliers: {
			influence: 3,
			returnOnInvestment: 1.2
		},
		costs: {
		  data: 15,
		  confidence: 80
	  }
	},
	'society-1': {
	  name: 'Society (1)',
	  type: 'society',
	  era: 2,
		multipliers: {
			influence: 3,
			approvalRating: 1.1
		},
		costs: {
		  data: 10,
		  confidence: 40
	  }
	},
	'society-2': {
	  name: 'Society (2)',
	  type: 'society',
	  era: 2,
		multipliers: {
			influence: 3,
			approvalRating: 1.1
		},
		costs: {
		  data: 15,
		  confidence: 80
	  }
	}
}

// getters
const getters = {
  getAbility: (state, getters) => (label) => {
		return state[label];
	},
	getActiveAbilities: (state, getters) => () => {
		return _.filter(getters.getEvents(), { type: 'ability' });
	},
	getAbilityCosts: (state, getters, rootState) => (id) => {
		var ability = getters.getAbility(id);
		var activeLength = getters.getActiveAbilities().length;
		var abilityCosts = _.map(ability.costs, (cost) => {
			return cost * Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength);
		});
		
		return _.defaults(abilityCosts, rootState.scores.COSTS_INIT);
	}
}

// actions
const actions = {
  addAbilityEvent: ({ dispatch, commit }, event) => {
	  dispatch('addEvent', event).then(success => {
		  if(success) {
	      commit('activateInitFactor', 'influence', { root: true });
      }
    });
  }
}

export default {
	state,
	getters,
	actions
}