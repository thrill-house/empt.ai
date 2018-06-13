<docs>
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`

---
</docs>

<template>
  <div id="game-factors" class="body">
    <template v-if="factors.bandwidth > 0">
	    <label class="label">Bandwidth</label><output class="output">+{{ factors.bandwidth|bandwidth }}</output>
    </template>
    <template v-if="factors.influence > 0">
	    <hr>
	    <label class="label">Influence</label><output class="output">+{{ factors.influence|influence }}</output>
    </template>
    <template v-if="factors.journalCitations > 0">
	    <hr>
	    <label class="label">Science boost</label><output class="output">+{{ factors.journalCitations|journalCitations }}</output>
	  </template>
	  <template v-if="factors.returnOnInvestment > 0">
	    <hr>
	    <label class="label">Economy boost</label><output class="output">+{{ factors.returnOnInvestment|returnOnInvestment }}</output>
	  </template>
	  <template v-if="factors.approvalRating > 0">
	    <hr>
	    <label class="label">Society boost</label><output class="output">+{{ factors.approvalRating|approvalRating }}</output>
    </template>
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
