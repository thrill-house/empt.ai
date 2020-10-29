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
    stain: {
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
  <div v-bem="{ color, tile, stain }"><slot></slot></div>
</template>

<style lang="scss">
@import '../styles/mixins';

.hexagon {
  @apply relative 
  w-48 h-hex*48
  overflow-hidden
  clip-hexagon;

  &:before {
    @apply absolute -z-10 clip-hexagon;
    content: '';
  }

  &--tile {
    background-color: none;

    > * {
      @apply relative z-10;
    }

    &:before {
      @apply absolute inset-0 z-20 bg-stain;
    }
  }

  @include --colors($property: 'bg-stain', $pseudo: 'before', $postfix: '-50');
  @include --colors(
    $property: 'bg-stain',
    $pseudo: 'before',
    $postfix: '-25',
    $modifier: 'stain'
  );
}
</style>
