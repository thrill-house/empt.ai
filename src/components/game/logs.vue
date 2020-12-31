<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  name: "game-logs",
  computed: {
    transitions() {
      return this.getTransitioned();
    },
    ...mapGetters({
      elapsed: "score/elapsed",
      getTransitioned: "score/transitioned",
    }),
  },
  methods: {
    clipboard(data) {
      navigator.clipboard.writeText(data);
    },
    dayjs,
  },
};
</script>

<template>
  <section v-bem>
    <ol v-bem:list>
      <li
        v-bem:listItem
        v-for="(transition, t) in transitions"
        :key="t"
        @click="clipboard(JSON.stringify(transition))"
        :title="$t(`Click to copy log to clipboard`)"
      >
        {{ transition.document }} +
        {{
          Math.round(
            (transition.transition.$createdAt -
              transitions?.[t - 1]?.transition?.$createdAt || elapsed * -1000) /
              -1000
          )
        }}
        seconds
      </li>
    </ol>
    <button v-bem:clipboard @click="clipboard(JSON.stringify(transitions))">
      {{ $t(`Copy all to clipboard`) }}
    </button>
  </section>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-logs {
  @apply w-full;
  @apply p-6;

  &__list {
    @apply font-mono;

    &-item + &-item {
      @apply border-t border-light border-opacity-25;
    }
  }

  &__clipboard {
    @apply button button-sm button-confirm;
    @apply mt-6;
  }
}
</style>