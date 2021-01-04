import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import VuexDash from "./dash";
import score from "./modules/score";
import inventory from "./modules/inventory";
import system from "./modules/system";
import labels from "./modules/labels";

export default createStore({
  state() {
    return {
      ownerId: process.env.VUE_APP_PLAYER_IDENTITY,
      mnemonic: process.env.VUE_APP_PLAYER_MNEMONIC,
      gameId: null,
      games: null,
    };
  },
  getters: {
    game: (state) => state?.games?.[state.gameId],
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
    ownerId: (state, payload) => {
      state.ownerId = payload;
    },
    mnemonic: (state, payload) => {
      state.mnemonic = payload;
    },
    gameId: (state, payload) => {
      state.gameId = payload;
    },
    games: (state, payload) => {
      state.games = payload;
    },
  },
  actions: {
    init: async ({ dispatch, state }) => {
      const { ownerId, mnemonic, gameId } = state;
      dispatch("labels/init");

      if (ownerId && mnemonic) {
        await dispatch("setOwnerId", ownerId);
        await dispatch("setMnemonic", mnemonic);
        await dispatch("fetchGames");

        if (gameId) {
          await dispatch("loadGame", gameId);
        }
      }
    },

    setOwnerId: async ({ commit }, payload) => {
      commit("ownerId", payload);
    },
    setMnemonic: async ({ commit }, payload) => {
      commit("mnemonic", payload);
    },

    fetchGames: async ({ commit, dispatch, getters }) => {
      await dispatch("Player/Games/all");

      commit("games", getters["Player/Games/all"]);
    },

    loadGame: async ({ commit, dispatch }, payload) => {
      commit("gameId", payload);

      await dispatch("score/init");
      await dispatch("system/init");
      await dispatch("inventory/init");
    },
  },
  modules: { score, inventory, system, labels },
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
        ["gameId", "ownerId", "mnemonic"],
      ],
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Models", "Slots", "Sources", "Trainings"],
      namespace: "Game",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic", allQuery: "allGameQuery" },
        ["ownerId", "mnemonic"],
      ],
    }),
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});
