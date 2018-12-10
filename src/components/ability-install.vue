<docs>
### Ability install
Displays a modal dialog for selecting an ability to install.

##### Instantiation
`<ability-install></ability-install>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilityDialog from './ability-dialog';
import EmotionDiagram from './emotion-diagram';

export default {
  name: 'ability-install',
  store,
  components: {
    AbilityDialog,
    EmotionDiagram,
  },
  data: () => ({
    selectedEvent: false,
    highlightedEvent: false,
  }),
  computed: {
    interaction: function() {
      return this.getInteraction('install');
    },
    label: function() {
      return this.interaction.label;
    },
    show: function() {
      return this.interaction !== false && this.label !== false;
    },
    ability: function() {
      return this.getAbility(this.label);
    },
    events: function() {
      return this.getAbilityEvents(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    installedInstances: function() {
      return _.map(this.installed, 'instance');
    },
    era: function() {
      return this.ability.era;
    },
    eraActive: function() {
      return this.isEraActive(this.era);
    },
    affordability: function() {
      return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getSlotCosts(this.newEvent);
    },
    scores: function() {
      return this.getScores();
    },
    submittable: function() {
      return this.affordable && this.selectedEvent !== false;
    },
    emotionProfile: function() {
      return this.getEmotions();
    },
    emotions: function() {
      var combineEmotions =
        this.highlightedEvent.emotions || this.selectedEvent.emotions;

      combineEmotions =
        this.isInstalled(this.highlightedEvent) ||
        this.isInstalled(this.selectedEvent)
          ? _.mapValues(combineEmotions, () => 0)
          : combineEmotions;

      return _.mergeWith(
        { color: 'sky' },
        this.emotionProfile,
        combineEmotions,
        _.add
      );
    },
    newEvent: function() {
      return {
        type: 'slot',
        target: 'ability',
        ability: this.label,
      };
    },
    slotting: function() {
      return this.getInteraction('slottingAbility');
    },
    slottingLabel: function() {
      return this.slotting ? this.slotting.label : '';
    },
    installing: function() {
      return this.getInteraction('installingAbility');
    },
    installingLabel: function() {
      return this.installing ? this.installing.label : '';
    },
    ...mapState(['abilities']),
    ...mapGetters([
      'getAbilityEvents',
      'getAbility',
      'getSlotCosts',
      'getValidSlotEvents',
      'getScores',
      'getInteraction',
      'getEmotions',
    ]),
  },
  methods: {
    isSelected: function(event) {
      return event ? this.selectedEvent.instance === event.instance : false;
    },
    isInstalled: function(event) {
      return event
        ? _.includes(this.installedInstances, event.instance)
        : false;
    },
    isInstalledDeselected: function(event) {
      return this.isInstalled(event) && !this.isSelected(event);
    },
    select: function(event) {
      if (this.selectedEvent !== event) {
        this.selectedEvent = event;
      } else {
        this.deselect();
      }
    },
    deselect: function() {
      this.selectedEvent = false;
    },
    highlight: function(event) {
      this.highlightedEvent = event;
    },
    lowlight: function() {
      this.highlightedEvent = false;
    },
    cancel: function() {
      this.deselect();
      this.lowlight();
      this.resetInteraction('install');
    },
    confirm: function() {
      this.setInteraction({
        interaction: 'slot',
        label: this.label,
        ability: this.getAbility(this.label),
        instance: this.selectedEvent.instance,
      });
      this.cancel();
    },
    tweakEmotions: function(emotions) {
      return _.mapValues(emotions, function(emotion) {
        return emotion === 0 ? 0.1 : emotion;
      });
    },
    ...mapActions(['setInteraction', 'resetInteraction']),
  },
};
</script>

<template>
  <ability-dialog
    :label="ability.label"
    :emotions="emotions"
    :show="show"
  >
    <span
      slot="installToggle"
      class="button text-lg uppercase font-bold px-4 py-2 text-navy bg-light"
    >{{ $t('Installing') }}</span>

    <button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      slot="confirm"
      :disabled="!submittable"
      :class="{ 'opacity-10': !submittable }"
      @click="confirm()"
    >{{ $t('Install') }}</button>

    <button
      class="button uppercase bg-blue px-4 py-2 font-bold text-light"
      slot="cancel"
      @click="cancel()"
    >{{ $t('Cancel') }}</button>

    <template slot="buttons">
      <button
        v-for="event in events"
        class="m-1 outline-none"
        :class="{ 'opacity-75': isInstalled(event) }"
        @click="select(event)"
        @mouseover="highlight(event)"
        @mouseout="lowlight()"
      >
        <emotion-diagram
          class="w-24 h-24"
          :values="event.emotions"
          :color="isInstalledDeselected(event)? 'sky': 'light'"
          :class="{ 'border border-light': isSelected(event) }"
        >
          <div
            class="w-full h-full flex items-center justify-center rounded-full z-30 relative"
            :class="[(isSelected(event)? 'bg-light-25': isInstalled(event)? 'bg-sky-25': '')]"
          >
            <span
              class="uppercase text-xs font-bold text-light p-1"
              :class="[(isSelected(event)? 'text-navy': isInstalled(event)? 'text-light': '')]"
            >
              {{ isInstalledDeselected(event)? $t('Installed'): (isSelected(event)? $t('Selected'): '') }}
            </span>
          </div>
        </emotion-diagram>
      </button>
    </template>

    <!--button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      :disabled="sumEmotions !== requiredEmotions"
      :class="{ 'opacity-10': sumEmotions !== requiredEmotions }"
      @click="engageResearch(label)"
    >{{ $t('Confirm') }}</button-->

  </ability-dialog>
</template>

<style lang="scss">
</style>
