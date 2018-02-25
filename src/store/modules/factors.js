const state =  {
	bandwidth: 1,
	processor: 1,
	journalCitations: 1,
	returnOnInvestment: 1,
	approvalRating: 1
}

// getters
const getters = {
  getBefore: (state) => (before) => {
		var dataSourcesEvents = state.events.getBefore(before, 'data-sources');
	  var abilitiesEvents = state.events.getBefore(before, 'abilities');
		var bandwidth = 1;
		var processor = 1;
		var journalCitations = 1;
		var returnOnInvestment = 1;
		var approvalRating = 1;
		
	  _.each(dataSourcesEvents, function(event) {
	  	var dataSource = state.dataSources[event.dataSource];
	  	bandwidth = state.bandwidth * dataSource.bandwidth;
	  });
	  
	  _.each(abilitiesEvents, function(event) {
	  	var ability = state.abilities[event.ability];
	  	var dataSource = state.dataSources[event.dataSource];
	  	var adder = (dataSource.type === 'neutral')? ability.adders.neutral: ((dataSource.type === ability.type)? ability.adders[ability.type]: ability.adders.other);
	  	
	  	bandwidth += adder.bandwidth;
	  	processor += adder.processor;
	  	journalCitations += adder.journalCitations;
	  	returnOnInvestment += adder.returnOnInvestment;
	  	approvalRating += adder.approvalRating;
	  });
	  
	  return {
		  bandwidth: bandwidth,
		  processor: processor,
		  journalCitations: journalCitations,
		  returnOnInvestment: returnOnInvestment,
		  approvalRating: approvalRating,
		};
	},
}

// mutations
const mutations = {
  setFactors: (state) => (factors) => {
    _.each(factors, function(factor, value) {
	  	if(state[factor] != undefined) {
		  	state[factor] = value;
	  	}
    });
  }
}

export default {
	state,
	getters,
	mutations
}