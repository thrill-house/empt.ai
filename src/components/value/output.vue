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
    format() {
      return this.factor !== undefined ? "percentage" : this.type;
    },
    prefix() {
      return this.value !== undefined ? "" : "+";
    },
  },
};
</script>

<template>
  <dt v-bem:type>
    {{
      {
        bandwidth: $t("Bandwidth"),
        influence: $t("Influence"),
        data: $t("Data"),
        confidence: $t("Confidence"),
      }[type]
    }}
  </dt>
  <dd
    v-bem:value="{ [type]: true }"
    v-format:[format]="value"
    v-format:[format].+="base || factor"
  />
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
