<docs>
### Socket slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<socket-slot label.string="slot-label"></socket-slot>`
</docs>

<script>
import BaseHexagon from "./base-hexagon";

export default {
  name: "socket-slot",

  components: {
    BaseHexagon,
  },
  props: {
    slotter: Object,
    stain: {
      type: [String, Boolean],
      default: "ash",
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
  <base-hexagon v-bem="{ position }" :tile="true" :stain="stain">
    <slot></slot>
  </base-hexagon>
</template>

<style lang="scss">
@import "../styles/util";

.socket-slot {
  @apply mx-1 -mt-hex/16;

  &--position {
    &-top-left {
      grid-area: a;
    }

    &-top-right {
      grid-area: b;
    }

    &-left {
      grid-area: c;
    }

    &-right {
      grid-area: e;
    }

    &-bottom-left {
      grid-area: f;
    }

    &-bottom-right {
      grid-area: g;
    }
  }
}
</style>
