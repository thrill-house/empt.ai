require("dotenv").config();

const Dash = require("dash");

const clientOpts = {
  network: process.env.VUE_APP_GAME_NETWORK,
  wallet: {
    mnemonic: process.env.VUE_APP_GAME_MNEMONIC,
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    },
  },
};
const client = new Dash.Client(clientOpts);

const createIdentity = async () => {
  return client.platform.identities.register();
};

createIdentity()
  .then((d) => console.log("Identity:\n", d.toJSON()))
  .catch((e) => console.error("Something went wrong:\n", e))
  .finally(() => client.disconnect());
