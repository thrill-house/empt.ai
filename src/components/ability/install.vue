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
    installing: false,
    selectedModelId: null,
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
    ...mapGetters({
      getAbilityDataCosts: "inventory/abilityDataCosts",
      getAbilityModels: "inventory/abilityModels",
      getModel: "inventory/model",
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
      console.log(this.selectedModelId);
      this.installingModel(this.selectedModelId);
      this.cancelDialog();
    },
    ...mapActions({
      installingModel: "inventory/installingModel",
    }),
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
            :values="model.feelings"
            :scale="2"
          />
        </button>
      </div>

      <div v-bem:actions>
        <button
          v-bem:actionsButton.confirm="{ valid }"
          @click="install"
          :disabled="!selectedModelId"
        >
          {{ $t("Proceed") }}
        </button>
        <button v-bem:actionsButton.cancel @click="cancelDialog">
          {{ $t("Cancel") }}
        </button>
      </div>
    </template>
  </util-dialog>
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

    &--installing {
      @apply bg-opacity-50;

      &::before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }
  }

  &__models {
    @apply flex flex-wrap justify-between;
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
