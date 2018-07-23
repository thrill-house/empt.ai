<docs>
### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`

---
</docs>

<template>
  <div id="ability-library">
	  <template v-for="(ability, index) in abilities">
	  	<div v-if="getAbilityEvents(index).length" class="list">
			  <h5>{{ ability.name }}</h5>
			  <button class="m-1" :class="[{'bg-orange': abilityEvent.instance == selectedInstance}]" v-for="abilityEvent in getAbilityEvents(index)" @click="selectAbility(abilityEvent.label, abilityEvent.instance)">
				  <emotion-diagram
					  :happiness="abilityEvent.happiness"
					  :sadness="abilityEvent.sadness"
					  :excitement="abilityEvent.excitement"
					  :fear="abilityEvent.fear"
					  :tenderness="abilityEvent.tenderness"
					  :anger="abilityEvent.anger"
					  class="w-8"></emotion-diagram>
			  </button>
		  </div>
	  </template>
  </div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import AvailabileAbility from './available-ability.vue'
	import EmotionDiagram from './emotion-diagram.vue'
	
	export default {
	  name: 'ability-library',
	  store,
	  components: {
	    AvailabileAbility,
	    EmotionDiagram
	  },
	  computed: {
		  abilityEvents: function() {
		    return this.getAbilityEvents(this.selectedAbility);
	    },
	    selectedAbility: function() {
		    return this.getInteraction('selectedAbility');
	    },
	    selectedLabel: function() {
		    return this.selectedAbility? this.selectedAbility.label: '';
	    },
	    selectedInstance: function() {
		    return this.selectedAbility? this.selectedAbility.instance: '';
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getAbilityEvents', 'getInteraction'])
	  },
	  methods: {
		  selectAbility: function(label, instance) {
			  this.setInteraction({
				  interaction: 'selectedAbility',
				  label: label,
					instance: instance
				});
		  },
		  ...mapActions(['setInteraction']),
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#ability-library {
	}
</style>
