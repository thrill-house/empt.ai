<docs>
### Game score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<game-score></game-score>`

---
</docs>

<template>
  <div id="game-score" class="body">
    <h5 v-if="data">Data: <output>{{ data | bits }}</output> @ <output class="em">{{ dataPerSecond | bits }}/s</output></h5>
    <h5 v-if="confidence">Confidence: <output>{{ confidence }}</output> @ <output class="em">{{ confidencePerSecond }}/s</output></h5>
  </div>
</template>

<script>
	import _ from 'lodash'
	import math from 'mathjs'
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'game-score',
	  store,
	  filters: {
		  bits: function (value) {
			  return math.unit(value, 'kb').toString();
			},
			frequency: function (value) {
			  return math.unit(value, 'Hz').toString();
			},
	  },
	  computed: {
		  data: function() {
			  return this.scores().data;
		  },
		  confidence: function() {
			  return this.scores().confidence;
		  },
		  dataPerSecond: function() {
			  return this.scores().dataPerSecond;
		  },
		  confidencePerSecond: function() {
			  return this.scores().confidencePerSecond;
		  },
			...mapGetters({
				scores: 'getScores'
			})
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-score {
	}
</style>
