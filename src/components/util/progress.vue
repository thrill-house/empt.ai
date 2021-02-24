<script>
import { mapGetters } from "vuex";

export default {
  name: "util-progress",
  props: {
    cost: Number,
  },
  emits: ["updateAffordability"],
  created() {
    this.$emit("updateAffordability", this.affordable);
  },
  computed: {
    available() {
      return this.resources.data;
    },
    affordable() {
      // console.log({ available: this.available, cost: this.cost });
      return this.available > this.cost;
    },
    ...mapGetters({
      resources: "score/currentResources",
    }),
  },
  watch: {
    affordable(oldAffordable, newAffordable) {
      this.$emit("updateAffordability", newAffordable);
    },
  },
};
</script>

<template>
  <progress v-bem :max="cost" :value="available" />
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

  &::-webkit-progress-value {
    @apply bg-data;
  }
}
</style>
