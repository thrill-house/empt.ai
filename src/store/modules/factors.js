

// getters
const getters = {
  getFactors: (state, getters, rootState) => (before = state.now, events = getters.getEvents(state.now)) => {
		var factors = { bandwidth: 1, processor: 1, journalCitations: 1, returnOnInvestment: 1, approvalRating: 1 };
		
		_.each(events, function(event) {
			switch(event.type) {
				case 'data-socket':
					var dataSocket = rootState.dataSockets[event.dataSocket];
					
					_.each(dataSocket.multipliers, function(multiplier, key) {
						factors[key] *= multiplier;
					});
				break;
		  	
				case 'ability':
			  	//var dataSocket = rootState.dataSockets[event.dataSocket];
					var ability = rootState.abilities[event.ability];
			  	
			  	_.each(ability.adders, function(adder, key) {
						factors[key] += adder;
					});
			  break;
			}
		});
		
	  return factors;
	}
}

export default {
	getters
}