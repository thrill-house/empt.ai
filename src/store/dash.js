import Dash from "dash";
import {
  each,
  head,
  includes,
  invokeMap,
  keyBy,
  omit,
  reduce,
} from "lodash-es";

export default (config) => {
  const defaultOptions = {
    // Namespace for the plugin.
    namespace: "dash",
    // List of documents to be fetched from Dash drive
    documents: [],

    // The network to connect to. One of "livenet", "testnet", "evonet"
    network: "livenet",
    // The contract to sync with
    contractId: null,
    // The owner to use for making changes
    // Attempts to create, edit or delete documents will fail if not included
    ownerId: null,
    // The mnemonic to use for making changes
    // Attempts to create, edit or delete documents will fail if not included
    mnemonic: null,
    // An object that is passed into queries retrieving all documents.
    // Can include conditions so that only documents matching a certain set of parameters are returned.
    // By default it will return everything
    allQuery: {},

    // Map root state values or getters to the plugin state, so that connection details can be changed dynamically.
    // Accepts a tuple, with the first parameter being an array of field names present in the root state or existing as getters.
    // Second parameter is an array of mutations present on the root state that the plugin should subscribe to to watch for changes in the values from the first array.
    subscribeToFrom: [[], []],
  };

  // Merge default options with constructor config
  const pluginOptions = { ...defaultOptions, ...config };

  // Destructure constants that can no longer change through a subscription
  const { namespace, subscribeToFrom, documents } = pluginOptions;

  // Destructure subscription tuple to return list of values and mutations to subscribe and sync
  const [subscriptions, fromRoot] = subscribeToFrom;

  // Install plugin
  return (store) => {
    // Create a module within the provided namespace
    store.registerModule(namespace, {
      namespaced: true,
      state: () => ({
        // Pass in the remaining options as our initial state
        options: pluginOptions,
      }),
      getters: {
        // Connection is dynamically created on demand and uses values from the local state.
        connection: (state) => {
          return {
            network: state.options.network,
            wallet: {
              mnemonic: state.options.mnemonic,
            },
            apps: {
              Contract: {
                contractId: state.options.contractId,
              },
            },
          };
        },
        // Client uses the dynamic connection details above
        client: (state, getters) => {
          return new Dash.Client(getters.connection);
        },
      },
      mutations: {
        updateOptions: (state, payload) => {
          state.options = { ...state.options, ...payload };
        },
      },
      actions: {
        // Helper to run the "all" action for every document module
        all: async ({ dispatch }) => {
          each(documents, (document) => {
            dispatch(`${document}/all`);
          });
        },
      },
      // Dynamically create a module for each document in the list
      modules: reduce(
        documents,
        (result, document) => {
          result[document] = {
            namespaced: true,
            state() {
              return {
                documents: [],
              };
            },
            getters: {
              all: (state) => state.documents,
              one: (state) => (id) => state.documents[id],
            },
            mutations: {
              all: (state, payload) => {
                state.documents = keyBy(invokeMap(payload, "toJSON"), "$id");
              },
              one: (state, payload) => {
                state.documents = {
                  ...state.documents,
                  [payload.$id]: payload,
                };
              },
              remove: (state, payload) => {
                state.documents = { ...omit(state.documents, payload.$id) };
              },
            },
            actions: {
              // Helper that wraps the "retrieve" action with a query to fetch all documents.
              // The `allQuery` parameter can be customised in plugin options.
              all: async ({
                dispatch,
                commit,
                rootState: {
                  [namespace]: { options },
                },
              }) => {
                commit("all", await dispatch("retrieve"), options.allQuery);
              },

              // Helper to wrap the "retrieve" action to return the first document matching the `id` passed in the payload.
              one: async ({ dispatch, commit }, { id }) => {
                commit(
                  "one",
                  head(
                    await dispatch("retrieve", {
                      where: [["$id", "==", id]],
                    })
                  )
                );
              },

              // Retrieve from documents. `payload` is a query.
              retrieve: async ({ rootGetters }, payload = {}) => {
                return await rootGetters[
                  `${namespace}/client`
                ].platform.documents.get(`Contract.${document}`, payload);
              },

              // Create a new document. `payload` is the content of the document to create.
              create: async (
                {
                  commit,
                  rootState: {
                    [namespace]: { options },
                  },
                  rootGetters,
                },
                payload = {}
              ) => {
                const client = rootGetters[`${namespace}/client`];

                try {
                  const identity = await client.platform.identities.get(
                    options.ownerId
                  );
                  const created = await client.platform.documents.create(
                    `Contract.${document}`,
                    identity,
                    payload
                  );

                  await client.platform.documents.broadcast(
                    { create: [created] },
                    identity
                  );

                  commit("one", created.toJSON());
                } catch (e) {
                  console.log(e);
                }

                client.disconnect();
              },

              // Replace a document. `payload` is the content of the document to replace and must include an `$id`.
              replace: async (
                {
                  dispatch,
                  commit,
                  rootState: {
                    [namespace]: { options },
                  },
                  rootGetters,
                },
                payload = {}
              ) => {
                const client = rootGetters[`${namespace}/client`];

                try {
                  const identity = await client.platform.identities.get(
                    options.ownerId
                  );
                  const [replaced] = await dispatch("retrieve", {
                    where: [["$id", "==", payload.$id]],
                  });

                  replaced.setData(payload);

                  await client.platform.documents.broadcast(
                    { replace: [replaced] },
                    identity
                  );

                  commit("one", replaced.toJSON());
                } catch (e) {
                  console.log(e);
                }

                client.disconnect();
              },

              // Delete a document. `payload` must include an `$id`.
              delete: async (
                {
                  dispatch,
                  commit,
                  rootState: {
                    [namespace]: { options },
                  },
                  rootGetters,
                },
                payload = {}
              ) => {
                const client = rootGetters[`${namespace}/client`];

                try {
                  const identity = await client.platform.identities.get(
                    options.ownerId
                  );
                  const [deleted] = await dispatch("retrieve", {
                    where: [["$id", "==", payload.$id]],
                  });

                  await client.platform.documents.broadcast(
                    { delete: [deleted] },
                    identity
                  );

                  commit("remove", payload);
                } catch (e) {
                  console.log(e);
                }

                client.disconnect();
              },
            },
          };

          return result;
        },
        {}
      ),
    });

    // Subscribe to root store mutations and sync root state values and getters to the plugin options.
    store.subscribe((mutation, state) => {
      if (includes(subscriptions, mutation.type)) {
        const combined = { ...state, ...store.getters };
        store.commit(
          `${namespace}/updateOptions`,
          reduce(
            fromRoot,
            (result, value, key) => {
              result[key] = combined[value];
            },
            {}
          )
        );
      }
    });
  };
};
