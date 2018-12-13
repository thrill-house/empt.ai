<docs>
### Base hexagon
Helper component for hexagons as the base for sockets, slots and slotted abilities.
</docs>

<script>
export default {
  name: 'base-hexagon',
  blockName: 'hexagon',
  props: {
    color: {
      type: [String, Boolean],
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div v-bem="{ color, tile }"><slot></slot></div>
</template>
