<template>
	<main id="app">
	  <header>
		  <img src="./assets/img/logo.png" class="logo">
		  <div class="docs">
			  <h1>Dash Game — Vue components</h1>
				<h2>Component library of user interface elements.</h2>
		  </div>
		</header>
		
		<!--
		---- Game events
		--->
		<section :class="{ hidden: gameEventsToggle }">
		  <button class="toggle" @click="toggle('gameEventsToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.gameEvents" class="docs"></div>
		  </header>
		  <game-events></game-events>
	  </section>
	  
		<!--
		---- Game time
		--->
	  <section :class="{ hidden: gameTimeToggle }">
		  <button class="toggle" @click="toggle('gameTimeToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.gameTime" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Start</label>
					<select v-model="sessionDurationTweaker">
					  <option disabled value="">Choose</option>
					  <option v-for="option in options" :value="option.value">
					    {{ option.label }}
					  </option>
					</select>
					<br>
					<label>Interval</label>
					<button v-if="interval" @click="stopSession">Stop</button>
					<button v-else @click="startSession">Start</button>
				</div>
		  </header>
		  <game-time></game-time>
	  </section>
	  
		<!--
		---- Game score
		--->
	  <section :class="{ hidden: gameScoreToggle }">
		  <button class="toggle" @click="toggle('gameScoreToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.gameScore" class="docs"></div>
		  </header>
		  <game-score></game-score>
	  </section>
	  
		<!--
		---- Game factors
		--->
	  <section :class="{ hidden: gameFactorsToggle }">
		  <button class="toggle" @click="toggle('gameFactorsToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.gameFactors" class="docs"></div>
		  </header>
		  <game-factors></game-factors>
	  </section>
	  
		<!--
		---- Enabled ability
		--->
	  <section :class="{ hidden: enabledAbilityToggle }">
		  <button class="toggle" @click="toggle('enabledAbilityToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.enabledAbility" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Enabled Ability</label>
					<select v-model="enabledAbilityTweaker">
					  <option disabled value="">Choose</option>
					  <option v-for="(abilityEvent) in getAllEventsOfType('ability')" :value="abilityEvent.instance">
					    {{ abilityEvent.instance }}
					  </option>
					</select>
				</div>
		  </header>
		  <enabled-ability :instance="enabledAbilityTweaker"></enabled-ability>
	  </section>
	  
		<!--
		---- Ability slot
		--->
	  <section :class="{ hidden: abilitySlotToggle }">
		  <button class="toggle" @click="toggle('abilitySlotToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.abilitySlot" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Ability Slot</label>
					<select v-model="abilitySlotTweaker">
					  <option disabled value="">Choose</option>
					  <option v-for="abilitySlot in slots" :value="abilitySlot">
					    {{ abilitySlot.name }}
					  </option>
					</select>
				</div>
		  </header>
		  <ability-slot :label="abilitySlotTweaker"></ability-slot>
	  </section>
	  
		<!--
		---- Data socket
		--->
	  <section :class="{ hidden: dataSocketToggle }">
		  <button class="toggle" @click="toggle('dataSocketToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.dataSocket" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Data Socket</label>
					<select v-model="dataSocketTweaker">
					  <option disabled value="">Choose</option>
						<option v-for="(dataSocket, index) in sockets" :value="index">
					    {{ dataSocket.name }}
					  </option>
					</select>
				</div>
		  </header>
		  <data-socket :label="dataSocketTweaker"></data-socket>
	  </section>
	  
		<!--
		---- Available ability
		--->
	  <section :class="{ hidden: availableAbilityToggle }">
		  <button class="toggle" @click="toggle('availableAbilityToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.availableAbility" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Available Ability</label>
					<select v-model="availableAbilityTweaker">
					  <option disabled value="">Choose</option>
					  <option v-for="(ability, index) in abilities" :value="index">
					    {{ ability.name }}
					  </option>
					</select>
				</div>
		  </header>
		  <available-ability :label="availableAbilityTweaker"></available-ability>
	  </section>
	  
		<!--
		---- Ability library
		--->
	  <section :class="{ hidden: abilityLibraryToggle }">
		  <button class="toggle" @click="toggle('abilityLibraryToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.abilityLibrary" class="docs"></div>
		  </header>
		  <ability-library></ability-library>
	  </section>
	  
		<!--
		---- Purchaseable ability
		--->
	  <section :class="{ hidden: purchaseableAbilityToggle }">
		  <button class="toggle" @click="toggle('purchaseableAbilityToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.purchaseableAbility" class="docs"></div>
		  </header>
		  <purchaseable-ability></purchaseable-ability>
	  </section>
	  
		<!--
		---- Ability market
		--->
	  <section :class="{ hidden: abilityMarketToggle }">
		  <button class="toggle" @click="toggle('abilityMarketToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.abilityMarket" class="docs"></div>
		  </header>
		  <ability-market></ability-market>
	  </section>
	  
		<!--
		---- Primary navigation
		--->
	  <section :class="{ hidden: primaryNavigationToggle }">
		  <button class="toggle" @click="toggle('primaryNavigationToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.primaryNavigation" class="docs"></div>
		  </header>
		  <primary-navigation></primary-navigation>
	  </section>
	  
		<!--
		---- Playing field
		--->
	  <section :class="{ hidden: playingFieldToggle }">
		  <button class="toggle" @click="toggle('playingFieldToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.playingField" class="docs"></div>
		  </header>
		  <playing-field></playing-field>
	  </section>
	  
		<!--
		---- Emotion diagram
		--->
	  <section :class="{ hidden: emotionDiagramToggle }">
		  <button class="toggle" @click="toggle('emotionDiagramToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.emotionDiagram" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Happiness</label>
					<input type="range" v-model.number="emotionDiagramHappinessTweaker" min="1" max="100">
					<br>
					<label>Sadness</label>
					<input type="range" v-model.number="emotionDiagramSadnessTweaker" min="1" max="100">
					<br>
					<label>Excitement</label>
					<input type="range" v-model.number="emotionDiagramExcitementTweaker" min="1" max="100">
					<br>
					<label>Fear</label>
					<input type="range" v-model.number="emotionDiagramFearTweaker" min="1" max="100">
					<br>
					<label>Tenderness</label>
					<input type="range" v-model.number="emotionDiagramTendernessTweaker" min="1" max="100">
					<br>
					<label>Anger</label>
					<input type="range" v-model.number="emotionDiagramAngerTweaker" min="1" max="100">
					<br>
				</div>
		  </header>
		  <emotion-diagram
		  :happiness="emotionDiagramHappinessTweaker"
		  :sadness="emotionDiagramSadnessTweaker"
		  :excitement="emotionDiagramExcitementTweaker"
		  :fear="emotionDiagramFearTweaker"
		  :tenderness="emotionDiagramTendernessTweaker"
		  :anger="emotionDiagramAngerTweaker"></emotion-diagram>
	  </section>
	  
		<!--
		---- Leader boards
		--->
	  <section :class="{ hidden: leaderBoardsToggle }">
		  <button class="toggle" @click="toggle('leaderBoardsToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.leaderBoards" class="docs"></div>
		  </header>
		  <leader-boards></leader-boards>
	  </section>
	  
		<!--
		---- Narrative output
		--->
	  <section :class="{ hidden: narrativeOutputToggle }">
		  <button class="toggle" @click="toggle('narrativeOutputToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.narrativeOutput" class="docs"></div>
		  </header>
		  <narrative-output></narrative-output>
	  </section>
	  
		<!--
		---- User profile
		--->
	  <section :class="{ hidden: userProfileToggle }">
		  <button class="toggle" @click="toggle('userProfileToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.userProfile" class="docs"></div>
		  </header>
		  <user-profile></user-profile>
	  </section>
	  
		<!--
		---- Mini-game
		--->
	  <section :class="{ hidden: miniGameToggle }">
		  <button class="toggle" @click="toggle('miniGameToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.miniGame" class="docs"></div>
		  </header>
		  <mini-game></mini-game>
	  </section>
	  
		<!--
		---- Sample component
		--->
	  <section :class="{ hidden: sampleComponentToggle }">
		  <button class="toggle" @click="toggle('sampleComponentToggle')">Toggle</button>
		  <header>
			  <div v-html="docs.sampleComponent" class="docs"></div>
			  <div class="tweakers">
					<h5>Tweakers</h5>
					<label>Message</label>
					<input v-model="messageTweaker" />
				</div>
		  </header>
		  <sample-component :message="messageTweaker"></sample-component>
	  </section>
	</main>
