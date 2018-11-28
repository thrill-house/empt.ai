<docs>
### Research ability
The component displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Instantiation
`<research-ability label="ability-label"></research-ability>`
</docs>

<template>
  <div v-if="ability" class="research-ability" :class="{ 'relative z-50': dialog }">
	  <div v-if="dialog" class="fixed pin bg-navy-75 flex items-center justify-center z-20">
			<article class="relative w-192 h-128 py-3 bg-navy border border-grey">
				<header class="install-ability__header flex justify-between px-6 py-3">
    		  <button class="button text-lg text-light uppercase font-bold bg-light-25 px-4 py-2" @click="endResearching(); $parent.$emit('install')">{{ $t('Install') }}</button>
    		  <div class="button text-lg text-navy uppercase font-bold px-4 py-2 bg-light">{{ $t('Research') }}</div>
  		  </header>
				<div class="flex justify-between">
					<div class="w-1/4 py-3 pl-6">
            <h4 class="uppercase mb-3">{{ ability.name }}</h4>
            <div class="w-24 h-24 bg-sky-25 overflow-hidden rounded-full inline-flex flex-no-shrink items-center justify-center">
              <icon :label="label" class="w-16 h-16 text-light"></icon>
            </div>
  			  </div>
					<div class="w-1/2 py-3">
  					<emotion-diagram
  					  :values="{
    					  happiness: selectedHappiness || 0.1,
    					  sadness: selectedSadness || 0.1,
    					  excitement: selectedExcitement || 0.1,
    					  fear: selectedFear || 0.1,
    					  tenderness: selectedTenderness || 0.1,
    					  anger: selectedAnger || 0.1
  					  }"
  					  :hideLabels="false"
  					  :scale="2"
  					  class="w-64 h-64">
  					  <template slot="happiness">
                <input type="number" v-model.number="selectedHappiness" min="0" :max="maximumHappiness" :class="'max-' + maximumHappiness">
              </template>
              <template slot="sadness">
                <input type="number" v-model.number="selectedSadness" min="0" :max="maximumSadness" :class="'max-' + maximumSadness">
              </template>
              <template slot="tenderness">
                <input type="number" v-model.number="selectedTenderness" min="0" :max="maximumTenderness" :class="'max-' + maximumTenderness">
              </template>
              <template slot="anger">
                <input type="number" v-model.number="selectedAnger" min="0" :max="maximumAnger" :class="'max-' + maximumAnger">
              </template>
              <template slot="excitement">
                <input type="number" v-model.number="selectedExcitement" min="0" :max="maximumExcitement" :class="'max-' + maximumExcitement">
              </template>
              <template slot="fear">
                <input type="number" v-model.number="selectedFear" min="0" :max="maximumFear" :class="'max-' + maximumFear">
              </template>
            </emotion-diagram>
					</div>
          <div class="w-1/4 flex flex-col items-end justify-between py-3 pr-6">
    			  <div class="flex flex-col">
          		<button :disabled="sumEmotions !== requiredEmotions" :class="{ 'opacity-10': sumEmotions !== requiredEmotions }" class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light" @click="engageResearch(label)">
    						{{ $t('Confirm') }}
    					</button>
    					<button class="button uppercase bg-blue px-4 py-2 font-bold text-light" @click="endResearching()">
    						{{ $t('Cancel') }}
    					</button>
    			  </div>
    				<div class="bg-sky-25 px-4 py-2 clip-2-corners w-full">
      				<h4 class="uppercase text-sm mb-2">{{ $t('Research cost') }}</h4>
      				<div>
        				<factor-value v-for="(value, cost) in costs" :key="cost" :label="cost" :value="value" class="h-4 mb-1"></factor-value>
      				</div>
    				</div>
  			  </div>
				</div>
			</article>
    </div>
    <button v-else :class="{'cursor-wait': (!affordable)}" class="button bg-sky-25 text-light text-left text-xs px-3 py-px relative w-full" :disabled="!affordable" @click="startResearching()">
			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-sky-50 rounded z-0"></span>
			<span class="relative z-10">
				{{ $t('Research') }}<br>
				<span class="font-bold filter-grayscale">{{ costs.confidence|confidence }}</span>
			</span>
		</button>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import FactorValue from "./factor-value.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "available-ability",
  store,
  components: {
    Icon,
    FactorValue,
    EmotionDiagram
  },
  props: {
    label: String
  },
  data: function() {
    return {
      dialog: false,
      selectedHappiness: 2,
      selectedSadness: 0,
      selectedTenderness: 0,
      selectedAnger: 1,
      selectedExcitement: 1,
      selectedFear: 0,
      requiredEmotions: 4
    };
  },
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    allEmotions: function() {
      return [
        this.selectedExcitement,
        this.selectedHappiness,
        this.selectedTenderness,
        this.selectedFear,
        this.selectedSadness,
        this.selectedAnger
      ];
    },
    sumEmotions: function() {
      return _.sum(this.allEmotions);
    },
    enoughEmotions: function() {
      return this.sumEmotions === this.requiredEmotions;
    },
    maximumEmotion: function() {
      return _.max(this.allEmotions);
    },
    maximumHappiness: function() {
      return this.getMaximumEmotion(
        this.selectedHappiness,
        this.selectedSadness
      );
    },
    maximumSadness: function() {
      return this.getMaximumEmotion(
        this.selectedSadness,
        this.selectedHappiness
      );
    },
    maximumTenderness: function() {
      return this.getMaximumEmotion(
        this.selectedTenderness,
        this.selectedAnger
      );
    },
    maximumAnger: function() {
      return this.getMaximumEmotion(
        this.selectedAnger,
        this.selectedTenderness
      );
    },
    maximumExcitement: function() {
      return this.getMaximumEmotion(this.selectedExcitement, this.selectedFear);
    },
    maximumFear: function() {
      return this.getMaximumEmotion(this.selectedFear, this.selectedExcitement);
    },
    affordability: function() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getAbilityCosts(this.newEvent);
    },
    scores: function() {
      return this.getScores();
    },
    newEvent: function() {
      return {
        type: "ability",
        label: this.label,
        target: false,
        emotions: {
          happiness: this.selectedHappiness,
          sadness: this.selectedSadness,
          tenderness: this.selectedTenderness,
          anger: this.selectedAnger,
          excitement: this.selectedExcitement,
          fear: this.selectedFear
        }
      };
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getEventsOfType",
      "getAbility",
      "getAbilityCosts",
      "getScores",
      "isEraActive"
    ])
  },
  methods: {
    startResearching: function() {
      this.dialog = true;
      this.setInteraction({
        interaction: "researchingAbility",
        label: this.label,
        ability: this.getAbility(this.label)
      });
    },
    endResearching: function() {
      this.dialog = false;
      this.resetInteraction("researchingAbility");
    },
    engageResearch: function(label) {
      if (this.sumEmotions === this.requiredEmotions) {
        var event = _.defaults(this.newEvent, {
          instance: this.label + "-" + _.now()
        });

        this.selectedHappiness = 0;
        this.selectedSadness = 0;
        this.selectedTenderness = 0;
        this.selectedAnger = 0;
        this.selectedExcitement = 0;
        this.selectedFear = 0;
        this.dialog = false;

        this.addAbilityEvent(event);

        this.endResearching();
        this.setInteraction({
          interaction: "slottingAbility",
          label: label,
          ability: this.getAbility(label),
          instance: event.instance
        });
      } else {
        alert("Fill in all emotions");
      }
    },
    getMaximumEmotion: function(emotion, complementary) {
      return complementary > 0
        ? 0
        : emotion == this.requiredEmotions / 2 ||
          (this.sumEmotions - emotion <= this.requiredEmotions / 2 &&
            this.maximumEmotion < this.requiredEmotions / 2)
          ? this.requiredEmotions / 2
          : 1;
    },
    ...mapActions(["addAbilityEvent", "setInteraction", "resetInteraction"])
  }
};
</script>

