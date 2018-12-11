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
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySlotted from './ability-slotted';
import BaseIcon from './base-icon';
import EmotionDiagram from './emotion-diagram';

export default {
  name: 'socket-slot',
  store,
  components: {
    AbilitySlotted,
    BaseIcon,
    EmotionDiagram,
  },
  props: {
    label: String,
  },
  data: function() {
    return {
      hover: false,
    };
  },
  computed: {
    slot: function() {
      return this.getSlot(this.label);
    },
    socket: function() {
      return this.getSocketForSlot(this.label);
    },
    event: function() {
      var event = this.getEventOfType(this.label, 'slot');
      return event && event.positive ? event : false;
    },
    abilityInstance: function() {
      if (this.event) {
        var instance = this.getEventOfType(
          this.event.instance,
          'slot',
          'instance'
        );
        if (instance.timestamp <= this.event.timestamp) {
          return this.event.instance;
        }
      }

      return '';
    },
    slotting: function() {
      return this.getInteraction('slot');
    },
    slottingLabel: function() {
      return this.slotting ? this.slotting.label : '';
    },
    slottingInstance: function() {
      return this.slotting ? this.slotting.instance : '';
    },
    ...mapGetters([
      'getEventOfType',
      'getSlot',
      'getSocketForSlot',
      'getInteraction',
    ]),
  },
  methods: {
    addEvent: function(ability, instance) {
      if (
        this.addSlotEvent({
          label: this.label,
          ability: ability,
          instance: instance,
        })
      ) {
        this.resetInteraction('slot');
      }
    },
    ...mapActions(['addSlotEvent', 'resetInteraction']),
  },
};
</script>

<template>
  <div
    class="socket-slot"
    :class="`socket-slot--${slot.position}`"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <ability-slotted
      v-if="event && abilityInstance && (!slottingLabel || !hover)"
      :instance="abilityInstance"
    ></ability-slotted>
    <div
      v-else
      class="socket-slot bg-tile-overlay hexagon w-48 h-hex*48 px-2 py-6 flex flex-col justify-between content-center items-center bg-light text-light text-center"
      :class="[
        { 'slotting-prompt': hover },
        { 'tree-match': slottingLabel && slotting.ability.type == socket.type },
        'bg-' + (slottingLabel && hover ? slotting.ability.type : 'light'),
      ]"
    >
      <div
        v-if="slottingLabel"
        class="w-24 h-24 rounded-full inline-flex align-center items-center justify-center order-2"
        :class="[
          'bg-' +
            (slottingLabel && hover ? slotting.ability.type : 'light') +
            '-25',
        ]"
      >
        <base-icon
          v-if="slottingLabel"
          v-show="hover"
          :label="slottingLabel"
          class="w-16 h-16 text-light"
        ></base-icon>
      </div>
      <div
        v-if="slottingLabel"
        class="w-8 h-8 rounded-full inline-flex items-center justify-center mb-2 order-1"
        :class="[
          'bg-' +
            (slottingLabel && hover ? slotting.ability.type : 'light') +
            '-25',
        ]"
      >
        <base-icon
          v-show="hover"
          class="w-4 h-4"
          :class="'text-' + slotting.ability.type"
          :label="slotting.ability.type"
        ></base-icon>
      </div>
      <button
        v-if="slottingLabel && slottingInstance"
        class="relative text-xs text-light uppercase font-bold p-2 button bg-sky mt-2 order-3"
        :class="{ 'opacity-0': !hover }"
        @click="addEvent(slottingLabel, slottingInstance)"
      >
        {{ $t('Install') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.socket-slot {
  &--top-left {
    grid-area: a;
  }

  &--top-right {
    grid-area: b;
  }

  &--left {
    grid-area: c;
  }

  &--right {
    grid-area: e;
  }

  &--bottom-left {
    grid-area: f;
  }

  &--bottom-right {
    grid-area: g;
  }
}
</style>
