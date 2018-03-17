<docs>
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`

---
</docs>

<template>
  <div id="game-factors" class="body">
    <h5>Bandwidth: <output>{{ factors.bandwidth|bandwidth }}</output></h5>
    <h5>Processor: <output>{{ factors.processor|processor }}</output></h5>
    <h5 v-if="factors.journalCitations">Journal citations: <output>{{ factors.journalCitations|journalCitations }}</output></h5>
    <h5 v-if="factors.returnOnInvestment">Return on investment: <output>{{ factors.returnOnInvestment|returnOnInvestment }}</output></h5>
    <h5 v-if="factors.approvalRating">Approval rating: <output>{{ factors.approvalRating|approvalRating }}</output></h5>
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
		  ...mapGetters(['getFactors'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-factors {
	}
</style>
