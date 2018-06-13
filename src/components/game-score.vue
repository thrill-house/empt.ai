<docs>
### Game score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<game-score></game-score>`

---
</docs>

<template>
  <div id="game-score" class="body">
    <label class="label">Data</label><output class="output">{{ scores.data|data }}</output><output class="output">+{{ factors.bandwidth|bandwidth }}</output>
    <hr>
    <label class="label">Confidence</label><output class="output">{{ scores.confidence|confidence }}</output><output class="output">+{{ factors.persuasion|persuasion }}</output>
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
		  factors: function() {
			  return this.getFactors();
		  },
		  scores: function() {
			  return this.getScores();
		  },
			...mapGetters(['getScores', 'getFactors'])
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-score {
	}
</style>
