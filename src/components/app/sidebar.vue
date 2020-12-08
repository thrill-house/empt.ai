
<script>
import GameInventory from "../game/inventory";
export default {
  name: "app-sidebar",
  components: { GameInventory },
  data() {
    return {
      open: true,
      gameInventory: true,
    };
  },
  methods: {
    togglePanel(panel) {
      this[panel] = !this[panel];
      this.open = this[panel];
    },
  },
};
</script>

<template>
  <aside v-bem="{ open }">
    <header v-bem:controls>
      <button v-bem:control.inventory @click="togglePanel('gameInventory')">
        <label v-bem:controlLabel>{{ $t("Inventory") }}</label>
      </button>
    </header>
    <game-inventory v-if="gameInventory" />
  </aside>
</template>

<style lang="scss">
.app-sidebar {
  @apply fixed top-0 right-0;
  @apply flex items-start;
  @apply w-96 min-h-screen;
  @apply transform translate-x-full;
  @apply transition-transform duration-500;
  @apply bg-ash bg-opacity-25;
  @apply shadow;

  &--open {
    @apply w-96;
    @apply translate-x-0;
  }

  &__controls {
    @apply absolute top-0 left-0;
    @apply w-10 mt-16;
    @apply transform -translate-x-full;
  }

  &__control {
    @apply w-10 h-10;
    @apply flex items-center justify-center;
    @apply bg-sky bg-opacity-50;

    &::before {
      content: "";
      @apply block w-6 h-6;
      @apply bg-light;
    }

    &--inventory {
      &::before {
        content: "";
        @apply mask-inventory;
      }
    }

    &-label {
      @apply hidden absolute left-0;
      @apply -ml-2;
      @apply transform -translate-x-full;
      @apply uppercase;
    }

    &:hover &-label {
      @apply block;
    }
  }
}
</style>
