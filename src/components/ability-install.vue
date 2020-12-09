<docs>
### Ability install
Displays a modal dialog for selecting an ability to install.

##### Instantiation
`<ability-install></ability-install>`
</docs>

<script>
import { mapState, mapGetters } from "vuex";
import _ from "lodash-es";

import AbilityDialog from "./ability-dialog";
import EmotionDiagram from "./emotion/diagram";

export default {
  name: "ability-install",

  components: {
    AbilityDialog,
    EmotionDiagram,
  },
  props: {
    label: String,
  },
  data: () => ({
    selectedEvent: false,
    highlightedEvent: false,
  }),
  computed: {
    ability() {
      return this.getAbility(this.label);
    },
    events() {
      return this.getAbilityEvents(this.label);
    },
    installed() {
      return this.getAbilitySlotEvents(this.label);
    },
    installedInstances() {
      return _.map(this.installed, "instance");
    },
    era() {
      return this.ability.era;
    },
    eraActive() {
      return this.getIsEraActive(this.era);
    },
    affordability() {
      return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    },
    affordable() {
      return this.affordability === 100;
    },
    costs() {
      return this.getSlotCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    submittable() {
      return this.affordable && this.selectedEvent !== false;
    },
    emotionProfile() {
      return this.getEmotions();
    },
    emotions() {
      let combineEmotions =
        this.highlightedEvent.emotions || this.selectedEvent.emotions;

      combineEmotions =
        this.isInstalled(this.highlightedEvent) ||
        this.isInstalled(this.selectedEvent)
          ? _.mapValues(combineEmotions, () => 0)
          : combineEmotions;

      return _.mergeWith(
        { color: "sky" },
        this.emotionProfile,
        combineEmotions,
        _.add
      );
    },
    newEvent() {
      return {
        type: "slot",
        target: "ability",
        ability: this.label,
      };
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getAbilityEvents",
      "getAbility",
      "getSlotCosts",
      "getAbilitySlotEvents",
      "getScores",
      "getEmotions",
    ]),
  },
  methods: {
    isSelected(event) {
      return event ? this.selectedEvent.instance === event.instance : false;
    },
    isInstalled(event) {
      return event
        ? _.includes(this.installedInstances, event.instance)
        : false;
    },
    isInstalledDeselected(event) {
      return this.isInstalled(event) && !this.isSelected(event);
    },
    select(event) {
      if (this.selectedEvent !== event) {
        this.selectedEvent = event;
      } else {
        this.deselect();
      }
    },
    deselect() {
      this.selectedEvent = false;
    },
    highlight(event) {
      this.highlightedEvent = event;
    },
    lowlight() {
      this.highlightedEvent = false;
    },
    cancel() {
      this.$emit("close");
      this.deselect();
      this.lowlight();
    },
    confirm() {
      // this.setInteraction({
      //   interaction: 'slot',
      //   label: this.label,
      //   ability: this.getAbility(this.label),
      //   instance: this.selectedEvent.instance,
      // });

      this.$emit("select", this.selectedEvent.instance);
      this.cancel();
    },
    tweakEmotions(emotions) {
      return _.mapValues(emotions, function (emotion) {
        return emotion === 0 ? 0.1 : emotion;
      });
    },
  },
};
</script>

<template>
  <ability-dialog :label="label" :emotions="emotions">
    <span
      class="button text-lg uppercase font-bold px-4 py-2 text-navy bg-light"
    >
      <slot name="installToggle">
        {{ $t("Installing") }}
      </slot>
    </span>

    <button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      :disabled="!submittable"
      :class="{ 'opacity-10': !submittable }"
      @click="confirm()"
    >
      <slot name="confirm">
        {{ $t("Install") }}
      </slot>
    </button>

    <button
      class="button uppercase bg-blue px-4 py-2 font-bold text-light"
      @click="cancel()"
    >
      <slot name="cancel">
        {{ $t("Cancel") }}
      </slot>
    </button>

    <template v-slot:buttons>
      <button
        v-for="event in events"
        class="m-1 outline-none"
        :class="{ 'opacity-75': isInstalled(event) }"
        :key="event.label"
        @click="select(event)"
        @mouseover="highlight(event)"
        @mouseout="lowlight()"
      >
        <emotion-diagram
          class="w-24 h-24"
          :values="event.emotions"
          :color="isInstalledDeselected(event) ? 'sky' : 'light'"
          :class="{ 'border border-light': isSelected(event) }"
        >
          <div
            class="w-full h-full flex items-center justify-center rounded-full z-30 relative"
            :class="[
              isSelected(event)
                ? 'bg-light-25'
                : isInstalled(event)
                ? 'bg-sky bg-opacity-25'
                : '',
            ]"
          >
            <span
              class="uppercase text-xs font-bold text-light p-1"
              :class="[
                isSelected(event)
                  ? 'text-navy'
                  : isInstalled(event)
                  ? 'text-light'
                  : '',
              ]"
            >
              {{
                isInstalledDeselected(event)
                  ? $t("Installed")
                  : isSelected(event)
                  ? $t("Selected")
                  : ""
              }}
            </span>
          </div>
        </emotion-diagram>
      </button>
    </template>
  </ability-dialog>
</template>

<style lang="scss">
@import "../styles/util";
</style>
