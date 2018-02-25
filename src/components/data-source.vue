<docs>
### Data source

The data source is the base element that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Attributes

- `label` — A label referring to a data source in the global store.
</docs>

<template>
  <div id="data-source">
    {{ event }}
    <h4>
      {{ dataSource.name }}
      <em v-if="dataSource.type">— {{ dataSource.type }}</em>
    </h4>
		<div class="sockets">
      <ability-socket
        v-for="(socket, index) in dataSource.sockets"
        :key="index"
        :label="socket">
      </ability-socket>
    </div>
  </div>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	import AbilitySocket from './ability-socket.vue'
	
	export default {
	  name: 'data-source',
	  store,
	  components: {
	    AbilitySocket
	  },
	  props: {
	    label: String
	  },
	  computed: {
	    dataSource: function() {
		    return this.dataSources[this.label];
	    },
	  	event: function() {
		    //return _.find(this.getEvents('data-source'), { dataSource: this.label });
		    return _.find(this.gameSession.events, { type: 'data-source', dataSource: this.label });
		    
	    },
		  ...mapState(['gameSession', 'dataSources']),
		  //...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#data-source {
	  background: $source;
	}
</style>
