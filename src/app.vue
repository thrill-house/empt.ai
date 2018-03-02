<template>
	<main id="app">
	  <header>
		  <img src="./assets/img/logo.png" class="logo">
		  <div class="docs">
			  <h1>Dash Game — Vue components</h1>
				<h2>Component library of user interface elements.</h2>
		  </div>
		</header>
	  
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
			  <div v-html="docs.gameTime" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label for="game-time-start">Start</label>
					<select v-model="sessionDuration">
					  <option v-for="option in options" :value="option.value">
					    {{ option.label }}
					  </option>
					</select>
				</div>
		  </header>
		  <game-time></game-time>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.gameScore" class="docs"></div>
		  </header>
		  <game-score></game-score>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.gameFactors" class="docs"></div>
		  </header>
		  <game-factors></game-factors>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.enabledAbility" class="docs"></div>
		  </header>
		  <enabled-ability label="neutral-1"></enabled-ability>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.abilitySocket" class="docs"></div>
		  </header>
		  <ability-slot label="root-1"></ability-slot>
	  </section>
	  
	  <section>
		  <header>
			  <div v-html="docs.dataSocket" class="docs"></div>
		  </header>
		  <data-socket label="root"></data-socket>
	  </section>
	  
	</main>
</template>

<script>
	import _ from 'lodash'
	import moment from 'moment'
	import { mapState, mapMutations, mapActions } from 'vuex'
	import store from './store'
	import SampleComponent from './components/1-sample-component.vue'
	import GameEvents from './components/2-game-events.vue'
	import GameTime from './components/3-game-time.vue'
	import GameScore from './components/4-game-score.vue'
	import GameFactors from './components/5-game-factors.vue'
	import DataSocket from './components/6-data-socket.vue'
	import AbilitySlot from './components/7-ability-slot.vue'
	import EnabledAbility from './components/8-enabled-ability.vue'
	import AvailableAbility from './components/9-available-ability.vue'
	import AbilityLibrary from './components/10-ability-library.vue'
	import PurchaseableAbility from './components/11-purchaseable-ability.vue'
	import AbilityMarket from './components/12-ability-market.vue'
	import PrimaryNavigation from './components/13-primary-navigation.vue'
	import PlayingField from './components/14-playing-field.vue'
	import EmotionDiagram from './components/15-emotion-diagram.vue'
	import LeaderBoard from './components/16-leader-boards.vue'
	import NarrativeOutput from './components/17-narrative-output.vue'
	import UserProfile from './components/18-user-profile.vue'
	import MiniGame from './components/19-mini-game.vue'
	
	export default {
	  name: 'app',
	  created: function() {
			this.updateEvents();
			this.startSession();
	  },
	  data: function() {
		  return {
			  message: 'This and that',
			  sessionDuration: 0
		  }
	  },
	  store,
	  components: {
	    SampleComponent,
	    GameEvents,
	    GameTime,
	    GameScore,
	    GameFactors,
	    DataSocket,
	    AbilitySlot,
	    EnabledAbility
	  },
	  computed: {
		  docs: function() {
				return _.transform(this.$options.components, function(result, component) {
					result[_.camelCase(component.name)] = component.__docs;
				});
		  },
		  initEvents: function() {
			  return [
					{ type: 'data-socket', dataSocket: 'root', timestamp: +moment(this.start).subtract(2, 'seconds') },
					{ type: 'ability', ability: 'neutral-1', dataSocket: 'root', dataSocketSlot: 'root-1', timestamp: +moment(this.start).add(5, 'seconds') },
					{ type: 'ability', ability: 'neutral-2', dataSocket: 'root', dataSocketSlot: 'root-2', timestamp: +moment(this.start).add(10, 'seconds') },
					{ type: 'ability', ability: 'neutral-3', dataSocket: 'root', dataSocketSlot: 'root-3', timestamp: +moment(this.start).add(15, 'seconds') },
					{ type: 'data-socket', dataSocket: 'neutral-1', timestamp: +moment(this.start).add(1, 'minutes') },
					{ type: 'ability', ability: 'science-1', dataSocket: 'neutral-1', dataSocketSlot: 'neutral-1-1', timestamp: +moment(this.start).add(8, 'minutes') },
					{ type: 'ability', ability: 'economy-1', dataSocket: 'neutral-1', dataSocketSlot: 'neutral-1-2', timestamp: +moment(this.start).add(13, 'minutes') },
					{ type: 'data-socket', dataSocket: 'neutral-2', timestamp: +moment(this.start).add(20, 'minutes') },
					{ type: 'ability', ability: 'society-1', dataSocket: 'neutral-2', dataSocketSlot: 'neutral-2-2', timestamp: +moment(this.start).add(21, 'minutes') },
					{ type: 'ability', ability: 'science-2', dataSocket: 'neutral-2', dataSocketSlot: 'neutral-2-2', timestamp: +moment(this.start).add(34, 'minutes') },
					{ type: 'data-socket', dataSocket: 'neutral-3', timestamp: +moment(this.start).add(55, 'minutes') },
					{ type: 'ability', ability: 'economy-2', dataSocket: 'neutral-3', dataSocketSlot: 'neutral-3-1', timestamp: +moment(this.start).add(1, 'hours') },
					{ type: 'ability', ability: 'society-2', dataSocket: 'neutral-3', dataSocketSlot: 'neutral-3-2', timestamp: +moment(this.start).add(2, 'hours') },
				]
		  },
		  ...mapState({
			  start: state => state.gameSession.start,
			  now: state => state.gameSession.now,
			  options: state => state.options
			})
		},
	  methods: {
		  updateEvents: function() {
			  this.setEvents(this.initEvents);
		  },
		  ...mapMutations(['setStart', 'setEvents']),
		  ...mapActions(['startSession'])
	  },
	  watch: {
		  sessionDuration: function(value) {
			  this.setStart(this.now - value);
			  this.updateEvents();
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
				margin-bottom: 1rem;
				
				hr {
					border: none;
					border-bottom: 1px solid $sky;
				}
				
				.tweakers {
					border-bottom: 1px solid $sky;
					padding-bottom: 1rem;
				}
				
				* + * {
					margin-top: 1rem;
				}
			}
	  }
	}
</style>
