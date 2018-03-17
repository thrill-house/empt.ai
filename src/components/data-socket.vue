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
  <div class="data-socket" :class="{ enabled: event }">
    <div class="details">
	    <div class="name">
		      {{ dataSocket.name }} <output>{{ dataSocket.type }}</output>
	    </div>
	    <div class="multipliers">
		    <output v-for="(value, multiplier) in dataSocket.multipliers">
			    +{{ prettyUnit(value, multiplier) }}
		    </output>
	    </div>
	    <button v-if="event" class="actions">Mini game</button>
	    <button v-else class="actions" @click="activate">
	    	Activate
	    	<output>C:{{ dataSocket.costs.confidence }}</output>
			</button>
    </div>
    <ability-slot
			v-if="event"
      v-for="(socket, index) in dataSocket.slots"
      :key="index"
      :label="index"
      :class="[socket.position, index]">
    </ability-slot>
  </div>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapGetters, mapMutations } from 'vuex'
	import store from '../store'
	import AbilitySlot from './ability-slot.vue'
	
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
		    return this.getDataSocket(this.label);
	    },
	  	event: function() {
		    return this.getEventOfType(this.label, 'data-socket');
	    },
		  ...mapGetters(['getEventOfType', 'getDataSocket', 'prettyUnit'])
	  },
	  methods: {
		  activate: function() {
	      var event = {
		      type: 'data-socket',
		      label: this.label
		    };
		    
	      this.addEvent(event);
	    },
	    ...mapMutations(['addEvent'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	.data-socket {
		display: grid;
		grid-template-rows: repeat(6, 70px);
		grid-template-columns: repeat(6, 81px);
		grid-row-gap: -35px;
		grid-template-areas:
		". a a b b ."
		". a a b b ."
		"c c d d e e"
		"c c d d e e"
		". f f g g ."
		". f f g g .";
		margin-bottom: 47px;
		
	  .details {
		  grid-area: d;
		  width: 162px;
			height: 187px;
			padding: 2px 0 0 36px;
		  
		  .name, .multipliers, .actions {
			  width: 90px;
			  height: 90px;
			  padding: 20px 5px;
			  color: $light;
			  position: absolute;
			  text-align: center;
			  box-shadow: inset 0 0 20px rgba($purple, 0.6);
		  }
		  
		  .name {
			  background: darken($sky, 15%);
			  transform: rotate(-45deg) skew(15deg, 15deg);
		  }
		  
		  .multipliers {
			  text-transform: capitalize;
			  background: darken($sky, 10%);
			  transform: rotate(15deg) skew(15deg, 15deg) translate(-50%, 100%);
		  }
		  
		  .actions {
			  border: none;
			  border-radius: 0;
			  outline: none;
			  cursor: pointer;
			  background: darken($sky, 5%);
			  transform: rotate(-15deg) skew(-15deg, -15deg) translate(50%, 100%);
		  }
	  }
	  
	  &.enabled {
		  .details {
			  .name, .multipliers, .actions {
				  box-shadow: inset 0 0 20px rgba($orange, 0.6);
			  }
			  
			  .name {
				  background: lighten($orange, 15%);
			  }
			  
			  .multipliers {
				  background: lighten($orange, 10%);
			  }
			  
			  .actions {
				  background: lighten($orange, 5%);
			  }
		  }
	  }
	  
	  .top-left {
		  grid-area: a;
	  }
	  
	  .top-right {
		  grid-area: b;
	  }
	  
	  .left {
		  grid-area: c;
	  }
	  
	  .right {
		  grid-area: e;
	  }
	  
	  .bottom-left {
		  grid-area: f;
	  }
	  
	  .bottom-right {
		  grid-area: g;
	  }
	}
</style>
