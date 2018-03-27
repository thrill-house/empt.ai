<docs>
### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`

---
</docs>

<template>
  <div id="ability-library">
	  ...
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	import AvailabileAbility from './available-ability.vue'
	
	export default {
	  name: 'ability-library',
	  store,
	  components: {
	    AvailabileAbility
	  },
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#ability-library {
	}
</style>
