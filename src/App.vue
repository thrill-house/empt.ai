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
    this.init();
  },
  methods: {
    ...mapActions(["init"]),
  },
};
</script>

<template>
  <app-header />
  <app-main />
  <app-sidebar />
</template>

<style lang="scss">
@import "styles/helper";

.app {
  @apply relative;
  @apply min-h-screen min-w-full;
  @apply bg-tile from-navy via-midnight to-dark text-light font-primary;
  @apply overflow-x-hidden;
}
</style>