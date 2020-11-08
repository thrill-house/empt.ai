<script>
import { mapActions } from "vuex";
import AppHeader from "./components/app/header";
import AppMain from "./components/app/main";
import AppSidebar from "./components/app/sidebar";

export default {
  name: "app",
  components: { AppHeader, AppMain, AppSidebar },
  created() {
    this.bases();
    this.factors();
    this.startTimer();
  },
  methods: {
    ...mapActions({
      startTimer: "score/startTimer",
      bases: "score/bases",
      factors: "score/factors",
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