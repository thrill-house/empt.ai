<script>
import { mapActions } from "vuex";
import { useI18n } from "vue-i18n";
import AppHeader from "./components/app/header";
import AppMain from "./components/app/main";
import AppSidebar from "./components/app/sidebar";

export default {
  name: "app",
  components: { AppHeader, AppMain, AppSidebar },
  setup() {
    return { ...useI18n() };
  },
  created() {
    // Get stuff
    this.trees();
    this.eras();

    // Calculate scores
    this.bases();
    this.factors();

    // Take inventory
    this.abilities();
    this.models();

    // Start the game
    this.init();
    this.startTimer();
  },
  methods: {
    ...mapActions({
      trees: "app/Trees/all",
      eras: "app/Eras/all",
      init: "score/init",
      startTimer: "score/startTimer",
      bases: "score/bases",
      factors: "score/factors",
      abilities: "inventory/abilities",
      models: "inventory/models",
    }),
  },
};
</script>

<template>
  <app-header />
  <app-main />
  <app-sidebar />
</template>

<style lang="scss">
.app {
  @apply relative;
  @apply min-h-screen min-w-full;
  @apply bg-tile from-navy via-midnight to-dark text-light font-primary;
}
</style>