// getters
const getters = {
  getFactors: (state, getters) => (before = state.now) => {
		var dataSocketsEvents = getters.getEvents('data-sockets', before);
	  var abilitiesEvents = getters.getEvents('abilities', before);
		var bandwidth = 1;
		var processor = 1;
		var journalCitations = 1;
		var returnOnInvestment = 1;
		var approvalRating = 1;
		
	  _.each(abilitiesEvents, function(event) {
	  	var ability = state.abilities[event.ability];
	  	var dataSocket = state.dataSockets[event.dataSocket];
	  	var adder = (dataSocket.type === 'neutral')? ability.adders.neutral: ((dataSocket.type === ability.type)? ability.adders[ability.type]: ability.adders.other);
	  	
	  	bandwidth += adder.bandwidth;
	  	processor += adder.processor;
	  	journalCitations += adder.journalCitations;
	  	returnOnInvestment += adder.returnOnInvestment;
	  	approvalRating += adder.approvalRating;
	  });
	  
	  _.each(dataSocketsEvents, function(event) {
	  	var dataSocket = state.dataSockets[event.dataSocket];
	  	bandwidth = state.bandwidth * dataSocket.bandwidth;
	  });
	  
	  return {
		  bandwidth: bandwidth,
		  processor: processor,
		  journalCitations: journalCitations,
		  returnOnInvestment: returnOnInvestment,
		  approvalRating: approvalRating,
		};
	}
}

export default {
	getters
}