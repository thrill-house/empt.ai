<docs>
### Ability slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<ability-slot label="data-socket-slot-label"></ability-slot>`

---
</docs>

<template>
  <div class="ability-slot">
	  <enabled-ability v-if="event && abilityInstance" :instance="abilityInstance"></enabled-ability>
	  <h3 v-else>Empty</h3>
	  <button class="mt-2 button orange" v-if="selectedLabel && selectedInstance && selectedInstance != abilityInstance" @click="addEvent(selectedLabel, selectedInstance)">
	  	Install <strong>{{ selectedLabel }}</strong>
	  </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import EnabledAbility from "./enabled-ability.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "ability-slot",
  store,
  components: {
    EnabledAbility,
    EmotionDiagram
  },
  props: {
    label: String
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
    selectedAbility: function() {
      return this.getInteraction("selectedAbility");
    },
    selectedLabel: function() {
      return this.selectedAbility ? this.selectedAbility.label : "";
    },
    selectedInstance: function() {
      return this.selectedAbility ? this.selectedAbility.instance : "";
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
        this.resetInteraction("selectedAbility");
      }
    },
    ...mapActions(["addSlotEvent", "resetInteraction"])
  }
};
</script>

<style lang="scss">
@import "../assets/scss/default";

/*
.ability-slot {
  position: relative;
	text-align: center;
  width: 162px; 
  height: 187px;
  padding: 30px 10px;
  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
	background: radial-gradient($light, $sky);
  color: $dark;
  
  .ability.enabled {
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: -1;
  }
}
.green {
	background: green;
}
.red {
	background: red;
}
.yellow {
	background: yellow;
}
*/
</style>
