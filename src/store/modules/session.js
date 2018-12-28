import _ from 'lodash';

const state = {
  events: {},
  labelsEnabled: false,
  interactions: {
    research: false,
    install: false,
    slot: false,
  },
};

// getters
const getters = {
  getEvents: (state, getters) => (before = getters.getUpdated()) => {
    return _.sortBy(
      _.filter(state.events, function(value) {
        return before === false || value.timestamp < before;
      }),
      'timestamp'
    );
  },
  getValidEvents: (state, getters) => (before = getters.getUpdated()) => {
    let events = getters.getEvents(before),
      negatedEvents = [];

    _.each(events, function(event) {
      _.each(event.negated, function(negated) {
        let negatedEvent = _.last(
          _.filter(getters.getEvents(event.timestamp), negated)
        );
        if (
          negatedEvent &&
          negatedEvent.positive &&
          !_.isMatch(event, negatedEvent)
        ) {
          negatedEvents.push(negatedEvent);
        }
      });

      if (event.positive !== undefined && !event.positive) {
        let negatedEvent = _.last(
          _.filter(getters.getEvents(event.timestamp), {
            type: event.type,
            instance: event.instance,
            positive: true,
          })
        );
        negatedEvents.push(event);
        negatedEvents.push(negatedEvent);
      }
    });

    return _.difference(events, negatedEvents);
  },
  getAllEventsOfType: (state, getters) => (
    type,
    events = getters.getEvents()
  ) => {
    return _.filter(events, { type: type });
  },
  getValidEventsOfType: (state, getters) => (label, type, id = 'label') => {
    return _.filter(
      getters.getAllEventsOfType(type, getters.getValidEvents()),
      { [id]: label }
    );
  },
  getEventsOfType: (state, getters) => (label, type, id = 'label') => {
    return _.filter(getters.getAllEventsOfType(type), { [id]: label });
  },
  getEventOfType: (state, getters) => (label, type, id = 'label') => {
    return _.last(getters.getEventsOfType(label, type, id));
  },
  getEventObject: (state, getters) => (event, id = 'label') => {
    let target = event.type;

    if (event.target !== undefined) {
      if (event.target) {
        target = event.target;
        id = event.target;
      } else {
        return {};
      }
    }

    return getters[`get${_.upperFirst(_.camelCase(target))}`](event[id]);
  },
  getEventObjects: (state, getters) => (events, id = 'label') => {
    let objects = [];

    _.each(events, function(event) {
      objects.push(getters.getEventObject(event, id));
    });

    return objects;
  },
  getEventCosts: (state, getters, rootState) => (event) => {
    let eventType = _.upperFirst(_.camelCase(event.type));
    return getters[`get${eventType}Costs`](event);
  },
  getEventAffordability: (state, getters, rootState) => (event) => {
    let eventObject = getters.getEventObject(event),
      scores = getters.getScores(event.timestamp),
      costs = getters.getEventCosts(event);

    if (
      _.isMatchWith(costs, scores, function(cost, score) {
        return cost <= score;
      })
    ) {
      return costs;
    } else {
      return false;
    }
  },
  getInteraction: (state) => (label) => {
    return state.interactions[label];
  },
  getLabelsEnabled: (state) => () => {
    return state.labelsEnabled;
  },
};

// mutations
const mutations = {
  addEvent: (state, event) => {
    if (event !== undefined) {
      state.events[event.timestamp] = event;
      return true;
    }

    return false;
  },
  resetEvents: (state, events) => {
    state.events = {};
  },
  setInteraction: (state, interaction) => {
    if (interaction !== undefined && interaction.interaction !== undefined) {
      state.interactions[interaction.interaction] = interaction;
      return true;
    }

    return false;
  },
  resetInteraction: (state, interactionLabel) => {
    state.interactions[interactionLabel] = false;
  },
};

// actions
const actions = {
  addEvent: ({ commit, dispatch, getters }, event) => {
    return new Promise((resolve, reject) => {
      if (event.timestamp === undefined) {
        event.timestamp = _.now();
      }

      let affordable = getters.getEventAffordability(event);

      if (affordable) {
        event.id = _.uniqueId();
        event.costs = affordable;

        commit('addEvent', event);
        commit('setUpdated', event.timestamp + 1);

        resolve();
      } else {
        alert('You can’t afford that');

        reject();
      }
    });
  },
  setEvents: ({ dispatch, commit }, events) => {
    commit('resetEvents');

    _.each(events, function(event) {
      dispatch('addEvent', event);
    });
  },
  setInteraction: ({ commit }, interaction) => {
    commit('setInteraction', interaction);
  },
  resetInteraction: ({ commit }, interactionLabel) => {
    commit('resetInteraction', interactionLabel);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
