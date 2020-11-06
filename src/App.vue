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

<style>
.app {
  @apply bg-tile text-light font-primary;
  @apply h-screen w-screen;
  @apply relative;
}
</style>