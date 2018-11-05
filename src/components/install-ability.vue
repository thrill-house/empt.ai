<docs>
### Install ability
The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Instantiation
`<install-ability label="ability-label"></install-ability>`

---
</docs>

<template>
  <div v-if="ability && events.length" class="available-ability">
	  <div v-if="showDialog" class="fixed pin bg-dark flex items-center justify-center z-50">
		  <div class="w-64">
			  <div class="mb-8 w-full flex flex-wrap">
				  <button v-for="event in events" class="m-1" :class="[{'bg-orange': event.instance == selectedInstance}]" @click="selectAbility(event.label, event.instance)">
					  <emotion-diagram
						  :happiness="event.happiness"
						  :sadness="event.sadness"
						  :excitement="event.excitement"
						  :fear="event.fear"
						  :tenderness="event.tenderness"
						  :anger="event.anger"
						  class="w-16"></emotion-diagram>
				  </button>
			  </div>
			  <button class="button bg-purple text-light" @click="showDialog = false">
					Cancel
				</button>
		  </div>
	  </div>
    <button v-else-if="!selectedAbility || selectedLabel !== label" :class="{'cursor-wait': (!affordable)}" class="button bg-peach text-light relative w-full" :disabled="!affordable" @click="showDialog = true">
			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-orange rounded z-0"></span>
			<span class="relative z-10">
				Install ({{ costs.data|data }})<br>
				{{ events.length }} available
			</span>
		</button>
		<button v-else class="button bg-purple text-light italic" @click="deselectAbility()">
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
      showDialog: false
    };
  },
  computed: {
    events: function() {
      return this.getAbilityEvents(this.label);
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
    selectedAbility: function() {
      return this.getInteraction("selectedAbility");
    },
    selectedLabel: function() {
      return this.selectedAbility ? this.selectedAbility.label : "";
    },
    selectedInstance: function() {
      return this.selectedAbility ? this.selectedAbility.instance : "";
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getAbilityEvents",
      "getAbility",
      "getSlotCosts",
      "getScores",
      "getInteraction"
    ])
  },
  methods: {
    selectAbility: function(label, instance) {
      this.showDialog = false;
      this.setInteraction({
        interaction: "selectedAbility",
        label: label,
        instance: instance
      });
    },
    deselectAbility: function() {
      this.showDialog = false;
      this.resetInteraction("selectedAbility");
    },
    ...mapActions(["setInteraction", "resetInteraction"])
  }
};
</script>

<style lang="scss">
@import "../assets/scss/default";

.available-ability {
  .emotions {
    @apply .relative .block;

    &:before {
      @apply .block;
      content: "";
      padding-top: 27 / 25 * 100%;
    }

    .emotion-diagram {
      @apply .absolute .pin .w-full .h-full;
    }
  }
}
</style>
