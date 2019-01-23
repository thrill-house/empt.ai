<docs>
### Base icon
Reference to a SVG sprite id for usage as base-icon.

##### Properties
- `label` — A label referring to the base-icon id in the SVG sprite.

##### Instantiation
`<base-icon label="icon-label"></base-icon>`
</docs>

<script>
import svg from '../svg';

export default {
  name: 'base-icon',
  blockName: 'icon',
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: false,
    },
    size: {
      type: [String, Boolean],
      default: false,
    },
  },
};
</script>

<template>
  <svg v-bem="{ color, size }"><use :xlink:href="`#${label}`"></use></svg>
</template>

<style lang="scss">
@import '../scss/mixins';

.icon {
  @apply fill-current;

  &--size {
    &-tiny {
      @apply w-4 h-4;
    }

    &-small {
      @apply w-6 h-6;
    }

    &-medium {
      @apply w-8 h-8;
    }

    &-large {
      @apply w-16 h-16;
    }
  }

  @include --colors($property: 'text');
}
</style>
