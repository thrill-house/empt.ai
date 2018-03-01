<docs>
### Playing field
The component displays all **data sockets**, **socket slots** and **enabled abilities** on the field in their correct locations.

##### Instantiation
`<playing-field></playing-field>`

---
</docs>

<template>
  <div id="playing-field">
	  ...
  </div>
</template>

<script>
	import moment from 'moment'
	import math from 'mathjs'
	import { mapState } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'playing-field',
	  store,
	  computed: mapState(['eras', 'dataSources', 'abilities'])
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#playing-field {
	}
</style>
