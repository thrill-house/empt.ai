<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default {
  name: "game-logs",
  computed: {
    ...mapGetters({
      elapsed: "score/elapsed",
      transitions: "score/transitions",
    }),
  },
  methods: {
    durationDiff(from, to) {
      const fromDate = dayjs(from);
      const toDate = dayjs(to);

      return dayjs.duration(fromDate.diff(toDate)).humanize();
    },
    clipboard(data) {
      navigator.clipboard.writeText(data);
    },
  },
};
</script>

<template>
  <section v-bem>
    <ol v-bem:list>
      <li
        v-bem:listItem
        v-for="({ document, transition, reference }, t) in transitions"
        :key="t"
        @click="clipboard(JSON.stringify(transition))"
        :title="$t(`Click to copy log to clipboard`)"
      >
        <span v-bem:listItemTitle="{ [document]: true }" :title="document">
          {{ reference.title }}
        </span>
        <span v-bem:listItemDuration :title="$t('Duration')">
          {{
            durationDiff(
              transition.$createdAt,
              transitions?.[t - 1]?.transition?.$createdAt
            )
          }}
        </span>
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

    &-item {
      @apply flex;
      @apply py-1;

      &-title {
        @apply flex items-center;
        @apply mr-2;

        &::before {
          content: "";
          @apply inline-block;
          @apply w-4 h-4 mr-1;
          @apply bg-light;
        }
        @include icons("::before", Models, Slots, Sources, Trainings);
      }

      &-duration {
        @apply flex items-center;

        &::before {
          content: "";
          @apply inline-block;
          @apply w-4 h-4 mr-1;
          @apply bg-light;
          @apply mask-duration;
        }
      }
    }

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