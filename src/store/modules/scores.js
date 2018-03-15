var scoresInit = { data: 1, confidence: 100 };

// getters
const getters = {
  getScores: (state, getters) => (before = getters.getNow(), events = getters.getEvents(before), previous = scoresInit) => {
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
		var nextEvent = _.head(remainingEvents);
		var nextTimestamp = (nextEvent != undefined? nextEvent.timestamp: before - 1);
		var filteredEvents = _.filter(events, function(value) { return value.timestamp < nextTimestamp; });
	  
	  if(firstEvent.cachedScore === undefined) {
		  var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
		  var factors = getters.getFactors(nextTimestamp);
		  //var costs = getters.getCosts(firstEvent);
		  
		  var dataPerSecond = factors.bandwidth;
		  var confidencePerSecond = factors.processor + factors.journalCitations + factors.returnOnInvestment + factors.approvalRating;
		  
			var eventScore = {
				data: (duration * dataPerSecond), // - costs.data,
				confidence: (duration * confidencePerSecond)// - costs.confidence
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
  }
}

export default {
	getters
}