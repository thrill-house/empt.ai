<script>
import { mapState, mapGetters, mapActions } from "vuex";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default {
  name: "game-settings",
  computed: {
    currentGame() {
      return this.game
        ? `${this.game?.title} — ${dayjs(this.game?.$createdAt).fromNow()}`
        : null;
    },
    ...mapState(["ownerId", "mnemonic", "gameId", "games"]),
    ...mapGetters(["game"]),
  },
  methods: {
    async newGame() {
      await this.createGame({
        title: "This is a new game",
      });
    },

    async updateGame(e) {
      await this.loadGame(e.target.value);
    },
    ...mapActions({
      setOwnerId: "setOwner",
      setMnemonic: "setMnemonic",
      loadGame: "loadGame",
      createGame: "Player/Games/create",
    }),
  },
};
</script>

<template>
  <section v-bem>
    <div v-bem:form>
      <label v-bem:formLabel.owner>{{ $t("Owner") }}</label>
      <input v-bem:formInput.owner :value="ownerId" @input="setOwnerId" />

      <label v-bem:formLabel.mnemonic>{{ $t("Mnemonic") }}</label>
      <input
        v-bem:formInput.mnemonic
        :value="mnemonic"
        @input="setMnemonic"
        type="password"
      />

      <label v-bem:formLabel.game>{{ $t("Game") }}</label>
      <div v-bem:formInput.game :data-value="currentGame">
        <select @input="updateGame">
          <option>Nothing</option>
          <option
            v-for="(game, gId) in games"
            :value="gId"
            :selected="gameId === gId"
            :key="gId"
          >
            {{ game.title }}
          </option>
        </select>
      </div>
      <button v-bem:formButton.game @click="newGame">
        {{ $t("Start a new game") }}
      </button>

      <label v-bem:formLabel.session>{{ $t("Debug") }}</label>
      <pre>{{ ownerId }}</pre>
      <pre>{{ mnemonic }}</pre>
      <pre>{{ gameId }}</pre>
      <pre>{{ games }}</pre>
      <pre>{{ game }}</pre>
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