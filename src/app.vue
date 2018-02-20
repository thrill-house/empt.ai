<documentation>
	This is the app component that controls the display of all the child components. Generally, this file won't need to be changed very often. 
</documentation>

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
			  <h3>Test</h3>
			  <div class="manipulators">
				  <p><label>message: <input v-model="message" /></label></p>
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
		  <ability-socket :model="sampleAbilitySocket"></ability-socket>
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
				message: 'Test'
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
		  localComputed() {
			  return {
				  sampleDataSource: function() {
					  return _.find(this.dataSources, { id: 1 });
				  },
				  sampleAbilitySocket: function() {
					  return _.head(this.sampleDataSource.sockets);
				  },
				  sampleEnabledAbility: function() {
					  return _.find(this.abilities, { id: 1 });
				  }
			  }
		  },
		  ...mapState(['options', 'dataSources', 'abilities', 'events']),
		}
	}
</script>

<style lang="scss">
	@import './assets/scss/default';
	
	#app {
		display: grid;
		grid-gap: 2rem;
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
		  
		  h1 {
			  font-size: 2rem;
			  line-height: 1.5;
		  }
		  
		  h2 {
			  font-size: 1.5rem;
			  line-height: 1.5;
		  }
	  }
	  
	  > section {
		  display: grid;
			grid-gap: 1rem;
			
			header {
				h3 {
				  font-size: 1.25rem;
				  line-height: 1.5;
			  }
			  
			  .manipulators {
				  position: relative;
				  margin: 2rem 0 1rem;
				  
			  	&:before {
				  	content: "Manipulate";
				  	position: absolute;
				  	top: -1rem;
				  	font-size: 0.75rem;
					  line-height: 1;
					  font-style: italic;
			  	}
			  	
			  	label {
				  	font-weight: bold;
			  	}
			  	
				  input {
					  font-size: 1rem;
					  line-height: 1.5;
					  padding: 0.5rem;
				  }
			  }
			}
	  }
	}
</style>
