import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import VuexDash from "./dash";
import score from "./modules/score";

export default createStore({
  state() {
    return {
      ownerId: process.env.VUE_APP_PLAYER_IDENTITY,
      mnemonic: process.env.VUE_APP_PLAYER_MNEMONIC,
      gameId: null,
    };
  },
  getters: {
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
  },
  modules: { score },
  plugins: [
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      ownerId: process.env.VUE_APP_GAME_IDENTITY,
      documents: ["Abilities", "Sockets", "Eras", "Trees", "Emotions"],
      namespace: "app",
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Games"],
      namespace: "player",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic", allQuery: "allGameQuery" },
        ["setGame"],
      ],
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Sources", "Slots", "Trainings"],
      namespace: "game",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic", allQuery: "allOwnerQuery" },
        ["setOwner", "setMnemonic"],
      ],
    }),
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});
