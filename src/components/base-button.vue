<docs>
### Base button
Buttons!

##### Instantiation
`<base-button></base-button>`
</docs>

<script>
export default {
  name: 'base-button',
  props: {
    label: String,
  },
};
</script>

<template>
  <button class="button"><slot></slot></button>
</template>

<style lang="scss">
// See components
</style>
