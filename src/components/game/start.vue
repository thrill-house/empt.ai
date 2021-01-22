<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { includes, keys } from "lodash-es";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dash from "dash";

const {
  Core: { Mnemonic },
} = Dash;

dayjs.extend(relativeTime);

import UtilDialog from "../util/dialog";

export default {
  name: "game-start",
  components: {
    UtilDialog,
  },
  data: () => ({
    walletPath: null,
    inputMnemonic: null,
    inputIdentityId: null,
    inputGameId: null,
    inputGameTitle: null,
    done: false,
  }),
  created() {
    if (this.mnemonic) {
      this.inputMnemonic = this.mnemonic;
      this.walletPath = "provide";
      this.updateMnemonic();
    }

    if (this.identityId) {
      this.inputIdentityId = this.identityId;
      this.updateIdentityId();
    }

    if (this.gameId) {
      this.inputGameId = this.gameId;
      this.updateGameId();
    }

    // if (this.mnemonic && this.identityId) {
    //   this.done = true;
    // }
  },
  computed: {
    existingWallet() {
      return (
        this.walletPath === "provide" &&
        !this.newWallet &&
        !!this.mnemonic &&
        !!this.accountSynced
      );
    },
    newWallet() {
      return this.walletPath === "create" && !!this.mnemonic;
    },
    steps() {
      return {
        wallet: {
          current: true,
          provide: this.walletPath === "provide",
          create: this.walletPath === "create",
        },
        balance: {
          current:
            this.newWallet &&
            (!this.existingWallet || (!this.confirmedBalance && !!this.credit)),
          skip:
            this.existingWallet &&
            ((!this.credit && this.confirmedBalance > 10000) ||
              this.haveIdentities ||
              (this.identitySynced && !!this.credit) ||
              this.accountSyncing),
          create:
            (this.newWallet && this.unusedAddress) ||
            (this.existingWallet &&
              !this.confirmedBalance &&
              this.unusedAddress),
        },
        identity: {
          current: !!this.walletPath && !!this.mnemonic,
          select: this.existingWallet && this.haveIdentities,
          provide:
            (!!this.walletPath && !!this.mnemonic && !this.existingWallet) ||
            (this.existingWallet && !this.haveIdentities),
          create:
            (this.newWallet || (this.existingWallet && !this.haveIdentities)) &&
            this.confirmedBalance,
        },
        credit: {
          current:
            this.newWallet &&
            (!this.existingWallet || (!this.credit && this.identitySynced)),
          skip:
            this.existingWallet &&
            ((!!this.identitySynced && !!this.credit) ||
              this.accountSyncing ||
              this.identitySyncing ||
              !this.inputIdentityId),
          create:
            (this.newWallet && this.identitySynced) ||
            (this.existingWallet && !this.credit && this.identitySynced),
        },
        game: {
          current:
            !!this.walletPath &&
            (!!this.identitySyncing || !!this.identitySynced) &&
            !!this.identityId,
          select: this.haveGames,
          create:
            !!this.walletPath &&
            !!this.identitySynced &&
            (this.newWallet || this.existingWallet),
        },
      };
    },
    haveGames() {
      return keys(this.games).length > 0;
    },
    haveIdentities() {
      return this.identities.length > 0;
    },
    currentGame() {
      return this.game
        ? `${this.game?.title} — ${dayjs(this.game?.$createdAt).fromNow()}`
        : `—`;
    },
    ...mapState(["identityId", "mnemonic", "gameId", "games"]),
    ...mapGetters({
      connection: "Player/connection",

      accountSynced: "Player/accountSynced",
      accountSyncing: "Player/accountSyncing",
      confirmedBalance: "Player/confirmedBalance",
      unusedAddress: "Player/unusedAddress",

      identities: "Player/identities",
      identity: "Player/identity",
      identitySynced: "Player/identitySynced",
      identitySyncing: "Player/identitySyncing",
      credit: "Player/credit",

      game: "game",
      models: "inventory/models",
    }),
  },
  methods: {
    // Wallet step functions
    provideWallet() {
      this.walletPath = "provide";
    },
    createWallet() {
      this.walletPath = "create";

      this.inputMnemonic = new Mnemonic().toString();
      this.updateMnemonic();
    },
    updateMnemonic() {
      const value = this.inputMnemonic;
      const valid = Mnemonic.isValid(value);

      if (valid) {
        this.setMnemonic(value);
      } else if (this.mnemonic !== null) {
        this.setMnemonic(null);
      }
    },

    // Identity step functions
    async registerIdentity() {
      const identity = await this.register();

      console.log(identity);
    },
    updateIdentityId() {
      const value = this.inputIdentityId;

      this.setIdentityId(value);
    },
    changeIdentityId(e) {
      this.inputIdentityId = e.target.value;

      this.updateIdentityId();
    },

    // Game step functions
    async createGame() {
      await this.createNewGame({
        title: this.newGameTitle,
      });

      const newGame = find(this.games, { title: this.newGameTitle });

      if (newGame) {
        await this.loadGame(newGame.$id);
      }
    },

    async updateGame() {
      const value = this.inputGameId;
      await this.loadGame(value);
    },
    changeGame(e) {
      this.inputGameId = e.target.value;
      this.updateGame;
    },

    ...mapActions({
      setIdentityId: "setIdentityId",
      setMnemonic: "setMnemonic",
      fetchGames: "fetchGames",
      loadGame: "loadGame",
      register: "Player/register",
      createNewGame: "Player/Games/create",
    }),

    dayjs,
    includes,
  },
  watch: {
    async identitySynced(newSynced) {
      if (newSynced) {
        this.fetchGames();
      }
    },
  },
};
</script>

