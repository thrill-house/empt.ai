<docs>
### Install ability
The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Instantiation
`<install-ability label="ability-label"></install-ability>`
</docs>

<template>
  <div v-if="ability && events.length" class="available-ability" :class="{ 'relative z-50': dialog }">
	  <div v-if="dialog" class="fixed pin bg-dark flex items-center justify-center">
		  <div class="w-64">
			  <div class="mb-8 w-full flex flex-wrap">
				  <button v-for="event in events" class="m-1" @click="startSlotting(event.instance)">
					  <emotion-diagram
						  :happiness="event.happiness"
						  :sadness="event.sadness"
						  :excitement="event.excitement"
						  :fear="event.fear"
						  :tenderness="event.tenderness"
						  :anger="event.anger"
						  class="w-16 h-hex*16"></emotion-diagram>
				  </button>
			  </div>
			  <button class="button bg-blue p-2 font-bold text-light" @click="endInstalling()">
					Cancel
				</button>
		  </div>
	  </div>
    <button v-else-if="!slotting || slottingLabel !== label" :class="{ 'cursor-wait': (!affordable) }" class="button bg-blue-light-25 text-light text-left text-xs px-3 py-px relative w-full" :disabled="!affordable" @click="startInstalling()">
			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-blue-light-50 rounded z-0"></span>
			<span class="relative block z-10">
				Install <span class="inline-block rounded-full px-1 h-3 bg-light text-blue-light text-center align-bottom text-2xs font-bold" :class="{ 'bg-grey': !remaining }">{{ remaining }}/{{ total }}</span><br>
				<span class="font-bold filter-grayscale">{{ costs.data|data }}</span>
			</span>
		</button>
		<button v-else class="button bg-blue-75 text-xs px-3 py-px text-light text-left relative w-full" @click="endSlotting()">
			Cancel<br>install
		</button>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "available-ability",
  store,
  components: {
    EmotionDiagram
  },
  props: {
    label: String
  },
  data: function() {
    return {
      dialog: false
    };
  },
  computed: {
    events: function() {
      return this.getAbilityEvents(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    remaining: function() {
      return this.total - this.installed.length;
    },
    total: function() {
      return this.events.length;
    },
    ability: function() {
      return this.getAbility(this.label);
    },
    era: function() {
      return this.ability.era;
    },
    eraActive: function() {
      return this.isEraActive(this.era);
    },
    affordability: function() {
      return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getSlotCosts(this.newEvent);
    },
    scores: function() {
      return this.getScores();
    },
    newEvent: function() {
      return {
        type: "slot",
        target: "ability",
        ability: this.label
      };
    },
    slotting: function() {
      return this.getInteraction("slottingAbility");
    },
    slottingLabel: function() {
      return this.slotting ? this.slotting.label : "";
    },
    installing: function() {
      return this.getInteraction("installingAbility");
    },
    installingLabel: function() {
      return this.installing ? this.installing.label : "";
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getAbilityEvents",
      "getAbility",
      "getSlotCosts",
      "getValidSlotEvents",
      "getScores",
      "getInteraction"
    ])
  },
  methods: {
    startInstalling: function() {
      this.dialog = true;
      this.setInteraction({
        interaction: "installingAbility",
        label: this.label,
        ability: this.getAbility(this.label)
      });
    },
    endInstalling: function() {
      this.dialog = false;
      this.resetInteraction("installingAbility");
    },
    startSlotting: function(instance) {
      this.endInstalling();
      this.setInteraction({
        interaction: "slottingAbility",
        label: this.label,
        ability: this.getAbility(this.label),
        instance: instance
      });
    },
    endSlotting: function() {
      this.endInstalling();
      this.resetInteraction("slottingAbility");
    },
    ...mapActions(["setInteraction", "resetInteraction"])
  }
};
</script>

<style lang="scss">
</style>
