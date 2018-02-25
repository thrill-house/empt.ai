<docs>
### Enabled ability

The enabled ability is an ability that is currently enabled within a socket.

##### Attributes

- `label` — An ability model
</docs>

<template>
  <div id="enabled-ability">
    {{ event }}
    <h5>
      {{ ability.name }}
      <em v-if="ability.type">— {{ ability.type }}</em>
    </h5>
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
		    //return _.find(this.getEvents('ability'), { ability: this.label });
		    console.log(this.gameSession.events);
		    return _.find(this.gameSession.events, { type: 'data-source', ability: this.label });
	    },
		  ...mapState(['gameSession', 'abilities']),
		  //...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#enabled-ability {
	  background: $ability;
	}
</style>