<template>
  <util-dialog :open="!done" ref="dialog">
    <template v-slot:title>
      {{ $t("Looks like you’re new around here?") }}
    </template>
    <template v-slot:default>
      <p v-bem:intro>
        {{ $t("To get started, you‘re going to need a few things:") }}
      </p>
      <ol v-bem:steps>
        <li v-bem:step.wallet="steps.wallet">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A mnemonic based Dash wallet") }} —

              <button v-bem:button.provide @click="provideWallet()">
                {{ $t("I have one") }}
              </button>

              {{ $t("or") }}

              <button v-bem:button.create @click="createWallet()">
                {{ $t("Create one for me") }}
              </button>
            </p>

            <input
              v-if="steps.wallet.provide || mnemonic"
              v-bem:input.mnemonic
              v-model="inputMnemonic"
              :placeholder="$t('Enter your private mnemonic')"
              @input="updateMnemonic"
            />

            <p v-bem:stepProceed v-if="steps.wallet.provide">
              <template v-if="mnemonic">
                {{ $t("This appears to be a valid mnemonic, we can continue") }}
              </template>
              <template v-else>
                {{
                  $t(
                    "Note that this is NEVER stored anywhere but in your browser"
                  )
                }}
              </template>
            </p>

            <p v-bem:stepProceed v-if="steps.wallet.create && mnemonic">
              {{
                $t(
                  "You should copy this somewhere safe and treat it as securely as you would a password"
                )
              }}<br />
              {{
                $t("But don’t worry, you’ll be given a chance to do this later")
              }}
            </p>
          </div>
        </li>

        <li v-bem:step.balance="steps.balance">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("An existing balance in that wallet") }}

              <template v-if="accountSyncing">
                —
                <button v-bem:button.loading>
                  {{ $t("Synchronising account") }}
                </button>
              </template>
            </p>

            <p v-bem:stepProceed v-if="confirmedBalance">
              {{
                $t("Dash balance of {confirmedBalance} confirmed", {
                  confirmedBalance,
                })
              }}
            </p>

            <p v-bem:stepProceed v-if="steps.balance.create">
              <i18n-t
                v-if="connection.network === `testnet`"
                keypath="You can fill up your test account by visiting {link} and entering {address} where prompted"
                tag="span"
              >
                <template #link>
                  <a
                    v-bem:link
                    href="http://testnet-452625393.us-west-2.elb.amazonaws.com/"
                    target="_blank"
                    >{{ $t("The Testnet Faucet") }}</a
                  >
                </template>
                <template #address>
                  <code v-bem:code>{{ unusedAddress }}</code>
                </template>
              </i18n-t>
              <i18n-t
                v-else
                keypath="You can purchase Dash from {link} which we’ll receive a small referral bonus for, from there you should transfer some Dash to {address}"
                tag="span"
              >
                <template #link>
                  <a
                    v-bem:link
                    href="https://www.coinbase.com/join/600421d73a0f8815d128ec4b"
                    target="_blank"
                    >{{ $t("Coinbase") }}</a
                  >
                </template>
                <template #address>
                  <code v-bem:code>{{ unusedAddress }}</code>
                </template>
              </i18n-t>
            </p>
          </div>
        </li>

        <li v-bem:step.identity="steps.identity">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A registered Dash network identity") }}

              <template v-if="accountSyncing">
                —
                <button v-bem:button.loading>
                  {{ $t("Synchronising account") }}
                </button>
              </template>
              <template v-if="identitySyncing">
                —
                <button v-bem:button.loading>
                  {{ $t("Synchronising identity") }}
                </button>
              </template>
            </p>

            <p v-bem:stepProceed v-if="steps.identity.create">
              {{
                $t(
                  "You‘ll need to create a new identity to interact with the Dash network"
                )
              }}
              <button v-bem:button.create @click="createIdentity()">
                {{ $t("Help me register") }}
              </button>
            </p>

            <p v-bem:stepProceed v-if="steps.identity.select">
              <select v-bem:input @input="changeIdentityId">
                <option :selected="!identityId">—</option>
                <option
                  v-for="identity in identities"
                  :value="identity"
                  :selected="identity === identityId"
                  :key="identity"
                >
                  {{ identity }}
                </option>
              </select>
            </p>

            <p v-bem:stepProceed v-if="steps.identity.provide">
              <input
                v-bem:input.identityId
                v-model="inputIdentityId"
                :placeholder="
                  $t(
                    'Enter your identity if you already know it, otherwise wait a moment and they’ll be loaded'
                  )
                "
                @input="updateIdentityId"
              />
            </p>
          </div>
        </li>

        <li v-bem:step.credit="steps.credit">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("Storage credits for your Dash identity") }}
              <template v-if="identitySyncing">
                —
                <button v-bem:button.loading>
                  {{ $t("Synchronising identity") }}
                </button>
              </template>
            </p>

            <p v-bem:stepProceed v-if="credit">
              {{
                $t("Possession of {credit} credits confirmed", {
                  credit,
                })
              }}
            </p>

            <p v-bem:stepProceed v-if="steps.credit.create">
              {{
                $t("You’ll need to convert some dash to credits for storage")
              }}

              <button v-bem:button.create @click="createCredit()">
                {{ $t("Help me top up") }}
              </button>
            </p>
          </div>
        </li>

        <li v-bem:step.game="steps.game">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A new or existing game to play") }}
              <template v-if="identitySyncing">
                —
                <button v-bem:button.loading>
                  {{ $t("Synchronising identity") }}
                </button>
              </template>
            </p>

            <p v-bem:stepProceed v-if="steps.game.select">
              <template v-if="steps.game.select">
                <select v-bem:input @input="changeGame">
                  <option :selected="!gameId">—</option>
                  <option
                    v-for="(game, gId) in games"
                    :value="gId"
                    :selected="gameId === gId"
                    :key="gId"
                  >
                    {{ `${game.title}  — ${dayjs(game.$createdAt).fromNow()}` }}
                  </option>
                </select>

                <span>{{ $t("or") }}</span>
              </template>
            </p>
            <p v-bem:stepProceed v-if="steps.game.create">
              <input
                v-bem:input
                v-model="inputGameTitle"
                @input="updateGame"
                :placeholder="$t('Enter a title for a new game')"
              />

              <button v-bem:button.create @click="createGame()">
                {{ $t("Start a new one") }}
              </button>
            </p>
          </div>
        </li>
      </ol>
    </template>
  </util-dialog>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-start {
  &__intro {
    @apply text-2xl;
  }

  &__steps {
    @apply mt-8;
  }

  &__step {
    @apply relative;
    @apply flex flex-wrap items-center;
    @apply text-xl;
    @apply overflow-hidden;
    @apply pt-4;

    & + & {
      &::before {
        content: "...........................................................................................................................................";
        @apply block w-full;
        @apply pb-10;
        @apply underline text-opacity-0 text-light text-2xl;
        text-decoration-color: theme("colors.navy") !important;
        text-decoration-style: wavy;
      }
    }

    &:not(&--current):not(&--create):not(&--provide) &-content {
      @apply opacity-10;

      &::before {
        content: "";
        @apply absolute inset-0;
        @apply w-auto h-auto;
        @apply z-10;
      }
    }

    &-content {
      @apply relative;
      @apply w-full;
    }

    &-instruction {
      @apply flex flex-wrap items-center;
      @apply w-full;
      @apply text-xl;
    }

    &-proceed {
      @apply flex items-center justify-between;
      @apply w-full;
      @apply text-sm;

      // > span {
      //   @apply flex-shrink;
      // }
      > input {
        @apply flex-grow;
        @apply w-auto;
        @apply mr-2;
      }

      > button {
        @apply flex-shrink-0;
      }
    }

    &-instruction + &-proceed {
      @apply mt-4;
    }

    &--complete &-content {
      @apply opacity-10;

      &::before {
        content: "";
        @apply absolute inset-0;
        @apply w-auto h-auto;
        @apply z-10;
      }
    }

    &--complete,
    &--skip {
      &::after {
        content: "";
        @apply absolute left-1/2 bottom-0;
        @apply w-24 h-24;
        @apply transform -translate-x-1/2;
        @apply bg-sky;
        @apply z-10;
        @apply mask-confirmed;
      }
    }

    // &--skip {
    //   @apply hidden;
    // }
    &--skip {
      &::after {
        @apply mask-duration;
      }
    }
  }

  &__button {
    @apply button button-inline mx-1;
  }

  &__step--complete &__button--complete,
  &__step--create &__button--create,
  &__step--provide &__button--provide {
    @apply button-icon;

    &::before {
      @apply bg-sky;
      @apply mask-confirmed;
    }
  }

  &__button--loading {
    @apply button-icon;

    &::before {
      @apply bg-sky;
      @apply mask-loading;
      @apply animate-spin;
      animation-direction: reverse;
    }
  }

  &__input {
    @apply input;
    @apply my-4;
  }

  &__link {
    @apply underline;
  }

  &__code {
    @apply bg-ash;
    @apply p-1;
    @apply rounded-full;
  }
}
</style>