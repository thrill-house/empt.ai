import moment from 'moment'
import gameSession from './game-session'

const state =  {
  [+moment(gameSession.start).subtract(10, 'seconds')]: { type: 'data-source', dataSource: 'root' },
  [+moment(gameSession.start).add(10, 'seconds')]: { type: 'ability', ability: 'neutral-1', dataSource: 'root', dataSourceSlot: 'root-1' },
  [+moment(gameSession.start).add(20, 'seconds')]: { type: 'ability', ability: 'neutral-2', dataSource: 'root', dataSourceSlot: 'root-2' },
	[+moment(gameSession.start).add(30, 'seconds')]: { type: 'ability', ability: 'neutral-3', dataSource: 'root', dataSourceSlot: 'root-3' },
	[+moment(gameSession.start).add(1, 'minutes')]: { type: 'data-source', dataSource: 'neutral-1' },
	[+moment(gameSession.start).add(8, 'minutes')]: { type: 'ability', ability: 'science-1', dataSource: 'neutral-1', dataSourceSlot: 'neutral-1-1' },
	[+moment(gameSession.start).add(13, 'minutes')]: { type: 'ability', ability: 'economy-1', dataSource: 'neutral-1', dataSourceSlot: 'neutral-1-2' },
	[+moment(gameSession.start).add(20, 'minutes')]: { type: 'data-source', dataSource: 'neutral-2' },
	[+moment(gameSession.start).add(21, 'minutes')]: { type: 'ability', ability: 'society-1', dataSource: 'neutral-2', dataSourceSlot: 'neutral-2-2' },
	[+moment(gameSession.start).add(34, 'minutes')]: { type: 'ability', ability: 'science-2', dataSource: 'neutral-2', dataSourceSlot: 'neutral-2-2' },
	[+moment(gameSession.start).add(55, 'minutes')]: { type: 'data-source', dataSource: 'neutral-3' },
	[+moment(gameSession.start).add(1, 'hours')]: { type: 'ability', ability: 'economy-2', dataSource: 'neutral-3', dataSourceSlot: 'neutral-3-1' },
	[+moment(gameSession.start).add(2, 'hours')]: { type: 'ability', ability: 'society-2', dataSource: 'neutral-3', dataSourceSlot: 'neutral-3-2' },
}

// getters
const getters = {
  getEvents: (state) => (type, before) => {
    if(before == undefined) {
		  var before = _.now();
	  }
	  
	  var events = _.filter(state, function(value, timestamp) { return timestamp < before; });
	  
    if(type !== undefined) {
	    events = _.filter(events, { type: type })
    }
    
    return _(events).toPairs().sortBy(0).fromPairs().value();
  }
}

// mutations
const mutations = {
  addEvent: (state) => (event, timestamp) => {
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