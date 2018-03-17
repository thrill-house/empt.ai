import Vue from 'vue';

const state = {
  SCORES_INIT: { data: 1, confidence: 100 },
	FACTORS_INIT: { bandwidth: 1, processor: 0, journalCitations: 0, returnOnInvestment: 0, approvalRating: 0, persuasion: 0 },
	COSTS_INIT: { data: 0, confidence: 0 }
}

// getters
const getters = {
  getScores: (state, getters) => (before = getters.getNow(), events = getters.getEvents(before), previous = _.defaults({}, state.SCORES_INIT)) => {
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
		var nextEvent = _.head(remainingEvents);
		var nextTimestamp = (nextEvent != undefined? nextEvent.timestamp: before - 1);
		var filteredEvents = _.filter(events, function(value) { return value.timestamp < nextTimestamp; });
	  
	  if(firstEvent !== undefined) {
		  if(firstEvent.finalScore === undefined) {
			  var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
			  var factors = getters.getFactors(nextTimestamp);
			  var costs = getters.getCosts(firstEvent);
			  
				var eventScore = {
					data: (duration * factors.bandwidth) - costs.data,
					confidence: (duration * factors.persuasion) - costs.confidence
				};
			} else {
				var eventScore = firstEvent.finalScore;
			}
			
			var score = {
			  data: eventScore.data + previous.data,
			  confidence: eventScore.confidence + previous.confidence
		  };
		  
		  firstEvent.currentScore = eventScore;
		  
		  if(remainingEvents.length) {
				if(firstEvent.finalScore === undefined) {
					firstEvent.finalScore = eventScore;
				}
					
			  return getters.getScores(before, remainingEvents, score);
		  }
	  } else {
		  score = previous;
	  }
	  
	  return score;
  },
  getFactors: (state, getters) => (before = getters.getNow()) => {
	  var events =  getters.getEvents(before);
	  var factors = _.defaults({}, state.FACTORS_INIT);
		
		_.each(events, function(event) {
			var eventObject = getters.getEventObject(event);
			
			_.each(eventObject.adders, function(adder, key) {
				factors[key] += adder;
			});
			
			_.each(eventObject.multipliers, function(multiplier, key) {
				factors[key] *= multiplier;
			});
		});
		
		factors.persuasion = (factors.processor + factors.journalCitations) * (factors.returnOnInvestment || 1) * (factors.approvalRating || 1);
		
	  return factors;
	},
  getCosts: (state, getters) => (event) => {
	  var eventObject = getters.getEventObject(event);
		
		return _.defaults(eventObject.costs, state.COSTS_INIT);
	},
  prettyUnit: (state, getters) => (value, filter) => {
  	return Vue.filter(filter)(value);
  }
}

// mutations
const mutations = {
  activateInitFactor: (state, factor) => {
	  state.FACTORS_INIT[factor] = 1;
  },
}

export default {
	state,
	getters,
	mutations
}