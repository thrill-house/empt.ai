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
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label for="sample-component-message">Start</label>
					<input id="sample-component-message" v-model="start" />
				</div>
		  </header>
		  <h6>Start: <output>{{ gameSession.start }}</output></h6>
		  <h6>Now: <output>{{ gameSession.now }}</output></h6>
		  <pre>
			  {{ events }}
		  </pre>
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
	import moment from 'moment'
	import { mapState } from 'vuex'
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
			this.updateEvents();
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
		  start: {
			  set: function(timestamp) {
				  this.gameSession.start = timestamp * 1;
				  this.updateEvents();
				  //this.$store.commit('gameSession.setStart', timestamp);
				},
			  get: function() {
				  return this.gameSession.start;
				}
			},
		  events: function() {
			  return {
				  [+moment(this.start).subtract(10, 'seconds')]: { type: 'data-source', dataSource: 'root' },
				  [+moment(this.start).add(10, 'seconds')]: { type: 'ability', ability: 'neutral-1', dataSource: 'root', dataSourceSlot: 'root-1' },
				  [+moment(this.start).add(20, 'seconds')]: { type: 'ability', ability: 'neutral-2', dataSource: 'root', dataSourceSlot: 'root-2' },
					[+moment(this.start).add(30, 'seconds')]: { type: 'ability', ability: 'neutral-3', dataSource: 'root', dataSourceSlot: 'root-3' },
					[+moment(this.start).add(1, 'minutes')]: { type: 'data-source', dataSource: 'neutral-1' },
					[+moment(this.start).add(8, 'minutes')]: { type: 'ability', ability: 'science-1', dataSource: 'neutral-1', dataSourceSlot: 'neutral-1-1' },
					[+moment(this.start).add(13, 'minutes')]: { type: 'ability', ability: 'economy-1', dataSource: 'neutral-1', dataSourceSlot: 'neutral-1-2' },
					[+moment(this.start).add(20, 'minutes')]: { type: 'data-source', dataSource: 'neutral-2' },
					[+moment(this.start).add(21, 'minutes')]: { type: 'ability', ability: 'society-1', dataSource: 'neutral-2', dataSourceSlot: 'neutral-2-2' },
					[+moment(this.start).add(34, 'minutes')]: { type: 'ability', ability: 'science-2', dataSource: 'neutral-2', dataSourceSlot: 'neutral-2-2' },
					[+moment(this.start).add(55, 'minutes')]: { type: 'data-source', dataSource: 'neutral-3' },
					[+moment(this.start).add(1, 'hours')]: { type: 'ability', ability: 'economy-2', dataSource: 'neutral-3', dataSourceSlot: 'neutral-3-1' },
					[+moment(this.start).add(2, 'hours')]: { type: 'ability', ability: 'society-2', dataSource: 'neutral-3', dataSourceSlot: 'neutral-3-2' }
				}
		  },
		  ...mapState(['gameSession'])
		},
	  methods: {
		  updateEvents: function() {
			  this.gameSession.events = this.events;
			  //this.$store.commit('setEvents', this.events);
		  }
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
