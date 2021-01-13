<script>
import { mapGetters, mapActions } from "vuex";

// import ValueList from "../value/list";

import EmotionDiagram from "../emotion/diagram";

export default {
  name: "game-installing",
  components: {
    EmotionDiagram,
  },
  computed: {
    title() {
      return this.ability?.title;
    },
    isInstalling() {
      return this.installing?.abilityId && this.installing?.modelId;
    },
    ability() {
      return this.isInstalling && this.getAbility(this.installing?.abilityId);
    },
    model() {
      return this.isInstalling && this.getModel(this.installing?.modelId);
    },
    ...mapGetters({
      installing: "system/slotting",
      getAbility: "inventory/ability",
      getModel: "inventory/model",
    }),
  },
  methods: {
    ...mapActions({
      installingReset: "system/slottingReset",
    }),
  },
};
</script>

<template>
  <div v-if="ability && model" v-bem>
    <header v-bem:header>
      <h3 v-bem:headerLabel>{{ $t("Installing") }}</h3>
      <h4 v-bem:headerTitle>{{ title }}</h4>
    </header>
    <i v-bem:badge="{ [title]: true }" />
    <emotion-diagram
      v-bem:emotions
      :sets="model.feelings"
      :scale="2"
      :labels="false"
    />
    <button
      v-bem:cancel
      @click="installingReset"
      :title="$t(`Cancel installation`)"
    />
  </div>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-installing {
  @apply relative;
  @apply flex;
  @apply h-20;
  @apply mt-20 p-2;

  &::before {
    content: "";
    @apply absolute inset-0;
    @apply bg-sky bg-opacity-50;
    @apply animate-pulse;
  }

  &__header {
    &-label {
      @apply text-xl font-bold uppercase;
      @apply mb-2;
    }

    &-title {
      @apply text-xl;
    }
  }

  &__badge {
    @apply flex items-center justify-center;
    @apply w-16 h-16;
    @apply ml-4;
    @apply bg-sky bg-opacity-50;
    @apply rounded-full;

    &::before {
      content: "";
      @apply w-8 h-8;
      @apply bg-light;
      @apply z-30;
    }

    @include icons("::before", $abilities...);
  }

  &__emotions {
    @apply w-16 h-16;
    @apply ml-2;
  }

  &__cancel {
    @apply absolute top-0 right-0;
    @apply flex items-center justify-center;
    @apply h-8 w-8;
    @apply text-3xl;
    @apply leading-none;
    @apply bg-navy text-light;
    @apply border border-light;
    @apply transform translate-x-1/2 -translate-y-1/2;
    @apply rounded-full;

    &::before {
      content: "×";
      @apply -mt-1.5;
    }
  }
}
</style>
