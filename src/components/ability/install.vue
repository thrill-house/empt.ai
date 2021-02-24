<script>
import { mapGetters, mapActions } from "vuex";
import { keys, some } from "lodash-es";

import hover from "../../mixins/hover";
import EmotionDiagram from "../emotion/diagram";
import UtilDialog from "../util/dialog";
import UtilProgress from "../util/progress";

export default {
  name: "ability-install",
  components: {
    EmotionDiagram,
    UtilDialog,
    UtilProgress,
  },
  mixins: [hover],
  inject: ["id", "ability", "title"],
  data: () => ({
    selectedModelId: null,
    open: false,
    affordable: false,
  }),
  computed: {
    loading() {
      return false;
    },
    installing() {
      return this.getInstalling?.abilityId === this.id;
    },

    installCost() {
      return this.getAbilityDataCosts(this.id);
    },

    models() {
      return this.getAbilityModels(this.id);
    },
    modelKeys() {
      return keys(this.models);
    },
    currentSlotted() {
      return this.getCurrentAbilitySlots(this.id);
    },
    currentSlottedKeys() {
      return keys(this.currentSlotted);
    },

    modelsAvailable() {
      return this.modelKeys.length - this.currentSlottedKeys.length;
    },
    modelsTotal() {
      return keys(this.models).length || 0;
    },

    cost() {
      return Math.abs(this.installCost);
    },
    submittable() {
      return this.affordable && this.selectedModelId;
    },

    ...mapGetters({
      getAbilityDataCosts: "inventory/abilityDataCosts",
      getAbilityModels: "inventory/abilityModels",
      getModel: "inventory/model",
      getInstalling: "system/slotting",
      getCurrentAbilitySlots: "system/currentAbilitySlots",
    }),
  },
  methods: {
    showDialog() {
      this.open = true;
    },
    cancelDialog() {
      this.selectedModelId = null;
      this.open = false;
    },
    updateAffordability(payload) {
      this.affordable = payload;
    },
    select(id) {
      this.selectedModelId = id;
    },
    install() {
      this.installingModel(this.selectedModelId);
      this.cancelDialog();
    },
    modelSlotted(id) {
      return some(this.currentSlotted, { modelId: id });
    },
    ...mapActions({
      installingModel: "system/slottingModel",
      installingReset: "system/slottingReset",
    }),
  },
};
</script>

<template>
  <div v-bem>
    <button
      v-bind="$attrs"
      v-bem:trigger.data="{ loading, installing }"
      v-format:data="installCost"
      :title="
        !installing
          ? `${$t('Install')} (${modelsAvailable}/${modelsTotal})`
          : $t('Installing')
      "
      :disabled="loading || !affordable || !modelsAvailable"
      @click="!installing ? showDialog() : installingReset()"
    />
    <util-progress
      v-bem:affordability
      :cost="cost"
      @updateAffordability="updateAffordability"
    />
  </div>
  <util-dialog :open="open" ref="dialog">
    <template v-slot:title>
      {{ $t("Select a {title} model to install", { title }) }}
    </template>
    <template v-slot:default>
      <div v-bem:models>
        <button
          v-bem:modelsTrigger="{
            highlight: selectedModelId == m,
            slotted: modelSlotted(m),
          }"
          v-for="(model, m) in models"
          :key="m"
          :data-slotted="modelSlotted(m) ? $t(`Installed`) : ``"
          @click="select(m)"
        >
          <emotion-diagram
            v-bem:modelsEmotions="{ slotted: modelSlotted(m) }"
            :sets="model.feelings"
            :scale="2"
          />
        </button>
      </div>
      <div v-bem:actions>
        <button
          v-bem:actionsButton.confirm
          :disabled="!submittable"
          @click="install()"
        >
          {{ $t("Proceed") }}
        </button>
        <button v-bem:actionsButton.cancel @click="cancelDialog()">
          {{ $t("Cancel") }}
        </button>
      </div>
    </template>
  </util-dialog>
</template>

<style lang="scss">
@import "../../styles/helper";

.ability-install {
  @apply relative;
  @apply w-1/2 mr-px;
  @apply clip-corners;

  &__trigger {
    @apply button button-xs button-title button-icon;
    @apply w-full;

    &::before {
      @apply bg-data;
    }

    @include icons("::before", data);

    &--loading {
      @apply bg-opacity-50;

      &::before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }

    &--installing {
      @apply animate-pulse;
      @apply cursor-wait;

      &::before {
        @apply mask-installing;
        @apply animate-bounce;
      }
    }
  }

  &__affordability {
    @apply absolute;
    @apply inset-x-1 bottom-0;
  }

  &__models {
    @apply flex flex-wrap justify-evenly;
    @apply self-center;
    @apply w-full;

    &-trigger {
      @apply p-2;
      @apply border border-transparent;

      &--highlight {
        @apply border-light border-dashed;
        @apply bg-sky bg-opacity-10;
        @apply rounded-full;
      }

      &--slotted {
        &::before {
          content: attr(data-slotted);
          @apply absolute inset-0 top-unset;
          @apply flex items-center justify-center;
          @apply p-1.5;
          @apply text-2xs uppercase;
          @apply text-light text-opacity-50;
          @apply z-10;
        }

        // &:after {
        //   content: "";
        //   @apply absolute inset-10;
        //   @apply rounded-full;
        //   @apply bg-sky; // bg-opacity-25;
        //   @apply -z-10;
        //   @apply animate-ping;
        // }
      }
    }

    &-emotions {
      @apply w-32 h-32;
      @apply m-4;

      &--slotted {
        @apply opacity-50;
      }
    }
  }

  &__actions {
    @apply flex flex-row-reverse;
    @apply self-end;
    @apply mt-8;

    &-button {
      @apply button;

      &--confirm {
        @apply button-lg button-confirm;
        @apply ml-2;
      }

      &--cancel {
        @apply button-cancel;
      }
    }
  }
}
</style>
