<docs>
  ### Ability dialog
  A shared component for researching and installing abilities
  ##### Instantiation
  `<ability-dialog task="install|research" ability="{ ability-object }"></ability-dialog>`
</docs>

<template>
  <the-modal :show="label && show">
    <div class="ability-dialog relative w-192 h-128 py-3 bg-navy border border-grey">
      <header class="ability-dialog__header flex justify-between px-6 py-3">
        <slot
          v-for="(button, index) in buttons"
          :name="index + 'Toggle'"
        >
          <button
            class="button text-lg uppercase font-bold px-4 py-2 bg-grey text-dark opacity-25"
            @click=""
          >{{ $t(button) }}</button>
        </slot>
      </header>
      <div class="flex justify-between">
        <div class="w-1/4 py-3 pl-6">
          <h4 class="uppercase mb-3 text-light">{{ ability.name }}</h4>
          <div class="w-24 h-24 bg-sky-25 overflow-hidden rounded-full inline-flex flex-no-shrink items-center justify-center">
            <icon
              class="w-16 h-16 text-light"
              :label="ability.label"
            ></icon>
          </div>
        </div>
        <div class="w-1/2 py-3">
          <slot name="emotions">
            <emotion-diagram
              class="w-64 h-64"
              :values="emotionValues"
              :hideLabels="false"
            ></emotion-diagram>
          </slot>
        </div>
        <div class="w-1/4 flex flex-col items-end justify-between py-3 pr-6">
          <div class="flex flex-col">
            <slot name="confirm"></slot>
            <slot name="cancel"></slot>
          </div>
          <div class="bg-sky-25 px-4 py-2 clip-2-corners w-full">
            <h4 class="uppercase text-sm mb-2 text-light">{{ $t('Cost') }}</h4>
            <div>
              <factor-value
                v-for="(value, cost) in costs"
                class="h-4 mb-1"
                :key="cost"
                :label="cost"
                :value="value"
              ></factor-value>
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

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import TheModal from "./the-modal.vue";
import FactorValue from "./factor-value.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "ability-dialog",
  store,
  components: {
    Icon,
    TheModal,
    FactorValue,
    EmotionDiagram
  },
  props: {
    label: [Boolean, String],
    emotions: Object,
    costs: Object,
    show: Boolean
  },
  data: () => ({
    buttons: {
      install: "Install",
      research: "Research"
    }
  }),
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    installedInstances: function() {
      return _.map(this.installed, "instance");
    },
    remaining: function() {
      return this.total - this.installed.length;
    },
    total: function() {
      return this.events.length;
    },
    era: function() {
      return this.ability.era;
    },
    eraActive: function() {
      return this.isEraActive(this.era);
    },
    emotionalProfile: function() {
      return _.merge({ color: "light" }, this.getEmotions());
    },
    emotionValues: function() {
      return [this.emotions, this.emotionalProfile];
    },
    ...mapGetters([
      "getAbility",
      "getValidSlotEvents",
      "getInteraction",
      "getEmotions"
    ])
  },
  methods: {
    ...mapActions(["setInteraction", "resetInteraction"])
  }
};
</script>
<style lang="scss">
.ability-dialog__header {
  @apply items-center;

  &:before,
  &:after {
    @apply w-1/4 h-px bg-light;
    content: "";
  }
}
</style>
