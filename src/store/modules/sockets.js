const state = {
  root: {
    name: "Root",
    type: "neutral",
    era: "student",
    parent: false,
    factors: {
      bandwidth: {
        base: 1
      }
    },
    costs: {
      data: 1
    }
  },
  "science-university": {
    name: "Science (Uni)",
    type: "science",
    era: "university",
    enables: "science",
    parent: "root",
    factors: {
      bandwidth: {
        base: 5
      }
    },
    costs: {
      confidence: 2000
    }
  },
  "economy-university": {
    name: "Economy (Uni)",
    type: "economy",
    era: "university",
    enables: "economy",
    parent: "root",
    factors: {
      bandwidth: {
        base: 5
      }
    },
    costs: {
      confidence: 2000
    }
  },
  "society-university": {
    name: "Society (Uni)",
    type: "society",
    era: "university",
    enables: "society",
    parent: "root",
    factors: {
      bandwidth: {
        base: 5
      }
    },
    costs: {
      confidence: 2000
    }
  },
  "science-business": {
    name: "Science (Biz)",
    type: "science",
    era: "business",
    parent: "science-university",
    factors: {
      bandwidth: {
        base: 15
      },
      influence: {
        base: 5
      }
    },
    costs: {
      confidence: 3000
    }
  },
  "economy-business": {
    name: "Economy (Biz)",
    type: "economy",
    era: "business",
    parent: "economy-university",
    factors: {
      bandwidth: {
        base: 15
      },
      influence: {
        base: 5
      }
    },
    costs: {
      confidence: 3000
    }
  },
  "society-business": {
    name: "Society (Biz)",
    type: "society",
    era: "business",
    parent: "society-university",
    factors: {
      bandwidth: {
        base: 15
      },
      influence: {
        base: 5
      }
    },
    costs: {
      confidence: 3000
    }
  },
  "science-government": {
    name: "Science (Gov)",
    type: "science",
    era: "government",
    parent: "science-business",
    factors: {
      bandwidth: {
        base: 45
      },
      influence: {
        base: 15
      }
    },
    costs: {
      confidence: 5000
    }
  },
  "economy-government": {
    name: "Economy (Gov)",
    type: "economy",
    era: "government",
    parent: "economy-business",
    factors: {
      bandwidth: {
        base: 45
      },
      influence: {
        base: 15
      }
    },
    costs: {
      confidence: 5000
    }
  },
  "society-government": {
    name: "Society (Gov)",
    type: "society",
    era: "government",
    parent: "society-business",
    factors: {
      bandwidth: {
        base: 45
      },
      influence: {
        base: 15
      }
    },
    costs: {
      confidence: 5000
    }
  },
  "science-consciousness": {
    name: "Science (Brain)",
    type: "science",
    era: "consciousness",
    parent: "science-government",
    factors: {
      bandwidth: {
        base: 135
      },
      influence: {
        base: 45
      }
    },
    costs: {
      confidence: 8000
    }
  },
  "economy-consciousness": {
    name: "Economy (Brain)",
    type: "economy",
    era: "consciousness",
    parent: "economy-government",
    factors: {
      bandwidth: {
        base: 135
      },
      influence: {
        base: 45
      }
    },
    costs: {
      confidence: 8000
    }
  },
  "society-consciousness": {
    name: "Society (Brain)",
    type: "society",
    era: "consciousness",
    parent: "society-government",
    factors: {
      bandwidth: {
        base: 135
      },
      influence: {
        base: 45
      }
    },
    costs: {
      confidence: 8000
    }
  }
};

// getters
const getters = {
  getSocket: (state, getters) => label => {
    return state[label];
  },
  getActiveSockets: (state, getters) => () => {
    return _.filter(getters.getEvents(), { type: "socket" });
  },
  getSocketCosts: (state, getters, rootState) => event => {
    var socket = getters.getSocket(event.label);
    var activeLength = getters.getActiveSockets().length;
    var socketCosts = {};

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
  }
};

// mutations
const mutations = {
  activateSocket: (state, label) => {
    state[label].active = true;
  }
};

// actions
const actions = {
  addSocketEvent: ({ dispatch, commit, getters }, event) => {
    return dispatch("addEvent", event).then(success => {
      var socket = getters.getEventObject(event);
      commit("activateEra", socket.era, { root: true });
    });
  }
};

export default {
  state,
  getters,
  actions
};
