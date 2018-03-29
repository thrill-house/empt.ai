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
		var nextTimestamp = (nextEvent != undefined? nextEvent.timestamp: before - 1);
	  
	  if(firstEvent !== undefined) {
		  if(firstEvent.finalScore === undefined) {
			  var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
			  var factors = firstEvent.factors = (firstEvent.factors === undefined? getters.getFactors(nextTimestamp): firstEvent.factors);
			  var costs = firstEvent.costs = (firstEvent.costs === undefined? getters.getEventCosts(firstEvent): firstEvent.costs);
			  
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
	  var events = getters.getEvents(before);
	  var factors = _.defaults({}, state.FACTORS_INIT);
	  
	  var factoriser = (event, positive = true) => {
		  if(event !== undefined) {
			  var eventObject = getters.getEventObject(event);
				
				_.each(eventObject.adders, (adder, key) => {
					factors[key] = positive? factors[key] + adder: factors[key] - adder;
				});
				
				_.each(eventObject.multipliers, (multiplier, key) => {
					factors[key] = positive? factors[key] * multiplier: factors[key] / multiplier;
				});
			}
	  };
		
		_.each(events, function(event) {
			_.each(event.negates, function(negate) {
				var negatedEvent = _.last(_.filter(getters.getEvents(before - 1), negate));
				if(negatedEvent && !_.isMatch(event, negatedEvent)) {
					factoriser(negatedEvent, false);
				}
			});
			
			factoriser(event);
		});
		
		factors.persuasion = factors.influence * (factors.journalCitations || 1) * (factors.returnOnInvestment || 1) * (factors.approvalRating || 1);
		
	  return factors;
	},
  prettyUnit: (state, getters) => (value, filter) => {
  	return Vue.filter(filter)(value);
  }
}

// mutations
const mutations = {
  activateInitFactor: (state, factor) => {
	  state.FACTORS_INIT[factor] = 1;
  }
}

// actions
const actions = {
  activateInitFactor: ({ state, commit }, factor = 'influence') => {
	  if(factor !== undefined) {
		  commit('activateInitFactor', factor);
	  }
  }
}

export default {
	state,
	getters,
	mutations,
	actions
}