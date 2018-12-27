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
    show: Boolean,
  },
  computed: {
    top() {
      return 50;
    },
    left() {
      return 50;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<template>
  <transition name="fade" slot="tooltip">
    <aside v-show="show" v-bem :style="{ top, left }"><slot /></aside>
  </transition>
</template>

<style lang="scss">
.the-tooltip {
  @apply absolute
  bg-navy
  text-light
  z-50;
}
</style>
