import _ from "lodash";

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
  "1541758585671": {
    type: "socket",
    label: "science-university",
    timestamp: 1541758585671,
    id: "39",
    costs: { confidence: 2000, data: 0 },
    factors: { bandwidth: 6, influence: 0 },
    currentScore: { data: 18, confidence: -2000 },
    finalScore: { data: 18, confidence: -2000 }
  },
  "1541758588528": {
    type: "socket",
    label: "economy-university",
    timestamp: 1541758588528,
    id: "40",
    costs: { confidence: 2240, data: 0 },
    factors: { bandwidth: 11, influence: 0 },
    currentScore: { data: 33, confidence: -2240 },
    finalScore: { data: 33, confidence: -2240 }
  },
  "1541758591444": {
    type: "socket",
    label: "society-university",
    timestamp: 1541758591444,
    id: "41",
    costs: { confidence: 2508.8, data: 0 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 352, confidence: -2508.8 },
    finalScore: { data: 352, confidence: -2508.8 }
  },
  "1541758613628": {
    type: "ability",
    label: "chat-buddy",
    target: false,
    happiness: 0,
    sadness: 1,
    tenderness: 0,
    anger: 1,
    excitement: 0,
    fear: 2,
    instance: "chat-buddy-1541762021517",
    timestamp: 1541758613628,
    id: "42",
    costs: { data: 0, confidence: 20 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 80, confidence: -20 },
    finalScore: { data: 80, confidence: -20 }
  },
  "1541758619039": {
    type: "ability",
    label: "video-game-level-solver",
    target: false,
    happiness: 0,
    sadness: 2,
    tenderness: 0,
    anger: 1,
    excitement: 1,
    fear: 0,
    instance: "video-game-level-solver-1541762026928",
    timestamp: 1541758619039,
    id: "43",
    costs: { data: 0, confidence: 105 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 80, confidence: -105 },
    finalScore: { data: 80, confidence: -105 }
  },
  "1541758623800": {
    type: "ability",
    label: "homework-ghostwriter",
    target: false,
    happiness: 1,
    sadness: 0,
    tenderness: 0,
    anger: 2,
    excitement: 1,
    fear: 0,
    instance: "homework-ghostwriter-1541762031689",
    timestamp: 1541758623800,
    id: "44",
    costs: { data: 0, confidence: 45 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 240, confidence: -45 },
    finalScore: { data: 240, confidence: -45 }
  },
  "1541758638940": {
    type: "ability",
    label: "tutor-students",
    target: false,
    happiness: 1,
    sadness: 0,
    tenderness: 1,
    anger: 0,
    excitement: 2,
    fear: 0,
    instance: "tutor-students-1541762046829",
    timestamp: 1541758638940,
    id: "45",
    costs: { data: 0, confidence: 7500 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 128, confidence: -7500 },
    finalScore: { data: 128, confidence: -7500 }
  },
  "1541758646772": {
    type: "ability",
    label: "tell-jokes",
    target: false,
    happiness: 2,
    sadness: 0,
    tenderness: 1,
    anger: 0,
    excitement: 0,
    fear: 1,
    instance: "tell-jokes-1541762054660",
    timestamp: 1541758646772,
    id: "46",
    costs: { data: 0, confidence: 3000 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 112, confidence: -3000 },
    finalScore: { data: 112, confidence: -3000 }
  },
  "1541758654252": {
    type: "ability",
    label: "weather-prediction",
    target: false,
    happiness: 0,
    sadness: 1,
    tenderness: 2,
    anger: 0,
    excitement: 0,
    fear: 1,
    instance: "weather-prediction-1541762062141",
    timestamp: 1541758654252,
    id: "47",
    costs: { data: 0, confidence: 1400 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 128, confidence: -1400 },
    finalScore: { data: 128, confidence: -1400 }
  },
  "1541758662457": {
    type: "ability",
    label: "human-movement-simulation",
    target: false,
    happiness: 0,
    sadness: 1,
    tenderness: 0,
    anger: 1,
    excitement: 0,
    fear: 2,
    instance: "human-movement-simulation-1541762070346",
    timestamp: 1541758662457,
    id: "48",
    costs: { data: 0, confidence: 7500 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 96, confidence: -7500 },
    finalScore: { data: 96, confidence: -7500 }
  },
  "1541758668389": {
    type: "ability",
    label: "crypto-mining",
    target: false,
    happiness: 0,
    sadness: 2,
    tenderness: 0,
    anger: 1,
    excitement: 1,
    fear: 0,
    instance: "crypto-mining-1541762076278",
    timestamp: 1541758668389,
    id: "49",
    costs: { data: 0, confidence: 1400 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 176, confidence: -1400 },
    finalScore: { data: 176, confidence: -1400 }
  },
  "1541758679236": {
    type: "ability",
    label: "grant-proposal-generator",
    target: false,
    happiness: 1,
    sadness: 0,
    tenderness: 0,
    anger: 2,
    excitement: 1,
    fear: 0,
    instance: "grant-proposal-generator-1541762087125",
    timestamp: 1541758679236,
    id: "50",
    costs: { data: 0, confidence: 3000 },
    factors: { bandwidth: 16, influence: 0 },
    currentScore: { data: 160, confidence: -3000 },
    finalScore: { data: 160, confidence: -3000 }
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
    currentScore: { data: 53.040000000000006, confidence: 4.6 },
    finalScore: { data: 53.040000000000006, confidence: 4.6 }
  },
  "1541758693423": {
    type: "slot",
    target: "ability",
    label: "root-1",
    ability: "video-game-level-solver",
    instance: "video-game-level-solver-1541762026928",
    positive: true,
    negated: [
      { type: "slot", instance: "video-game-level-solver-1541762026928" }
    ],
    timestamp: 1541758693423,
    id: "52",
    costs: { confidence: 0, data: 150 },
    factors: { bandwidth: 18.03, influence: 2.15 },
    currentScore: { data: -41.81999999999999, confidence: 12.899999999999999 },
    finalScore: { data: -41.81999999999999, confidence: 12.899999999999999 }
  },
  "1541758698937": {
    type: "slot",
    target: "ability",
    label: "root-2",
    ability: "homework-ghostwriter",
    instance: "homework-ghostwriter-1541762031689",
    positive: true,
    negated: [{ type: "slot", instance: "homework-ghostwriter-1541762031689" }],
    timestamp: 1541758698937,
    id: "53",
    costs: { confidence: 0, data: 60 },
    factors: { bandwidth: 19.03, influence: 3.45 },
    currentScore: { data: 206.42000000000002, confidence: 48.300000000000004 },
    finalScore: { data: 206.42000000000002, confidence: 48.300000000000004 }
  },
  "1541758712820": {
    type: "slot",
    target: "ability",
    label: "science-university-2",
    ability: "tutor-students",
    instance: "tutor-students-1541762046829",
    positive: true,
    negated: [{ type: "slot", instance: "tutor-students-1541762046829" }],
    timestamp: 1541758712820,
    id: "54",
    costs: { confidence: 0, data: 10000 },
    factors: { bandwidth: 20.03, influence: 4.867500000000001 },
    currentScore: { data: 5583.34, confidence: 3786.9150000000004 },
    finalScore: { data: 5583.34, confidence: 3786.9150000000004 }
  },
  "1541759490873": {
    type: "slot",
    target: "ability",
    label: "science-university-1",
    ability: "weather-prediction",
    instance: "weather-prediction-1541762062141",
    positive: true,
    negated: [{ type: "slot", instance: "weather-prediction-1541762062141" }],
    timestamp: 1541759490873,
    id: "55",
    costs: { confidence: 0, data: 2200 },
    factors: { bandwidth: 21.03, influence: 6.097100000000001 },
    currentScore: { data: -2031.76, confidence: 48.77680000000001 },
    finalScore: { data: -2031.76, confidence: 48.77680000000001 }
  },
  "1541759498647": {
    type: "slot",
    target: "ability",
    label: "economy-university-2",
    ability: "human-movement-simulation",
    instance: "human-movement-simulation-1541762070346",
    positive: true,
    negated: [
      { type: "slot", instance: "human-movement-simulation-1541762070346" }
    ],
    timestamp: 1541759498647,
    id: "56",
    costs: { confidence: 0, data: 12000 },
    factors: { bandwidth: 22.03, influence: 7.535600000000001 },
    currentScore: { data: -11889.85, confidence: 37.678000000000004 },
    finalScore: { data: -11889.85, confidence: 37.678000000000004 }
  },
  "1541759503529": {
    type: "slot",
    target: "ability",
    label: "economy-university-1",
    ability: "crypto-mining",
    instance: "crypto-mining-1541762076278",
    positive: true,
    negated: [{ type: "slot", instance: "crypto-mining-1541762076278" }],
    timestamp: 1541759503529,
    id: "57",
    costs: { confidence: 0, data: 1900 },
    factors: { bandwidth: 23.03, influence: 8.766800000000002 },
    currentScore: { data: 60027.670000000006, confidence: 23573.925200000005 },
    finalScore: { data: 60027.670000000006, confidence: 23573.925200000005 }
  },
  "1541762192674": {
    type: "slot",
    target: "ability",
    label: "society-university-2",
    ability: "tell-jokes",
    instance: "tell-jokes-1541762054660",
    positive: true,
    negated: [{ type: "slot", instance: "tell-jokes-1541762054660" }],
    timestamp: 1541762192674,
    id: "58",
    costs: { confidence: 0, data: 3200 },
    factors: { bandwidth: 24.03, influence: 10.206800000000001 },
    currentScore: { data: -3031.79, confidence: 71.44760000000001 },
    finalScore: { data: -3031.79, confidence: 71.44760000000001 }
  },
  "1541762199933": {
    type: "slot",
    target: "ability",
    label: "society-university-1",
    ability: "grant-proposal-generator",
    instance: "grant-proposal-generator-1541762087125",
    positive: true,
    negated: [
      { type: "slot", instance: "grant-proposal-generator-1541762087125" }
    ],
    timestamp: 1541762199933,
    id: "59",
    costs: { confidence: 0, data: 3400 },
    factors: { bandwidth: 25.03, influence: 11.4289 },
    currentScore: { data: -2148.5, confidence: 571.445 }
  }
};

