<docs>
### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`

---
</docs>

<template>
  <div id="ability-library">
	  <available-ability :label="index" :key="index" v-for="(ability, index) in abilities" class="mb-4 pb-4 border-b-4 border-solid border-orange"></available-ability>
  </div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import AvailableAbility from './available-ability.vue'
	
	export default {
	  name: 'ability-library',
	  store,
	  components: {
	    AvailableAbility
	  },
	  computed: {
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
		  ...mapGetters(['getInteraction'])
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
