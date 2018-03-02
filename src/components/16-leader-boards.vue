<docs>
### Leader board
Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation
`<leader-board></leader-board>`

---
</docs>

<template>
  <div id="leader-board">
	  ...
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'leader-board',
	  store
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#leader-board {
	}
</style>
