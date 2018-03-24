<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability></available-ability>`

---
</docs>

<template>
  <div class="available-ability">
	  {{ ability.name }}
	  <div class="add">
			{{ sumEmotions }}
			<p class="green">0 <input type="range" v-model.number="selectedHappiness" min="0" :max="maximumHappiness"> {{ maximumHappiness }}</p>
		  <p class="green">0 <input type="range" v-model.number="selectedSadness" min="0" :max="maximumSadness"> {{ maximumSadness }}</p>
		  <p class="red">0 <input type="range" v-model.number="selectedTenderness" min="0" :max="maximumTenderness"> {{ maximumTenderness }}</p>
		  <p class="red">0 <input type="range" v-model.number="selectedAnger" min="0" :max="maximumAnger"> {{ maximumAnger }}</p>
		  <p class="yellow">0 <input type="range" v-model.number="selectedExcitement" min="0" :max="maximumExcitement"> {{ maximumExcitement }}</p>
		  <p class="yellow">0 <input type="range" v-model.number="selectedFear" min="0" :max="maximumFear"> {{ maximumFear }}</p>
		  <button @click="submitEvent">Submit</button>
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
	
	export default {
	  name: 'available-ability',
	  store,
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
		    selectedFear: 0
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
		  	return (complementary > 0)? 0: ((emotion == 2 || (this.sumEmotions - emotion <= 2 && this.maximumEmotion < 2))? 2: 1);
	    },
	    submitEvent: function() {
			  if(this.sumEmotions === 4) {
				  var event = {
			      type: 'ability',
			      label: this.label,
			      instance: this.label + '-' + _.now(),
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
		
	}
</style>
