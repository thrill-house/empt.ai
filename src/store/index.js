import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import VuexDash from "./dash";

export const store = createStore({
  state() {
    return {
      ownerId: process.env.VUE_APP_PLAYER_IDENTITY,
      mnemonic: process.env.VUE_APP_PLAYER_MNEMONIC,
    };
  },
  getters: {
    all: (state) => ({
      where: [["$ownerId", "==", state.ownerId]],
    }),
  },
  mutations: {
    setOwner: (state, payload) => {
      state.ownerId = payload;
    },
    setMnemonic: (state, payload) => {
      state.mnemonic = payload;
    },
  },
  plugins: [
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      ownerId: process.env.VUE_APP_GAME_IDENTITY,
      documents: ["Abilities", "Sockets", "Eras", "Trees", "Emotions"],
      namespace: "game",
    }),
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      documents: ["Games", "Sources", "Slots", "Trainings"],
      namespace: "player",
      subscribeToFrom: [
        ["ownerId", "mnemonic", "all"],
        ["setOwner", "setMnemonic"],
      ],
    }),
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});
