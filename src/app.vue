<script>
import _ from 'lodash';
import moment from 'moment';
import store from './store';
import Vue from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import AbilityAvailable from './components/ability-available';
import AbilityInstall from './components/ability-install';
import AbilityPurchaseable from './components/ability-purchaseable';
import AbilityResearch from './components/ability-research';
import AbilitySlot from './components/ability-slot';
import EmotionDiagram from './components/emotion-diagram';
import EmotionProfile from './components/emotion-profile';
import SocketField from './components/socket-field';
import SocketChallenge from './components/socket-challenge';
import SocketSlot from './components/socket-slot';
import TheAbilities from './components/the-abilities';
import TheEvents from './components/the-events';
import TheFactors from './components/the-factors';
import TheLeaders from './components/the-leaders';
import TheMarketplace from './components/the-marketplace';
import TheMenu from './components/the-menu';
import ThePlayer from './components/the-player';
import TheScore from './components/the-score';
import TheSockets from './components/the-sockets';
import TheStory from './components/the-story';
import TheTime from './components/the-time';

export default {
  name: 'app',
  store,
  components: {
    AbilityAvailable,
    AbilityInstall,
    AbilityPurchaseable,
    AbilityResearch,
    AbilitySlot,
    EmotionDiagram,
    EmotionProfile,
    SocketField,
    SocketChallenge,
    SocketSlot,
    TheAbilities,
    TheEvents,
    TheFactors,
    TheLeaders,
    TheMarketplace,
    TheMenu,
    ThePlayer,
    TheScore,
    TheSockets,
    TheStory,
    TheTime,
  },
  localStorage: {
    abilityAvailableToggle: { type: Boolean },
    abilitySlottedToggle: { type: Boolean },
    abilityInstallToggle: { type: Boolean },
    abilityPurchaseableToggle: { type: Boolean },
    abilityResearchToggle: { type: Boolean },
    docsToggle: { type: Boolean },
    emotionDiagramToggle: { type: Boolean },
    emotionProfileToggle: { type: Boolean },
    socketFieldToggle: { type: Boolean },
    socketChallengeToggle: { type: Boolean },
    socketSlotToggle: { type: Boolean },
    theAbilitiesToggle: { type: Boolean },
    theEventsToggle: { type: Boolean },
    theFactorsToggle: { type: Boolean },
    theLeadersToggle: { type: Boolean },
    theMarketplaceToggle: { type: Boolean },
    theMenuToggle: { type: Boolean },
    thePlayerToggle: { type: Boolean },
    theScoreToggle: { type: Boolean },
    theSocketsToggle: { type: Boolean },
    theStoryToggle: { type: Boolean },
    theTimeToggle: { type: Boolean },
  },
  created: function() {
    this.initSockets();
    this.initAbilities();
    window.setTimeout(() => {
      this.addSocketEvent(this.initEvent);
      this.startSession();
    }, 3000);
  },
  data: () => ({
    abilityAvailableTweaker: 'chat-buddy',
    abilitySlottedTweaker: 'chat-buddy',
    emotionDiagramAngerTweaker: 1,
    emotionDiagramExcitementTweaker: 1,
    emotionDiagramFearTweaker: 1,
    emotionDiagramHappinessTweaker: 1,
    emotionDiagramSadnessTweaker: 1,
    emotionDiagramTendernessTweaker: 1,
    sessionDurationTweaker: 0,
    socketFieldTweaker: 'root',
    socketSlotTweaker: 'root-left',
  }),
  computed: {
    docs: function() {
      return _.transform(this.$options.components, function(result, component) {
        result[_.camelCase(component.name)] = component.__docs;
      });
    },
    initEvent: function() {
      return {
        type: 'socket',
        label: 'root',
        timestamp: +moment(this.start).subtract(1, 'seconds'),
      };
    },
    ...mapState({
      start: (state) => state.session.start,
      now: (state) => state.session.now,
      interval: (state) => state.session.interval,
      options: 'options',
      sockets: 'sockets',
      slots: 'slots',
      abilities: 'abilities',
    }),
    ...mapGetters([
      'getActiveSockets',
      'getAllEventsOfType',
      'getDuration',
      'getEventAffordability',
      'getEventObject',
      'getEvents',
      'getNow',
      'getSlotEvents',
      'getSlotsForSocket',
      'getStart',
    ]),
  },
  methods: {
    toggle: function(section) {
      this[section] = !this[section];
    },
    toggleDocs: function() {
      this.docsToggle = !this.docsToggle;
    },
    randomSocket: function() {
      var active = _.map(this.getActiveSockets(), 'label'),
        labels = _.shuffle(_.difference(_.keys(this.sockets), active)),
        socketEvent = false;

      _.each(labels, (socketLabel) => {
        socketEvent = {
          type: 'socket',
          label: socketLabel,
        };

        if (this.getEventAffordability(socketEvent)) {
          this.addSocketEvent(socketEvent);

          return false;
        } else {
          socketEvent = false;
        }
      });

      if (!socketEvent) {
        console.log('No sockets currently affordable');
        return false;
      }

      return true;
    },
    randomAbility: function() {
      var label = _.sample(_.keys(this.abilities.list)),
        abilityEvent = {
          type: 'ability',
          label: label,
          instance: label + '-' + _.now(),
          target: false,
        };

      if (label && this.getEventAffordability(abilityEvent)) {
        abilityEvent.happiness = 2;
        abilityEvent.sadness = 0;

        abilityEvent.tenderness = 1;
        abilityEvent.anger = 0;

        abilityEvent.excitement = 1;
        abilityEvent.fear = 0;

        this.addAbilityEvent(abilityEvent);
      } else {
        console.log('No abilities currently affordable');
        return false;
      }

      return true;
    },
    randomSlot: function() {
      var socketLabel = _.sample(_.map(this.getActiveSockets(), 'label')),
        slotLabel = _.sample(_.keys(this.getSlotsForSocket(socketLabel))),
        abilityEvent = _.sample(this.getAllEventsOfType('ability')),
        slotEvent = {
          label: slotLabel,
          ability: abilityEvent.label,
          instance: abilityEvent.instance,
        };

      if (
        slotEvent &&
        this.getEventAffordability(_.merge(slotEvent, { type: 'slot' }))
      ) {
        this.addSlotEvent(slotEvent);
      } else {
        console.log('No slots currently affordable');
        return false;
      }

      return true;
    },
    ...mapMutations(['setStart']),
    ...mapActions([
      'addAbilityEvent',
      'addEvent',
      'addSlotEvent',
      'addSocketEvent',
      'initSockets',
      'initAbilities',
      'setEvents',
      'startSession',
      'stopSession',
    ]),
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
    },
  },
};
</script>

