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
	  },
	  owned: {}
  },
	'science-university': {
	  name: 'Science (Uni)',
	  type: 'science',
	  era: 'university',
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
		  confidence: 100
	  },
	  owned: {}
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
		  confidence: 1000
	  },
	  owned: {}
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
		  confidence: 10000
	  },
	  owned: {}
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
		  confidence: 100000
	  },
	  owned: {}
  },
	'economy-university': {
	  name: 'Economy (Uni)',
	  type: 'economy',
	  era: 'university',
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
		  confidence: 1000
	  },
	  owned: {}
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
		  confidence: 10000
	  },
	  owned: {}
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
		  confidence: 100000
	  },
	  owned: {}
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
		  confidence: 10000000
	  },
	  owned: {}
  },
	'society-university': {
	  name: 'Society (Uni)',
	  type: 'society',
	  era: 'university',
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
		  confidence: 1000
	  },
	  owned: {}
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
		  confidence: 2000
	  },
	  owned: {}
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
		  confidence: 3000
	  },
	  owned: {}
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
		  confidence: 3000
	  },
	  owned: {}
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