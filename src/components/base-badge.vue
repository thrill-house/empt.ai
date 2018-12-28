<docs>
### Base badge
Little helper component for wrapping things like icons in a nice circular badge.

##### Instantiation
`<base-badge></base-badge>`
</docs>

<script>
export default {
  name: 'base-badge',
  blockName: 'badge',
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
