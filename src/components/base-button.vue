<docs>
### Base button
Buttons!

##### Instantiation
`<base-button></base-button>`
</docs>

<script>
import _ from 'lodash-es';

export default {
  name: 'base-button',
  blockName: 'button',
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default(props) {
        return props.showProgress ? 'navy' : 'sky';
      },
    },
    size: {
      type: [String, Boolean],
      default: 'medium',
    },
    font: {
      type: [String, Boolean],
      default: 'bold',
    },
    progressColor: {
      type: [String, Boolean],
      default() {
        return 'sky';
      },
    },
    progress: {
      type: [Number, Boolean],
      default: false,
    },
  },
  computed: {
    showProgress() {
      return _.isFinite(this.progress) && this.progress < 100;
    },
  },
};
</script>

<template>
  <button v-bem="{ color, size, font }">
    <span
      v-if="showProgress"
      v-bem:progress="{ color: progressColor }"
      :style="{ width: progress + '%' }"
    ></span>
    <slot></slot>
  </button>
</template>

<style lang="scss">
@import '../styles/mixins';

.button {
  @apply clip-corners
  text-light
  transition-all duration-300 ease-linear;

  &:hover {
    @apply scale-105;
  }

  &--size {
    &-medium {
      @apply p-2 text-xs;
    }
  }

  &--font,
  &__label--font {
    &-bold {
      @apply uppercase font-bold;
    }
  }

  @include --colors;

  &__progress {
    @apply block
    absolute inset-0
    h-full
    -z-10;

    @include --colors;
  }
}
</style>
