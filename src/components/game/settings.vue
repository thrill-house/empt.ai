<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "game-settings",
  computed: {
    currentGame() {
      return `${this.games[this.session.gameId].title} — ${
        this.games[this.session.gameId].$createdAt
      }`;
    },
    ...mapGetters({
      loaded: "loaded",
      session: "session",
      games: "Player/Games/all",
    }),
  },
  methods: {
    async newGame() {
      await this.createGame({
        title: "This is a new game",
      });
    },
    updateGame(e) {
      this.setGame(e.target.value);
    },
    ...mapActions({
      setOwner: "setOwner",
      setMnemonic: "setMnemonic",
      setGame: "setGame",
      createGame: "Player/Games/create",
    }),
  },
};
</script>

<template>
  <section v-bem>
    <div v-bem:form>
      <label v-bem:formLabel.owner>{{ $t("Owner") }}</label>
      <input v-bem:formInput.owner :value="session.ownerId" @input="setOwner" />

      <label v-bem:formLabel.mnemonic>{{ $t("Mnemonic") }}</label>
      <input
        v-bem:formInput.mnemonic
        :value="session.mnemonic"
        @input="setMnemonic"
        type="password"
      />

      <label v-bem:formLabel.game>{{ $t("Game") }}</label>
      <div v-bem:formInput.game :data-value="currentGame">
        <select @input="updateGame">
          <option>Nothing</option>
          <option
            v-for="(game, g) in games"
            :value="game.$id"
            :selected="session.gameId === game.$id"
            :key="g"
          >
            {{ game.title }}
          </option>
        </select>
      </div>
      <button v-bem:formButton.game @click="newGame">
        {{ $t("Start a new game") }}
      </button>

      <label v-bem:formLabel.session>{{ $t("Debug") }}</label>
      <pre>{{ session }}</pre>
      <pre>{{ loaded }}</pre>
    </div>
  </section>
</template>

<style lang="scss">
@import "../../styles/components";
@import "../../styles/mixins";

.game-settings {
  @apply w-full p-6;

  &__form {
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
      @apply mt-2;
    }
  }
}
</style>