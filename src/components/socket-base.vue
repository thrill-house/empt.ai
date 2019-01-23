<docs>
### Socket base
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-base label.string="socket-label"></socket-base>`
</docs>

<script>
import _ from 'lodash';
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import BaseButton from './base-button';
import BaseEra from './base-era';
import BaseIcon from './base-icon';
import BaseHexagon from './base-hexagon';

export default {
  name: 'socket-base',
  store,
  components: {
    BaseButton,
    BaseEra,
    BaseHexagon,
    BaseIcon,
  },
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: 'grey',
    },
  },
  computed: {
    socket() {
      return this.getSocket(this.label);
    },
    affordability() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable() {
      return this.affordability === 100;
    },
    factors() {
      return this.socket.factors;
    },
    costs() {
      return this.getSocketCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    event() {
      return this.getEventOfType(this.label, 'socket');
    },
    newEvent() {
      return {
        type: 'socket',
        label: this.label,
      };
    },
    ...mapGetters([
      'getScores',
      'getEventOfType',
      'getSocket',
      'getSocketCosts',
      'getSlotsForSocket',
    ]),
  },
  methods: {
    activate() {
      this.addSocketEvent(this.newEvent);
    },
    ...mapActions(['addSocketEvent']),
  },
};
</script>

<template>
  <base-hexagon v-bem="{ color }" :tile="true" :color="color">
    <header v-bem:header>
      <h4 v-bem:title>{{ socket.name }}</h4>
    </header>
    <div v-bem:content>
      <slot>
        <base-button
          v-bem:connect
          size="medium"
          :progress="affordability"
          :color="affordable ? 'sky' : 'navy'"
          :disabled="!affordable"
          @click.native.once="activate()"
        >
          <template v-if="affordable">
            {{ $t('Costs') }} {{ costs.confidence | confidence }}
          </template>
          <template v-else>{{ $t('Connect') }}</template>
        </base-button>
      </slot>
    </div>
    <base-icon
      v-bem:icon
      size="medium"
      :color="socket.tree"
      :label="socket.tree"
    ></base-icon>
    <base-era v-bem:era :label="socket.era"></base-era>
  </base-hexagon>
</template>

<style lang="scss">
@import '../scss/mixins';

.socket-base {
  @apply flex flex-col
  justify-between items-center
  bg-neutral
  px-2 py-6
  mx-1 -mt-hex/16
  text-center;
  grid-area: d;

  &:before {
    @apply m-2;
  }

  &:after {
    @apply absolute pin
    w-full*2 h-full*2
    bg-dots
    z-1
    rotate-45;
    content: '';
    left: -50%;
    top: -50%;
  }

  @include --colors;

  &__header {
    @apply flex
    items-center justify-center
    text-center
    bg-grey-25
    p-2
    w-2/3 h-12
    order-2;
  }

  &__title {
    @apply text-light text-sm uppercase;
  }

  &__content {
    @apply flex flex-wrap
    justify-center items-center
    w-full h-12
    order-2;
  }

  &__icon {
    @apply mb-2 order-1;
  }

  &__era {
    @apply mt-1 order-4 w-2;
  }
}
</style>
