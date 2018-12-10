<docs>
### Socket field
Helper component for sockets to extend, defining the socket and its slots locations.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-field label.string="socket-label"></socket-field>`
</docs>

<script>
import store from '../store';

export default {
  name: 'socket-field',
  store,
  props: {
    label: String,
  },
  data: () => ({
    slots: {
      topLeft: 'top-left',
      topRight: 'top-right',
      right: 'right',
      bottomRight: 'bottom-right',
      bottomLeft: 'bottom-left',
      left: 'left',
    },
  }),
};
</script>

<template>
  <div class="socket-field">
    <div name="socket" class="socket-base"></div>
    <div
      v-for="(value, slot) in slots"
      :class="['socket-slot', `socket-slot--${value}`]"
      :name="slot"
    ></div>
  </div>
</template>

<style lang="scss">
.socket-field {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    '. a a b b .'
    '. a a b b .'
    'c c d d e e'
    'c c d d e e'
    '. f f g g .'
    '. f f g g .';
}
</style>
