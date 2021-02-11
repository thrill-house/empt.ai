<script>
import { mapState, mapGetters, mapActions } from "vuex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Dash from "dash";

const {
  Core: { Mnemonic },
} = Dash;

dayjs.extend(relativeTime);

export default {
  name: "game-settings",
  data: () => ({
    newGameTitle: null,
    inputMnemonic: null,
    inputIdentityId: null,
  }),
  computed: {
    currentGame() {
      return this.game
        ? `${this.game?.title} — ${dayjs(this.game?.$createdAt).fromNow()}`
        : `—`;
    },
    ...mapState(["identityId", "mnemonic", "gameId", "games"]),
    ...mapGetters({
      game: "game",
      models: "inventory/models",
    }),
  },
  methods: {
    updateMnemonic() {
      const value = this.inputMnemonic;
      const valid = Mnemonic.isValid(value);

      if (valid) {
        this.setMnemonic(value);
      } else if (this.mnemonic !== null) {
        this.setMnemonic(null);
      }
    },
    updateIdentityId() {
      const value = this.inputIdentityId;
      this.setIdentityId(value);
    },

    async newGame() {
      await this.createGame({
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
      createGame: "Player/Games/create",
    }),

    dayjs,
  },
};
</script>

<template>
  <section v-bem>
    <div v-bem:form>
      <label v-bem:formLabel.owner>{{ $t("Identity ID") }}</label>
      <input
        v-bem:formInput.owner
        v-model="inputIdentityId"
        @input="updateIdentityId"
      />

      <label v-bem:formLabel.mnemonic>{{ $t("Mnemonic") }}</label>
      <input
        v-bem:formInput.mnemonic
        v-model="inputMnemonic"
        @input="updateMnemonic"
        type="text"
      />

      <label v-bem:formLabel.game>{{ $t("Loaded game") }}</label>
      <div v-bem:formInput.game :data-value="currentGame">
        <select @input="updateGame">
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
      </div>

      <label v-bem:formLabel.mnemonic>{{ $t("New game") }}</label>
      <input
        v-bem:formInput.mnemonic
        v-model="newGameTitle"
        :placeholder="$t('Enter a catchy title')"
      />
      <button v-bem:formButton.game @click="newGame">
        {{ $t("Create") }}
      </button>
    </div>
  </section>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-settings {
  @apply w-full p-6;

  &__form {
    @apply flex flex-col;

    &-label {
      @apply label;

      &:not(:first-child) {
        @apply mt-8;
      }
    }

    &-input {
      @apply input;

      // &--mnemonic {
      //   @apply input-textarea;
      // }

      &--game {
        @apply input-select;
      }
    }

    &-button {
      @apply button button-lg;
      @apply mt-4;

      &--game {
        @apply self-end;
      }
    }
  }

  &__debug {
    @apply p-3;
    @apply bg-sky bg-opacity-50;
    @apply clip-2-corners;
  }
}
</style>