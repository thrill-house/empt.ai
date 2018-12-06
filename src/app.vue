<template>
  <main id="app" class="p-8 bg-tile" :class="{'hide-docs': docsToggle}">
  <header class="w-full flex items-center text-light">
    <div class="w-32">
      <img src="/assets/img/logo.png">
    </div>
    <div class="docs keep p-4">
      <h1>Project EMPATIC — Vue components</h1>
      <h2>Component library of user interface elements.</h2>
      <button class="font-bold text-xs mt-4 mr-4 py-2 px-4 rounded bg-sky text-light" @click="toggleDocs()">{{ docsToggle? 'Show': 'Hide' }} documentation</button>
    </div>
  </header>
  
  <!--
  ---- Game events
  --->
  <section :class="{ off: gameEventsToggle }">
    <header>
      <button class="toggle" @click="toggle('gameEventsToggle')">Toggle</button>
      <div v-html="docs.gameEvents" class="docs"></div>
      <div class="tweakers">
        <h5>Tweakers</h5>
        <label>Random socket</label>
        <button @click="randomSocket">Activate</button><hr>
        <label>Random ability</label>
        <button @click="randomAbility">Research</button><hr>
        <label>Random slot</label>
        <button @click="randomSlot">Install</button>
      </div>
    </header>
    <game-events></game-events>
  </section>
  
  <!--
  ---- Game time
  --->
  <section :class="{ off: gameTimeToggle }">
    <header>
      <button class="toggle" @click="toggle('gameTimeToggle')">Toggle</button>
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
        <hr>
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
  <section :class="{ off: gameScoreToggle }">
    <header>
      <button class="toggle" @click="toggle('gameScoreToggle')">Toggle</button>
      <div v-html="docs.gameScore" class="docs"></div>
    </header>
    <game-score></game-score>
  </section>
  
  <!--
  ---- Game factors
  --->
  <section :class="{ off: gameFactorsToggle }">
    <header>
      <button class="toggle" @click="toggle('gameFactorsToggle')">Toggle</button>
      <div v-html="docs.gameFactors" class="docs"></div>
    </header>
    <game-factors></game-factors>
  </section>
  
  <!--
  ---- Enabled ability
  --->
  <section :class="{ off: enabledAbilityToggle }">
    <header>
      <button class="toggle" @click="toggle('enabledAbilityToggle')">Toggle</button>
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
  <section :class="{ off: abilitySlotToggle }">
    <header>
      <button class="toggle" @click="toggle('abilitySlotToggle')">Toggle</button>
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
  <section :class="{ off: dataSocketToggle }">
    <header>
      <button class="toggle" @click="toggle('dataSocketToggle')">Toggle</button>
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
  <section :class="{ off: availableAbilityToggle }">
    <header>
      <button class="toggle" @click="toggle('availableAbilityToggle')">Toggle</button>
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
  <section :class="{ off: abilityLibraryToggle }">
    <header>
      <button class="toggle" @click="toggle('abilityLibraryToggle')">Toggle</button>
      <div v-html="docs.abilityLibrary" class="docs"></div>
    </header>
    <ability-library></ability-library>
  </section>
  
  <!--
  ---- Purchaseable ability
  --->
  <section :class="{ off: purchaseableAbilityToggle }">
    <header>
      <button class="toggle" @click="toggle('purchaseableAbilityToggle')">Toggle</button>
      <div v-html="docs.purchaseableAbility" class="docs"></div>
    </header>
    <purchaseable-ability></purchaseable-ability>
  </section>
  
  <!--
  ---- Ability market
  --->
  <section :class="{ off: abilityMarketToggle }">
    <header>
      <button class="toggle" @click="toggle('abilityMarketToggle')">Toggle</button>
      <div v-html="docs.abilityMarket" class="docs"></div>
    </header>
    <ability-market></ability-market>
  </section>
  
  <!--
  ---- Emotional profile
  --->
  <section :class="{ off: emotionalProfileToggle }">
    <header>
      <button class="toggle" @click="toggle('emotionalProfileToggle')">Toggle</button>
      <div v-html="docs.emotionalProfile" class="docs"></div>
    </header>
    <emotional-profile class="w-64 h-64"></emotional-profile>
  </section>
  
  <!--
  ---- Emotion diagram
  --->
  <section :class="{ off: emotionDiagramToggle }">
    <header>
      <button class="toggle" @click="toggle('emotionDiagramToggle')">Toggle</button>
      <div v-html="docs.emotionDiagram" class="docs"></div>
      <div class="tweakers">
        <h5>Tweakers</h5>
        <label>Happiness</label>
        <input type="range" v-model.number="emotionDiagramHappinessTweaker" min="1" max="100">
        <hr>
        <label>Sadness</label>
        <input type="range" v-model.number="emotionDiagramSadnessTweaker" min="1" max="100">
        <hr>
        <label>Excitement</label>
        <input type="range" v-model.number="emotionDiagramExcitementTweaker" min="1" max="100">
        <hr>
        <label>Fear</label>
        <input type="range" v-model.number="emotionDiagramFearTweaker" min="1" max="100">
        <hr>
        <label>Tenderness</label>
        <input type="range" v-model.number="emotionDiagramTendernessTweaker" min="1" max="100">
        <hr>
        <label>Anger</label>
        <input type="range" v-model.number="emotionDiagramAngerTweaker" min="1" max="100">
        <hr>
      </div>
    </header>
    <emotion-diagram class="w-128 h-128"
    :hideLabels="false"
    :values="[{
      happiness: 12,
      sadness: 24,
      excitement: 36,
      fear: 48,
      tenderness: 60,
      anger: 72,
      color: 'sky'
    }, {
      happiness: emotionDiagramHappinessTweaker,
      sadness: emotionDiagramSadnessTweaker,
      excitement: emotionDiagramExcitementTweaker,
      fear: emotionDiagramFearTweaker,
      tenderness: emotionDiagramTendernessTweaker,
      anger: emotionDiagramAngerTweaker,
      color: 'light'
    }]"></emotion-diagram>
  </section>
  
  <!--
  ---- Playing field
  --->
  <section :class="{ off: playingFieldToggle }">
    <header>
      <button class="toggle" @click="toggle('playingFieldToggle')">Toggle</button>
      <div v-html="docs.playingField" class="docs"></div>
    </header>
    <playing-field></playing-field>
  </section>
  
  <!--
  ---- Leader boards
  --->
  <section :class="{ off: leaderBoardsToggle }">
    <header>
      <button class="toggle" @click="toggle('leaderBoardsToggle')">Toggle</button>
      <div v-html="docs.leaderBoards" class="docs"></div>
    </header>
    <leader-boards></leader-boards>
  </section>
  
  <!--
  ---- Narrative output
  --->
  <section :class="{ off: narrativeOutputToggle }">
    <header>
      <button class="toggle" @click="toggle('narrativeOutputToggle')">Toggle</button>
      <div v-html="docs.narrativeOutput" class="docs"></div>
    </header>
    <narrative-output></narrative-output>
  </section>
  
  <!--
  ---- User profile
  --->
  <section :class="{ off: userProfileToggle }">
    <header>
      <button class="toggle" @click="toggle('userProfileToggle')">Toggle</button>
      <div v-html="docs.userProfile" class="docs"></div>
    </header>
    <user-profile></user-profile>
  </section>
  
  <!--
  ---- Mini-game
  --->
  <section :class="{ off: miniGameToggle }">
    <header>
      <button class="toggle" @click="toggle('miniGameToggle')">Toggle</button>
      <div v-html="docs.miniGame" class="docs"></div>
    </header>
    <mini-game></mini-game>
  </section>
  
  <!--
  ---- Primary navigation
  --->
  <section :class="{ off: primaryNavigationToggle }">
    <header>
      <button class="toggle" @click="toggle('primaryNavigationToggle')">Toggle</button>
      <div v-html="docs.primaryNavigation" class="docs"></div>
    </header>
    <primary-navigation></primary-navigation>
  </section>
  
  <!--
  ---- Sample component
  --->
  <section :class="{ off: sampleComponentToggle }">
    <header>
      <button class="toggle" @click="toggle('sampleComponentToggle')">Toggle</button>
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
import Vue from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import store from "./store";
import _ from "lodash";
import moment from "moment";
import SampleComponent from "./components/sample-component.vue";
import GameEvents from "./components/game-events.vue";
import GameTime from "./components/game-time.vue";
import GameScore from "./components/game-score.vue";
import GameFactors from "./components/game-factors.vue";
import DataSocket from "./components/data-socket.vue";
import AbilitySlot from "./components/ability-slot.vue";
import EnabledAbility from "./components/enabled-ability.vue";
import AvailableAbility from "./components/available-ability.vue";
import AbilityLibrary from "./components/ability-library.vue";
import PurchaseableAbility from "./components/purchaseable-ability.vue";
import AbilityMarket from "./components/ability-market.vue";
import PrimaryNavigation from "./components/primary-navigation.vue";
import PlayingField from "./components/playing-field.vue";
import EmotionalProfile from "./components/emotional-profile.vue";
import EmotionDiagram from "./components/emotion-diagram.vue";
import LeaderBoards from "./components/leader-boards.vue";
import NarrativeOutput from "./components/narrative-output.vue";
import UserProfile from "./components/user-profile.vue";
import MiniGame from "./components/mini-game.vue";

