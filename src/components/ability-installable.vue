<docs>
### Ability installable
Displays options for selecting an ability to install in a slot. A button is displayed that triggers a modal to select which emotional profile of those available (instances of this ability researched) and "tags" the selected instance temporarily to move it to an available slot in the playing field.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-installable label.string="ability-label"></ability-installable>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilityInstall from './ability-install';

export default {
  name: 'ability-installable',
  store,
  props: {
    label: String,
  },
  components: {
    AbilityInstall,
  },
  data: () => ({
    task: 'install',
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
    scores: function() {
      return this.getScores();
    },
    newEvent: function() {
      return {
        type: 'slot',
        target: 'ability',
        ability: this.label,
      };
    },
    ...mapGetters([
      'getAbilityEvents',
      'getValidSlotEvents',
      'getAbility',
      'getSlotCosts',
      'getScores',
    ]),
  },
  methods: {
    install: function() {
      this.setInteraction({
        interaction: 'install',
        label: this.label,
      });
    },
    ...mapActions(['setInteraction', 'resetInteraction']),
  },
};
</script>

<template>
  <button
    v-if="ability && events.length"
    class="ability-installable button bg-sky text-light text-left text-xs px-3 py-px relative w-full z-10"
    :class="{ 'cursor-wait': !affordable }"
    :disabled="!affordable"
    @click="install()"
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
        >{{ remaining }}/{{ total }}</span
      >
      <br />
      <span class="font-bold filter-grayscale">{{ costs.data | data }}</span>
    </span>
  </button>
  <!--button
  v-else
  class="button bg-blue-75 text-xs px-3 py-px text-light text-left relative w-full"
  @click="endSlotting()">
    {{ $t('Cancel {item}', { item: $t('installation')} ) }}
  </button-->
</template>

<style lang="scss">
.ability-installable {
}
</style>
