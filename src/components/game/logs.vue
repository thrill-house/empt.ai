<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default {
  name: "game-logs",
  data: () => ({
    devMode: false,
  }),
  computed: {
    ...mapGetters({
      currentElapsed: "score/currentElapsed",
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
    async remove(document, id) {
      const proceed = window.confirm(
        this.$t(
          "Please be sure you want to do this, it could break the game and should only be used in emergencies"
        )
      );

      if (proceed) {
        await this.$store.dispatch(`Game/${document}/delete`, {
          $id: id,
        });
      }
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
        <button
          v-if="devMode"
          v-bem:listItemRemove
          @click="remove(document, transition.$id)"
        >
          {{ $t(`Zap`) }}
        </button>
      </li>
    </ol>
    <div v-bem:actions>
      <button
        v-bem:actionsTrigger
        @click="clipboard(JSON.stringify(transitions))"
      >
        {{ $t(`Copy all to clipboard`) }}
      </button>
      <button v-bem:actionsTrigger.danger @click="devMode = !devMode">
        {{ !devMode ? $t(`Enable Zap Mode`) : $t(`Disable Zap Mode`) }}
      </button>
    </div>
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
      @apply flex items-center justify-start;
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

      &-remove {
        @apply button button-2xs button-cancel;
        @apply absolute;
        @apply right-0;
      }
    }

    &-item + &-item {
      @apply border-t border-light border-opacity-25;
    }
  }

  &__actions {
    @apply flex justify-between;

    &-trigger {
      @apply button button-xs button-confirm;
      @apply mt-6;

      &--danger {
        @apply button-cancel;
      }
    }
  }
}
</style>