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
import {  mapGetters  } from 'vuex';
import _ from 'lodash-es';

import AbilityInstall from './ability-install';
import AbilitySlotter from './ability-slotter';

export default {
  name: 'ability-installable',
  store,
  props: {
    label: String,
  },
  components: {
    AbilityInstall,
    AbilitySlotter,
  },
  data: () => ({
    showModal: false,
    instance: false,
  }),
  computed: {
    ability() {
      return this.getAbility(this.label);
    },
    events() {
      return this.getAbilityEvents(this.label);
    },
    installed() {
      return this.getAbilitySlotEvents(this.label);
    },
    remaining() {
      return this.total - this.installed.length;
    },
    total() {
      return this.events.length;
    },
    affordability() {
      return _.clamp((this.scores.data / this.costs.data) * 100, 0, 100);
    },
    affordable() {
      return this.affordability === 100;
    },
    costs() {
      return this.getSlotCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    newEvent() {
      return {
        type: 'slot',
        target: 'ability',
        ability: this.label,
      };
    },
    ...mapGetters([
      'getAbilityEvents',
      'getAbilitySlotEvents',
      'getAbility',
      'getSlotCosts',
      'getScores',
    ]),
  },
  methods: {
    open() {
      this.showModal = true;
    },
    close() {
      this.showModal = false;
      //this.select(false);
    },
    select(instance) {
      this.instance = instance;
    },
    cancel() {
      this.select(false);
      this.close();
    },
  },
};
</script>

<template>
  <button
    v-if="ability && events.length"
    class="ability-installable button bg-sky text-light text-left text-xs px-3 py-px relative w-full z-10"
    :class="{ 'cursor-wait': !affordable }"
    :disabled="!affordable"
    @click="open()"
  >
    <!--span
      class="absolute block inset-0 h-full bg-sky-50 rounded z-0"
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
      <span class="font-bold filter-grayscale">{{ $filters.data(costs.data) }}</span>
    </span>
    <portal v-if="showModal" to="modals">
      <ability-install :label="label" @close="close" @select="select" />
    </portal>
    <portal v-if="instance" to="slotter">
      <ability-slotter
        v-if="instance"
        v-slot="props"
        :label="label"
        :instance="instance"
        :slotter="props.slotter"
        @cancel="cancel"
      />
    </portal>
  </button>
</template>

<style lang="scss">
@import '../styles/mixins';
</style>
