import _ from 'lodash';

/*
let debugEvents = {
  "1541758580990": {
    type: "socket",
    label: "root",
    timestamp: 1541758580990,
    id: "38",
    costs: { data: 1, confidence: 0 },
    factors: { bandwidth: 1, influence: 0 },
    currentScore: { data: 4, confidence: 0 },
    finalScore: { data: 4, confidence: 0 }
  },
  "1541758613628": {
    type: "ability",
    label: "chat-buddy",
    target: false,
    emotions: {
      happiness: 0,
      sadness: 1,
      tenderness: 0,
      anger: 1,
      excitement: 0,
      fear: 2
    },
    instance: "chat-buddy-1541762021517",
    timestamp: 1541758613628,
    id: "42",
    costs: { data: 0, confidence: 20 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 80, confidence: -20 },
    finalScore: { data: 80, confidence: -20 }
  },
  "1541758689476": {
    type: "slot",
    target: "ability",
    label: "root-3",
    ability: "chat-buddy",
    instance: "chat-buddy-1541762021517",
    positive: true,
    negated: [{ type: "slot", instance: "chat-buddy-1541762021517" }],
    timestamp: 1541758689476,
    id: "51",
    costs: { confidence: 0, data: 15 },
    factors: { bandwidth: 17.01, influence: 1.15 },
    currentScore: { data: 53, confidence: 4.6 },
    finalScore: { data: 53, confidence: 4.6 }
  }
};
*/

const state = {
  start: _.now(),
  now: _.now(),
  interval: false,
  //events: debugEvents,
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
  getStart: (state) => () => {
    return state.start;
  },
  getNow: (state) => () => {
    return state.now;
  },
  getDuration: (state) => (start = state.start, end = state.now) => {
    return _.round((end - start) / 1000);
  },
  getEvents: (state) => (before = state.now) => {
    return _.sortBy(
      _.filter(state.events, function(value) {
        return value.timestamp < before;
      }),
      'timestamp'
    );
  },
  getValidEvents: (state, getters) => (before = state.now) => {
    var events = getters.getEvents(before);
    var negatedEvents = [];

    _.each(events, function(event) {
      _.each(event.negated, function(negated) {
        var negatedEvent = _.last(
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
        var negatedEvent = _.last(
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
  getEventsOfType: (state, getters) => (label, type, id = 'label') => {
    return _.filter(getters.getAllEventsOfType(type), { [id]: label });
  },
  getEventOfType: (state, getters) => (label, type, id = 'label') => {
    return _.last(getters.getEventsOfType(label, type, id));
  },
  getEventObject: (state, getters) => (event, id = 'label') => {
    var target = event.type;

    if (event.target !== undefined) {
      if (event.target) {
        var target = event.target;
        id = event.target;
      } else {
        return {};
      }
    }

    var functionName = 'get' + _.upperFirst(_.camelCase(target));

    return getters[functionName](event[id]);
  },
  getEventObjects: (state, getters) => (events, id = 'label') => {
    var objects = [];

    _.each(events, function(event) {
      objects.push(getters.getEventObject(event, id));
    });

    return objects;
  },
  getEventCosts: (state, getters, rootState) => (event) => {
    var functionName = 'get' + _.upperFirst(_.camelCase(event.type)) + 'Costs';
    return getters[functionName](event);
  },
  getEventAffordability: (state, getters, rootState) => (event) => {
    var eventObject = getters.getEventObject(event);
    var scores = getters.getScores(event.timestamp);
    var costs = getters.getEventCosts(event);

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
  setStart: (state, start = _.now()) => {
    state.start = start;
  },
  setNow: (state, now = _.now()) => {
    state.now = now;
  },
  setInterval: (state, interval = false) => {
    state.interval = interval;
  },
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
    if (event.timestamp === undefined) {
      event.timestamp = _.now();
    }

    var affordable = getters.getEventAffordability(event);

    if (affordable) {
      event.id = _.uniqueId();
      event.costs = affordable;
      commit('addEvent', event);
    } else {
      alert('You can’t afford that');
    }
  },
  setEvents: ({ dispatch, commit }, events) => {
    commit('resetEvents');

    _.each(events, function(event) {
      dispatch('addEvent', event);
    });
  },
  startSession: ({ commit }) => {
    commit(
      'setInterval',
      window.setInterval(function() {
        commit('setNow');
      }, 1000)
    );
  },
  stopSession: ({ state, commit }) => {
    window.clearInterval(state.interval);
    commit('setInterval');
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
