const state =  {
	start: _.now(),
  now: _.now(),
  events: {}
}

// getters
const getters = {
  getEvents: (state) => (type, before) => {
    if(before == undefined) {
		  var before = this.now;
	  }
	  
	  var events = _.filter(state.events, function(value, timestamp) { return timestamp < before; });
	  
    if(type !== undefined) {
	    events = _.filter(events, { type: type })
    }
    
    return _(events).toPairs().sortBy(0).fromPairs().value();
  }
}

// mutations
const mutations = {
  setStart: (state) => (timestamp) => {
    console.log('SETSTART');
    state.start = timestamp;
  },
  setNow: (state) => {
    state.now = _.now();
  },
  addEvent: (state) => (event, timestamp) => {
    if(timestamp == undefined) {
		  var timestamp = _.now();
	  }
    
    state.events[timestamp] = event;
  },
  setEvents: (state) => (events) => {
    if(timestamp == undefined) {
		  var timestamp = _.now();
	  }
    
    state.events[timestamp] = event;
  }
}

export default {
	state,
	getters,
	mutations
}