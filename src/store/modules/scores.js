import Vue from 'vue';

const state = {
	MULTIPLIER_RATE: 1.12,
  SCORES_INIT: { data: 1, confidence: 100 },
	FACTORS_INIT: { bandwidth: 1, influence: 0, journalCitations: 0, returnOnInvestment: 0, approvalRating: 0, persuasion: 0 },
	COSTS_INIT: { data: 0, confidence: 0 }
}

// getters
const getters = {
  getScores: (state, getters) => (before = getters.getNow(), events = getters.getEvents(before), previous = _.defaults({}, state.SCORES_INIT)) => {
    var firstEvent = _.first(events);
	  var remainingEvents = _.tail(events);
		var nextEvent = _.first(remainingEvents);
		var nextTimestamp = (nextEvent != undefined)? nextEvent.timestamp: before - 1;
	  
	  if(firstEvent !== undefined) {
		  if(firstEvent.finalScore === undefined) {			  
			  var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
			  var factors = firstEvent.factors = (firstEvent.factors === undefined? getters.getFactors(nextTimestamp): firstEvent.factors);
			  
				var eventScore = {
					data: (duration * factors.bandwidth) - firstEvent.costs.data,
					confidence: (duration * factors.persuasion) - firstEvent.costs.confidence
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
	calculateFactors: (state, getters) => (event, factors = _.defaults({}, state.FACTORS_INIT), positive = true) => {
	  if(event !== undefined) {
		  var eventObject = getters.getEventObject(event);
			
			if(eventObject) {
				_.each(eventObject.adders, (adder, key) => {
					factors[key] = positive? factors[key] + adder: factors[key] - adder;
				});
				
				_.each(eventObject.multipliers, (multiplier, key) => {
					factors[key] = positive? factors[key] * multiplier: factors[key] / multiplier;
				});
			}
		};
		
		return factors;
  },
  getFactors: (state, getters) => (before = getters.getNow()) => {
	  var events = getters.getEvents(before);
	  var factors = _.defaults({}, state.FACTORS_INIT);
		
		_.each(events, function(event) {
			_.each(event.negated, function(negated) {
				var negatedEvent = _.last(_.filter(getters.getEvents(event.timestamp), negated));
				if(negatedEvent && negatedEvent.positive && !_.isMatch(event, negatedEvent)) {
					factors = getters.calculateFactors(negatedEvent, factors, false);
				}
			});
			
			factors = getters.calculateFactors(event, factors, event.positive);
		});
		
		factors.persuasion = factors.influence * (((factors.journalCitations || 0) + (factors.returnOnInvestment || 0) + (factors.approvalRating || 0)) || 1);
		
	  return factors;
	},
  prettyUnit: (state, getters) => (value, filter) => {
  	return Vue.filter(filter)(value);
  }
}

export default {
	state,
	getters
}