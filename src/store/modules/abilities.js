const state = {
  'neutral-1': {
	  name: 'Neutral (1)',
	  type: 'neutral',
	  era: 'student',
	  factors: {
		  influence: {
			  base: 1
			}
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
		factors: {
		  influence: {
			  base: 1,
			  dependencies: {
					'neutral-1': 1.1
				}
			}
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
		factors: {
		  influence: {
			  base: 1,
			  dependencies: {
					'neutral-1': 1.1,
					'neutral-2': 1.1
				}
			}
		},
		costs: {
		  data: 5,
		  confidence: 20
	  }
	},
	'science-1': {
	  name: 'Science (1)',
	  type: 'science',
	  era: 'university',
		factors: {
		  influence: {
			  base: 2,
			  trees: {
					science: 1.1
				}
			}
		},
		costs: {
		  data: 10,
		  confidence: 30
	  }
	},
	'science-2': {
	  name: 'Science (2)',
	  type: 'science',
	  era: 'university',
		factors: {
		  influence: {
			  base: 3,
			  trees: {
					science: 1.2
				},
			  dependencies: {
					'science-1': 1.1
				}
			}
		},
		costs: {
		  data: 15,
		  confidence: 80
	  }
	},
	'economy-1': {
	  name: 'Economy (1)',
	  type: 'economy',
	  era: 'university',
	  factors: {
		  influence: {
			  base: 2,
			  trees: {
					economy: 1.2
				},
			}
		},
		costs: {
		  data: 10,
		  confidence: 40
	  }
	},
	'economy-2': {
	  name: 'Economy (2)',
	  type: 'economy',
	  era: 'university',
		factors: {
		  influence: {
			  base: 3,
			  trees: {
					economy: 1.2
				},
			  dependencies: {
					'economy-1': 1.1
				}
			}
		},
		costs: {
		  data: 15,
		  confidence: 80
	  }
	},
	'society-1': {
	  name: 'Society (1)',
	  type: 'society',
	  era: 'university',
		factors: {
		  influence: {
			  base: 2,
			  trees: {
					society: 1.2
				}
			}
		},
		costs: {
		  data: 10,
		  confidence: 50
	  }
	},
	'society-2': {
	  name: 'Society (2)',
	  type: 'society',
	  era: 'university',
		factors: {
		  influence: {
			  base: 3,
			  trees: {
					society: 1.2
				},
			  dependencies: {
					'society-1': 1.1
				}
			}
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
	getAbilityEvents: (state, getters) => (label) => {
		return getters.getEventsOfType(label, 'ability');
	},
	getAbilityCosts: (state, getters, rootState) => (event) => {
		var ability = getters.getAbility(event.label);
		var activeLength = getters.getAbilityEvents(event.label).length;
		var abilityCosts = {};
		
		if(ability) {
			_.forIn(ability.costs, (cost, key) => {
				abilityCosts[key] = cost;
				
				if(activeLength > 1) {
					abilityCosts[key] *= Math.pow(rootState.scores.MULTIPLIER_RATE, activeLength);
				}
			});
		}
		
		return _.defaults({ data: 0 }, abilityCosts, rootState.scores.COSTS_INIT);
	}
}

// actions
const actions = {
  addAbilityEvent: ({ dispatch }, event) => {
	  dispatch('addEvent', event);
  }
}

export default {
	state,
	getters,
	actions
}