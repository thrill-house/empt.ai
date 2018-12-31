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
  mounted() {
    this.width = this.$el.offsetWidth;
    this.height = this.$el.offsetHeight;
  },
  data: () => ({
    width: 0,
    height: 0,
  }),
  computed: {
    top() {
      return `${this.position.top}px`;
    },
    left() {
      return `${this.position.left + this.leftOffset}px`;
    },
    leftOffset() {
      return this.isAtRight ? -20 : 20;
    },
    isAtRight() {
      return this.position.left >= window.innerWidth - this.width;
    },
    isAtBottom() {
      return this.position.top >= window.innerHeight - this.height;
    },
    translateX() {
      return this.isAtRight ? 'translateX(-100%)' : '';
    },
    translateY() {
      return this.isAtBottom ? 'translateY(-100%)' : '';
    },
    transform() {
      return `${this.translateX} ${this.translateY}`;
    },
  },
};
</script>

<template>
  <transition name="fade" slot="tooltip">
    <aside v-bem :style="{ top, left, transform }"><slot /></aside>
  </transition>
</template>
