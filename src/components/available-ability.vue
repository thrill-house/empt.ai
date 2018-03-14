<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability></available-ability>`

---
</docs>

<template>
  <div id="available-ability">
	  ...
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'available-ability',
	  store,
	  computed: mapState(['abilities'])
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#available-ability {
	}
</style>
