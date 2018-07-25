<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability label="ability-label"></available-ability>`

---
</docs>

<template>
  <div v-if="ability && eraActive" class="available-ability w-64">
	  <header class="flex items-center mb-2 pb-2 border-b border-solid border-orange">
	    <h4 class="mr-2">{{ ability.name }}</h4>
	    <output class="output">{{ ability.type }}</output>
	    <output class="output bg-orange text-peach">{{ ability.era }}</output>
    </header>
    <div class="">
	    <h6 class="mb-2">Multipliers</h6>
	    <div class="flex pb-2 border-b border-solid border-orange">
		    <output class="output" v-for="(value, factor) in factors" v-if="value.base > 0">
			    +{{ prettyUnit(value.base, factor) }}
		    </output>
	    </div>
	    <template v-if="trees">
		    <h6 class="my-2">Tree boosts</h6>
			  <div class="flex pb-2 border-b border-solid border-orange">
			    <output class="output" v-for="(value, tree) in trees" v-if="value > 1">
				    +{{ prettyUnit(value, tree) }}
			    </output>
			  </div>
	    </template>
	    <template v-if="dependencies">
		    <h6 class="my-2">Boosted by</h6>
			  <div class="flex pb-2 border-b border-solid border-orange">
			    <output class="output" v-for="(value, dependency) in dependencies">
				  	gains +{{ value|percentage }} with "{{ getAbility(dependency).name }}"
			    </output>
			  </div>
	    </template>
	    <template v-if="dependants">
		    <h6 class="my-2">Boosts</h6>
			  <div class="flex pb-2 border-b border-solid border-orange">
			    <output class="output" v-for="(value, dependant) in dependants">
				  	provides "{{ getAbility(dependant).name }}" with +{{ value|percentage }}
			    </output>
			  </div>
	    </template>
    </div>
    <div class="flex justify-between mt-4">
			<research-ability :label="label"></research-ability>
			<install-ability :label="label"></install-ability>
    </div>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import ResearchAbility from './research-ability.vue'
	import InstallAbility from './install-ability.vue'
	
	export default {
	  name: 'available-ability',
	  store,
	  components: {
	    ResearchAbility,
	    InstallAbility
	  },
	  props: {
	    label: String
	  },
	  computed: {
		  ability: function() {
		    return this.getAbility(this.label);
	    },
	    factors: function() {
		    return this.ability.factors;
	    },
	    influence: function() {
		    return this.factors.influence;
	    },
	    trees: function() {
		    return this.influence.trees;
	    },
	    dependencies: function() {
		    return this.influence.dependencies;
	    },
	    dependants: function() {
		    return this.getAbilityDependants(this.label);
	    },
	    era: function() {
		  	return this.ability.era;
	    },
	    eraActive: function() {
		  	return this.isEraActive(this.era);
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getAbility', 'isEraActive', 'getAbilityDependants', 'prettyUnit'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/default';
	
	.available-ability {
		
	}
</style>
