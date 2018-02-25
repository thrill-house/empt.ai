<docs>
### Game events

The component lists all events associated with the game that are stored in the global data store. This is a helper component that won't be used as an interface element.
</docs>

<template>
  <div id="game-score">
	  <h4 v-if="elapsed">Elapsed: <output>{{ elapsed }}</output></h5>
    <h5 v-if="data">Data: <output>{{ data }}</output> <output class="em">{{ dataPerSecond }}/s</output></h5>
    <h5 v-if="confidence">Confidence: <output>{{ confidence }}</output> <output class="em">{{ confidencePerSecond }}/s</output></h5>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-score',
	  created: function () {
			var self = this;
			window.setInterval(function () {
				self.$data.now = Date.now();
			}, 1000);
	  },
	  data: function() {
		  start: Date.now(),
	    now: Date.now()
	  },
	  store,
	  computed: {
		  elapsed: {
			  get: function() {
				  return Math.round((this.now - this.start) / 1000);
			  },
			  set: function(elapsed) {
				  this.start = this.now - elapsed;
			  },
			},
		  currentScore: function() {
			  return this.score.getBefore(this.now);
		  },
		  data: function() {
			  return this.currentScore.data;
		  },
		  confidence: function() {
			  return this.currentScore.confidence;
		  },
		  dataPerSecond: function() {
			  return this.currentScore.dataPerSecond;
		  },
		  confidencePerSecond: function() {
			  return this.currentScore.confidencePerSecond;
		  },
		  ...mapState(['score'])
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-score {
	}
</style>