const state = {
  start: _.now(),
  now: _.now(),
  interval: false,
  events: debugEvents,
  interactions: {
    selectedAbility: false
  }
};

// getters
const getters = {
  getStart: state => () => {
    return state.start;
  },
  getNow: state => () => {
    return state.now;
  },
  getDuration: state => (start = state.start, end = state.now) => {
    return _.round((end - start) / 1000);
  },
  getEvents: state => (before = state.now) => {
    return _.sortBy(
      _.filter(state.events, function(value) {
        return value.timestamp < before;
      }),
      "timestamp"
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
            positive: true
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
  getEventsOfType: (state, getters) => (label, type, id = "label") => {
    return _.filter(getters.getAllEventsOfType(type), { [id]: label });
  },
  getEventOfType: (state, getters) => (label, type, id = "label") => {
    return _.last(getters.getEventsOfType(label, type, id));
  },
  getEventObject: (state, getters) => (event, id = "label") => {
    var target = event.type;

    if (event.target !== undefined) {
      if (event.target) {
        var target = event.target;
        id = event.target;
      } else {
        return {};
      }
    }

    var functionName = "get" + _.upperFirst(_.camelCase(target));

    return getters[functionName](event[id]);
  },
  getEventObjects: (state, getters) => (events, id = "label") => {
    var objects = [];

    _.each(events, function(event) {
      objects.push(getters.getEventObject(event, id));
    });

    return objects;
  },
  getEventCosts: (state, getters, rootState) => event => {
    var functionName = "get" + _.upperFirst(_.camelCase(event.type)) + "Costs";
    return getters[functionName](event);
  },
  getEventAffordability: (state, getters, rootState) => event => {
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
  getInteraction: state => label => {
    return state.interactions[label];
  }
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
  }
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
      commit("addEvent", event);
    } else {
      alert("You can’t afford that");
    }
  },
  setEvents: ({ dispatch, commit }, events) => {
    commit("resetEvents");

    _.each(events, function(event) {
      dispatch("addEvent", event);
    });
  },
  startSession: ({ commit }) => {
    commit(
      "setInterval",
      window.setInterval(function() {
        commit("setNow");
      }, 1000)
    );
  },
  stopSession: ({ state, commit }) => {
    window.clearInterval(state.interval);
    commit("setInterval");
  },
  setInteraction: ({ commit }, interaction) => {
    commit("setInteraction", interaction);
  },
  resetInteraction: ({ commit }, interactionLabel) => {
    commit("resetInteraction", interactionLabel);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
