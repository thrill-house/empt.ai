import Vue from 'vue';

const state = {
	MULTIPLIER_RATE: 1.12,
  SCORES_INIT: { data: 1000, confidence: 100 },
	FACTORS_INIT: { bandwidth: 1, influence: 0, science: 0, economy: 0, society: 0, boosts: 0, persuasion: 0 },
	COSTS_INIT: { data: 0, confidence: 0 }
}

// getters
const getters = {
  getScores: (state, getters) => (before = getters.getNow(), events = getters.getValidEvents(before), previous = _.defaults({}, state.SCORES_INIT)) => {
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
					var factor = factors[key] || 1;
					factors[key] = positive? factor * multiplier: (factor / multiplier > 1)? factor / multiplier: 0;
				});
				
				if(event.target) {
					var functionName = 'getValid' + _.upperFirst(_.camelCase(event.type)) + 'Events';
					
					_.each(eventObject.boosters, (booster, key) => {
						var boosterEvent = _.last(getters[functionName](key));
						if(boosterEvent) {
							var boost = factors.boosts || 1;
							factors.boosts = boost * booster;
						}
					});
				}
				
				/*
				_.each(eventObject.boosters, (booster, key) => {
					var factor = factors[key] || 1;
					factors[key] = positive? factor * multiplier: (factor / multiplier > 1)? factor / multiplier: 0;
				});
				*/
			}
		};
		
		return factors;
  },
  getFactors: (state, getters) => (before = getters.getNow()) => {
	  var events = getters.getValidEvents(before);
	  var factors = _.defaults({}, state.FACTORS_INIT);
		
		_.each(events, function(event) {
			factors = getters.calculateFactors(event, factors);
		});
		
		console.log(factors);
		
		factors.persuasion = factors.influence * (factors.science || 1) * (factors.economy || 1) * (factors.society || 1) * (factors.boosts || 1);
		
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