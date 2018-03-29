<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability></available-ability>`

---
</docs>

<template>
  <div class="available-ability">
	  <h4>{{ ability.name }}</h4>
	  <div class="define-emotions">
			<div class="emotions">
				<emotion-diagram
				  :happiness="selectedHappiness"
				  :sadness="selectedSadness"
				  :excitement="selectedExcitement"
				  :fear="selectedFear"
				  :tenderness="selectedTenderness"
				  :anger="selectedAnger"></emotion-diagram>
				<div class="axis axis-happiness">
					<input type="range" v-model.number="selectedHappiness" min="0" :max="maximumHappiness" :class="'max-' + maximumHappiness">
					<label>Happiness</label>
				</div>
			  <div class="axis axis-sadness">
				  <input type="range" v-model.number="selectedSadness" min="0" :max="maximumSadness" :class="'max-' + maximumSadness">
				  <label>Sadness</label>
			  </div>
			  <div class="axis axis-tenderness">
				  <input type="range" v-model.number="selectedTenderness" min="0" :max="maximumTenderness" :class="'max-' + maximumTenderness">
				  <label>Tenderness</label>
			  </div>
			  <div class="axis axis-anger">
				  <input type="range" v-model.number="selectedAnger" min="0" :max="maximumAnger" :class="'max-' + maximumAnger">
				  <label>Anger</label>
			  </div>
			  <div class="axis axis-excitement">
				  <input type="range" v-model.number="selectedExcitement" min="0" :max="maximumExcitement" :class="'max-' + maximumExcitement">
				  <label>Excitement</label>
			  </div>
			  <div class="axis axis-fear">
				  <input type="range" v-model.number="selectedFear" min="0" :max="maximumFear" :class="'max-' + maximumFear">
				  <label>Fear</label>
			  </div>
			</div>
			<h6>Selected {{ sumEmotions }}/{{ requiredEmotions }}</h6>
		  <button @click="submitEvent" v-show="sumEmotions == requiredEmotions">Submit</button>
	  </div>
	  <div v-if="events" class="list">
		  <div v-for="event in events">
			  <h6>Happiness: {{ event.happiness }}</h6>
			  <h6>Sadness: {{ event.sadness }}</h6>
			  <h6>Tenderness: {{ event.tenderness }}</h6>
			  <h6>Anger: {{ event.anger }}</h6>
			  <h6>Excitement: {{ event.excitement }}</h6>
			  <h6>Fear: {{ event.fear }}</h6>
		  </div>
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
		  ...mapState(['abilities']),
		  ...mapGetters(['getEventsOfType', 'getAbility'])
	  },
	  methods: {
		  getMaximumEmotion: function(emotion, complementary) {
		  	return (complementary > 0)? 0: ((emotion == this.requiredEmotions / 2 || (this.sumEmotions - emotion <= this.requiredEmotions / 2 && this.maximumEmotion < this.requiredEmotions / 2))? this.requiredEmotions / 2: 1);
	    },
	    submitEvent: function() {
			  if(this.sumEmotions === this.requiredEmotions) {
				  var event = {
			      type: 'ability',
			      label: this.label,
			      instance: this.label + '-' + _.now(),
			      target: false,
			      happiness: this.selectedHappiness,
			      sadness: this.selectedSadness,
			      tenderness: this.selectedTenderness,
			      anger: this.selectedAnger,
			      excitement: this.selectedExcitement,
			      fear: this.selectedFear
			    };
			    
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
	@import '../assets/scss/variables';
	
	.available-ability {
		width: 300px;
		
		.define-emotions {
			text-align: center;
		
			.emotions {
				position: relative;
				width: 300px;
				height: (187 / 162) * 300px;
				margin: 15px 0;
				
				.emotion-diagram {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
				}
				
				.axis {
					position: absolute;
					left: 50%;
					top: 50%;
					width: 150px;
					margin-top: -9px;
					transform-origin: center left;
						
					&.axis-happiness {
						transform: rotate(-90deg);
					}
					
					&.axis-tenderness {
						transform: rotate(-150deg);
					}
					
					&.axis-excitement {
						transform: rotate(-30deg);
					}
					
					&.axis-sadness {
						transform: rotate(90deg);
					}
					
					&.axis-fear {
						transform: rotate(150deg);
					}
					
					&.axis-anger {
						transform: rotate(30deg);
					}
					
					input {
						display: block;
						width: 100%;
						height: 100%;
						
						&.max-1 {
							width: 55%;
						}
						
						&.max-0 {
							width: 10%;
						}
					}
					
					label {
						position: absolute;
						right: -1rem;
						bottom: 1rem;
						font-size: 0.5rem;
						transform-origin: bottom right;
					}
				}
			}
		}
	}
</style>
