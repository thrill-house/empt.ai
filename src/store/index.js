import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import VuexDash from "./plugins/dash";
import score from "./modules/score";
import inventory from "./modules/inventory";
import system from "./modules/system";
import labels from "./modules/labels";

export default createStore({
  state() {
    return {
      identityId: null,
      mnemonic: null,
      gameId: null,
      games: null,
    };
  },
  getters: {
    game: (state) => state?.games?.[state.gameId],
    allOwnerQuery: (state) => ({
      where: [["$ownerId", "==", state.identityId]],
    }),
    allGameQuery: (state) => ({
      where: [
        ["$ownerId", "==", state.identityId],
        ["gameId", "==", state.gameId],
      ],
    }),
  },
  mutations: {
    identityId: (state, payload) => {
      state.identityId = payload;
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
      const { identityId, mnemonic, gameId } = state;
      dispatch("labels/init");

      if (mnemonic) {
        await dispatch("setMnemonic", mnemonic);
      }

      if (identityId) {
        await dispatch("setIdentityId", identityId);
      }

      if (identityId && mnemonic) {
        await dispatch("fetchGames");

        if (gameId) {
          await dispatch("loadGame", gameId);
        }
      }
    },

    setIdentityId: async ({ commit }, payload) => {
      commit("identityId", payload);
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
      identityId: process.env.VUE_APP_GAME_IDENTITY,
      documents: ["Abilities", "Sockets", "Trees", "Eras", "Emotions"],
      namespace: "App",
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Games"],
      namespace: "Player",
      subscribeToFrom: [
        {
          identityId: "identityId",
          mnemonic: "mnemonic",
          allQuery: "allOwnerQuery",
        },
        ["identityId", "mnemonic"],
      ],
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Models", "Slots", "Sources", "Trainings"],
      namespace: "Game",
      subscribeToFrom: [
        {
          identityId: "identityId",
          mnemonic: "mnemonic",
          allQuery: "allGameQuery",
        },
        ["gameId", "identityId", "mnemonic"],
      ],
    }),
    new VuexPersistence().plugin,
  ],
});
