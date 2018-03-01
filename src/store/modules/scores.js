// getters
const getters = {
  getScores: (state, getters)  => (events, before = state.now, previous = { data: 0, confidence: 0, dataPerSecond: 0, confidencePerSecond: 0 }) => {
    if(events === undefined) {
	    events = getters.getEvents();
    }
    
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
	  var factors = getters.getFactors(before);
	  var duration = getters.getDuration(firstEvent.timestamp, before);
	  var dataPerSecond = factors.bandwidth;
	  var confidencePerSecond = factors.processor * factors.journalCitations * factors.returnOnInvestment * factors.approvalRating;
	  var data = duration * dataPerSecond;
	  var confidence = duration * confidencePerSecond;
		var score = {
			data: previous.data + data,
			confidence: previous.confidence + confidence,
			dataPerSecond: previous.dataPerSecond + dataPerSecond,
			confidencePerSecond: previous.confidencePerSecond + confidencePerSecond
		};
	  
	  if (remainingEvents.length) {
		  var nextEvent = _.head(remainingEvents);
		  return getters.getScores(remainingEvents, nextEvent.timestamp, score);
	  }
	  
	  return score;
  }
}

export default {
	getters
}