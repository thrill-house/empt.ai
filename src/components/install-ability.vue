<docs>
  ### Install ability
  The component displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.
  ##### Instantiation
  `<install-ability label="ability-label"></install-ability>`
</docs>
<template>
  <button
     v-if="ability && events.length"
    class="install-ability button bg-sky-25 text-light text-left text-xs px-3 py-px relative w-full z-10"
    :class="{ 'cursor-wait': (!affordable) }"
    :disabled="!affordable"
    @click="parent.$emit('install')"
  >
    <!--span
      class="absolute block pin h-full bg-sky-50 rounded z-0"
      :style="{width: affordability + '%'}"
    ></span-->
    <span class="relative block z-10">
      {{ $t('Install') }}
      <span
        class="inline-block rounded-full px-1 h-3 bg-light text-sky text-center align-bottom text-2xs font-bold"
        :class="{ 'bg-grey': !remaining }"
      >{{ remaining }}/{{ total }}</span>
      <br>
      <span class="font-bold filter-grayscale">{{ costs.data|data }}</span>
    </span>
    <dialog-install
      :task="task"
      :label="label"
      :showDialog="showDialog"
    ></dialog-install>
  </button>
  <!--button
  v-else
  class="button bg-blue-75 text-xs px-3 py-px text-light text-left relative w-full"
  @click="endSlotting()">
    {{ $t('Cancel {item}', { item: $t('installation')} ) }}
  </button-->
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import DialogInstall from "./dialog-install";

export default {
  name: "install-ability",
  store,
  props: {
    label: String
  },
  components: {
    DialogInstall
  },
  data: () => ({
    task: "install",
    showDialog: false
  }),
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    events: function() {
      return this.getAbilityEvents(this.label);
    },
    installed: function() {
      return this.getValidSlotEvents(this.label);
    },
    remaining: function() {
      return this.total - this.installed.length;
    },
    total: function() {
      return this.events.length;
    },
    affordability: function() {
      return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getSlotCosts(this.newEvent);
    },
    newEvent: function() {
      return {
        type: "slot",
        target: "ability",
        ability: this.label
      };
    },
    ...mapGetters([
      "getAbilityEvents",
      "getValidSlotEvents",
      "getAbility",
      "getSlotCosts"
    ])
  },
  methods: {
    openDialog: function() {
      this.showDialog = true;
    },
    closeDialog: function() {
      this.showDialog = false;
    }
  }
};
</script>
<style lang="scss">
</style>
