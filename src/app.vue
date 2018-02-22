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
			  <div v-html="docs.test" class="docs"></div>
			  <div class="tweakers">
					<label for="test-message">Message</label>
					<input id="test-message" v-model="message" />
				</div>
		  </header>
		  <test :message="message"></test>
	  </section>
	  
	  <section>
		  <header>
			  <h3>Data source</h3>
		  </header>
		  <data-source :model="sampleDataSource"></data-source>
	  </section>
	  
	  <section>
		  <header>
			  <h3>Ability socket</h3>
		  </header>
		  <ability-socket :model="sampleAbilitySocket" :event="sampleAbilityEvent" :ability="sampleEnabledAbility"></ability-socket>
	  </section>
	  
	  <section>
		  <header>
			  <h3>Enabled Ability</h3>
		  </header>
		  <enabled-ability :model="sampleEnabledAbility"></enabled-ability>
	  </section>
	</main>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'
	
	import Test from './components/test.vue'
	import DataSource from './components/data-source.vue'
	import AbilitySocket from './components/ability-socket.vue'
	import EnabledAbility from './components/enabled-ability.vue'
	
	import store from './store'
	
	export default {
	  name: 'app',
	  data: function() {
		  return {
			  message: 'This and that'
		  }
	  },
	  store,
	  components: {
	    Test,
	    DataSource,
	    AbilitySocket,
	    EnabledAbility
	  },
	  computed: {
		  docs: function() {
				return _.transform(this.$options.components, function(result, component) {
					result[component.name] = component.__docs;
				});
		  },
		  tweakers: function() {
				return _.transform(this.$options.components, function(result, component) {
					result[component.name] = component.__tweakers;
				});
		  },
		  sampleDataSource: function() {
			  return _.head(this.dataSources);
		  },
		  sampleAbilityEvent: function() {
			  return _.find(this.events, { type: 'abilities' });
		  },
		  sampleAbilitySocket: function() {
			  return _.head(this.sampleDataSource.sockets);
		  },
		  sampleEnabledAbility: function() {
			  return _.head(this.abilities);
		  },
		  ...mapState(['options', 'dataSources', 'abilities', 'events']),
		}
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
			font-family: 'Menlo', 'Courier', monospace;
			align-items: center;
			
		  .logo {
				max-width: 100%;
				height: auto;
		  }
	  }
	  
	  > section {
		  display: grid;
			grid-gap: 1rem;
			padding: 2rem 0;
			border-bottom: 3px solid $sky;
			
			header {
				.docs {
					* + * {
						margin-top: 1rem;
					}
					
					& + .tweakers {
						margin-top: 2rem;
					}
				}
			}
	  }
	}
</style>
