import Dash from "dash";
import {
  each,
  head,
  includes,
  invokeMap,
  isEqual,
  keyBy,
  keys,
  omit,
  once,
  pickBy,
  reduce,
  startsWith,
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
        options: (state) => {
          return state.options;
        },
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
        accountSynced: (state) => {
          if (state.accountSynced) {
            return state.accountSynced;
          }

          return null;
        },
        accountLoading: (state) => {
          if (state.accountLoading) {
            return state.accountLoading;
          }

          return null;
        },
        account: (state) => {
          if (state.accountSynced) {
            console.debug(state.accountSynced);
          }

          if (state.account && typeof state.account === "function") {
            return state.account();
          }

          if (state.accountInit && typeof state.accountInit === "function") {
            state.accountInit();
          }

          return null;
        },
        identities: (state, getters) => {
          if (getters.account) {
            return getters.account.getIdentityIds();
          }

          return [];
        },
        balance: (state, getters) => {
          if (getters.account) {
            return {
              confirmed: getters.account.getConfirmedBalance(),
              unconfirmed: getters.account.getUnconfirmedBalance(),
            };
          }

          return { confirmed: 0, unconfirmed: 0 };
        },
        credit: (state, getters) => {
          if (getters.account) {
            return {
              confirmed: getters.account.getConfirmedBalance(),
              unconfirmed: getters.account.getUnconfirmedBalance(),
            };
          }

          return { confirmed: 0, unconfirmed: 0 };
        },
      },
      mutations: {
        account: (state, payload) => {
          state.account = payload;
        },
        accountInit: (state, payload) => {
          state.accountInit = payload;
        },
        accountSynced: (state, payload) => {
          state.accountSynced = payload;
        },
        accountLoading: (state, payload) => {
          state.accountLoading = payload;
        },
        updateOptions: (state, payload) => {
          state.options = { ...state.options, ...payload };
        },
      },
      actions: {
        // Helper to run the "all" action for every document module
        init: async ({ commit, getters }) => {
          const accountInit = once(async () => {
            console.log("fetching account");
            commit("accountLoading", true);

            const account = await getters.client.getWalletAccount();

            account.on("FETCHED/UNCONFIRMED_TRANSACTION", () => {
              commit("accountSynced", Date.now());
            });

            account.on("FETCHED/CONFIRMED_TRANSACTION", () => {
              commit("accountSynced", Date.now());
            });

            commit("account", () => account);
            commit("accountSynced", Date.now());

            commit("accountInit", null);
            commit("accountLoading", false);
          });

          commit("accountInit", accountInit);
        },

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
            state: {
              documents: {},
            },
            getters: {
              all: (state) => state.documents,
              one: (state) => (id) => state.documents?.[id],
            },
            mutations: {
              all: (state, payload) => {
                const documents = keyBy(invokeMap(payload, "toJSON"), "$id");
                state.documents = documents;
              },
              one: (state, payload) => {
                const document = payload.toJSON();
                state.documents = {
                  ...state.documents,
                  [document.$id]: document,
                };
              },
              remove: (state, payload) => {
                const document = payload.toJSON();
                state.documents = {
                  ...omit(state.documents, document.$id),
                };
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
                const all = await dispatch("retrieve", options.allQuery);

                commit("all", all);

                return all;
              },

              // Helper to wrap the "retrieve" action to return the first document matching the `id` passed in the payload.
              one: async ({ dispatch, commit }, payload = null) => {
                const one = head(
                  await dispatch("retrieve", {
                    where: [["$id", "==", payload]],
                  })
                );

                commit("one", one);

                return one;
              },

              // Retrieve from documents. `payload` is a query.
              retrieve: async ({ rootGetters }, payload = {}) => {
                return await rootGetters[
                  `${namespace}/client`
                ].platform.documents.get(`Contract.${document}`, payload);
              },

              compose: async ({ rootGetters }, payload = {}) => {
                const client = rootGetters[`${namespace}/client`];

                try {
                  const identity = await client.platform.identities.get(
                    rootGetters[`${namespace}/options`].ownerId
                  );

                  const composed = await client.platform.documents.create(
                    `Contract.${document}`,
                    identity,
                    payload
                  );

                  return composed;
                } catch (e) {
                  console.log(e);
                }
              },

              multiple: async ({ commit, dispatch }, payload = {}) => {
                let documents = { create: [], replace: [], delete: [] };

                try {
                  for await (const item of payload) {
                    if (isEqual(keys(item), ["$id"])) {
                      const deleted = await dispatch("one", item.$id);

                      documents.delete.push(deleted);
                    } else if (item.$id) {
                      const replaced = await dispatch("one", item.$id);

                      replaced.setData(
                        pickBy(item, (value, key) => !startsWith(key, "$"))
                      );

                      documents.replace.push(replaced);
                    } else {
                      const created = await dispatch("compose", item);

                      documents.create.push(created);
                    }
                  }

                  await dispatch("broadcast", documents);

                  each(
                    [...documents.create, ...documents.replace],
                    (document) => {
                      commit("one", document);
                    }
                  );
                  each(documents.delete, (document) => {
                    commit("remove", document);
                  });
                } catch (e) {
                  console.log(e);
                }
              },

              // Create a new document. `payload` is the content of the document to create.
              create: async ({ commit, dispatch }, payload = {}) => {
                try {
                  const created = await dispatch("compose", payload);

                  await dispatch("broadcast", { create: [created] });

                  commit("one", created);
                } catch (e) {
                  console.log(e);
                }
              },

              // Replace a document. `payload` is the content of the document to replace and must include an `$id`.
              replace: async ({ dispatch, commit }, payload = {}) => {
                try {
                  const replaced = await dispatch("one", payload.$id);

                  replaced.setData(payload);

                  await dispatch("broadcast", { replace: [replaced] });

                  commit("one", replaced);
                } catch (e) {
                  console.log(e);
                }
              },

              // Delete a document. `payload` must include an `$id`.
              delete: async ({ dispatch, commit }, payload = {}) => {
                try {
                  const deleted = await dispatch("one", payload.$id);

                  await dispatch("broadcast", { delete: [deleted] });

                  commit("remove", deleted);
                } catch (e) {
                  console.log(e);
                }
              },

              // Broadcast a set of documents. Payload is an object with create, replace and or delete keys.
              broadcast: async ({ dispatch, rootGetters }, payload = {}) => {
                const included = {
                  create: [],
                  replace: [],
                  delete: [],
                };
                const remainder = {
                  create: [],
                  replace: [],
                  delete: [],
                };
                let size = 0;
                let limit = 0;

                each(payload, (items, key) => {
                  each(items, (item) => {
                    size +=
                      new TextEncoder().encode(JSON.stringify(item)).length /
                      1024;
                    limit += 1;

                    if (size < 16 && limit <= 10) {
                      included[key].push(item);
                    } else {
                      remainder[key].push(item);
                    }
                  });
                });

                if (
                  included.create.length ||
                  included.replace.length ||
                  included.delete.length
                ) {
                  const client = rootGetters[`${namespace}/client`];
                  const identity = await client.platform.identities.get(
                    rootGetters[`${namespace}/options`].ownerId
                  );
                  await client.platform.documents.broadcast(included, identity);
                }

                if (
                  remainder.create.length ||
                  remainder.replace.length ||
                  remainder.delete.length
                ) {
                  await dispatch("broadcast", remainder);
                }
              },
            },
          };

          return result;
        },
        {}
      ),
    });

    // console.log(store);

    // Subscribe to root store mutations and sync root state values and getters to the plugin options.
    store.subscribe((mutation, state) => {
      // if (mutation.type === `${namespace}/updateOptions`) {
      //   console.log(mutation.type);
      //   store.dispatch(`${namespace}/init`);
      // }

      if (includes(fromRoot, mutation.type)) {
        const combined = { ...state, ...store.getters };
        store.commit(
          `${namespace}/updateOptions`,
          reduce(
            subscriptions,
            (result, value, key) => {
              result[key] = combined[value];
              return result;
            },
            {}
          )
        );
      }
    });

    store.dispatch(`${namespace}/init`);
  };
};
