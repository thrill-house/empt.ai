<docs>
### The Tooltip
Helper element to display tooltips that take a z-index priority over all other elements.

##### Instantiation
`<the-tooltip></the-tooltip>`
</docs>

<script>
export default {
  name: 'the-tooltip',
  blockName: 'the-tooltip',
  props: {
    position: Object,
  },
  computed: {
    top() {
      return `${this.position.top}px`;
    },
    left() {
      return `${this.position.left + 20}px`;
    },
  },
};
</script>

<template>
  <transition name="fade" slot="tooltip">
    <aside v-bem :style="{ top, left }"><slot /></aside>
  </transition>
</template>
