<script>
import { mapGetters } from "vuex";
import ValueList from "../value/list";

export default {
  name: "game-score",
  components: { ValueList },
  computed: {
    ...mapGetters({
      frequencies: "score/currentFrequencies",
      resources: "score/currentResources",
    }),
  },
};
</script>

<template>
  <dl v-bem>
    <dt v-bem:label.resources>{{ $t("Resources") }}</dt>
    <dd v-bem:collection.resources>
      <value-list v-bem:list :items="resources" />
    </dd>
    <dt v-bem:label.frequencies>{{ $t("Frequencies") }}</dt>
    <dd v-bem:collection.frequencies>
      <value-list v-bem:list :items="frequencies" />
    </dd>
  </dl>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-score {
  @apply flex flex-col flex-wrap items-center;
  @apply h-32 w-96 pt-4 mt-4 mb-2;

  &__label {
    @apply text-xl font-bold uppercase;
    @apply h-8 w-48 px-4 py-2;
    @apply bg-grout bg-grout-sky bg-opacity-50;

    &--resources {
      @apply relative;
      @apply w-48 -ml-6;

      &::before {
        content: "";
        @apply absolute block top-0 left-0;
        @apply transform -translate-x-full;
        @apply h-28 w-28;
        @apply bg-grout bg-grout-sky bg-opacity-50;
      }
    }

    &--frequencies {
      @apply clip-1-corner;
      @apply -ml-2;
    }
  }

  &__collection {
    @apply h-20 w-48 px-4 py-1;
    @apply bg-grout bg-grout-sky bg-opacity-50;

    &--resources {
      @apply w-48 -ml-6;
    }

    &--frequencies {
      @apply -ml-2;
    }
  }

  &__list {
    @apply flex flex-wrap w-32;

    dd {
      @apply w-full h-8;
      @apply text-xl;

      &:before {
        @apply w-6 h-6 mr-2;
      }
    }
  }
}
</style>
