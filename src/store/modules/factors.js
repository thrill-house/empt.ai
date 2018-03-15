// getters
const getters = {
  getFactors: (state, getters) => (before = getters.getNow()) => {
	  var events =  getters.getEvents(before);
		var factors = { bandwidth: 1, processor: 0, journalCitations: 0, returnOnInvestment: 0, approvalRating: 0 };
		
		_.each(events, function(event) {
			switch(event.type) {
				case 'data-socket':
					var dataSocket = getters.getDataSocket(event.label);
					
					_.each(dataSocket.multipliers, function(multiplier, key) {
						factors[key] *= multiplier;
					});
				break;
		  	
				case 'ability':
					var ability = getters.getAbility(event.label);
			  	
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