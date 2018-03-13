<docs>
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
    <template v-if="event">
	    <div class="data-socket">
		    <div class="name">
			      {{ dataSocket.name }}
			      <em v-if="dataSocket.type">({{ dataSocket.type }})</em>
		    </div>
		    <div class="multipliers">
			    <template v-for="(value, multiplier) in dataSocket.multipliers">
				    {{ multiplier }}: <strong>{{ value }}</strong>
			    </template>
		    </div>
		    <a href="#" class="minigame">
			    mini game
		    </a>
	    </div>
			<div class="slots">
	      <ability-slot
	        v-for="(socket, index) in dataSocket.slots"
	        :key="index"
	        :label="socket">
	      </ability-slot>
	    </div>
    </template>
    <template v-else>Socket not yet enabled.</template>
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
		    return _.find(this.getEvents(), { type: 'data-socket', dataSocket: this.label });
	    },
		  ...mapState(['dataSockets']),
		  ...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#data-socket {
	  .data-socket {
		  position: relative;
		  width: 215px;
			height: 215px;
			padding: 0 0 0 47.5px;
		  
		  .name, .multipliers, .minigame {
			  width: 120px;
			  height: 120px;
			  padding: 20px 5px;
			  color: $light;
			  position: absolute;
			  text-align: center;
			  box-shadow: inset 0 0 20px rgba($orange, 0.6);
		  }
		  
		  .name {
			  background: lighten($orange, 15%);
			  transform: rotate(-45deg) skew(15deg, 15deg);
		  }
		  
		  .multipliers {
			  text-transform: capitalize;
			  background: lighten($orange, 10%);
			  transform: rotate(15deg) skew(15deg, 15deg) translate(-50%, 100%);
		  }
		  
		  .minigame {
			  background: lighten($orange, 5%);
			  transform: rotate(-15deg) skew(-15deg, -15deg) translate(50%, 100%);
		  }
	  }
	  
	  .slots {
		  position: relative;
		  top: -215px;
		  left: 50%;
		  
		  * + * {
			  margin-left: 107.5px;
			  margin-top: -60px;
		  }
		  
		  > *:last-child {
			  margin-left: -107.5px;
			  margin-top: -240px;
		  }
	  }
	}
</style>
