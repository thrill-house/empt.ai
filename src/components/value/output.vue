<script>
export default {
  name: "value-output",
  props: {
    type: String,
    base: Number,
    factor: Number,
    value: Number,
  },
  computed: {
    label() {
      return {
        influence: this.$t(
          "Influence — a measure of how quickly confidence is amassed"
        ),
        bandwidth: this.$t(
          "Bandwidth — a measure of how quickly data is collected"
        ),
        confidence: this.$t(
          "Confidence — collected by expanding your influence"
        ),
        data: this.$t("Data — collected by broadening your bandwidth"),
      }[this.type];
    },
    format() {
      return this.factor !== undefined ? "percentage" : this.type;
    },
    prefix() {
      return this.value !== undefined ? "" : "+";
    },
    notZero() {
      return (
        (this.base && this.base !== 0) ||
        (this.factor && this.factor !== 0) ||
        (this.value && this.value !== 0)
      );
    },
  },
};
</script>

<template>
  <dt v-bem:type>
    {{ label }}
  </dt>
  <dd
    v-if="notZero"
    v-bem:value="{ [type]: true }"
    v-format:[format]="value"
    v-format:[format].+="base || factor"
    :title="label"
  />
  <dd v-else v-bem:value="{ [type]: true }" :title="label">—</dd>
</template>

<style lang="scss">
.value-output {
  &__type {
    @apply sr-only;
  }

  &__value {
    @apply flex items-center;
    @apply h-4;
    @apply text-sm leading-none;

    &:before {
      content: "";
      @apply block;
      @apply w-4 h-4 mr-1;
      @apply bg-light;
    }

    &--data:before {
      @apply mask-data bg-data;
    }

    &--confidence:before {
      @apply mask-confidence bg-confidence;
    }

    &--bandwidth:before {
      @apply mask-bandwidth bg-bandwidth;
    }

    &--influence:before {
      @apply mask-influence bg-influence;
    }
  }
}
</style>
