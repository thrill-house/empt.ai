<script>
import Dash from "dash";
import { omitBy, remove, startsWith } from "lodash-es";
import vueJsonEditor from "vue-json-editor";

export default {
  name: "app",
  components: { vueJsonEditor },
  data: () => ({
    // Connection to blockchain
    network: process.env.VUE_APP_GAME_NETWORK,
    contract: process.env.VUE_APP_GAME_CONTRACT,
    mnemonic: process.env.VUE_APP_GAME_MNEMONIC,
    address: process.env.VUE_APP_GAME_ADDRESS,
    identity: process.env.VUE_APP_GAME_IDENTITY,

    // Wallet balances
    balance: null,
    credit: null,

    // Editing
    document: "",
    id: null,
    field: {},

    // Viewing documents
    open: "",
    documents: {
      Abilities: [],
      Sockets: [],
      Eras: [],
      Trees: [],
      Emotions: [],
    },

    // Loading states
    loading: {
      address: false,
      identity: false,
      balance: false,
      create: [],
      retrieve: [],
      update: [],
      delete: [],
    },
  }),
  computed: {
    clientOptions() {
      const clientOptions = {
        network: this.network,
      };

      if (this.contract) {
        clientOptions.apps= {
          Contract: {
            contractId: this.contract,
          }
        };
      }

      if (this.mnemonic) {
        clientOptions.wallet = {
          mnemonic: this.mnemonic,
        };
      }

      return clientOptions;
    },
  },
  watch: {
    open(newOpen) {
      if (!this.documents[newOpen].length) {
        this.retrieveDocuments(newOpen);
      }
    },
  },
  methods: {
    // Retrieve address
    createWallet() {
      this.loading.address = true;

      const client = new Dash.Client({
        network: this.network,
        wallet: {
          mnemonic: null,
        },
      });

      const createWallet = async () => {
        await client.getWalletAccount();
        const mnemonic = client.wallet.exportWallet();

        this.mnemonic = mnemonic;
      };

      createWallet()
        .catch((e) => console.error("Something went wrong:\n", e))
        .finally(() => {
          this.loading.address = false;
          client.disconnect();
        });
    },

    // Retrieve address
    retrieveAddress() {
      this.loading.address = true;
      const client = new Dash.Client(this.clientOptions);

      const retrieveIdentity = async () => {
        const account = await client.wallet.getAccount();
        await account.isReady();

        this.address = account.getUnusedAddress().address;
      };

      retrieveIdentity()
        .catch((e) => console.error("Something went wrong:\n", e))
        .finally(() => {
          this.loading.address = false;
          client.disconnect();
        });
    },

    // Register identity
    registerIdentity() {
      this.loading.identity = true;
      const client = new Dash.Client(this.clientOptions);

      const createIdentity = async () => {
        return client.platform.identities.register();
      };

      createIdentity()
        .then((d) => {
          this.identity = d.toJSON().id;
        })
        .catch((e) => console.error("Something went wrong:\n", e))
        .finally(() => {
          this.loading.identity = false;
          client.disconnect();
        });
    },

    // Retrieve an identity
    retrieveIdentity() {
      this.loading.identity = true;
      const client = new Dash.Client(this.clientOptions);

      const retrieveIdentity = async () => {
        const account = await client.wallet.getAccount();
        await account.isReady();
        return account.getIdentityIds();
      };

      retrieveIdentity()
        .then((d) => {
          this.identity = d[0];
        })
        .catch((e) => console.error("Something went wrong:\n", e))
        .finally(() => {
          this.loading.identity = false;
          client.disconnect();
        });
    },

    // Retrieve an identity
    retrieveBalance() {
      this.loading.balance = true;
      const client = new Dash.Client(this.clientOptions);

      const retrieveBalance = async () => {
        const account = await client.wallet.getAccount();
        await account.isReady();
        this.balance = account.getTotalBalance(false);
        const identity = await client.platform.identities.get(this.identity);
        return identity;
      };

      retrieveBalance()
        .then((d) => {
          this.credit = d.toJSON().balance;
        })
        .catch((e) => console.error("Something went wrong:\n", e))
        .finally(() => {
          this.loading.balance = false;
          client.disconnect();
        });
    },

    // Add a new message
    createDocument(document, content) {
      if (document && content) {
        this.reset();
        this.loading.create.push(document);
        const client = new Dash.Client(this.clientOptions);

        const submitNoteDocument = async () => {
          const identity = await client.platform.identities.get(this.identity);

          const createdDocument = await client.platform.documents.create(
            `Contract.${document}`,
            identity,
            content
          );

          return client.platform.documents.broadcast(
            { create: [createdDocument] },
            identity
          );
        };

        submitNoteDocument()
          .then((d) => {
            console.log("Document created:\n", d);
            this.retrieveDocuments(document);
          })
          .catch((e) => console.error("Something went wrong:\n", e))
          .finally(() => {
            this.loading.create = remove(this.loading.create, document);
            client.disconnect();
          });
      }
    },

    // Retrieve all messages
    retrieveDocuments(document) {
      if (document) {
        this.loading.retrieve.push(document);
        const client = new Dash.Client(this.clientOptions);

        const getDocuments = async () =>
          await client.platform.documents.get(`Contract.${document}`, {
            where: [["$ownerId", "==", this.identity]],
          });

        getDocuments()
          .then((d) => {
            this.documents[document] = d.map((doc) => ({
              json: omitBy(doc.toJSON(), (json, j) => !startsWith(j, "$")),
              data: doc.getData(),
            }));
          })
          .catch((e) => console.error("Something went wrong:\n", e))
          .finally(() => {
            this.loading.retrieve = remove(this.loading.retrieve, document);
            client.disconnect();
          });
      }
    },

    // Retrieve all messages
    updateDocument(document, content, id) {
      if (document && id && content) {
        this.reset();
        this.loading.update.push(document);
        const client = new Dash.Client(this.clientOptions);

        const updateDocument = async () => {
          const identity = await client.platform.identities.get(this.identity);
          const [updatedDocument] = await client.platform.documents.get(
            `Contract.${document}`,
            {
              where: [["$id", "==", id]],
            }
          );

          updatedDocument.setData(content);

          return client.platform.documents.broadcast(
            { replace: [updatedDocument] },
            identity
          );
        };

        updateDocument()
          .then((d) => {
            console.log("Document updated:\n", d);
            this.retrieveDocuments(document);
          })
          .catch((e) => console.error("Something went wrong:\n", e))
          .finally(() => {
            this.loading.update = remove(this.loading.update, document);
            client.disconnect();
          });
      }
    },

    // Delete a document
    deleteDocument(document, id) {
      if (document && id) {
        this.loading.delete.push(document);
        const client = new Dash.Client(this.clientOptions);

        const deleteDocument = async () => {
          const identity = await client.platform.identities.get(this.identity);
          const deleteDocuments = await client.platform.documents.get(
            `Contract.${document}`,
            {
              where: [["$id", "==", id]],
            }
          );

          return client.platform.documents.broadcast(
            {
              delete: deleteDocuments,
            },
            identity
          );
        };

        deleteDocument()
          .then((d) => {
            console.log("Document deleted:\n", d);
            this.retrieveDocuments(document);
          })
          .catch((e) => console.error("Something went wrong:\n", e))
          .finally(() => {
            this.loading.delete = remove(this.loading.delete, document);
            client.disconnect();
          });
      }
    },

    onJsonChange(data) {
      this.field = data;
    },

    reset() {
      this.document = "";
      this.field = {};
      this.id = "";
    },

    clipboard(data) {
      navigator.clipboard.writeText(data);
    },
  },
};
</script>

