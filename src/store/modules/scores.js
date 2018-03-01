var scoresInit = { data: 0, confidence: 0, dataPerSecond: 0, confidencePerSecond: 0 };

// getters
const getters = {
  getScores: (state, getters)  => (before = state.now, events = getters.getEvents(before), previous = scoresInit) => {
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
	  
	  var duration = getters.getDuration(firstEvent.timestamp, before);
	  var factors = getters.getFactors(before, events);
	  
	  var dataPerSecond = factors.bandwidth;
	  var confidencePerSecond = factors.processor * factors.journalCitations * factors.returnOnInvestment * factors.approvalRating;
	  
	  var data = duration * dataPerSecond / 1000;
	  var confidence = duration * confidencePerSecond / 1000;
	  
		var score = {
			data: previous.data + data,
			confidence: previous.confidence + confidence,
			dataPerSecond: previous.dataPerSecond + dataPerSecond,
			confidencePerSecond: previous.confidencePerSecond + confidencePerSecond
		};
	  
	  if (remainingEvents.length) {
		  var nextEvent = _.head(remainingEvents);
		  return getters.getScores(nextEvent.timestamp, remainingEvents, score);
	  }
	  
	  return score;
  }
}

export default {
	getters
}