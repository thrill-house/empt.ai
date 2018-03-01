const state = {
  'root': { name: 'Root (1)', type: 'neutral', era: 'basement', parent: false, slots: ['root-1', 'root-2', 'root-3'], multipliers: {
		  bandwidth: 2
	  }
  },
	'neutral-1': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: ['neutral-1-1', 'neutral-1-2'], multipliers: {
		  bandwidth: 3
	  }
  },
	'neutral-2': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: ['neutral-2-1', 'neutral-2-2'], multipliers: {
		  bandwidth: 4
	  }
  },
	'neutral-3': { name: 'Neutral (2)', type: 'neutral', era: 'university', parent: 'root', slots: ['neutral-3-1', 'neutral-3-2'], multipliers: {
		  bandwidth: 5
	  }
  }
}

export default {
	state
}