<docs>
	### This is the app component that controls the display of all the child components. Generally, this file won't need to be changed very often.
</docs>

<template>
	<main id="app">
	  <header>
		  <img src="./assets/img/logo.png" class="logo">
		  <div>
			  <h1>Dash Game — Vue components</h1>
			  <h2>This is the library of all components used to make up the user interface of the Dash Game.</h2>
		  </div>
		</header>
		
	  <section>
		  <header>
			  <h3>Current time</h3>
		  </header>
		  <pre>{{ gameSession }}</pre>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.sampleComponent" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label for="sample-component-message">Message</label>
					<input id="sample-component-message" v-model="message" />
				</div>
		  </header>
		  <sample-component :message="message"></sample-component>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.gameEvents" class="docs"></div>
		  </header>
		  <game-events></game-events>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.dataSource" class="docs"></div>
		  </header>
		  <data-source label="root"></data-source>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.abilitySocket" class="docs"></div>
		  </header>
		  <ability-socket label="root-1"></ability-socket>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.enabledAbility" class="docs"></div>
		  </header>
		  <enabled-ability label="neutral-1"></enabled-ability>
	  </section>
	</main>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapMutations } from 'vuex'
	import store from './store'
	import SampleComponent from './components/sample-component.vue'
	import GameEvents from './components/game-events.vue'
	import DataSource from './components/data-source.vue'
	import AbilitySocket from './components/ability-socket.vue'
	import EnabledAbility from './components/enabled-ability.vue'
	
	export default {
	  name: 'app',
	  data: function() {
		  return {
			  message: 'This and that',
			  start: _.now()
		  }
	  },
	  store,
	  components: {
	    SampleComponent,
	    GameEvents,
	    DataSource,
	    AbilitySocket,
	    EnabledAbility
	  },
	  created: function() {
		  var self = this;
			window.setInterval(function() {
			  self.$store.commit('setNow');
		  }, 1000);
	  },
	  computed: {
		  docs: function() {
				return _.transform(this.$options.components, function(result, component) {
					result[_.camelCase(component.name)] = component.__docs;
				});
		  },
		  ...mapState(['gameSession'])
		},
		watch: {
    	start: function(newTime) {
	    	this.gameSession.start = newTime;
	    	//console.log(this.$store.commit('setStart', newTime));
	      //this.$store.commit('setStart', newTime);
	    }
	  },
	}
</script>

<style lang="scss">
	@import './assets/scss/default';
	
	#app {
		display: grid;
		padding: 2rem;
		justify-content: start;
		
		> header {
			display: grid;
			grid-template-columns: 120px 1fr;
			grid-gap: 2rem;
			padding-bottom: 2rem;
			font-family: 'Menlo', 'Courier', monospace;
			align-items: center;
			border-bottom: 3px solid $purple;
			
		  .logo {
				max-width: 100%;
				height: auto;
		  }
	  }
	  
	  > section {
		  display: grid;
			grid-gap: 1rem;
			padding: 2rem 0;
			border-bottom: 3px solid $purple;
			
			> header {
				border-bottom: 1px solid $sky;
				padding-bottom: 1rem;
				margin-bottom: 1rem;
				
				.tweakers {
					border-top: 1px solid $sky;
					padding-top: 1rem;
				}
				
				* + * {
					margin-top: 1rem;
				}
			}
	  }
	}
</style>
