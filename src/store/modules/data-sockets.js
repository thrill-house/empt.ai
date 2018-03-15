const state = {
  'root': { name: 'Root (1)', type: 'neutral', era: 'basement', parent: false, slots: {
	  	'root-1': { position: 'top-right' },
	  	'root-2': { position: 'bottom-right' },
	  	'root-3': { position: 'left' }
	  }, multipliers: {
		  bandwidth: 1,
		  processor: 1
	  }, costs: {
		  data: 1
	  }
  },
	'neutral-1': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-1-1': { position: 'top-left' },
	  	'neutral-1-2': { position: 'right' }
	  }, multipliers: {
		  bandwidth: 2,
		  processor: 2
	  }, costs: {
		  confidence: 1000
	  }
  },
	'neutral-2': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-2-1': { position: 'right' },
	  	'neutral-2-2': { position: 'bottom-left' }
	  }, multipliers: {
		  bandwidth: 2,
		  processor: 2
	  }, costs: {
		  confidence: 2000
	  }
  },
	'neutral-3': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-3-1': { position: 'top-left' },
	  	'neutral-3-2': { position: 'bottom-left' }
	  }, multipliers: {
		  bandwidth: 2,
		  processor: 2
	  }, costs: {
		  confidence: 3000
	  }
  }
}

// getters
const getters = {
  getDataSocket: (state, getters) => (id) => {
		return state[id];
	}
}

export default {
	state,
	getters
}