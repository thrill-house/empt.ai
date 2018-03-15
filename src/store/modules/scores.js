const SCORES_INIT = { data: 0, confidence: 100 };
const FACTORS_INIT = { bandwidth: 1000, processor: 0, journalCitations: 0, returnOnInvestment: 0, approvalRating: 0, persuasion: 0 };
const COSTS_INIT = { data: 0, confidence: 0 };

// getters
const getters = {
  getScores: (state, getters) => (before = getters.getNow(), events = getters.getEvents(before), previous = _.defaults({}, SCORES_INIT)) => {
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
		var nextEvent = _.head(remainingEvents);
		var nextTimestamp = (nextEvent != undefined? nextEvent.timestamp: before - 1);
		var filteredEvents = _.filter(events, function(value) { return value.timestamp < nextTimestamp; });
	  
	  if(firstEvent.cachedScore === undefined) {
		  var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
		  var factors = getters.getFactors(nextTimestamp);
		  var costs = getters.getCosts(firstEvent);
		  
			var eventScore = {
				data: (duration * factors.bandwidth) - costs.data,
				confidence: (duration * factors.persuasion) - costs.confidence
			};
		} else {
			var eventScore = firstEvent.cachedScore;
		}
		
		var score = {
		  data: eventScore.data + previous.data,
		  confidence: eventScore.confidence + previous.confidence
	  };
	  
	  if(remainingEvents.length) {
			if(firstEvent.cachedScore === undefined) {
				firstEvent.cachedScore = eventScore;
			}
				
		  return getters.getScores(before, remainingEvents, score);
	  }
	  
	  return score;
  },
  getFactors: (state, getters) => (before = getters.getNow()) => {
	  var events =  getters.getEvents(before);
		var factors = _.defaults({}, FACTORS_INIT);
		
		_.each(events, function(event) {
			var eventObject = getters.getEventObject(event);
			
			_.each(eventObject.multipliers, function(multiplier, key) {
				factors[key] *= multiplier;
			});
			
			_.each(eventObject.adders, function(adder, key) {
				factors[key] += adder;
			});
		});
		
		factors.persuasion = factors.processor + factors.journalCitations + factors.returnOnInvestment + factors.approvalRating;
		
	  return factors;
	},
  getCosts: (state, getters) => (event) => {
	  var eventObject = getters.getEventObject(event);
		
		return _.defaults(eventObject.costs, COSTS_INIT);
	}
}

export default {
	getters
}