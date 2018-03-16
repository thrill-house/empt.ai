const state = {
  'root': {
	  name: 'Root (1)',
	  type: 'neutral',
	  era: 'basement',
	  parent: false,
	  slots: {
	  	'root-1': { position: 'top-right' },
	  	'root-2': { position: 'bottom-right' },
	  	'root-3': { position: 'left' }
	  },
	  multipliers: {
		  bandwidth: 1,
		  processor: 1
	  },
	  costs: {
		  data: 1
	  }
  },
	'science-1-socket': {
	  name: 'Science (1)',
	  type: 'science',
	  era: 'university',
	  parent: 'root',
		slots: {
	  	'science-1-1': { position: 'top-left' },
	  	'science-1-2': { position: 'right' }
	  },
	  adders: {
		  journalCitations: 10
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 1000
	  }
  },
	'science-2-socket': {
	  name: 'Science (2)',
	  type: 'science',
	  era: 'university',
	  parent: 'root',
		slots: {
	  	'science-2-1': { position: 'right' },
	  	'science-2-2': { position: 'bottom-left' }
	  },
	  adders: {
		  journalCitations: 10
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'science-3-socket': {
	  name: 'Science (3)',
	  type: 'science',
	  era: 'university',
	  parent: 'root',
		slots: {
	  	'science-3-1': { position: 'top-left' },
	  	'science-3-2': { position: 'bottom-left' }
	  },
	  adders: {
		  journalCitations: 10
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  },
	'economy-1-socket': {
	  name: 'Economy (1)',
	  type: 'economy',
	  era: 'business',
	  parent: 'science-1-socket',
		slots: {
	  	'economy-1-1': { position: 'top-left' },
	  	'economy-1-2': { position: 'right' }
	  },
	  adders: {
		  returnOnInvestment: 1
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 1000
	  }
  },
	'economy-2-socket': {
	  name: 'Economy (2)',
	  type: 'economy',
	  era: 'business',
	  parent: 'science-2-socket',
		slots: {
	  	'economy-2-1': { position: 'right' },
	  	'economy-2-2': { position: 'bottom-left' }
	  },
	  adders: {
		  returnOnInvestment: 1
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 2000
	  }
  },
	'economy-3-socket': {
	  name: 'Economy (3)',
	  type: 'economy',
	  era: 'business',
	  parent: 'science-3-socket',
		slots: {
	  	'economy-3-1': { position: 'top-left' },
	  	'economy-3-2': { position: 'bottom-left' }
	  },
	  adders: {
		  returnOnInvestment: 1
	  },
	  multipliers: {
		  bandwidth: 2,
		  processor: 2
	  },
	  costs: {
		  confidence: 3000
	  }
  }
}

// getters
const getters = {
  getDataSocket: (state,
	  getters) => (id) => {
		return state[id];
	},
	getSlots: (state,
	  getters) => () => {
		return _.flattenDeep(_.map(state,
	  function(o) { return _.keysIn(o.slots) }));
	},
	getSocketForSlot: (state,
	  getters) => (slot) => {
		return _.find(state,
	  function(o) { return _.includes(_.keys(o.slots),
	  slot) });
	}
}

export default {
	state,
	getters
}