</template>

<script>
	import _ from 'lodash'
	import moment from 'moment'
	import Vue from 'vue'
	import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
	import VueLocalStorage from 'vue-localstorage'
	import store from './store'
	import SampleComponent from './components/sample-component.vue'
	import GameEvents from './components/game-events.vue'
	import GameTime from './components/game-time.vue'
	import GameScore from './components/game-score.vue'
	import GameFactors from './components/game-factors.vue'
	import DataSocket from './components/data-socket.vue'
	import AbilitySlot from './components/ability-slot.vue'
	import EnabledAbility from './components/enabled-ability.vue'
	import AvailableAbility from './components/available-ability.vue'
	import AbilityLibrary from './components/ability-library.vue'
	import PurchaseableAbility from './components/purchaseable-ability.vue'
	import AbilityMarket from './components/ability-market.vue'
	import PrimaryNavigation from './components/primary-navigation.vue'
	import PlayingField from './components/playing-field.vue'
	import EmotionDiagram from './components/emotion-diagram.vue'
	import LeaderBoards from './components/leader-boards.vue'
	import NarrativeOutput from './components/narrative-output.vue'
	import UserProfile from './components/user-profile.vue'
	import MiniGame from './components/mini-game.vue'
	
	Vue.use(VueLocalStorage, {
		bind: true
	});
	
	export default {
	  name: 'app',
	  created: function() {
			this.setEvents(this.initEvents);
			this.startSession();
	  },
	  data: function() {
		  return {
			  messageTweaker: 'This and that',
			  sessionDurationTweaker: 0,
			  enabledAbilityTweaker: 'neutral-1',
			  availableAbilityTweaker: 'neutral-1',
			  abilitySlotTweaker: 'root-1',
			  dataSocketTweaker: 'root',
			  emotionDiagramHappinessTweaker: 1,
			  emotionDiagramSadnessTweaker: 1,
			  emotionDiagramExcitementTweaker: 1,
			  emotionDiagramFearTweaker: 1,
			  emotionDiagramTendernessTweaker: 1,
			  emotionDiagramAngerTweaker: 1
		  }
	  },
	  store,
	  components: {
	    GameEvents,
	    GameTime,
	    GameScore,
	    GameFactors,
	    DataSocket,
	    AbilitySlot,
	    EnabledAbility,
	    AvailableAbility,
			AbilityLibrary,
			PurchaseableAbility,
			AbilityMarket,
			PrimaryNavigation,
			PlayingField,
			EmotionDiagram,
			LeaderBoards,
			NarrativeOutput,
			UserProfile,
			MiniGame,
			SampleComponent
	  },
	  localStorage: {
		  gameEventsToggle: {
	      type: Boolean
	    },
		  gameTimeToggle: {
	      type: Boolean
	    },
		  gameScoreToggle: {
	      type: Boolean
	    },
		  gameFactorsToggle: {
	      type: Boolean
	    },
		  dataSocketToggle: {
	      type: Boolean
	    },
		  abilitySlotToggle: {
	      type: Boolean
	    },
		  enabledAbilityToggle: {
	      type: Boolean
	    },
		  availableAbilityToggle: {
	      type: Boolean
	    },
		  abilityLibraryToggle: {
	      type: Boolean
	    },
		  purchaseableAbilityToggle: {
	      type: Boolean
	    },
		  abilityMarketToggle: {
	      type: Boolean
	    },
		  primaryNavigationToggle: {
	      type: Boolean
	    },
		  playingFieldToggle: {
	      type: Boolean
	    },
		  emotionDiagramToggle: {
	      type: Boolean
	    },
		  leaderBoardsToggle: {
	      type: Boolean
	    },
		  narrativeOutputToggle: {
	      type: Boolean
	    },
		  userProfileToggle: {
	      type: Boolean
	    },
		  miniGameToggle: {
	      type: Boolean
	    },
		  sampleComponentToggle: {
	      type: Boolean
	    }
	  },
	  computed: {
		  docs: function() {
				return _.transform(this.$options.components, function(result, component) {
					result[_.camelCase(component.name)] = component.__docs;
				});
		  },
		  initEvents: function() {
			  return [
					{ type: 'socket', label: 'root', timestamp: +moment(this.start).subtract(1, 'seconds') }
				]
		  },
		  ...mapState({
			  start: state => state.session.start,
			  now: state => state.session.now,
			  interval: state => state.session.interval,
			  options: 'options',
			  sockets: 'sockets',
			  slots: 'slots',
			  abilities: 'abilities'
			}),
			...mapGetters(['getStart', 'getNow', 'getDuration', 'getEvents', 'getAllEventsOfType'])
		},
	  methods: {
		  toggle: function(section) {
			  this[section] = !this[section];
		  },
		  ...mapMutations(['setStart']),
		  ...mapActions(['startSession', 'stopSession', 'setEvents'])
	  },
	  watch: {
		  sessionDurationTweaker: function(value) {
			  var oldStart = this.getStart();
			  var newStart = this.getNow() - value;
			  var events = _.map(this.getEvents(), function(event) {
				  var difference = event.timestamp - oldStart;
				  event.timestamp = newStart + difference;
				  event.finalScore = undefined;
				  return event;
			  });
			  
			  this.setStart(newStart);
			  this.setEvents(events);
		  }
	  }
	}
</script>

<style lang="scss">
	@import './assets/scss/default';
	
	#app {
		display: grid;
		padding: 2rem;
		
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
		  position: relative;
			grid-gap: 1rem;
			padding: 2rem 0;
			border-bottom: 3px solid $purple;
			
			.toggle {
				position: absolute;
				background: none;
				right: 0;
				top: 2rem;
			}
			
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
			
			&.hidden {
				order: 99;
				
				header {
					margin: 0;
				}
				
				header + *, .docs *:not(h3), .tweakers {
					display: none;
				}
			}
	  }
	}
</style>
