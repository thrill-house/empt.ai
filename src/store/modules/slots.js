const state = {
  'root-1': {
	  socket: 'root',
	  position: 'top-right'
	},
	'root-2': {
	  socket: 'root',
	  position: 'bottom-right'
	},
	'root-3': {
	  socket: 'root',
	  position: 'left'
	},
	'science-university-1': {
		socket: 'science-university',
	  position: 'top-left'
	},
	'science-university-2': {
		socket: 'science-university',
	  position: 'right'
	},
	'economy-university-1': {
	  socket: 'economy-university',
	  position: 'right'
	},
	'economy-university-2': {
	  socket: 'economy-university',
	  position: 'bottom-left'
	},
	'society-university-1': {
	  socket: 'society-university',
	  position: 'top-left'
	},
	'society-university-2': {
	  socket: 'society-university',
	  position: 'bottom-left'
	}
}

// getters
const getters = {
  getSlot: (state, getters) => (id) => {
		return state[id];
	},
	getSlotsForSocket: (state, getters) => (socket) => {
		return _.pickBy(state, (slot) => { return slot.socket == socket; });
	},
	getSocketForSlot: (state, getters) => (slot) => {
		return getters.getSocket(getters.getSlot(slot).socket);
	}
}

// actions
const actions = {
  addSlotEvent: ({ dispatch }, event) => {
	  dispatch('addEvent', event);
  }
}

export default {
	state,
	getters,
	actions
}