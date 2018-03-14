const state = {
  'root': { name: 'Root (1)', type: 'neutral', era: 'basement', parent: false, slots: {
	  	'root-1': { position: 'top-right' },
	  	'root-2': { position: 'bottom-right' },
	  	'root-3': { position: 'left' }
	  }, multipliers: {
		  bandwidth: 1
	  }
  },
	'neutral-1': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-1-1': { position: 'top-left' },
	  	'neutral-1-2': { position: 'right' }
	  }, multipliers: {
		  bandwidth: 2
	  }
  },
	'neutral-2': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-2-1': { position: 'right' },
	  	'neutral-2-2': { position: 'bottom-left' }
	  }, multipliers: {
		  bandwidth: 3
	  }
  },
	'neutral-3': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: {
	  	'neutral-3-1': { position: 'top-left' },
	  	'neutral-3-2': { position: 'bottom-left' }
	  }, multipliers: {
		  bandwidth: 5
	  }
  }
}

export default {
	state
}