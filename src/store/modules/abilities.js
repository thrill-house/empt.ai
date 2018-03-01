const state = {
  'neutral-1': { name: 'Neutral (1)', type: 'neutral', era: 1, adders: {
		  bandwidth: 1,
		  processor: 1.5
		}
	},
	'neutral-2': { name: 'Neutral (2)', type: 'neutral', era: 1, adders: {
		  bandwidth: 1.5,
		  processor: 1
		}
	},
	'neutral-3': { name: 'Neutral (3)', type: 'neutral', era: 1, adders: {
		  bandwidth: 1.5,
		  processor: 1.5
		}
	},
	'science-1': { name: 'Science (1)', type: 'science', era: 2, adders: {
			bandwidth: 2,
			processor: 2,
			journalCitations: 2
		}
	},
	'science-2': { name: 'Science (2)', type: 'science', era: 2, adders: {
			bandwidth: 3,
			processor: 3,
			journalCitations: 3
		}
	},
	'economy-1': { name: 'Economy (1)', type: 'economy', era: 2, adders: {
			bandwidth: 3,
			processor: 3,
			returnOnInvestment: 3
		}
	},
	'economy-2': { name: 'Economy (2)', type: 'economy', era: 2, adders: {
			bandwidth: 3,
			processor: 3,
			returnOnInvestment: 3
		}
	},
	'society-1': { name: 'Society (1)', type: 'society', era: 2, adders: {
			bandwidth: 3,
			processor: 3,
			approvalRating: 3
		}
	},
	'society-2': { name: 'Society (1)', type: 'society', era: 2, adders: {
			bandwidth: 3,
			processor: 3,
			approvalRating: 3
		}
	}
}

export default {
	state
}