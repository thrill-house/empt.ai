import Vue from 'vue';

const state = {
  MULTIPLIER_RATE: 1.12,
  SCORES_INIT: { data: 1, confidence: 21 },
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
    let score = previous,
      firstEvent = _.first(events),
      eventScore = firstEvent ? firstEvent.finalScore : {},
      remainingEvents = _.tail(events),
      nextEvent = _.first(remainingEvents),
      nextTimestamp =
        nextEvent !== undefined ? nextEvent.timestamp : before - 1;

    if (firstEvent !== undefined) {
      if (eventScore === undefined) {
        let duration = getters.getDuration(firstEvent.timestamp, nextTimestamp),
          factors = (firstEvent.factors =
            firstEvent.factors === undefined
              ? getters.getFactors(nextTimestamp)
              : firstEvent.factors);

        eventScore = {
          data: duration * factors.bandwidth - firstEvent.costs.data,
          confidence:
            duration * factors.influence - firstEvent.costs.confidence,
        };
      }

      score = {
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
    }

    return score;
  },
  calculateFactors: (state, getters) => (
    event,
    factors = _.defaults({}, state.FACTORS_INIT)
  ) => {
    if (event !== undefined) {
      let eventObject = getters.getEventObject(event);

      if (eventObject && eventObject.factors) {
        _.each(eventObject.factors, (factor, key) => {
          let base = factor.base || 0,
            target = event.target || event.type,
            label = event.target ? event[event.target] : event.label,
            objectName = _.upperFirst(_.camelCase(target));

          if (factor.trees) {
            _.each(factor.trees, (tree, key) => {
              let treeObject = getters[`get${objectName}`](label);

              if (treeObject && key === treeObject.tree) {
                base *= tree;
                return false;
              }
            });
          }

          if (factor.dependencies) {
            _.each(factor.dependencies, (dependency, key) => {
              let boosterEvent = _.last(
                getters[`getValid${objectName}Events`](key)
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
  getFactors: (state, getters) => (before = getters.getUpdated()) => {
    let events = getters.getValidEvents(before),
      factors = _.defaults({}, state.FACTORS_INIT);

    _.each(events, function(event) {
      factors = getters.calculateFactors(event, factors);
    });

    return factors;
  },
  getEmotions: (state, getters) => (before = getters.getUpdated()) => {
    let slotEvents = getters.getAllEventsOfType(
      'slot',
      getters.getValidEvents(before)
    );
    let emotions = _.defaults({}, state.EMOTIONS_INIT);

    _.each(slotEvents, function(slotEvent) {
      let abilityEvent = getters.getEventOfType(
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
