<docs>
### Ability dialog
A shared component for researching and installing abilities

##### Properties
- `label` — A label referring to an ability in the global store.
- `costs` — Object of costs for the dialog action.
- `emotions` — Optional object of emotion values, will be combined with emotion profile for comparison.
- `show` — Show or hide the dialog.

##### Instantiation
`<ability-dialog
  label.string="ability-label"
  costs.object="{object}"
  emotions.object="{object}"
  show.boolean="true"
></ability-dialog>`
</docs>

<script>
import { mapGetters, mapActions } from "vuex";
import _ from "lodash-es";

import BaseFactor from "./base-factor";
import BaseIcon from "./base-icon";
import EmotionDiagram from "./emotion-diagram";
import TheModal from "./the-modal";

export default {
  name: "ability-dialog",

  components: {
    BaseFactor,
    BaseIcon,
    EmotionDiagram,
    TheModal,
  },
  props: {
    label: [Boolean, String],
    costs: Object,
    emotions: Object,
  },
  data: () => ({
    buttons: {
      install: "Install",
      research: "Research",
    },
  }),
  computed: {
    ability() {
      return this.getAbility(this.label);
    },
    installed() {
      return this.getAbilitySlotEvents(this.label);
    },
    installedInstances() {
      return _.map(this.installed, "instance");
    },
    remaining() {
      return this.total - this.installed.length;
    },
    total() {
      return this.events.length;
    },
    era() {
      return this.ability.era;
    },
    eraActive() {
      return this.getIsEraActive(this.era);
    },
    emotionProfile() {
      return _.merge({ color: "light" }, this.getEmotions());
    },
    emotionValues() {
      return [this.emotions, this.emotionProfile];
    },
    ...mapGetters([
      "getAbility",
      "getAbilitySlotEvents",
      "getInteraction",
      "getEmotions",
    ]),
  },
  methods: {
    ...mapActions(["setInteraction", "resetInteraction"]),
  },
};
</script>

<template>
  <the-modal>
    <div
      class="ability-dialog relative w-192 h-128 py-3 bg-navy border border-grey"
    >
      <header class="ability-dialog__header flex justify-between px-6 py-3">
        <slot v-for="(button, index) in buttons" :name="index + 'Toggle'">
          <button
            class="button text-lg uppercase font-bold px-4 py-2 bg-grey text-dark opacity-25"
            @click="alert('hi')"
            :key="index"
          >
            {{ $t(button) }}
          </button>
        </slot>
      </header>
      <div class="flex justify-between">
        <div class="w-1/4 py-3 pl-6">
          <h4 class="uppercase mb-3 text-light">{{ ability.name }}</h4>
          <div
            class="w-24 h-24 bg-sky-25 overflow-hidden rounded-full inline-flex flex-shrink-0 items-center justify-center"
          >
            <base-icon
              class="w-16 h-16 text-light"
              :label="ability.label"
            ></base-icon>
          </div>
        </div>
        <div class="w-1/2 py-3">
          <slot name="emotions">
            <emotion-diagram
              class="w-64 h-64"
              :values="emotionValues"
              :labels="false"
            ></emotion-diagram>
          </slot>
        </div>
        <div class="w-1/4 flex flex-col items-end justify-between py-3 pr-6">
          <div class="flex flex-col">
            <slot name="confirm"></slot> <slot name="cancel"></slot>
          </div>
          <div class="bg-sky-25 px-4 py-2 clip-2-corners w-full">
            <h4 class="uppercase text-sm mb-2 text-light">{{ $t("Cost") }}</h4>
            <div>
              <base-factor
                v-for="(value, cost) in costs"
                class="h-4 mb-1"
                :key="cost"
                :label="cost"
                :value="value"
              ></base-factor>
            </div>
          </div>
        </div>
      </div>
      <div class="py-3 w-full flex flex-wrap justify-center">
        <slot name="buttons"></slot>
      </div>
    </div>
  </the-modal>
</template>

<style lang="scss">
@import "../styles/mixins";
</style>

<!-- <style lang="scss">
.ability-dialog {
  &__header {
    @apply items-center;

    &:before,
    &:after {
      @apply w-1/4 h-px bg-light;
      content: '';
    }
  }
}
</style> -->
