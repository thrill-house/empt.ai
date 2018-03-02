<docs>
### Emotion diagram
Displays the player's emotional status as a result of their currently enabled abilities on the playing field. 

##### Instantiation
`<emotion-diagram></emotion-diagram>`

---
</docs>

<template>
  <div id="emotion-diagram">
	  ...
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'emotion-diagram',
	  store
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#emotion-diagram {
	}
</style>
