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
    this.startup();
  },
  methods: {
    ...mapActions(["startup"]),
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