import Vue from 'vue';

const state = {
  MULTIPLIER_RATE: 1.12,
  SCORES_INIT: { data: 500, confidence: 500 },
  FACTORS_INIT: { bandwidth: 0, influence: 0 },
  COSTS_INIT: { data: 0, confidence: 0 },
  EMOTIONS_INIT: {
    happiness: 7,
    sadness: 4,
    excitement: 3,
    fear: 6,
    tenderness: 4,
    anger: 5,
  },
};

// getters
const getters = {
  getScores: (state, getters) => (
    before = getters.getNow(),
    events = getters.getEvents(before),
    previous = _.defaults({}, state.SCORES_INIT)
  ) => {
    var firstEvent = _.first(events);
    var remainingEvents = _.tail(events);
    var nextEvent = _.first(remainingEvents);
    var nextTimestamp =
      nextEvent != undefined ? nextEvent.timestamp : before - 1;

    if (firstEvent !== undefined) {
      if (firstEvent.finalScore === undefined) {
        var duration = getters.getDuration(firstEvent.timestamp, nextTimestamp);
        var factors = (firstEvent.factors =
          firstEvent.factors === undefined
            ? getters.getFactors(nextTimestamp)
            : firstEvent.factors);

        var eventScore = {
          data: duration * factors.bandwidth - firstEvent.costs.data,
          confidence:
            duration * factors.influence - firstEvent.costs.confidence,
        };
      } else {
        var eventScore = firstEvent.finalScore;
      }

      var score = {
        data: eventScore.data + previous.data,
        confidence: eventScore.confidence + previous.confidence,
      };

      firstEvent.currentScore = eventScore;

      if (remainingEvents.length) {
        if (firstEvent.finalScore === undefined) {
          firstEvent.finalScore = eventScore;
        }

        return getters.getScores(before, remainingEvents, score);
      }
    } else {
      score = previous;
    }

    return score;
  },
  getFactors: (state, getters) => (
    event,
    factors = _.defaults({}, state.FACTORS_INIT)
  ) => {
    if (event !== undefined) {
      var eventObject = getters.getEventObject(event);
      if (eventObject && eventObject.factors) {
        _.each(eventObject.factors, (factor, key) => {
          var base = factor.base || 0;

          if (factor.trees) {
            _.each(factor.trees, (tree, key) => {
              var treeObject = getters[
                'get' + _.upperFirst(_.camelCase(event.type))
              ](event.label);

              if (treeObject && key === treeObject.type) {
                base *= tree;
                return false;
              }
            });
          }

          if (factor.dependencies) {
            _.each(factor.dependencies, (dependency, key) => {
              var boosterEvent = _.last(
                getters[
                  'getValid' + _.upperFirst(_.camelCase(event.type)) + 'Events'
                ](key)
              );

              if (boosterEvent) {
                base *= dependency;
              }
            });
          }

          factors[key] += base;
        });
      }
    }

    return factors;
  },
  getFactors: (state, getters) => (before = getters.getNow()) => {
    var events = getters.getValidEvents(before);
    var factors = _.defaults({}, state.FACTORS_INIT);

    _.each(events, function(event) {
      factors = getters.getFactors(event, factors);
    });

    return factors;
  },
  getEmotions: (state, getters) => (before = getters.getNow()) => {
    var slotEvents = getters.getAllEventsOfType(
      'slot',
      getters.getValidEvents(before)
    );
    var emotions = _.defaults({}, state.EMOTIONS_INIT);

    _.each(slotEvents, function(slotEvent) {
      var abilityEvent = getters.getEventOfType(
        slotEvent.instance,
        'ability',
        'instance'
      );

      _.each(emotions, function(emotion, key) {
        emotions[key] += abilityEvent['emotions'][key];
      });
    });

    return emotions;
  },
  prettyUnit: (state, getters) => (value, filter) => {
    return Vue.filter(filter)(value);
  },
};

export default {
  state,
  getters,
};
