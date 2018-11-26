<docs>
### Ability slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<ability-slot label="data-socket-slot-label"></ability-slot>`
</docs>

<template>
  <div class="ability-slot-field" @mouseover="hover = true" @mouseout="hover = false">
    <enabled-ability v-if="event && abilityInstance && (!slottingLabel || !hover)" :instance="abilityInstance"></enabled-ability>
    <div v-else class="ability-slot bg-tile-overlay hexagon w-48 h-hex*48 px-2 py-6 flex flex-col justify-between content-center items-center bg-light text-light text-center" :class="[{'slotting-prompt': hover}, {'tree-match': slottingLabel && slotting.ability.type == socket.type}, 'bg-' + (slottingLabel && hover? slotting.ability.type: 'light')]">
      <div v-if="slottingLabel" class="w-24 h-24 rounded-full inline-flex align-center items-center justify-center order-2" :class="['bg-' + (slottingLabel && hover? slotting.ability.type: 'light') + '-25']">
        <icon v-if="slottingLabel" v-show="hover" :label="slottingLabel" class="w-16 h-16 text-light"></icon>
      </div>
      <div v-if="slottingLabel" :class="['bg-' + (slottingLabel && hover? slotting.ability.type: 'light') + '-25']" class="w-8 h-8 rounded-full inline-flex items-center justify-center mb-2 order-1">
  	    <icon v-show="hover" :label="slotting.ability.type" :class="'text-' + slotting.ability.type" class="w-4 h-4"></icon>
      </div>
  	  <button class="relative text-xs text-light uppercase font-bold p-2 button bg-sky mt-2 order-3" v-if="slottingLabel && slottingInstance" :class="{ 'opacity-0': !hover }" @click="addEvent(slottingLabel, slottingInstance)">
  	  	Install
  	  </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import EnabledAbility from "./enabled-ability.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "ability-slot",
  store,
  components: {
    Icon,
    EnabledAbility,
    EmotionDiagram
  },
  props: {
    label: String
  },
  data: function() {
    return {
      hover: false
    };
  },
  computed: {
    socket: function() {
      return this.getSocketForSlot(this.label);
    },
    event: function() {
      var event = this.getEventOfType(this.label, "slot");
      return event && event.positive ? event : false;
    },
    abilityInstance: function() {
      if (this.event) {
        var instance = this.getEventOfType(
          this.event.instance,
          "slot",
          "instance"
        );
        if (instance.timestamp <= this.event.timestamp) {
          return this.event.instance;
        }
      }

      return "";
    },
    slotting: function() {
      return this.getInteraction("slottingAbility");
    },
    slottingLabel: function() {
      return this.slotting ? this.slotting.label : "";
    },
    slottingInstance: function() {
      return this.slotting ? this.slotting.instance : "";
    },
    ...mapGetters(["getEventOfType", "getSocketForSlot", "getInteraction"])
  },
  methods: {
    addEvent: function(ability, instance) {
      if (
        this.addSlotEvent({
          label: this.label,
          ability: ability,
          instance: instance
        })
      ) {
        this.resetInteraction("slottingAbility");
      }
    },
    ...mapActions(["addSlotEvent", "resetInteraction"])
  }
};
</script>

<style lang="scss">
@import "../scss/$variables";

.ability-slot {
  &:before {
    @apply pin;
  }

  &:after {
    @apply hidden;
  }

  &.slotting-prompt {
    &:before {
      top: 0.1666rem;
      left: 0.1666rem;
      bottom: 0.1666rem;
      right: 0.1666rem;
    }
  }

  &:not(.tree-match) {
    &:after {
      @apply block bg-light;
    }
  }
}
</style>
