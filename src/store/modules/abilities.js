const state = {
  'neutral-1': {
	  name: 'Neutral (1)',
	  type: 'neutral',
	  era: 'student',
	  adders: {
		  bandwidth: 1,
		  influence: 1.5
		},
		costs: {
		  data: 5,
		  confidence: 10
	  }
	},
	'neutral-2': {
	  name: 'Neutral (2)',
	  type: 'neutral',
	  era: 'student',
		adders: {
		  bandwidth: 2,
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
		adders: {
		  bandwidth: 2,
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
		adders: {
			bandwidth: 4,
			influence: 2
		},
		multipliers: {
			journalCitations: 1.2
		},
		costs: {
		  data: 10,
		  confidence: 40
	  }
	},
	'science-2': {
	  name: 'Science (2)',
	  type: 'science',
	  era: 2,
		adders: {
			bandwidth: 8,
			influence: 3
		},
		multipliers: {
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
		adders: {
			bandwidth: 4,
			influence: 3
		},
		multipliers: {
			returnOnInvestment: 1.2
		},
		costs: {
		  data: 10,
		  confidence: 40
	  }
	},
	'economy-2': {
	  name: 'Economy (2)',
	  type: 'economy',
	  era: 2,
		adders: {
			bandwidth: 8,
			influence: 3
		},
		multipliers: {
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
		adders: {
			bandwidth: 4,
			influence: 3
		},
		multipliers: {
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
		adders: {
			bandwidth: 8,
			influence: 3
		},
		multipliers: {
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
  getAbility: (state,
	  getters) => (label) => {
		return state[label];
	}
}

export default {
	state,
	getters
}