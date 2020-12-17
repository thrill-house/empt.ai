<script>
import { mapGetters, mapActions } from "vuex";
import { keys } from "lodash-es";

import hover from "../../mixins/hover";
import EmotionDiagram from "../emotion/diagram";
import UtilDialog from "../util/dialog";

export default {
  name: "ability-install",
  components: {
    EmotionDiagram,
    UtilDialog,
  },
  mixins: [hover],
  inject: ["id", "ability", "title"],
  data: () => ({
    selectedModelId: null,
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

    modelsAvailable() {
      // TODO: Figure out how many are already installed
      return keys(this.models).length || 0;
    },
    modelsTotal() {
      return keys(this.models).length || 0;
    },
    ...mapGetters({
      getAbilityDataCosts: "inventory/abilityDataCosts",
      getAbilityModels: "inventory/abilityModels",
      getModel: "inventory/model",
      getInstalling: "system/slotting",
    }),
  },
  methods: {
    showDialog() {
      this.$refs?.dialog?.show();
    },
    cancelDialog() {
      this.selectedModelId = null;
      this.$refs?.dialog?.close();
    },
    select(id) {
      this.selectedModelId = id;
    },
    install() {
      this.installingModel(this.selectedModelId);
      this.cancelDialog();
    },
    ...mapActions({
      installingModel: "system/slottingModel",
      installingReset: "system/slottingReset",
    }),
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    v-bem:trigger.data="{ loading, installing }"
    v-format:data="installCost"
    :title="
      !installing
        ? `${$t('Install')} (${modelsAvailable}/${modelsTotal})`
        : $t('Installing')
    "
    :disabled="loading"
    @click="!installing ? showDialog() : installingReset()"
  />

  <util-dialog ref="dialog">
    <template v-slot:title>
      {{ $t("Select a {title} model to install", { title }) }}
    </template>
    <template v-slot:default>
      <div v-bem:models>
        <button
          v-bem:modelsTrigger="{ highlight: selectedModelId == m }"
          v-for="(model, m) in models"
          @click="select(m)"
          :key="m"
        >
          <emotion-diagram
            v-bem:modelsEmotions
            :sets="model.feelings"
            :scale="2"
          />
        </button>
      </div>

      <div v-bem:actions>
        <button
          v-bem:actionsButton.confirm="{ valid }"
          :disabled="!selectedModelId"
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
  &__trigger {
    @apply button button-xs button-title button-icon;
    @apply w-1/2 mr-px;

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

  &__models {
    @apply flex flex-wrap justify-evenly;
    @apply self-center;
    @apply w-full;

    &-trigger {
      @apply p-2;
      @apply border border-transparent;

      &--highlight {
        @apply border-light;
        @apply bg-sky bg-opacity-10;
        @apply rounded-full;
      }
    }

    &-emotions {
      @apply w-32 h-32;
      @apply m-4;
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
