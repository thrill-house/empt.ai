<docs>
### The Modal
Helper element to display modal dialogs within, that take a z-index priority over all other elements.

##### Instantiation
`<the-modal></the-modal>`
</docs>

<script>
export default {
  name: "the-modal",
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<template>
  <transition name="fade">
    <slot name="modal">
      <aside class="the-modal bg-navy bg-opacity-75"><slot></slot></aside>
    </slot>
  </transition>
</template>

<style lang="scss">
.the-modal {
  @apply fixed
  inset-0
  flex justify-center items-center
  bg-navy bg-opacity-75
  z-50;
}
</style>
