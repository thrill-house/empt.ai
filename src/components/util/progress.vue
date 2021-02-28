<script>
import { mapGetters } from "vuex";

export default {
  name: "util-progress",
  props: {
    cost: Number,
    resource: String,
  },
  emits: ["updateAffordability"],
  created() {
    this.$emit("updateAffordability", this.threshold);
  },
  computed: {
    available() {
      return this.resources[this.resource];
    },
    threshold() {
      return this.available >= this.cost;
    },
    ...mapGetters({
      resources: "score/currentResources",
    }),
  },
  watch: {
    threshold(newThreshold) {
      this.$emit("updateAffordability", newThreshold);
    },
  },
};
</script>

<template>
  <progress v-bem="{ [resource]: true }" :max="cost" :value="available" />
</template>

<style lang="scss">
@import "../../styles/helper";

.util-progress {
  @apply w-auto h-px;
  @apply bg-dark;
  @apply appearance-none;

  &::-webkit-progress-bar {
    @apply bg-navy;
  }

  &--data {
    &::-webkit-progress-value {
      @apply bg-data;
    }
  }

  &--confidence {
    &::-webkit-progress-value {
      @apply bg-confidence;
    }
  }
}
</style>
