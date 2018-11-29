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
  					  :values="tweakEmotions(emotions)"
  					  :hideLabels="false"
  					  :scale="2"
  					  class="w-64 h-64">
  					  <span v-for="(value, emotion) in emotions"
  					  :key="emotion"
  					  :slot="emotion"
  					  :class="[ emotionSide(emotion) > 0? 'order-first mr-1': 'ml-1' ]"
  					  class="inline-flex">
                <button class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-l-full border-r border-navy"
                  @click="adjust(emotion, emotionSide(emotion) * -1)">❮</button>
                <button class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-r-full"
                  @click="adjust(emotion, emotionSide(emotion))">❯</button>
              </span>
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
      emotions: {
        excitement: 0,
        happiness: 0,
        tenderness: 0,
        fear: 0,
        sadness: 0,
        anger: 0
      },
      complements: {
        excitement: "fear",
        happiness: "sadness",
        tenderness: "anger",
        fear: "excitement",
        sadness: "happiness",
        anger: "tenderness"
      },
      sides: {
        excitement: 1,
        happiness: 1,
        tenderness: 1,
        fear: -1,
        sadness: -1,
        anger: -1
      },
      requiredEmotions: 4
    };
  },
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    sumEmotions: function() {
      return _.sum(_.values(this.emotions));
    },
    enoughEmotions: function() {
      return this.sumEmotions === this.requiredEmotions;
    },
    maxEmotion: function() {
      return _.max(_.values(this.emotions));
    },
    maximums: function() {
      return this.getMaxEmotions(this.emotions);
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
        emotions: this.emotions
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
    adjust: function(emotion, amount) {
      var complement = this.getComplement(emotion);

      if (
        !this.isEmotionValue(complement) &&
        this.isEmotionAdjustable(emotion, amount)
      ) {
        this.emotions[emotion] += amount;
      } else if (this.isEmotionAdjustable(complement, amount * -1)) {
        this.adjust(complement, amount * -1);
      }
    },
    tweakEmotions: function(emotions) {
      return _.mapValues(emotions, function(emotion) {
        return emotion === 0 ? 0.1 : emotion;
      });
    },
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

        this.dialog = false;
        this.emotions = _.mapValues(this.emotions, () => 0);

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
    getComplement: function(emotion) {
      return this.complements[emotion];
    },
    getMaxEmotion: function(emotion) {
      var value = this.emotions[emotion],
        complement = this.emotions[this.complements[emotion]];

      return complement > 0
        ? 0
        : value == this.requiredEmotions / 2 ||
          (this.sumEmotions - value <= this.requiredEmotions / 2 &&
            this.maxEmotion < this.requiredEmotions / 2)
          ? this.requiredEmotions / 2
          : 1;
    },
    getMaxEmotions: function(emotions) {
      var self = this;

      return _.mapValues(emotions, function(value, emotion) {
        return self.getMaxEmotion(emotion);
      });
    },
    emotionSide: function(emotion) {
      console.log(this.sides[emotion]);
      return this.sides[emotion];
    },
    isEmotionMax: function(emotion) {
      return this.emotions[emotion] === this.maximums[emotion];
    },
    isEmotionMin: function(emotion) {
      return this.emotions[emotion] === 0;
    },
    isEmotionInRange: function(emotion) {
      return (
        this.emotions[emotion] >= 0 &&
        this.emotions[emotion] <= this.maximums[emotion]
      );
    },
    isEmotionIncrementable: function(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMax(emotion);
    },
    isEmotionDecrementable: function(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMin(emotion);
    },
    isEmotionAdjustable: function(emotion, amount) {
      return (
        (amount > 0 && this.isEmotionIncrementable(emotion)) ||
        (amount < 0 && this.isEmotionDecrementable(emotion))
      );
    },
    isEmotionValue: function(emotion) {
      return this.isEmotionDecrementable(emotion);
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
