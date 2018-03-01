<docs>
---
### Data socket
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<data-socket label="data-socket-label"></data-socket>`
---
</docs>

<template>
  <div id="data-socket">
    <div v-if="event">
	    <h4>
	      {{ dataSocket.name }}
	      <em v-if="dataSocket.type">— {{ dataSocket.type }}</em>
	    </h4>
			<div class="slots">
	      <ability-slot
	        v-for="(socket, index) in dataSocket.slots"
	        :key="index"
	        :label="socket">
	      </ability-slot>
	    </div>
    </div>
    <div v-else>Socket not yet enabled.</div>
  </div>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	import AbilitySlot from './7-ability-slot.vue'
	
	export default {
	  name: 'data-socket',
	  store,
	  components: {
	    AbilitySlot
	  },
	  props: {
	    label: String
	  },
	  computed: {
	    dataSocket: function() {
		    return this.dataSockets[this.label];
	    },
	  	event: function() {
		    return _.find(this.getEvents('data-socket'), { dataSocket: this.label });
	    },
		  ...mapState(['dataSockets']),
		  ...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#data-socket {
	  background: $source;
	}
</style>
