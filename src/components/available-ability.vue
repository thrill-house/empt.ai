<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability></available-ability>`

---
</docs>

<template>
  <div class="available-ability">
	  <header class="flex items-center mb-2">
	    <h4 class="mr-2">{{ ability.name }}</h4>
	    <output class="output">{{ ability.type }}</output>
	    <output class="output bg-orange text-peach">{{ ability.era }}</output>
    </header>
		<div class="emotions my-8 w-64">
			<emotion-diagram
			  :happiness="selectedHappiness"
			  :sadness="selectedSadness"
			  :excitement="selectedExcitement"
			  :fear="selectedFear"
			  :tenderness="selectedTenderness"
			  :anger="selectedAnger"
			  :scale="2"></emotion-diagram>
			<div class="axis axis-happiness">
				<input type="range" v-model.number="selectedHappiness" min="0" :max="maximumHappiness" :class="'max-' + maximumHappiness">
				<label class="label">Happiness</label>
			</div>
		  <div class="axis axis-sadness">
			  <input type="range" v-model.number="selectedSadness" min="0" :max="maximumSadness" :class="'max-' + maximumSadness">
			  <label class="label">Sadness</label>
		  </div>
		  <div class="axis axis-tenderness">
			  <input type="range" v-model.number="selectedTenderness" min="0" :max="maximumTenderness" :class="'max-' + maximumTenderness">
			  <label class="label">Tenderness</label>
		  </div>
		  <div class="axis axis-anger">
			  <input type="range" v-model.number="selectedAnger" min="0" :max="maximumAnger" :class="'max-' + maximumAnger">
			  <label class="label">Anger</label>
		  </div>
		  <div class="axis axis-excitement">
			  <input type="range" v-model.number="selectedExcitement" min="0" :max="maximumExcitement" :class="'max-' + maximumExcitement">
			  <label class="label">Excitement</label>
		  </div>
		  <div class="axis axis-fear">
			  <input type="range" v-model.number="selectedFear" min="0" :max="maximumFear" :class="'max-' + maximumFear">
			  <label class="label">Fear</label>
		  </div>
		</div>
		<div class="w-64">
			<button @click="submitEvent" :class="{'cursor-wait': (!enoughEmotions || !affordable)}" class="button bg-peach text-light relative w-full" :disabled="!enoughEmotions || !affordable">
				<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-orange rounded z-0"></span>
				<span class="relative z-10">
					<template v-if="sumEmotions != requiredEmotions">{{ sumEmotions }} / {{ requiredEmotions }} emotions</template>
					<template v-else-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
					<template v-else>Research</template>
				</span>
			</button>
		</div>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import EmotionDiagram from './emotion-diagram.vue'
	
	export default {
	  name: 'available-ability',
	  store,
	  components: {
	    EmotionDiagram
	  },
	  props: {
	    label: String
	  },
	  data: function () {
		  return {
		    selectedHappiness: 0,
		    selectedSadness: 0,
		    selectedTenderness: 0,
		    selectedAnger: 0,
		    selectedExcitement: 0,
		    selectedFear: 0,
		    requiredEmotions: 4
		  }
		},
	  computed: {
		  events: function() {
		    return this.getEventsOfType(this.label, 'ability');
	    },
	    ability: function() {
		    return this.getAbility(this.label);
	    },
	    allEmotions: function() {
		    return [this.selectedHappiness, this.selectedTenderness, this.selectedExcitement, this.selectedSadness, this.selectedAnger, this.selectedFear];
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
		    return this.getMaximumEmotion(this.selectedHappiness, this.selectedSadness);
	    },
	    maximumSadness: function() {
		    return this.getMaximumEmotion(this.selectedSadness, this.selectedHappiness);
	    },
	    maximumTenderness: function() {
		    return this.getMaximumEmotion(this.selectedTenderness, this.selectedAnger);
	    },
	    maximumAnger: function() {
		    return this.getMaximumEmotion(this.selectedAnger, this.selectedTenderness);
	    },
	    maximumExcitement: function() {
		    return this.getMaximumEmotion(this.selectedExcitement, this.selectedFear);
	    },
	    maximumFear: function() {
		    return this.getMaximumEmotion(this.selectedFear, this.selectedExcitement);
	    },
	    affordability: function() {
		    return _.clamp((this.scores.confidence / this.costs.confidence * 100), 0, 100);
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
	    newEvent : function() {
		    return {
			    type: 'ability',
		      label: this.label,
		      target: false,
		      happiness: this.selectedHappiness,
		      sadness: this.selectedSadness,
		      tenderness: this.selectedTenderness,
		      anger: this.selectedAnger,
		      excitement: this.selectedExcitement,
		      fear: this.selectedFear
		    }
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getEventsOfType', 'getAbility', 'getAbilityCosts', 'getScores'])
	  },
	  methods: {
		  getMaximumEmotion: function(emotion, complementary) {
		  	return (complementary > 0)? 0: ((emotion == this.requiredEmotions / 2 || (this.sumEmotions - emotion <= this.requiredEmotions / 2 && this.maximumEmotion < this.requiredEmotions / 2))? this.requiredEmotions / 2: 1);
	    },
	    submitEvent: function() {
			  if(this.sumEmotions === this.requiredEmotions) {
				  var event = _.create(this.newEvent, {
			      instance: this.label + '-' + _.now()
			    });
			    
			    this.addAbilityEvent(event);
			  } else {
				  alert('Fill in all emotions');
			  }
		  },
		  ...mapActions(['addAbilityEvent'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/default';
	
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
			
			.axis {
				@apply .absolute .-mt-1;
				left: 50%;
				top: 50%;
				width:  50% * 27 / 25;
				transform-origin: center left;
					
				&.axis-happiness {
					transform: rotate(270deg);
				}
				
				&.axis-tenderness {
					transform: rotate(180deg + (30deg * 25 / 27));
				}
				
				&.axis-excitement {
					transform: rotate(-30deg * 25 / 27);
				}
				
				&.axis-sadness {
					transform: rotate(90deg);
				}
				
				&.axis-fear {
					transform: rotate(180deg + (-30deg * 25 / 27));
				}
				
				&.axis-anger {
					transform: rotate(30deg * 25 / 27);
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
					@apply .absolute .pin-b .pin-r .mb-2 .-mr-4 .text-xs .bg-sky;
					transform-origin: bottom right;
					transform: scale(0.75);
				}
			}
		}
	}
</style>
