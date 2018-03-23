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
  <enabled-ability v-if="event" :label="abilityLabel"></enabled-ability>
  <div v-else class="ability-socket">
	  <select  v-if="!selectedLabel" v-model="selectedLabel">
			<option disabled value="">Choose</option>
		  <option v-for="(ability, index) in abilities" :value="index">
		  	{{ ability.name }}
		  </option>
		</select>
		<template v-else>
			{{ sumEmotions }}
			<p class="green">0 <input type="range" v-model.number="selectedHappiness" min="0" :max="maximumHappiness"> {{ maximumHappiness }}</p>
		  <p class="green">0 <input type="range" v-model.number="selectedSadness" min="0" :max="maximumSadness"> {{ maximumSadness }}</p>
		  <p class="red">0 <input type="range" v-model.number="selectedTenderness" min="0" :max="maximumTenderness"> {{ maximumTenderness }}</p>
		  <p class="red">0 <input type="range" v-model.number="selectedAnger" min="0" :max="maximumAnger"> {{ maximumAnger }}</p>
		  <p class="yellow">0 <input type="range" v-model.number="selectedExcitement" min="0" :max="maximumExcitement"> {{ maximumExcitement }}</p>
		  <p class="yellow">0 <input type="range" v-model.number="selectedFear" min="0" :max="maximumFear"> {{ maximumFear }}</p>
		  <button @click="submitEvent">Submit</button>
		  <button @click="selectedLabel = ''">Cancel</button>
		</template>
  </div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import EnabledAbility from './enabled-ability.vue'
		
	export default {
	  name: 'ability-slot',
	  store,
	  components: {
	    EnabledAbility
	  },
	  props: {
	    label: String
	  },
	  data: function () {
		  return {
		    selectedLabel: '',
		    selectedHappiness: 0,
		    selectedSadness: 0,
		    selectedTenderness: 0,
		    selectedAnger: 0,
		    selectedExcitement: 0,
		    selectedFear: 0
		  }
		},
	  computed: {
		  dataSocket: function() {
			  return this.getSocketForSlot(this.label);
		  },
		  event: function() {
		    return this.getEventOfType(this.label, 'ability', 'dataSocketSlot');
	    },
		  abilityLabel: function() {
		    return this.event? this.event.label: '';
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
		  ...mapGetters(['getEventOfType', 'getSlots', 'getSocketForSlot'])
	  },
	  methods: {
		  getMaximumEmotion: function(emotion, complementary) {
		  	return (complementary > 0)? 0: ((emotion == 2 || (this.sumEmotions - emotion <= 2 && this.maximumEmotion < 2))? 2: 1);
	    },
	    submitEvent: function() {
			  if(this.sumEmotions === 4) {
				  var event = {
			      type: 'ability',
			      label: this.selectedLabel,
			      happiness: this.selectedHappiness,
			      sadness: this.selectedSadness,
			      tenderness: this.selectedTenderness,
			      anger: this.selectedAnger,
			      excitement: this.selectedExcitement,
			      fear: this.selectedFear,
			      dataSocket: this.dataSocket.label,
			      dataSocketSlot: this.label
			    };
			    
			    if(this.addEvent(event)) {
					  //Doesn't return boolean, so should be put somewhere else.
					  this.activateInitFactor('influence');
				  }
			  } else {
				  alert('Fill in all emotions');
			  }
		  },
		  ...mapActions(['addEvent', 'activateInitFactor'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	.ability-socket {
	  position: relative;
		text-align: center;
	  width: 162px; 
	  height: 187px;
	  padding: 30px 10px;
	  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
		background: radial-gradient($light, $sky);
	  color: $dark;
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
</style>
