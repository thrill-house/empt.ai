require("dotenv").config();

const Dash = require("dash");
const fs = require("fs");

const clientOpts = {
  network: process.env.VUE_APP_GAME_NETWORK,
  wallet: {
    mnemonic: process.env.VUE_APP_GAME_MNEMONIC,
  },
};
const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const platform = client.platform;
  const identity = await platform.identities.get(
    process.env.VUE_APP_GAME_IDENTITY
  );
  const documents = JSON.parse(
    fs.readFileSync(`${__dirname}/../documents.json`)
  );
  const definitions = JSON.parse(
    fs.readFileSync(`${__dirname}/../definitions.json`)
  );

  const contract = await platform.contracts.create(documents, identity);
  contract.setDefinitions(definitions);

  const validationResult = await platform.dpp.dataContract.validate(contract);

  if (validationResult.isValid()) {
    console.log("Validation passed, broadcasting contract..");
    return platform.contracts.broadcast(contract, identity);
  }
  console.error(validationResult);
  throw validationResult.errors[0];
};

registerContract()
  .then((d) => console.log("Contract registered:\n", d.toJSON()))
  .catch((e) => console.error("Something went wrong:\n", e))
  .finally(() => client.disconnect());