<template>
  <main id="app" class="p-8 bg-tile" :class="{ 'hide-docs': docsToggle }">
    <header class="w-full flex items-center text-light">
      <div class="w-32"><img src="/assets/img/logo.png" /></div>
      <div class="docs keep p-4">
        <h1>Project EMPATIS — Components</h1>
        <h2>Vue.js component library of user interface elements.</h2>
        <button
          class="font-bold text-xs mt-4 mr-4 py-2 px-4 rounded bg-sky text-light"
          @click="toggleDocs()"
        >
          {{ docsToggle ? 'Show' : 'Hide' }} documentation
        </button>
      </div>
    </header>

    <!--
    ---- The menu
    --->
    <section :class="{ off: theMenuToggle }">
      <header>
        <button class="toggle" @click="toggle('theMenuToggle')">Toggle</button>
        <div v-html="docs.theMenu" class="docs"></div>
      </header>
      <the-menu></the-menu>
    </section>

    <!--
    ---- The player
    --->
    <section :class="{ off: thePlayerToggle }">
      <header>
        <button class="toggle" @click="toggle('thePlayerToggle')">
          Toggle
        </button>
        <div v-html="docs.thePlayer" class="docs"></div>
      </header>
      <the-player></the-player>
    </section>

    <!--
    ---- The time
    --->
    <section :class="{ off: theTimeToggle }">
      <header>
        <button class="toggle" @click="toggle('theTimeToggle')">Toggle</button>
        <div v-html="docs.theTime" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Start</label>
          <select v-model="sessionDurationTweaker">
            <option disabled value="">Choose</option>
            <option v-for="option in options" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <hr />
          <label>Interval</label>
          <button v-if="interval" @click="stopSession">Stop</button>
          <button v-else @click="startSession">Start</button>
        </div>
      </header>
      <the-time></the-time>
    </section>

    <!--
    ---- The score
    --->
    <section :class="{ off: theScoreToggle }">
      <header>
        <button class="toggle" @click="toggle('theScoreToggle')">Toggle</button>
        <div v-html="docs.theScore" class="docs"></div>
      </header>
      <the-score></the-score>
    </section>

    <!--
    ---- The factors
    --->
    <section :class="{ off: theFactorsToggle }">
      <header>
        <button class="toggle" @click="toggle('theFactorsToggle')">
          Toggle
        </button>
        <div v-html="docs.theFactors" class="docs"></div>
      </header>
      <the-factors></the-factors>
    </section>

    <!--
    ---- The sockets
    --->
    <section :class="{ off: theSocketsToggle }">
      <header>
        <button class="toggle" @click="toggle('theSocketsToggle')">
          Toggle
        </button>
        <div v-html="docs.theSockets" class="docs"></div>
      </header>
      <the-sockets></the-sockets>
    </section>

    <!--
    ---- The abilities
    --->
    <section :class="{ off: theAbilitiesToggle }">
      <header>
        <button class="toggle" @click="toggle('theAbilitiesToggle')">
          Toggle
        </button>
        <div v-html="docs.theAbilities" class="docs"></div>
      </header>
      <the-abilities></the-abilities>
    </section>

    <!--
    ---- The marketplace
    --->
    <section :class="{ off: theMarketplaceToggle }">
      <header>
        <button class="toggle" @click="toggle('theMarketplaceToggle')">
          Toggle
        </button>
        <div v-html="docs.theMarketplace" class="docs"></div>
      </header>
      <the-marketplace></the-marketplace>
    </section>

    <!--
    ---- The story
    --->
    <section :class="{ off: theStoryToggle }">
      <header>
        <button class="toggle" @click="toggle('theStoryToggle')">Toggle</button>
        <div v-html="docs.theStory" class="docs"></div>
      </header>
      <the-story></the-story>
    </section>

    <!--
    ---- The leaders
    --->
    <section :class="{ off: theLeadersToggle }">
      <header>
        <button class="toggle" @click="toggle('theLeadersToggle')">
          Toggle
        </button>
        <div v-html="docs.theLeaders" class="docs"></div>
      </header>
      <the-leaders></the-leaders>
    </section>

    <!--
    ---- The events
    --->
    <section :class="{ off: theEventsToggle }">
      <header>
        <button class="toggle" @click="toggle('theEventsToggle')">
          Toggle
        </button>
        <div v-html="docs.theEvents" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Random socket</label>
          <button @click="randomSocket">Activate</button>
          <hr />
          <label>Random ability</label>
          <button @click="randomAbility">Research</button>
          <hr />
          <label>Random slot</label>
          <button @click="randomSlot">Install</button>
        </div>
      </header>
      <the-events></the-events>
    </section>

    <!--
    ---- Emotion profile
    --->
    <section :class="{ off: emotionProfileToggle }">
      <header>
        <button class="toggle" @click="toggle('emotionProfileToggle')">
          Toggle
        </button>
        <div v-html="docs.emotionProfile" class="docs"></div>
      </header>
      <emotion-profile class="w-64 h-64"></emotion-profile>
    </section>

    <!--
    ---- Emotion diagram
    --->
    <section :class="{ off: emotionDiagramToggle }">
      <header>
        <button class="toggle" @click="toggle('emotionDiagramToggle')">
          Toggle
        </button>
        <div v-html="docs.emotionDiagram" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Happiness</label>
          <input
            type="range"
            v-model.number="emotionDiagramHappinessTweaker"
            min="1"
            max="100"
          />
          <hr />
          <label>Sadness</label>
          <input
            type="range"
            v-model.number="emotionDiagramSadnessTweaker"
            min="1"
            max="100"
          />
          <hr />
          <label>Excitement</label>
          <input
            type="range"
            v-model.number="emotionDiagramExcitementTweaker"
            min="1"
            max="100"
          />
          <hr />
          <label>Fear</label>
          <input
            type="range"
            v-model.number="emotionDiagramFearTweaker"
            min="1"
            max="100"
          />
          <hr />
          <label>Tenderness</label>
          <input
            type="range"
            v-model.number="emotionDiagramTendernessTweaker"
            min="1"
            max="100"
          />
          <hr />
          <label>Anger</label>
          <input
            type="range"
            v-model.number="emotionDiagramAngerTweaker"
            min="1"
            max="100"
          />
          <hr />
        </div>
      </header>
      <emotion-diagram
        class="w-128 h-128"
        :labels="false"
        :values="[
          {
            happiness: 12,
            sadness: 24,
            excitement: 36,
            fear: 48,
            tenderness: 60,
            anger: 72,
            color: 'sky',
          },
          {
            happiness: emotionDiagramHappinessTweaker,
            sadness: emotionDiagramSadnessTweaker,
            excitement: emotionDiagramExcitementTweaker,
            fear: emotionDiagramFearTweaker,
            tenderness: emotionDiagramTendernessTweaker,
            anger: emotionDiagramAngerTweaker,
            color: 'light',
          },
        ]"
      ></emotion-diagram>
    </section>

    <!--
    ---- Socket online
    --->
    <section :class="{ off: socketFieldToggle }">
      <header>
        <button class="toggle" @click="toggle('socketFieldToggle')">
          Toggle
        </button>
        <div v-html="docs.socketField" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Data Socket</label>
          <select v-model="socketFieldTweaker">
            <option disabled value="">Choose</option>
            <option v-for="(socketField, index) in sockets.list" :value="index">
              {{ socketField.name }}
            </option>
          </select>
        </div>
      </header>
      <socket-field :label="socketFieldTweaker"></socket-field>
    </section>

    <!--
    ---- Socket slot
    --->
    <section :class="{ off: socketSlotToggle }">
      <header>
        <button class="toggle" @click="toggle('socketSlotToggle')">
          Toggle
        </button>
        <div v-html="docs.socketSlot" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Ability Slot</label>
          <select v-model="socketSlotTweaker">
            <option disabled value="">Choose</option>
            <option v-for="socketSlot in slots" :value="socketSlot">
              {{ socketSlot.name }}
            </option>
          </select>
        </div>
      </header>
      <!-- <socket-slot :label="socketSlotTweaker"></socket-slot> -->
    </section>

    <!--
    ---- Socket challenge
    --->
    <section :class="{ off: socketChallengeToggle }">
      <header>
        <button class="toggle" @click="toggle('socketChallengeToggle')">
          Toggle
        </button>
        <div v-html="docs.socketChallenge" class="docs"></div>
      </header>
      <socket-challenge></socket-challenge>
    </section>

    <!--
    ---- Ability available
    --->
    <section :class="{ off: abilityAvailableToggle }">
      <header>
        <button class="toggle" @click="toggle('abilityAvailableToggle')">
          Toggle
        </button>
        <div v-html="docs.abilityAvailable" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Available Ability</label>
          <select v-model="abilityAvailableTweaker">
            <option disabled value="">Choose</option>
            <option v-for="(ability, index) in abilities" :value="index">
              {{ ability.name }}
            </option>
          </select>
        </div>
      </header>
      <ability-available :label="abilityAvailableTweaker"></ability-available>
    </section>

    <!--
    ---- Ability enabled
    --->
    <section :class="{ off: abilitySlottedToggle }">
      <header>
        <button class="toggle" @click="toggle('abilitySlottedToggle')">
          Toggle
        </button>
        <div v-html="docs.abilitySlotted" class="docs"></div>
        <div class="tweakers">
          <h5>Tweakers</h5>
          <label>Enabled Ability</label>
          <select v-model="abilitySlottedTweaker">
            <option disabled value="">Choose</option>
            <option
              v-for="abilityEvent in getAllEventsOfType('ability')"
              :value="abilityEvent.instance"
            >
              {{ abilityEvent.instance }}
            </option>
          </select>
        </div>
      </header>
      <!-- <ability-slot :instance="abilitySlottedTweaker"></ability-slot> -->
    </section>

    <!--
    ---- Ability purchaseable
    --->
    <section :class="{ off: abilityPurchaseableToggle }">
      <header>
        <button class="toggle" @click="toggle('abilityPurchaseableToggle')">
          Toggle
        </button>
        <div v-html="docs.abilityPurchaseable" class="docs"></div>
      </header>
      <ability-purchaseable></ability-purchaseable>
    </section>

    <!--
    ---- Ability research
    --->
    <section :class="{ off: abilityResearchToggle }">
      <header>
        <button class="toggle" @click="toggle('abilityResearchToggle')">
          Toggle
        </button>
        <div v-html="docs.abilityResearch" class="docs"></div>
      </header>
      <ability-research></ability-research>
    </section>

    <!--
    ---- Ability install
    --->
    <section :class="{ off: abilityInstallToggle }">
      <header>
        <button class="toggle" @click="toggle('abilityInstallToggle')">
          Toggle
        </button>
        <div v-html="docs.abilityInstall" class="docs"></div>
      </header>
      <ability-install></ability-install>
    </section>
  </main>
</template>

<style lang="scss">
@import './scss/default';

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

      pre {
        code {
          @apply block;
        }
      }

      blockquote {
        @apply inline-block bg-navy text-light p-4 italic rounded;
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