<style lang="scss">
.research-ability {
  .emotions {
    @apply .relative .block;

    .emotion-diagram {
      @apply .absolute .pin .w-full .h-full;
    }

    .axis {
      @apply .absolute .-mt-1;
      left: 50%;
      top: 50%;
      transform-origin: center left;

      &.axis-excitement {
        transform: rotate(90deg - 30deg);
      }

      &.axis-happiness {
        transform: rotate(90deg - 90deg);
      }

      &.axis-tenderness {
        transform: rotate(90deg - 150deg);
      }

      &.axis-fear {
        transform: rotate(90deg - 210deg);
      }

      &.axis-sadness {
        transform: rotate(90deg - 270deg);
      }

      &.axis-anger {
        transform: rotate(90deg - 330deg);
      }

      input {
        @apply .block .w-full .h-2 .rounded-full .bg-dark .opacity-25;
        -webkit-appearance: none;

        &:focus {
          outline: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        &::-ms-track {
          @apply .w-full .cursor-pointer .bg-transparent .text-transparent .border-transparent;
        }

        @mixin thumb {
          @apply .bg-transparent .h-4 .w-4 .rounded-full .cursor-pointer;
        }

        &::-webkit-slider-thumb {
          @include thumb;
        }

        &::-moz-range-thumb {
          @include thumb;
        }

        &::-ms-thumb {
          @include thumb;
        }

        &.max-1 {
          @apply .w-1/2;
        }

        &.max-0 {
          @apply .w-4;
        }
      }

      label {
        @apply .absolute .pin-b .pin-r .mb-2 .-mr-4 .text-xs;
        transform-origin: bottom right;
        transform: scale(0.75);
      }
    }
  }
}
</style>
