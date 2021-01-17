<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { includes } from "lodash-es";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dash from "dash";
// import { i18n } from "../../i18n";

// console.log(i18n);

const {
  Core: { Mnemonic },
} = Dash;

dayjs.extend(relativeTime);

import UtilDialog from "../util/dialog";

export default {
  name: "game-start",
  components: {
    UtilDialog,
    // i18n,
  },
  data: () => ({
    walletStep: ["current"],
    balanceStep: [],
    identityStep: [],
    creditStep: [],
    gameStep: [],

    address: null,

    done: false,
  }),
  created() {
    if (this.mnemonic) {
      this.provideWallet();
      this.completeWallet();
    }

    if (this.ownerId) {
      this.provideIdentity();
      this.completeIdentity();
    }

    if (this.game) {
      this.provideGame();
      this.completeGame();
    }

    // if (this.mnemonic && this.ownerId) {
    //   this.done = true;
    // }
  },
  computed: {
    currentGame() {
      return this.game
        ? `${this.game?.title} — ${dayjs(this.game?.$createdAt).fromNow()}`
        : `—`;
    },
    ...mapState(["ownerId", "mnemonic", "gameId", "games"]),
    ...mapGetters({
      connection: "Player/connection",
      client: "Player/client",
      game: "game",
      models: "inventory/models",
    }),
  },
  methods: {
    // Wallet step functions
    provideWallet() {
      this.walletStep = ["provide"];
    },
    async createWallet() {
      this.walletStep = ["create"];

      await this.setMnemonic(new Mnemonic().toString());
    },
    completeWallet() {
      this.walletStep.push("complete");
      this.balanceStep.push("current");
    },
    async updateMnemonic(e) {
      const value = e.target.value.toString();
      const valid = Mnemonic.isValid(value);

      console.log({ value, valid });

      if (valid) {
        await this.setMnemonic(value);
      }
    },

    // Balance step functions
    async provideBalance() {
      const account = await this.client.wallet.getAccount();
      const balance = account.getConfirmedBalance();
      console.log({ balance });
      this.balanceStep = ["provide"];
    },
    async createBalance() {
      const account = await this.client.wallet.getAccount();
      const { address } = account.getUnusedAddress();
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
    },
    completeIdentity() {
      this.identityStep.push("complete");
      this.creditStep.push("current");
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
      setOwnerId: "setOwnerId",
      setMnemonic: "setMnemonic",
      loadGame: "loadGame",
      createNewGame: "Player/Games/create",
    }),

    dayjs,
    includes,
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
              :value="mnemonic"
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

        <li v-bem:step.balance="balanceStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("An existing balance in that wallet") }} —

              <button v-bem:button.provide @click="provideBalance()">
                {{ $t("I have some") }}
              </button>

              {{ $t("or") }}

              <button v-bem:button.create @click="createBalance()">
                {{ $t("Help me add some") }}
              </button>
            </p>

            <p v-bem:stepProceed v-if="includes(balanceStep, `provide`)">
              {{ $t("Checking your Dash balance") }}

              <button v-bem:button.complete @click="completeBalance()">
                {{ $t("Go to the next step") }}
              </button>
            </p>

            <p v-bem:stepProceed v-if="includes(balanceStep, `create`)">
              <i18n-t
                v-if="connection.network === `testnet`"
                keypath="You can fill up your test account by visiting {link} and entering {address} where prompted"
                tag="span"
              >
                <template #link>
                  <a
                    v-bem:link
                    href="https://testnet-faucet.dash.org/"
                    target="_blank"
                    >{{ $t("The Testnet Faucet") }}</a
                  >
                </template>
                <template #address>
                  <code v-bem:code>{{ address }}</code>
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
                  <code v-bem:code>{{ address }}</code>
                </template>
              </i18n-t>

              <button v-bem:button.complete @click="completeBalance()">
                {{ $t("Go to the next step") }}
              </button>
            </p>
          </div>
        </li>

        <li v-bem:step.identity="identityStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A registered Dash network identity") }} —

              <button v-bem:button.provide @click="provideIdentity()">
                {{ $t("I have registered") }}
              </button>

              {{ $t("or") }}

              <button v-bem:button.create @click="createIdentity()">
                {{ $t("Help me register") }}
              </button>
            </p>

            <input
              v-if="includes(identityStep, `provide`)"
              v-bem:input.ownerId
              :value="ownerId"
              :placeholder="$t('Enter your registration identity')"
              @input="setOwnerId"
            />
          </div>
        </li>

        <li v-bem:step.credit="creditStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("Storage credits for your Dash identity") }} —

              <button v-bem:button.provide @click="provideCredit()">
                {{ $t("I have plenty") }}
              </button>

              {{ $t("or") }}

              <button v-bem:button.create @click="createCredit()">
                {{ $t("Help me top up") }}
              </button>
            </p>
          </div>
        </li>

        <li v-bem:step.game="gameStep">
          <div v-bem:stepContent>
            <p v-bem:stepInstruction>
              {{ $t("A new or existing game to play") }} —

              <button v-bem:button.provide @click="provideGame()">
                {{ $t("I’ll choose one") }}
              </button>

              {{ $t("or") }}

              <button v-bem:button.create @click="createGame()">
                {{ $t("Start a new one") }}
              </button>
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

    &--complete {
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