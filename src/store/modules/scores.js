const state =  {
	data: 0,
	confidence: 0,
	dataPerSecond: 0,
	confidencePerSecond: 0
}

// getters
const getters = {
  getScores: (state)  => (events, before, previous) => {
    if(events == undefined) {
		  var events = state.events;
	  }
	  
	  if(before == undefined) {
		  var before = _.now();
	  }
    
    if(previous == undefined) {
		  var previous = { data: 0, confidence: 0, dataPerSecond: 0, confidencePerSecond: 0 };
	  }
    
    var firstEvent = _.head(events);
	  var remainingEvents = _.tail(events);
	  var factors = state.factors.getBefore(before);
	  var duration = _.round(before - firstEvent.timestamp);
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
		  return this.getBefore(remainingEvents, nextEvent.timestamp, score);
	  }
	  
	  return score;
  }
}

// mutations
const mutations = {
  setScores: (state)  => (scores) => {
    _.each(scores, function(score, value) {
	  	if(state.score[score] != undefined) {
		  	state.score[score] = value;
	  	}
    });
  }
}

export default {
	state,
	getters
}