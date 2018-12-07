<docs>
  ### Install ability
  The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.
  ##### Instantiation
  `<install-ability label="ability-label"></install-ability>`
</docs>
<template>
  <ability-dialog
    :task="task"
    :label="ability.label"
    :emotions="emotions"
    :showModal="showDialog"
  >
    <template
      slot="installToggle"
      class="text-navy bg-light"
    ></template>
    <template
      slot="submit"
      :disabled="!submit"
      :class="{ 'opacity-10': !submit }"
      @click="$parent.$emit('confirm')"
    >
      {{ $t('Confirm installation') }}
    </template>
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
  </ability-dialog>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import AbilityDialog from "./ability-dialog";

export default {
  name: "install-ability",
  store,
  components: {
    AbilityDialog
  },
  props: {
    label: String
  },
  data: () => ({
    task: "install",
    showDialog: false
  }),
  computed: {
    events: function() {
      return this.getAbilityEvents(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    installedInstances: function() {
      return _.map(this.installed, "instance");
    },
    ability: function() {
      return this.getAbility(this.label);
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
    emotions: function() {
      return this.getEmotions();
    },
    previewEmotions: function() {
      var combineEmotions =
        this.highlightedEvent.emotions || this.selectedEvent.emotions;

      combineEmotions =
        this.isInstalled(this.highlightedEvent) ||
        this.isInstalled(this.selectedEvent)
          ? _.mapValues(combineEmotions, () => 0)
          : combineEmotions;

      return combineEmotions
        ? _.transform(
            this.emotions,
            function(result, value, key) {
              result[key] = value + combineEmotions[key];
            },
            {}
          )
        : false;
    },
    emotionValues: function() {
      var emotions = _.merge({ color: "light" }, this.emotions);
      return this.previewEmotions
        ? [emotions, _.merge({ color: "sky" }, this.previewEmotions)]
        : emotions;
    },
    newEvent: function() {
      return {
        type: "slot",
        target: "ability",
        ability: this.label
      };
    },
    slotting: function() {
      return this.getInteraction("slottingAbility");
    },
    slottingLabel: function() {
      return this.slotting ? this.slotting.label : "";
    },
    installing: function() {
      return this.getInteraction("installingAbility");
    },
    installingLabel: function() {
      return this.installing ? this.installing.label : "";
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getAbilityEvents",
      "getAbility",
      "getSlotCosts",
      "getValidSlotEvents",
      "getScores",
      "getInteraction",
      "getEmotions"
    ])
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
    startInstalling: function() {
      this.showDialog = true;
      this.setInteraction({
        interaction: "installingAbility",
        label: this.label,
        ability: this.getAbility(this.label)
      });
    },
    endInstalling: function() {
      this.showDialog = false;
      this.deselect();
      this.lowlight();
      this.resetInteraction("installingAbility");
    },
    startSlotting: function(instance) {
      this.endInstalling();
      this.setInteraction({
        interaction: "slottingAbility",
        label: this.label,
        ability: this.getAbility(this.label),
        instance: instance
      });
    },
    endSlotting: function() {
      this.endInstalling();
      this.resetInteraction("slottingAbility");
    },
    tweakEmotions: function(emotions) {
      return _.mapValues(emotions, function(emotion) {
        return emotion === 0 ? 0.1 : emotion;
      });
    },
    ...mapActions(["setInteraction", "resetInteraction"])
  }
};
</script>
<style lang="scss">
</style>
