<script>
import { mapGetters } from "vuex";
import { keys } from "lodash-es";
// import _ from "lodash-es";

import UtilDialog from "../util/dialog";
// import AbilityDialog from "./ability-dialog";
// import EmotionDiagram from "./emotion/diagram";

export default {
  name: "ability-install",
  components: {
    UtilDialog,
  },
  // props: {
  //   label: String,
  // },
  inject: ["id", "ability", "title"],
  data: () => ({
    dialog: false,
    dialogRef: null,
    // selectedEvent: false,
    // highlightedEvent: false,
  }),
  computed: {
    installCost() {
      return this.getAbilityDataCosts(this.id);
    },

    models() {
      return this.getAbilityModels(this.id);
    },

    modelsAvailable() {
      // TODO: Figure out how many are already installed
      return keys(this.models).length || 0;
    },
    modelsTotal() {
      return keys(this.models).length || 0;
    },
    // ability() {
    //   return this.getAbility(this.label);
    // },
    // events() {
    //   return this.getAbilityEvents(this.label);
    // },
    // installed() {
    //   return this.getAbilitySlotEvents(this.label);
    // },
    // installedInstances() {
    //   return _.map(this.installed, "instance");
    // },
    // era() {
    //   return this.ability.era;
    // },
    // eraActive() {
    //   return this.getIsEraActive(this.era);
    // },
    // affordability() {
    //   return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    // },
    // affordable() {
    //   return this.affordability === 100;
    // },
    // costs() {
    //   return this.getSlotCosts(this.newEvent);
    // },
    // scores() {
    //   return this.getScores();
    // },
    // submittable() {
    //   return this.affordable && this.selectedEvent !== false;
    // },
    // emotionProfile() {
    //   return this.getEmotions();
    // },
    // emotions() {
    //   let combineEmotions =
    //     this.highlightedEvent.emotions || this.selectedEvent.emotions;

    //   combineEmotions =
    //     this.isInstalled(this.highlightedEvent) ||
    //     this.isInstalled(this.selectedEvent)
    //       ? _.mapValues(combineEmotions, () => 0)
    //       : combineEmotions;

    //   return _.mergeWith(
    //     { color: "sky" },
    //     this.emotionProfile,
    //     combineEmotions,
    //     _.add
    //   );
    // },
    // newEvent() {
    //   return {
    //     type: "slot",
    //     target: "ability",
    //     ability: this.label,
    //   };
    // },
    // ...mapState(["abilities"]),
    // ...mapGetters([
    //   "getAbilityEvents",
    //   "getAbility",
    //   "getSlotCosts",
    //   "getAbilitySlotEvents",
    //   "getScores",
    //   "getEmotions",
    // ]),
    ...mapGetters({
      getAbilityDataCosts: "inventory/abilityDataCosts",
      getAbilityModels: "inventory/abilityModels",
    }),
  },
  methods: {
    setDialogRef(el) {
      this.dialogRef = el;
    },
    showDialog() {
      this.dialog = true;
      // this.$refs.dialog.$el.showModal();
    },
    cancelDialog() {
      this.dialog = false;
      // this.$refs.dialog.$el.close();
      // this.resetEmotions();
    },
    // isSelected(event) {
    //   return event ? this.selectedEvent.instance === event.instance : false;
    // },
    // isInstalled(event) {
    //   return event
    //     ? _.includes(this.installedInstances, event.instance)
    //     : false;
    // },
    // isInstalledDeselected(event) {
    //   return this.isInstalled(event) && !this.isSelected(event);
    // },
    // select(event) {
    //   if (this.selectedEvent !== event) {
    //     this.selectedEvent = event;
    //   } else {
    //     this.deselect();
    //   }
    // },
    // deselect() {
    //   this.selectedEvent = false;
    // },
    // highlight(event) {
    //   this.highlightedEvent = event;
    // },
    // lowlight() {
    //   this.highlightedEvent = false;
    // },
    // cancel() {
    //   this.$emit("close");
    //   this.deselect();
    //   this.lowlight();
    // },
    // confirm() {
    //   // this.setInteraction({
    //   //   interaction: 'slot',
    //   //   label: this.label,
    //   //   ability: this.getAbility(this.label),
    //   //   instance: this.selectedEvent.instance,
    //   // });

    //   this.$emit("select", this.selectedEvent.instance);
    //   this.cancel();
    // },
    // tweakEmotions(emotions) {
    //   return _.mapValues(emotions, function (emotion) {
    //     return emotion === 0 ? 0.1 : emotion;
    //   });
    // },
  },
  watch: {
    dialogRef(dialog) {
      dialog.$el.showModal();
    },
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    v-bem:trigger.data
    v-format:data="installCost"
    :title="`${$t('Install')} (${modelsAvailable}/${modelsTotal})`"
    @click="showDialog()"
  />

  <teleport to="#app" v-if="dialog">
    <util-dialog :ref="setDialogRef" tag="dialog" v-if="dialog" v-bem:dialog>
      <template v-slot:title>
        {{ $t("Install a {title} model", { title }) }}
      </template>
    </util-dialog>
  </teleport>
  <!-- <span
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
    </template> -->
</template>

<style lang="scss">
@import "../../styles/components";
@import "../../styles/mixins";

.ability-install {
  &__trigger {
    @apply button button-xs button-title button-icon;
    @apply w-1/2 mr-px;

    &::before {
      @apply bg-data;
    }

    @include icons("::before", data);
  }
}
</style>
