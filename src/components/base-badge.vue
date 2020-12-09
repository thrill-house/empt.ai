<docs>
### Base badge
Little helper component for wrapping things like icons in a nice circular badge.

##### Instantiation
`<base-badge></base-badge>`
</docs>

<script>
export default {
  name: "base-badge",
  blockName: "badge",
  props: {
    color: {
      type: [String, Boolean],
      default: false,
    },
    fade: {
      type: [String, Boolean],
      default: false,
    },
    stain: {
      type: [String, Boolean],
      default: false,
    },
    borderColor: {
      type: [String, Boolean],
      default: false,
    },
    size: {
      type: [String, Boolean],
      default: false,
    },
    borderSize: {
      type: [String, Boolean],
      default: false,
    },
  },
};
</script>

<template>
  <div
    v-bem="{
      color,
      fade,
      stain,
      borderColor,
      size,
      borderSize,
    }"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import "../styles/util";

.badge {
  @apply inline-flex flex-shrink-0
  items-center justify-center
  overflow-hidden
  rounded-full;

  &:before {
    // @apply absolute inset-0 z-10 bg-stain;
  }

  > * {
    @apply z-20;
  }

  &--size {
    &-tiny {
      @apply w-8 h-8;
    }

    &-small {
      @apply w-12 h-12;
    }

    &-medium {
      @apply w-16 h-16;
    }

    &-large {
      @apply w-24 h-24;
    }

    &-larger {
      @apply w-28 h-28;
    }
  }

  &--border {
    &-size {
      &-small {
        @apply border;
      }

      &-medium {
        @apply border-2;
      }

      &-large {
        @apply border-4;
      }
    }

    // @include --colors($property: "border", $delimit: "-");
  }

  // @include --colors($property: "bg");
  // @include --colors($property: "bg", $postfix: "-50", $modifier: "fade");
  // @include --colors(
  //   $property: "bg-stain",
  //   $pseudo: "before",
  //   $postfix: "-50",
  //   $modifier: "stain"
  // );
}
</style>
