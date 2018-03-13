<docs>
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="data-socket-slot-label"></enabled-ability>`

---
</docs>

<template>
  <div id="enabled-ability">
    <template v-if="event">
      {{ ability.name }}
      <em v-if="ability.type">— {{ ability.type }}</em>
    </template>
    <div v-else>No valid event for ability.</div>
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    label: String
	  },
	  store,
	  computed: {
		  ability: function() {
		    return this.abilities[this.label];
	    },
	  	event: function() {
		    return _.find(this.getEvents(), { type: 'ability', ability: this.label });
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#enabled-ability {
		text-align: center;
	}
</style>
