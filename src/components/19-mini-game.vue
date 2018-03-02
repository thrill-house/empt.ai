<docs>
### Mini-game
Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation
`<mini-game></mini-game>`

---
</docs>

<template>
  <div id="mini-game">
	  ...
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'mini-game',
	  store
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#mini-game {
	}
</style>
