<docs>
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`

---
</docs>

<template>
  <div id="game-factors" class="body">
    <h5>Bandwidth: <output>{{ bandwidth }}/s</output></h5>
    <h5>Processor: <output>{{ processor }}</output></h5>
    <h5 v-if="journalCitations > 1">Journal citations: <output>{{ journalCitations }}</output></h5>
    <h5 v-if="returnOnInvestment > 1">Return on investment: <output>{{ returnOnInvestment }}</output></h5>
    <h5 v-if="approvalRating > 1">Approval rating: <output>{{ approvalRating }}</output></h5>
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
		  factors: function() {
			  return this.getFactors();
		  },
		  bandwidth: function() {
			  return this.factors.bandwidth;
		  },
		  processor: function() {
			  return this.factors.processor;
		  },						
		  journalCitations: function() {
			  return this.factors.journalCitations;
		  },
		  returnOnInvestment: function() {
			  return this.factors.returnOnInvestment;
		  },
		  approvalRating: function() {
			  return this.factors.approvalRating;
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
