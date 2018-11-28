<docs>
### Install ability
The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Instantiation
`<install-ability label="ability-label"></install-ability>`
</docs>

<template>
  <div v-if="ability && events.length" class="install-ability" :class="{ 'relative z-50': dialog }">
	  <div v-if="dialog" class="fixed pin bg-navy-75 flex items-center justify-center z-20">
		  <article class="relative w-192 h-128 py-3 bg-navy border border-grey">
  		  <header class="install-ability__header flex justify-between px-6 py-3">
    		  <div class="button text-lg text-navy uppercase font-bold bg-light px-4 py-2">{{ $t('Install') }}</div>
    		  <button class="button text-lg text-light uppercase font-bold px-4 py-2 bg-light-25"
    		  @click="endInstalling(); $parent.$emit('research')">{{ $t('Research') }}</button>
  		  </header>
  		  <div class="flex justify-between">
  			  <div class="w-1/4 py-3 pl-6">
            <h4 class="uppercase mb-3">{{ ability.name }}</h4>
            <div class="w-24 h-24 bg-sky-25 overflow-hidden rounded-full inline-flex flex-no-shrink items-center justify-center">
              <icon :label="label" class="w-16 h-16 text-light"></icon>
            </div>
  			  </div>
  			  <div class="w-1/2 py-3">
    			  <emotion-diagram class="w-64 h-64"
      			  :values="values"
      			  :hideLabels="false"></emotion-diagram>
  			  </div>
  			  <div class="w-1/4 flex flex-col items-end justify-between py-3 pr-6">
    			  <div class="flex flex-col">
      			  <button :disabled="!selectedEvent" :class="{ 'opacity-10': !selectedEvent }" class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light" @click="startSlotting(selectedEvent.instance)">
      					{{ $t('Install') }}
      				</button>
      			  <button class="button uppercase bg-blue px-4 py-2 font-bold text-light" @click="endInstalling()">
      					{{ $t('Cancel') }}
      				</button>
    			  </div>
    				<div class="bg-sky-25 px-4 py-2 clip-2-corners w-full">
      				<h4 class="uppercase text-sm mb-2">{{ $t('Install cost') }}</h4>
      				<div>
        				<factor-value v-for="(value, cost) in costs" :key="cost" :label="cost" :value="value" class="h-4 mb-1"></factor-value>
      				</div>
    				</div>
  			  </div>
  		  </div>
  		  <div class="py-3 w-full flex flex-wrap justify-center">
  			  <button v-for="event in events"
  			    class="m-1 outline-none"
  			    :class="{ 'opacity-75': isInstalled(event) }"
  			    @click="select(event)"
  			    @mouseover="highlight(event)"
  			    @mouseout="lowlight()">
  				    <emotion-diagram class="w-24 h-24"
      				  :values="event.emotions"
      				  :color="isInstalledDeselected(event)? 'sky': 'light'"
      				  :class="{ 'border border-light': isSelected(event) }">
      				  <div class="w-full h-full flex items-center justify-center rounded-full z-30 relative"
        				  :class="[(isSelected(event)? 'bg-light-25': isInstalled(event)? 'bg-sky-25': '')]">
      				    <span class="uppercase text-xs font-bold text-light p-1"
        				    :class="[(isSelected(event)? 'text-navy': isInstalled(event)? 'text-light': '')]">
        				      {{ isInstalledDeselected(event)? $t('Installed'): (isSelected(event)? $t('Selected'): '') }}
        				  </span>
      				  </div>
      				</emotion-diagram>
  			  </button>
  		  </div>
		  </article>
	  </div>
    <button v-if="!slotting || slottingLabel !== label"
      :class="{ 'cursor-wait': (!affordable) }"
      class="button bg-sky-25 text-light text-left text-xs px-3 py-px relative w-full z-10"
      :disabled="!affordable"
      @click="startInstalling()">
			<span class="absolute block pin h-full bg-sky-50 rounded z-0"
			  :style="{width: affordability + '%'}" ></span>
			<span class="relative block z-10">
				{{ $t('Install') }}
				<span class="inline-block rounded-full px-1 h-3 bg-light text-sky text-center align-bottom text-2xs font-bold"
				:class="{ 'bg-grey': !remaining }">{{ remaining }}/{{ total }}</span>
				<br><span class="font-bold filter-grayscale">{{ costs.data|data }}</span>
			</span>
		</button>
		<button v-else class="button bg-blue-75 text-xs px-3 py-px text-light text-left relative w-full" @click="endSlotting()">
			{{ $t('Cancel {item}', { item: $t('installation')} ) }}
		</button>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import FactorValue from "./factor-value.vue";
import EmotionalProfile from "./emotional-profile.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "available-ability",
  store,
  components: {
    Icon,
    FactorValue,
    EmotionalProfile,
    EmotionDiagram
  },
  props: {
    label: String
  },
  data: function() {
    return {
      dialog: false,
      selectedEvent: false,
      highlightedEvent: false
    };
  },
  computed: {
    events: function() {
      return this.getAbilityEvents(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    installedInstances: function() {
      return _.map(this.installed, "instance");
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
    emotions: function() {
      return this.getEmotions();
    },
    previewEmotions: function() {
      var combineEmotions =
        this.highlightedEvent.emotions || this.selectedEvent.emotions;

      combineEmotions =
        this.isInstalled(this.highlightedEvent) ||
        this.isInstalled(this.selectedEvent)
          ? _.mapValues(combineEmotions, () => 0)
          : combineEmotions;

      return combineEmotions
        ? _.transform(
            this.emotions,
            function(result, value, key) {
              result[key] = value + combineEmotions[key];
            },
            {}
          )
        : false;
    },
    values: function() {
      var emotions = _.merge({ color: "light" }, this.emotions);
      return this.previewEmotions
        ? [emotions, _.merge({ color: "sky" }, this.previewEmotions)]
        : emotions;
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
      "getInteraction",
      "getEmotions"
    ])
  },
  methods: {
    isSelected: function(event) {
      return event ? this.selectedEvent.instance === event.instance : false;
    },
    isInstalled: function(event) {
      return event
        ? _.includes(this.installedInstances, event.instance)
        : false;
    },
    isInstalledDeselected: function(event) {
      return this.isInstalled(event) && !this.isSelected(event);
    },
    select: function(event) {
      if (this.selectedEvent !== event) {
        this.selectedEvent = event;
      } else {
        this.deselect();
      }
    },
    deselect: function() {
      this.selectedEvent = false;
    },
    highlight: function(event) {
      this.highlightedEvent = event;
    },
    lowlight: function() {
      this.highlightedEvent = false;
    },
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
      this.deselect();
      this.lowlight();
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
.install-ability__header {
  @apply items-center;

  &:before,
  &:after {
    @apply w-1/4 h-px bg-light;
    content: "";
  }
}
</style>