<template>
  <header
    class="w-full h-144 flex-none flex items-top justify-between border-b p-8"
  >
    <div>
      <h1 class="text-5xl">EMPTH.AI</h1>
      <h2 class="text-2xl">Admin panel</h2>
    </div>
    <dl class="flex flex-wrap items-center max-w-3xl">
      <dt class="text-xl w-1/4 border-b border-ash-50">Network</dt>
      <dd class="w-3/4 p-1">
        <select
          v-model="network"
          class="bg-ash bg-opacity-25 p-2 text-xl mr-4 w-full rounded-lg"
        >
          <option value="evonet">Evonet</option>
          <option value="testnet">Testnet</option>
        </select>
      </dd>
      <dt class="text-xl w-1/4 border-b border-ash-50">Contract</dt>
      <dd class="w-3/4 p-1">
        <input
          type="text"
          v-model="contract"
          class="bg-ash bg-opacity-25 p-2 text-xl mr-4 w-full rounded-lg"
        />
      </dd>
      <dt class="text-xl w-1/4 border-b border-ash-50">Mnemonic</dt>
      <dd class="flex w-3/4 p-1">
        <input
          type="text"
          v-model="mnemonic"
          class="bg-ash bg-opacity-25 p-2 text-xl mr-4 w-full rounded-lg"
        />
        <button
          v-if="!mnemonic" class="bg-light text-dark p-2 m-2 rounded" @click="createWallet">Create</button>
      </dd>
      <dt class="text-xl w-1/4 border-b border-ash-50">Address</dt>
      <dd class="flex w-3/4 p-1">
        <input
          type="text"
          v-model="address"
          class="bg-ash bg-opacity-25 p-2 text-xl mr-4 w-full rounded-lg"
        />
        <button
          v-if="!address" class="bg-light text-dark p-2 m-2 rounded" @click="retrieveAddress">Retrieve</button>
      </dd>
      <dt class="text-xl w-1/4 border-b border-ash-50">Identity</dt>
      <dd class="flex w-3/4 p-1">
        <input
          type="text"
          v-model="identity"
          class="bg-ash bg-opacity-25 p-2 text-xl mr-4 w-full rounded-lg"
        />
        <button
          class="bg-light text-dark p-2 m-2 rounded"
          :disabled="loading.identity"
          @click="retrieveIdentity"
          v-if="mnemonic && !identity"
        >
          Retrieve
        </button>
        <button
          class="bg-light text-dark p-2 rounded"
          :disabled="loading.identity"
          @click="registerIdentity"
          v-if="mnemonic && !identity"
        >
          Register
        </button>
      </dd>
      <dt class="text-xl w-1/4 border-b border-ash-50">Balance</dt>
      <dd class="flex w-3/4 p-1">
        <span v-if="credit">
          <output class="text-xl">{{ credit }}</output> Credits |
        </span>
        <span v-if="balance" class="mr-4">
          <output class="text-xl">{{ balance }}</output> Dash
        </span>
        <button
          class="bg-light text-dark p-2 rounded"
          :disabled="loading.balance"
          @click="retrieveBalance"
          v-if="mnemonic && identity"
        >
          {{ balance ? "Refresh" : "Retrieve" }} balance
        </button>
      </dd>
    </dl>
  </header>
  <main
    id="main"
    class="flex flex-1 self-stretch w-full max-h-full justify-center items-stretch"
  >
    <section class="flex w-1/2 h-full p-4">
      <details
        v-for="(document, d) in documents"
        :key="d"
        @click="open = d"
        class="w-1/5 px-4"
      >
        <summary class="text-2xl flex items-center">
          {{ d }}
          <button
            @click="
              this.document = d;
              this.field = {};
              this.id = null;
            "
          >
            ➕
          </button>
          <button
            @click="clipboard(JSON.stringify(document))"
            title="Copy all to clipboard"
          >
            📋
          </button>
          <span
            class="inline-block rounded-full w-5 h-5 bg-dots bg-neutral animate-spin ml-2"
            title="Retrieving"
            v-if="loading.retrieve.indexOf(d) > -1"
          />
          <span
            class="inline-block rounded-full w-5 h-5 bg-dots bg-science animate-spin ml-2"
            title="Creating"
            v-if="loading.create.indexOf(d) > -1"
          />
          <span
            class="inline-block rounded-full w-5 h-5 bg-dots bg-economy animate-spin ml-2"
            title="Updating"
            v-if="loading.update.indexOf(d) > -1"
          />
          <span
            class="inline-block rounded-full w-5 h-5 bg-dots bg-society animate-spin ml-2"
            title="Deleting"
            v-if="loading.delete.indexOf(d) > -1"
          />
        </summary>
        <ul v-if="document.length" class="w-full mb-8">
          <li
            v-for="(item, i) in document"
            :key="i"
            class="flex w-full border-b py-4"
          >
            <h3
              class="p-2 bg-sky bg-opacity-25 text-xl rounded-lg w-full"
              :class="{
                'bg-sky-75': item.json.$id === id,
                'animate-pulse': item.json.$id === id,
              }"
            >
              {{ item.data.title }}
            </h3>
            <div class="flex text-2xl ml-4 w-32 justify-between">
              <button
                @click="clipboard(item.json.$id)"
                title="Copy ID to clipboard"
              >
                📋
              </button>
              <button
                @click="
                  this.document = d;
                  this.id = item.json.$id;
                  this.field = item.data;
                "
              >
                ✏️
              </button>
              <button @click="deleteDocument(d, item.json.$id)">🗑</button>
            </div>
          </li>
        </ul>
      </details>
    </section>
    <section class="relative flex flex-col w-1/2 h-full p-8 rounded-xl">
      <vue-json-editor
        id="editor"
        v-model="field"
        :value="field"
        :show-btns="false"
        :expandedOnStart="true"
        mode="form"
        class="bg-light w-full flex-1"
        @json-change="onJsonChange"
      />
      <div class="flex justify-between w-64 h-12 flex-none mt-8">
        <button
          class="bg-light text-dark p-2 rounded"
          @click="createDocument(this.document, this.field)"
          v-if="document && field"
        >
          Create
        </button>
        <button
          class="bg-light text-dark p-2 rounded"
          @click="updateDocument(this.document, this.field, this.id)"
          v-if="id && document && field"
        >
          Update
        </button>
        <button class="bg-light text-dark p-2 rounded" @click="reset">
          Cancel
        </button>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
#main {
  height: calc(100vh - 384px);
}

#editor {
  height: calc(100% - 80px);

  .jsoneditor-vue {
    @apply h-full;
  }

  .jsoneditor-menu {
    @apply relative z-10;
  }
}
</style>