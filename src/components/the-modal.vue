<docs>
### The Modal
Helper element to display modal dialogs within, that take a z-index priority over all other elements.

##### Instantiation
`<the-modal></the-modal>`
</docs>

<script>
export default {
  name: 'the-modal',
  props: {
    show: Boolean,
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
  },
};
</script>

<template>
  <transition
    name="fade"
    slot="modal"
  >
    <aside
      v-show="show"
      class="the-modal bg-navy-75"
    >
      <slot></slot>
    </aside>
  </transition>
</template>

<style lang="scss">
.the-modal {
  @apply fixed
  pin
  flex justify-center items-center
  z-50;

  //@extend %bg-navy-75;
}
</style>
