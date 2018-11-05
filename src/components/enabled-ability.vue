<docs>
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="data-socket-slot-label"></enabled-ability>`

---
</docs>

<template>
  <div v-if="event && slotEvent">
    <header class="flex items-center mb-2">
	    <h5 class="mr-2">{{ ability.name }}</h5>
		  <output class="output bg-orange text-peach">{{ ability.era }}</output>
		  <output v-if="ability.type" :class="[{'bg-sky': !treeMatch}]" class="output">{{ ability.type }}</output>
		  <output :class="[{'bg-sky': (tree != socket.type)}]" class="output" v-for="(value, tree) in trees" v-if="tree == socket.type && value > 1">
		    +{{ prettyUnit(value, tree) }}
	    </output>
    </header>
    <div class="flex items-center align-center">
	    <div v-if="dependencies" class="mr-2 outputs">
		    <output :class="[{'bg-sky': !hasValidSlotEvents(dependency)}]" class="output" v-for="(value, dependency) in dependencies">
			  	+{{ value|percentage }} with {{ getAbility(dependency).name }}
		    </output>
	    </div>
	    <div class="values">
		    <emotion-diagram
				  :happiness="event.happiness"
				  :sadness="event.sadness"
				  :excitement="event.excitement"
				  :fear="event.fear"
				  :tenderness="event.tenderness"
				  :anger="event.anger"
				  class="w-16 h-hex*16"></emotion-diagram>
				<div class="mt-2 outputs">
			    <!--output class="output" v-for="(value, factor) in factors" v-if="value.base > 0">
				    Before bonus: +{{ prettyUnit(value.base, factor) }}
			    </output-->
			    <output class="output" v-for="(value, factor) in calculatedFactors" v-if="value > 0">
				    <!--With bonus: -->+{{ prettyUnit(value, factor) }}
			    </output>
		    </div>
	    </div>
	    <div v-if="dependants" class="ml-2 outputs">
		    <output :class="[{'bg-sky': !hasValidSlotEvents(dependant)}]" class="output" v-for="(value, dependant) in dependants">
			  	{{ getAbility(dependant).name }} gains +{{ value|percentage }}
		    </output>
	    </div>
    </div>
  </div>
  <div v-else class="ability disabled">
    No valid event for "{{ instance }}".
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "enabled-ability",
  props: {
    instance: String
  },
  store,
  components: {
    EmotionDiagram
  },
  computed: {
    abilityLabel: function() {
      return this.event.label;
    },
    ability: function() {
      return this.getAbility(this.abilityLabel);
    },
    factors: function() {
      return this.ability.factors;
    },
    calculatedFactors: function() {
      return this.calculateFactors(this.slotEvent);
    },
    influence: function() {
      return this.factors.influence;
    },
    trees: function() {
      return this.influence.trees;
    },
    dependencies: function() {
      return this.influence.dependencies;
    },
    dependants: function() {
      return this.getAbilityDependants(this.abilityLabel);
    },
    event: function() {
      return this.getEventOfType(this.instance, "ability", "instance");
    },
    slotEvent: function() {
      return this.getEventOfType(this.instance, "slot", "instance");
    },
    socket: function() {
      return this.getSocketForSlot(this.slotEvent.label);
    },
    treeMatch: function() {
      return this.ability.type === this.socket.type;
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "calculateFactors",
      "getEventOfType",
      "getEventObjects",
      "getAbility",
      "getAbilityDependants",
      "hasValidSlotEvents",
      "getSocketForSlot",
      "prettyUnit"
    ])
  },
  methods: {
    clearSlotEvent: function() {
      this.addSlotEvent({
        label: this.slotEvent.label,
        ability: this.slotEvent.ability,
        instance: ""
      });
    },
    ...mapActions(["addSlotEvent"])
  }
};
</script>

<style lang="scss">
</style>
