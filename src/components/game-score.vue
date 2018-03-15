<docs>
### Game score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<game-score></game-score>`

---
</docs>

<template>
  <div id="game-score" class="body">
    <h5 v-if="data">Data: <output>{{ data | bits }}</output></h5>
    <h5 v-if="confidence">Confidence: <output>{{ confidence }}</output></h5>
  </div>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'game-score',
	  store,
	  computed: {
		  scores: function() {
			  return this.getScores();
		  },
		  data: function() {
			  return this.scores.data;
		  },
		  confidence: function() {
			  return this.scores.confidence;
		  },
			...mapGetters(['getScores'])
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-score {
	}
</style>