export default {
  name: "app",
  created: function() {
    this.addSocketEvent(this.initEvent);
    this.startSession();
    this.initAbilities();
  },
  data: function() {
    return {
      messageTweaker: "This and that",
      sessionDurationTweaker: 0,
      enabledAbilityTweaker: "neutral-1",
      availableAbilityTweaker: "neutral-1",
      abilitySlotTweaker: "root-1",
      dataSocketTweaker: "root",
      emotionDiagramHappinessTweaker: 1,
      emotionDiagramSadnessTweaker: 1,
      emotionDiagramExcitementTweaker: 1,
      emotionDiagramFearTweaker: 1,
      emotionDiagramTendernessTweaker: 1,
      emotionDiagramAngerTweaker: 1
    };
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
    EmotionalProfile,
    EmotionDiagram,
    LeaderBoards,
    NarrativeOutput,
    UserProfile,
    MiniGame,
    SampleComponent
  },
  localStorage: {
    docsToggle: { type: Boolean },
    gameEventsToggle: { type: Boolean },
    gameTimeToggle: { type: Boolean },
    gameScoreToggle: { type: Boolean },
    gameFactorsToggle: { type: Boolean },
    dataSocketToggle: { type: Boolean },
    abilitySlotToggle: { type: Boolean },
    enabledAbilityToggle: { type: Boolean },
    availableAbilityToggle: { type: Boolean },
    abilityLibraryToggle: { type: Boolean },
    purchaseableAbilityToggle: { type: Boolean },
    abilityMarketToggle: { type: Boolean },
    primaryNavigationToggle: { type: Boolean },
    playingFieldToggle: { type: Boolean },
    emotionalProfileToggle: { type: Boolean },
    emotionDiagramToggle: { type: Boolean },
    leaderBoardsToggle: { type: Boolean },
    narrativeOutputToggle: { type: Boolean },
    userProfileToggle: { type: Boolean },
    miniGameToggle: { type: Boolean },
    sampleComponentToggle: { type: Boolean }
  },
  computed: {
    docs: function() {
      return _.transform(this.$options.components, function(result, component) {
        result[_.camelCase(component.name)] = component.__docs;
      });
    },
    initEvent: function() {
      return {
        type: "socket",
        label: "root",
        timestamp: +moment(this.start).subtract(1, "seconds")
      };
    },
    ...mapState({
      start: state => state.session.start,
      now: state => state.session.now,
      interval: state => state.session.interval,
      options: "options",
      sockets: "sockets",
      slots: "slots",
      abilities: "abilities"
    }),
    ...mapGetters([
      "getStart",
      "getNow",
      "getDuration",
      "getEvents",
      "getAllEventsOfType",
      "getActiveSockets",
      "getSlotsForSocket",
      "getSlotEvents",
      "getEventObject",
      "getEventAffordability"
    ])
  },
  methods: {
    toggle: function(section) {
      this[section] = !this[section];
    },
    toggleDocs: function() {
      this.docsToggle = !this.docsToggle;
    },
    randomSocket: function() {
      var active = _.map(this.getActiveSockets(), "label"),
        labels = _.shuffle(_.difference(_.keys(this.sockets), active)),
        socketEvent = false;

      _.each(labels, socketLabel => {
        socketEvent = {
          type: "socket",
          label: socketLabel
        };

        if (this.getEventAffordability(socketEvent)) {
          this.addSocketEvent(socketEvent);

          return false;
        } else {
          socketEvent = false;
        }
      });

      if (!socketEvent) {
        console.log("No sockets currently affordable");
      }
    },
    randomAbility: function() {
      var labels = _.shuffle(_.keys(this.abilities)),
        abilityEvent = false;

      _.each(labels, abilityLabel => {
        abilityEvent = {
          type: "ability",
          label: abilityLabel,
          instance: abilityLabel + "-" + _.now(),
          target: false
        };

        if (this.getEventAffordability(abilityEvent)) {
          var axis = _.shuffle([1, 1, 2]);

          abilityEvent.happiness = _.random() * axis[0];
          abilityEvent.sadness = 1 * axis[0] - abilityEvent.happiness;

          abilityEvent.tenderness = _.random() * axis[1];
          abilityEvent.anger = 1 * axis[1] - abilityEvent.tenderness;

          abilityEvent.excitement = _.random() * axis[2];
          abilityEvent.fear = 1 * axis[2] - abilityEvent.excitement;
          this.addAbilityEvent(abilityEvent);

          return false;
        } else {
          abilityEvent = false;
        }
      });

      if (!abilityEvent) {
        console.log("No abilities currently affordable");
      }
    },
    randomSlot: function() {
      var socketLabel = _.sample(_.map(this.getActiveSockets(), "label")),
        slotLabel = _.sample(_.keys(this.getSlotsForSocket(socketLabel))),
        abilityEvent = _.sample(this.getAllEventsOfType("ability")),
        slotEvent = {
          label: slotLabel,
          ability: abilityEvent.label,
          instance: abilityEvent.instance
        };

      if (
        slotEvent &&
        this.getEventAffordability(_.merge(slotEvent, { type: "slot" }))
      ) {
        this.addSlotEvent(slotEvent);
      } else {
        console.log("No slots currently affordable");
      }
    },
    ...mapMutations(["setStart"]),
    ...mapActions([
      "initAbilities",
      "startSession",
      "stopSession",
      "setEvents",
      "addEvent",
      "addSocketEvent",
      "addSlotEvent",
      "addAbilityEvent"
    ])
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
};
</script>

<style lang="scss">
@import "./scss/default";

#app {
  @apply flex flex-wrap;

  > section {
    @apply flex flex-wrap items-start w-full pb-4;

    > header {
      @apply w-full relative bg-light p-4 my-4 rounded-lg;

      .toggle {
        @apply absolute pin-t pin-r mt-4 mr-4;
      }

      h3,
      h5 {
        @apply font-bold;
      }

      h3 {
        @apply text-xl;
      }

      h5 {
        @apply text-lg;
      }

      button,
      input,
      select {
        @apply font-bold text-xs py-2 px-4 rounded bg-sky text-light;

        &:hover {
          @apply opacity-75;
        }
      }

      input,
      select {
        @apply inline-block appearance-none bg-blue text-light;
      }

      label {
        @apply inline-block text-xs py-2 px-4 rounded bg-grey;
      }

      code {
        @apply bg-grey py-2 px-4 rounded;
      }

      & + * {
        @apply flex-no-shrink;
        order: 3;
      }

      .docs,
      .tweakers {
        @apply p-4 leading-normal;
      }

      .tweakers {
        @apply border-t border-solid border-midnight;
      }

      .docs {
        * + * {
          @apply mt-4;
        }
      }

      .tweakers {
        @apply flex flex-wrap;

        h5 {
          @apply w-full mb-2;
        }

        label {
          @apply w-32 mr-2;
        }

        hr {
          @apply block w-full my-1;
        }
      }
    }

    &.off {
      @apply items-start;
      order: 99;

      > header {
        @apply m-0;

        & + *,
        .docs *:not(h3),
        .tweakers {
          @apply hidden;
        }

        .docs {
          @apply border-none;
        }
      }
    }
  }

  &.hide-docs {
    header {
      .docs:not(.keep) {
        * + * {
          @apply hidden;
        }
      }
    }
  }
}
</style>
