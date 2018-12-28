import _ from 'lodash';
import api from '../../api';

// state
const state = {
  list: {},
};

// getters
const getters = {
  getSocket: (state, getters) => (label) => {
    return state.list[label];
  },
  getSocketSlots: (state, getters) => (label) => {
    return getters.getSocket(label).slots;
  },
  getSocketsEvents: (state, getters) => () => {
    return _.filter(getters.getEvents(), { type: 'socket' });
  },
  getActiveSocketLabels: (state, getters) => () => {
    return _.map(getters.getSocketsEvents(), 'label');
  },
  getActiveSockets: (state, getters) => () => {
    return _.pick(state.list, getters.getActiveSocketLabels());
  },
  getInactiveSockets: (state, getters) => () => {
    return _.omit(state.list, getters.getActiveSocketLabels());
  },
  getSocketCosts: (state, getters, rootState) => (event) => {
    let socket = getters.getSocket(event.label),
      activeLength = getters.getActiveSockets().length,
      socketCosts = {};

    if (socket) {
      _.forIn(socket.costs, (cost, key) => {
        socketCosts[key] = cost;

        if (activeLength > 0) {
          socketCosts[key] *= Math.pow(
            rootState.scores.MULTIPLIER_RATE,
            activeLength - 1
          );
        }
      });
    }

    return _.defaults(socketCosts, rootState.scores.COSTS_INIT);
  },
  getSlot: (state, getters) => (label) => {
    return state[label];
  },
  getSlotEvents: (state, getters) => (label) => {
    return _.filter(getters.getValidEvents(), { type: 'slot', label: label });
  },
  getSlotEvent: (state, getters) => (label) => {
    let slotEvents = getters.getSlotEvents(label);
    return slotEvents.length ? _.last(slotEvents) : false;
  },
  getValidSlotEvents: (state, getters) => (label) => {
    return getters.getSlotEvents(label);
  },
  getAbilitySlotEvents: (state, getters) => (abilityLabel = '') => {
    let filter = { type: 'slot', target: 'ability' };

    if (abilityLabel) {
      filter['ability'] = abilityLabel;
    }

    return _.filter(getters.getValidEvents(), filter);
  },
  getAbilitySlotEvent: (state, getters) => (abilityLabel = '') => {
    return getters.getAbilitySlotEvents(abilityLabel);
  },
  getSlotCosts: (state, getters, rootState) => (event) => {
    let ability = getters.getAbility(event.ability),
      activeLength = getters.getAbilityEvents(event.ability).length,
      slotCosts = {};

    if (ability) {
      _.forIn(ability.costs, (cost, key) => {
        slotCosts[key] = cost;

        if (activeLength > 1) {
          slotCosts[key] *= Math.pow(
            rootState.scores.MULTIPLIER_RATE,
            activeLength
          );
        }
      });
    }

    return _.defaults(
      { confidence: 0 },
      slotCosts,
      rootState.scores.COSTS_INIT
    );
  },
  getSlotsForSocket: (state, getters) => (socket) => {
    return _.pickBy(state, (slot) => {
      return slot.socket === socket;
    });
  },
  getSocketForSlot: (state, getters) => (slot) => {
    return getters.getSocket(getters.getSlot(slot).socket);
  },
};

// mutations
const mutations = {
  activateSocket: (state, label) => {
    state.list[label].active = true;
  },
  initSockets(state, sockets) {
    state.list = sockets;
  },
};

// actions
const actions = {
  initSockets({ commit }) {
    api.get('sockets.json').then(function(response) {
      commit('initSockets', _.keyBy(response.data.data, 'label'));
    });
  },
  addSocketEvent: ({ dispatch, commit, getters }, event) => {
    return dispatch('addEvent', event)
      .then(() => {
        let socket = getters.getEventObject(event);
        commit('activateEra', socket.era, { root: true });
      })
      .catch((error) => {
        console.log({ error });
      });
  },
  addSlotEvent: ({ getters, dispatch }, eventValues) => {
    // Set instance to provided instance
    let instance = eventValues.instance,
      positive = true,
      slotEvents = getters.getSlotEvents(eventValues.label),
      // Get the last event for this instance, if it exists.
      instanceEvent = _.last(_.filter(slotEvents, { instance: instance })),
      // Get the last event for this slot, regardless of positive or negative.
      slotEvent = _.last(slotEvents);

    // If instance is blank
    if (!instance) {
      // If there is a previous instance, and it was positive, then set the instance to this instead.
      if (slotEvent && slotEvent.positive) {
        instance = slotEvent.instance;
        positive = false;
        // Exit, we don't want to add in a blank event, and there's no need to cancel something that doesn't exist.
      } else {
        return false;
      }
      // If something has been slotted here before
      // + That slotting was positive
      // + The instance we're trying to slot is already in the slot
      // + There is a previous instance event (there should be at this point, but checking for sanity)
      // + The instance event was also positive
      // + The instance event is not the same as the slot event
      // + The slot event came after the instance event
    } else if (
      slotEvent &&
      slotEvent.positive &&
      instance === slotEvent.instance &&
      instanceEvent &&
      instanceEvent.positive &&
      !_.isMatch(slotEvent, instanceEvent) &&
      slotEvent.timestamp > instanceEvent.timestamp
    ) {
      positive = false;
    }

    let event = {
      type: 'slot',
      target: 'ability',
      label: eventValues.label,
      ability: eventValues.ability,
      instance: instance,
      positive: positive,
    };

    if (event.positive) {
      event.negated = [
        {
          type: 'slot',
          instance: instance,
        },
      ];
    }

    dispatch('addEvent', event);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
