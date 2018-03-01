<docs>
---
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`
---
</docs>

<template>
  <div id="game-factors" class="body">
    <h5 v-if="bandwidth">Bandwidth: <output>{{ bandwidth }}</output></h5>
    <h5 v-if="processor">Processor: <output>{{ processor }}</output></h5>
    <h5 v-if="journalCitations">Journal citations: <output>{{ journalCitations }}</output></h5>
    <h5 v-if="returnOnInvestment">Return on investment: <output>{{ returnOnInvestment }}</output></h5>
    <h5 v-if="approvalRating">Approval rating: <output>{{ approvalRating }}</output></h5>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-factors',
	  store,
	  computed: {
		  bandwidth: function() {
			  return this.getFactors().bandwidth;
		  },
		  processor: function() {
			  return this.getFactors().processor;
		  },
		  journalCitations: function() {
			  return this.getFactors().journalCitations;
		  },
		  returnOnInvestment: function() {
			  return this.getFactors().returnOnInvestment;
		  },
		  approvalRating: function() {
			  return this.getFactors().approvalRating;
		  },
		  ...mapGetters(['getFactors'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-factors {
	}
</style>
