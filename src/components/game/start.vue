<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { includes } from "lodash-es";
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
    walletStep: ["current"],
    balanceStep: [],
    syncStep: [],
    identityStep: [],
    creditStep: [],
    gameStep: [],

    newMnemonic: null,

    // address: null,
    // identity: null,

    done: false,
  }),
  created() {
    if (this.mnemonic) {
      this.newMnemonic = this.mnemonic;
      this.walletStep = ["provide"];
      this.syncStep = ["skip"];
      this.balanceStep = ["skip"];
      this.identityStep = ["provide"];
      this.creditStep = ["skip"];
      this.completeWallet();
    }

    if (this.identityId) {
      this.completeSync();
      this.completeBalance();
      this.completeIdentity();
      this.completeCredit();
    }

    if (this.gameId) {
      this.provideGame();
      this.completeGame();
    }

    // if (this.mnemonic && this.identityId) {
    //   this.done = true;
    // }
  },
  computed: {
    currentGame() {
      return this.game
        ? `${this.game?.title} — ${dayjs(this.game?.$createdAt).fromNow()}`
        : `—`;
    },
    ...mapState(["identityId", "mnemonic", "gameId", "games"]),
    ...mapGetters({
      connection: "Player/connection",

      accountSyncing: "Player/accountSyncing",
      accountSynced: "Player/accountSynced",
      confirmedBalance: "Player/confirmedBalance",
      unusedAddress: "Player/unusedAddress",

      identities: "Player/identities",
      identity: "Player/identity",
      credit: "Player/credit",

      game: "game",
      models: "inventory/models",
    }),
  },
  methods: {
    // Wallet step functions
    provideWallet() {
      this.walletStep = ["provide"];
    },
    createWallet() {
      this.walletStep = ["create"];

      this.newMnemonic = new Mnemonic().toString();
      this.updateMnemonic();
    },
    completeWallet() {
      this.walletStep.push("complete");

      if (includes(this.walletStep, `create`)) {
        this.balanceStep.push("current");
        this.syncStep.push("skip");
      }
    },
    updateMnemonic() {
      const value = this.newMnemonic;
      const valid = Mnemonic.isValid(value);

      if (valid) {
        this.setMnemonic(value);
      } else if (this.mnemonic !== null) {
        this.setMnemonic(null);
      }
    },

    completeSync() {
      this.syncStep.push("complete");

      if (includes(this.walletStep, `provide`)) {
        this.identityStep.push("current");
      }
    },

    // Balance step functions
    provideBalance() {
      this.balanceStep = ["provide"];
    },
    createBalance() {
      const { address } = this.unusedAddress;
      this.address = address;

      this.balanceStep = ["create"];
    },
    completeBalance() {
      this.balanceStep.push("complete");
      this.identityStep.push("current");
    },

    // Identity step functions
    provideIdentity() {
      this.identityStep = ["provide"];
    },
    createIdentity() {
      this.identityStep = ["create"];

      this.registerIdentity();
    },
    completeIdentity() {
      this.identityStep.push("complete");
      this.balanceStep.push("current");
    },
    async registerIdentity() {
      const identity = await this.register();

      console.log(identity);
    },
    changeIdentityId(e) {
      const value = e.target.value;

      this.setIdentityId(value);
    },

    // Credit step functions
    provideCredit() {
      this.creditStep = ["provide"];
    },
    createCredit() {
      this.creditStep = ["create"];
    },
    completeCredit() {
      this.creditStep.push("complete");
      this.gameStep.push("current");
    },

    // Credit step functions
    provideGame() {
      this.gameStep = ["provide"];
    },
    createGame() {
      this.gameStep = ["create"];
    },
    completeGame() {
      this.gameStep.push("complete");
    },

    // Game step functions
    async newGame() {
      await this.createNewGame({
        title: this.newGameTitle,
      });
    },

    async updateGame(e) {
      await this.loadGame(e.target.value);
    },

    ...mapActions({
      setIdentityId: "setIdentityId",
      setMnemonic: "setMnemonic",
      loadGame: "loadGame",
      register: "Player/register",
      createNewGame: "Player/Games/create",
    }),

    dayjs,
    includes,
  },
  watch: {
    accountSynced(newSync) {
      if (newSync && !this.accountSyncing) {
        this.completeSync();
      }
    },
    confirmedBalance(newBalance) {
      if (newBalance > 10000) {
        this.provideBalance();
        this.completeBalance();
      }
    },
    identities(newIdentities) {
      if (newIdentities.length === 1) {
        this.setIdentityId(newIdentities[0]);
        this.completeIdentity();
      } else if (newIdentities.length > 1) {
        this.provideIdentity();
      }
    },
    credit(newCredit) {
      if (newCredit > 100000) {
        this.provideCredit();
        this.completeCredit();
      }
    },
    games(newGames) {
      console.log(newGames);
      // if (newGames.length === 1) {
      //   this.setGameId(newGames[0]);
      //   this.completeGame();
      // } else if (newGames.length > 1){
      //   this.provideGame();
      // }
      this.provideGame();
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
        <li v-bem:step.wallet="walletStep">
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
              v-if="includes(walletStep, `provide`) || mnemonic"
              v-bem:input.mnemonic
              v-model="newMnemonic"
              :placeholder="$t('Enter your private mnemonic')"
              @input="updateMnemonic"
            />

            <p v-bem:stepProceed v-if="includes(walletStep, `provide`)">
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

              <button
                v-if="mnemonic"
                v-bem:button.complete
                @click="completeWallet()"
              >
                {{ $t("Go to the next step") }}
              </button>
            </p>

            <p
              v-bem:stepProceed
              v-if="includes(walletStep, `create`) && mnemonic"
            >
              {{
                $t(
                  "You should copy this somewhere safe and treat it as securely as you would a password"
                )
              }}<br />
              {{
                $t("But don’t worry, you’ll be given a chance to do this later")
              }}

              <button v-bem:button.complete @click="completeWallet()">
                {{ $t("Go to the next step") }}
              </button>
            </p>
          </div>
        </li>

        <li v-bem:step.sync="syncStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A synchronised connection to the Dash network") }}
              <template v-if="accountSyncing">
                —
                <button v-bem:button="{ loading: accountSyncing }">
                  {{ $t("Synchronising") }}
                </button>
              </template>
            </p>

            <p v-if="accountSyncing" v-bem:stepProceed>
              {{
                $t(
                  "This step can take upwards of 5 minutes so please sit back and be patient"
                )
              }}
            </p>

            <p v-else-if="!accountSyncing && accountSynced" v-bem:stepProceed>
              {{
                $t(
                  "Account successfully synchronised most recently at {accountSynced}",
                  {
                    accountSynced,
                  }
                )
              }}
            </p>
          </div>
        </li>

        <li v-bem:step.balance="balanceStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("An existing balance in that wallet") }}
              <template
                v-if="
                  includes(walletStep, `create`) ||
                  (accountSynced && !confirmedBalance)
                "
              >
                —
                <button v-bem:button.create @click="createBalance()">
                  {{ $t("Help me add some") }}
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

            <p v-bem:stepProceed v-if="!confirmedBalance && unusedAddress">
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

        <li v-bem:step.identity="identityStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A registered Dash network identity") }}
              <template
                v-if="
                  includes(walletStep, `create`) ||
                  (identitySynced && !identity)
                "
              >
                —

                <button v-bem:button.create @click="createIdentity()">
                  {{ $t("Help me register") }}
                </button>
              </template>
            </p>

            <select
              v-bem:input
              v-if="!accountSyncing && accountSynced"
              @input="changeIdentityId"
            >
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
          </div>
        </li>

        <li v-bem:step.credit="creditStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("Storage credits for your Dash identity") }}
              <template
                v-if="
                  includes(walletStep, `create`) || (identitySynced && !credit)
                "
              >
                —
                <button v-bem:button.create @click="createCredit()">
                  {{ $t("Help me top up") }}
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
          </div>
        </li>

        <li v-bem:step.game="gameStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A new or existing game to play") }}
              <template
                v-if="
                  includes(walletStep, `create`) || (identitySynced && !game)
                "
              >
                —

                <button v-bem:button.provide @click="provideGame()">
                  {{ $t("I’ll choose one") }}
                </button>

                {{ $t("or") }}

                <button v-bem:button.create @click="createGame()">
                  {{ $t("Start a new one") }}
                </button>
              </template>
            </p>

            <select
              v-bem:input
              v-if="includes(gameStep, `provide`)"
              @input="updateGame"
            >
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

            <input
              v-if="includes(gameStep, `create`)"
              v-bem:input
              v-model="newGameTitle"
              :placeholder="$t('Enter a catchy title')"
            />
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