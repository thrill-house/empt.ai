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
      frequencies: "score/frequencies",
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
        <dd v-bem:value.data v-format:data="resources.data"></dd>
        <dt v-bem:term.confidence>{{ $t("Confidence") }}</dt>
        <dd
          v-bem:value.confidence
          v-format:confidence="resources.confidence"
        ></dd>
      </dl>
    </dd>
    <dt v-bem:label.frequencies>{{ $t("Frequencies") }}</dt>
    <dd v-bem:collection.frequencies>
      <dl v-bem:values>
        <dt v-bem:term.bandwidth>{{ $t("Bandwidth") }}</dt>
        <dd
          v-bem:value.bandwidth
          v-format:bandwidth.+="frequencies.bandwidth"
        ></dd>
        <dt v-bem:term.influence>{{ $t("Influence") }}</dt>
        <dd
          v-bem:value.influence
          v-format:influence.+="frequencies.influence"
        ></dd>
      </dl>
    </dd>
  </dl>
</template>

<style lang="scss">
.game-score {
  @apply flex flex-col flex-wrap items-center;
  @apply h-40 w-96 py-4 mt-4;

  &__label {
    @apply text-xl font-bold uppercase;
    @apply h-12 w-48 px-4 py-2;
    @apply bg-sky-50;

    &--resources {
      @apply relative;
      @apply w-48 -ml-6;

      &::before {
        content: "";
        @apply absolute block top-0 left-0;
        @apply transform -translate-x-full;
        @apply h-32 w-28;
        @apply bg-sky-50;
      }
    }

    &--frequencies {
      @apply clip-1-corner;
      @apply -ml-2;
    }
  }

  &__collection {
    @apply h-20 w-48 px-4 py-1;
    @apply bg-sky-50;

    &--resources {
      @apply w-48 -ml-6;
    }

    &--frequencies {
      @apply -ml-2;
    }
  }

  &__values {
    @apply flex flex-wrap w-32;
  }

  &__term {
    @apply sr-only;
  }

  &__value {
    @apply inline-flex items-center;
    @apply text-xl;

    &:before {
      content: "";
      @apply inline-block;
      @apply bg-contain bg-center bg-no-repeat;
      @apply w-6 h-6 mr-2;
    }

    &--data {
      &::before {
        @apply bg-data mask-data;
      }
    }
    &--confidence {
      &::before {
        @apply bg-confidence mask-confidence;
      }
    }
    &--bandwidth {
      &::before {
        @apply bg-bandwidth mask-bandwidth;
      }
    }
    &--influence {
      &::before {
        @apply bg-influence mask-influence;
      }
    }
  }
}
</style>
