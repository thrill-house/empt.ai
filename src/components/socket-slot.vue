<docs>
### Socket slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<socket-slot label.string="slot-label"></socket-slot>`
</docs>

<script>
import store from '../store';
import BaseHexagon from './base-hexagon';

export default {
  name: 'socket-slot',
  blockName: 'socket-slot',
  store,
  components: {
    BaseHexagon,
  },
  props: {
    slotter: Object,
    color: {
      type: [String, Boolean],
      default: 'ash',
    },
  },
  computed: {
    position() {
      return this.slotter.position;
    },
  },
};
</script>

<template>
  <base-hexagon v-bem="{ position }" :tile="true" :color="color">
    <slot></slot>
  </base-hexagon>
</template>
