
<script>
import { reduce } from "lodash-es";

import GameInventory from "../game/inventory";
import GameSettings from "../game/settings";
import GameLogs from "../game/logs";

export default {
  name: "app-sidebar",
  components: { GameInventory, GameSettings, GameLogs },
  data() {
    return {
      open: true,
      panels: {
        inventory: true,
        settings: false,
        logs: false,
      },
    };
  },
  methods: {
    togglePanel(toggle) {
      this.panels = reduce(
        this.panels,
        (accum, panel, key) => {
          accum[key] = key === toggle ? !this.panels[toggle] : false;
          return accum;
        },
        {}
      );
      this.open = this.panels[toggle];
    },
  },
};
</script>

<template>
  <aside v-bem="{ open }">
    <header v-bem:controls>
      <button v-bem:control.inventory @click="togglePanel('inventory')">
        <label v-bem:controlLabel>{{ $t("Inventory") }}</label>
      </button>
      <button v-bem:control.settings @click="togglePanel('settings')">
        <label v-bem:controlLabel>{{ $t("Settings") }}</label>
      </button>
      <button v-bem:control.logs @click="togglePanel('logs')">
        <label v-bem:controlLabel>{{ $t("Logs") }}</label>
      </button>
    </header>
    <game-inventory v-if="panels.inventory" />
    <game-settings v-if="panels.settings" />
    <game-logs v-if="panels.logs" />
  </aside>
</template>

<style lang="scss">
@import "../../styles/helper";

.app-sidebar {
  @apply fixed top-0 right-0;
  @apply flex items-start;
  @apply w-96 h-screen;
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
    @apply bg-grout bg-grout-sky bg-opacity-50;

    & + & {
      @apply mt-4;
    }

    &::before {
      content: "";
      @apply block w-6 h-6;
      @apply bg-light;
    }

    @include icons("::before", inventory, settings, logs);

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
