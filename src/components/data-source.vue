<documentation>
	The data source is the base element that abilities are attached to. When enabled, their multipliers are applied to the score calculation.
	
	Properties
	model: A data source model.
</documentation>

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
	import _ from 'lodash'
	import app from '../app.vue'
	import AbilitySocket from './ability-socket.vue'
	
	export default {
	  name: 'data-source',
	  components: {
	    AbilitySocket
	  },
	  props: {
	    model: Object
	  },
	  computed: {
	    abilities: function() {
		    var abilitiesIDs = _.map(this.events, 'abilitiesId');
		    return _.filter(app.abilities, function(o) { return _.indexOf(abilitiesIDs, o.id) >= 0; });
	    },
	  	events: function() {
		    return _.filter(app.events, { type: 'abilities', dataSourcesId: this.model.id, active: true });
	    },
	  	event: function() {
		    return _.find(app.events, { type: 'dataSources', dataSourcesId: this.model.id, active: true });
	    },
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#data-source {
	  background: green;
	}
</style>
