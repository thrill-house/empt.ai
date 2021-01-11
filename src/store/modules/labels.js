import { find, keys, map, sortBy, zipObject } from "lodash-es";

const sortKeysBy = (obj, comparator) => {
  const objKeys = sortBy(keys(obj), (key) =>
    comparator ? comparator(obj[key], key) : key
  );

  return zipObject(
    objKeys,
    map(objKeys, (key) => obj[key])
  );
};

export default {
  namespaced: true,
  state: () => ({
    // Trees
    trees: {},

    // Eras
    eras: {},

    // Emotions
    emotions: {},
  }),
  getters: {
    // Get all trees
    trees: (state) => state.trees,

    // GGet all eras
    eras: (state) => state.eras,

    // Get all emotions
    emotions: (state) => state.emotions,

    // Get one tree
    tree: (state, getters) => (id) => getters.trees?.[id],

    // Get one era
    era: (state, getters) => (id) => getters.eras?.[id],

    // Get one emotion
    emotion: (state, getters) => (id) => getters.emotions?.[id],

    // Get one tree by title
    treeByTitle: (state, getters) => (title) => find(getters.trees, { title }),

    // Get one era by title
    eraByTitle: (state, getters) => (title) => find(getters.eras, { title }),

    // Get one emotion by title
    emotionByTitle: (state, getters) => (title) =>
      find(getters.emotions, { title }),
  },
  mutations: {
    trees: (state, payload) => {
      state.trees = payload;
    },
    eras: (state, payload) => {
      state.eras = payload;
    },
    emotions: (state, payload) => {
      state.emotions = payload;
    },
  },
  actions: {
    init: async ({ dispatch }) => {
      await dispatch("fetchTrees");
      await dispatch("fetchEras");
      await dispatch("fetchEmotions");
    },

    fetchTrees: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Trees/all", null, { root: true });

      commit(
        "trees",
        sortKeysBy(rootGetters["App/Trees/all"], ({ title }) => {
          switch (title) {
            case "Neutral":
              return 1;
            case "Science":
              return 2;
            case "Economy":
              return 3;
            case "Society":
              return 4;
          }
        })
      );
    },

    fetchEras: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Eras/all", null, { root: true });

      commit(
        "eras",
        sortKeysBy(rootGetters["App/Eras/all"], ({ title }) => {
          switch (title) {
            case "Hobbyist":
              return 1;
            case "University":
              return 2;
            case "Business":
              return 3;
            case "Government":
              return 4;
            case "Consciousness":
              return 4;
          }
        })
      );
    },

    fetchEmotions: async ({ commit, dispatch, rootGetters }) => {
      await dispatch("App/Emotions/all", null, { root: true });

      commit(
        "emotions",
        sortKeysBy(rootGetters["App/Emotions/all"], ({ title }) => {
          switch (title) {
            case "Happiness":
              return 1;
            case "Sadness":
              return 2;
            case "Tenderness":
              return 3;
            case "Anger":
              return 4;
            case "Excitement":
              return 5;
            case "Fear":
              return 6;
          }
        })
      );
    },
  },
};
