<docs>
	### The enabled ability is an ability that is currently enabled within a socket.
	- `model` An ability model.
</docs>

<template>
  <div id="enabled-ability">
    <h5>
      {{ model.label }}
      <em v-if="model.type">— {{ model.type }}</em>
    </h5>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    model: Object
	  },
	  store,
	  computed: {
		  event: function() {
		    return _.find(this.events, { type: 'abilities', abilitiesId: this.model.id, active: true });
	    },
		  ...mapState(['events']),
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#enabled-ability {
	  background: $ability;
	}
</style>
