const state = {
  student: {
	  name: 'Student',
	  active: false
	},
	university: {
		name: 'University',
	  active: false,
	  enables: 'journalCitations'
	},
	business: {
		name: 'Business',
	  active: false,
	  enables: 'returnOnInvestment'
	},
	government: {
		name: 'Government',
	  active: false,
	  enables: 'approvalRating'
	},
	consciousness: {
		name: 'Consciousness',
	  active: false
	}
}

// mutations
const mutations = {
  activateEra: (state, era) => {
	  state[era].active = true;
  },
}

// actions
const actions = {
  activateEra: ({ state, commit }, era = 'student') => {
	  commit('activateInitFactor', state[era].enables, { root: true });
	  commit('activateEra', era);
  }
}

export default {
	state,
	mutations,
	actions
}