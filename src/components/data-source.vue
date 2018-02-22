<docs>
	### The data source is the base element that abilities are attached to. When enabled, their multipliers are applied to the score calculation.
	- `model` A data source model.
</docs>

<template>
  <div id="data-source">
    <h4>
      {{ model.label }}
      <em v-if="model.type">— {{ model.type }}</em>
    </h4>
		<div class="sockets">
      <ability-socket
        v-for="(socket, index) in model.sockets"
        :key="index"
        :model="socket">
      </ability-socket>
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'
	import AbilitySocket from './ability-socket.vue'
	import store from '../store'
	
	export default {
	  name: 'data-source',
	  store,
	  components: {
	    AbilitySocket
	  },
	  props: {
	    model: Object
	  },
	  computed: {
	    abilities: function() {
		    var abilitiesIDs = _.map(this.events, 'abilitiesId');
		    return _.filter(this.abilities, function(o) { return _.indexOf(abilitiesIDs, o.id) >= 0; });
	    },
	  	events: function() {
		    return _.filter(this.events, { type: 'abilities', dataSourcesId: this.model.id, active: true });
	    },
	  	event: function() {
		    return _.find(this.events, { type: 'dataSources', dataSourcesId: this.model.id, active: true });
	    },
		  ...mapState(['abilities', 'events']),
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#data-source {
	  background: $source;
	}
</style>
