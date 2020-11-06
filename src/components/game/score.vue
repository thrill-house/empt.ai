<docs>
### The score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<the-score></the-score>`
</docs>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "game-score",
  computed: {
    ...mapState({
      bases: (state) => state.score.bases,
      factors: (state) => state.score.factors,
    }),
    ...mapGetters({
      rates: "score/rates",
      resources: "score/resources",
    }),
  },
};
</script>

<template>
  <dl v-bem>
    <dt v-bem:label.resources>{{ $t("Resources") }}</dt>
    <dd v-bem:collection.resources>
      <dl v-bem:values>
        <dt v-bem:term.data>{{ $t("Data") }}</dt>
        <dd v-bem:value v-format:data="resources.data"></dd>
        <dt v-bem:term.confidence>{{ $t("Confidence") }}</dt>
        <dd v-bem:value v-format:confidence="resources.confidence"></dd>
      </dl>
    </dd>
    <dt v-bem:label.rates>{{ $t("Rates") }}</dt>
    <dd v-bem:collection.rates>
      <dl v-bem:values>
        <dt v-bem:term.bandwidth>{{ $t("Bandwidth") }}</dt>
        <dd v-bem:value v-format:bandwidth.+="factors.bandwidth"></dd>
        <dt v-bem:term.influence>{{ $t("Influence") }}</dt>
        <dd v-bem:value v-format:influence.+="factors.influence"></dd>
      </dl>
    </dd>
  </dl>
</template>

<style lang="scss">
.game-score {
  @apply flex flex-col flex-wrap;
  @apply h-40 w-80 py-4;

  &__label {
    @apply text-xl font-bold uppercase;
    @apply h-12 w-40 px-4 py-2;
    @apply bg-sky-50;

    &--resources {
      @apply relative;
      &::before {
        content: "";
        @apply absolute block top-0 left-0;
        @apply transform -translate-x-full;
        @apply h-32 w-32;
        @apply bg-sky-50;
      }
    }

    &--rates {
      @apply ml-2;
      @apply clip-1-corner;
    }
  }

  &__collection {
    @apply h-20 w-40 px-4 py-1;
    @apply bg-sky-50;

    &--rates {
      @apply ml-2;
    }
  }

  &__values {
    @apply flex flex-wrap w-32;
  }

  &__term {
    @apply sr-only;
  }

  &__value {
    @apply text-xl uppercase;
    @apply animate-pulse;
  }
}
</style>
