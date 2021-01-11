import { createStore } from "vuex";

import VuexDash from "./dash";

export default createStore({
  state() {
    return {
      ownerId: process.env.VUE_APP_GAME_IDENTITY,
      mnemonic: process.env.VUE_APP_GAME_MNEMONIC,
    };
  },
  mutations: {
    ownerId: (state, payload) => {
      state.ownerId = payload;
    },
    mnemonic: (state, payload) => {
      state.mnemonic = payload;
    },
  },
  actions: {
    init: async ({ dispatch, state }) => {
      const { ownerId, mnemonic } = state;

      if (ownerId && mnemonic) {
        await dispatch("setOwnerId", ownerId);
        await dispatch("setMnemonic", mnemonic);
        await dispatch("App/all");
      }
    },

    setOwnerId: async ({ commit }, payload) => {
      commit("ownerId", payload);
    },
    setMnemonic: async ({ commit }, payload) => {
      commit("mnemonic", payload);
    },
  },
  plugins: [
    new VuexDash({
      network: process.env.VUE_APP_GAME_NETWORK,
      contractId: process.env.VUE_APP_GAME_CONTRACT,
      ownerId: process.env.VUE_APP_GAME_IDENTITY,
      documents: ["Sockets", "Abilities", "Trees", "Eras", "Emotions"],
      namespace: "App",
      subscribeToFrom: [
        { ownerId: "ownerId", mnemonic: "mnemonic" },
        ["ownerId", "mnemonic"],
      ],
    }),
  ],
});
