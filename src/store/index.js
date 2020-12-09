import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import VuexDash from "./dash";
import score from "./modules/score";
import inventory from "./modules/inventory";
import system from "./modules/system";

export default createStore({
  state() {
    return {
      ownerId: process.env.VUE_APP_PLAYER_IDENTITY,
      mnemonic: process.env.VUE_APP_PLAYER_MNEMONIC,
      gameId: null,
      loaded: {
        games: null,
        trees: null,
        eras: null,
        emotions: null,
        abilities: null,
        models: null,
        sockets: null,
        sources: null,
      }
    };
  },
  getters: {
    loaded: (state) => state.loaded,
    session: (state) => ({
      ownerId: state.ownerId,
      mnemonic: state.mnemonic,
      gameId: state.gameId
    }),
    allOwnerQuery: (state) => ({
      where: [["$ownerId", "==", state.ownerId]],
    }),
    allGameQuery: (state) => ({
      where: [
        ["$ownerId", "==", state.ownerId],
        ["gameId", "==", state.gameId],
      ],
    }),
  },
  mutations: {
    setOwner: (state, payload) => {
      state.ownerId = payload;
    },
    setMnemonic: (state, payload) => {
      state.mnemonic = payload;
    },
    setGame: (state, payload) => {
      state.gameId = payload;
    },
    setLoaded: (state, payload) => {
      state.loaded[payload] = Date.now();
    },
  },
  actions: {
    setOwner: async ({ commit }, payload) => {
      commit("setOwner", payload);
    },
    setMnemonic: async ({ commit }, payload) => {
      commit("setMnemonic", payload);
    },
    setGame: async ({ commit }, payload) => {
      commit("setGame", payload);
    },
    startup: async ({ commit, dispatch, state }) => {
      const { ownerId, mnemonic, gameId } = state;

      if (ownerId && mnemonic) {
        await dispatch("setOwner", ownerId);
        await dispatch("setMnemonic", mnemonic);

        await dispatch("Player/Games/all");
        commit("setLoaded", 'games');

        if (ownerId && mnemonic && gameId) {
          await dispatch("setGame", gameId);

          await dispatch("App/Trees/all");
          commit("setLoaded", 'trees');

          await dispatch("App/Eras/all");
          commit("setLoaded", 'eras');

          await dispatch("App/Emotions/all");
          commit("setLoaded", 'emotions');

          await dispatch("inventory/abilities");
          commit("setLoaded", 'abilities');

          await dispatch("inventory/models");
          commit("setLoaded", 'models');

          await dispatch("inventory/sockets");
          commit("setLoaded", 'sockets');

          await dispatch("inventory/sources");
          commit("setLoaded", 'sources');

          console.log("Start taking scores");
          await dispatch("score/bases");
          await dispatch("score/factors");

          // TODO: initiate with our game time
          await dispatch("score/init");
          await dispatch("score/startTimer");
        }
      }

      console.log("Done starting up");
    },
  },
  modules: { score, inventory, system },
  plugins: [
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      ownerId: process.env.VUE_APP_GAME_IDENTITY,
      documents: ["Abilities", "Sockets", "Trees", "Eras", "Emotions"],
      namespace: "App",
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Games"],
      namespace: "Player",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic", allQuery: "allOwnerQuery" },
        ["setGame"],
      ],
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Models", "Sources", "Slots", "Trainings"],
      namespace: "Game",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic", allQuery: "allGameQuery" },
        ["setOwner", "setMnemonic"],
      ],
    }),
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});
