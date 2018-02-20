<documentation>
	The enabled ability is an ability that is currently enabled within a socket.
	
	Properties
	model: An ability model.
</documentation>

<template>
  <div id="enabled-ability">
    <h5>
      {{ model.label }}
      <em v-if="model.type">— {{ model.type }}</em>
    </h5>
  </div>
</template>

<script>
	import app from '../app.vue'
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    model: Object
	  },
	  computed: {
		  event: function() {
		    return _.find(app.events, { type: 'abilities', abilitiesId: this.model.id, active: true });
	    },
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#enabled-ability {
	  background: green;
	}
</style>
