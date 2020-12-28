<script>
import { mapGetters, mapActions } from "vuex";

import AbilitySynergies from "../ability/synergies";
import UtilEra from "../util/era";

export default {
  name: "socket-slot",
  components: { AbilitySynergies, UtilEra },
  props: {
    slotIndex: Number,
  },
  inject: ["socketId", "socketTree", "socketEra"],
  computed: {
    id() {
      return this.slot?.$id;
    },
    source() {
      return this.getSocketSource(this.socketId);
    },
    slot() {
      return this.getSourceSlot(this.source.$id, this.slotIndex);
    },
    isInstalling() {
      return this.installing?.abilityId && this.installing?.modelId;
    },
    ability() {
      return this.getAbility(this.slot?.abilityId);
    },
    abilityId() {
      return this.ability?.$id;
    },
    title() {
      return this.ability?.title;
    },
    tree() {
      return this.getTree(this.ability?.treeId)?.title;
    },
    era() {
      return this.getEra(this.ability?.eraId)?.stage || 0;
    },

    dependees() {
      return this.getAbilityDependees(this.abilityId);
    },
    dependants() {
      return this.getAbilityDependants(this.abilityId);
    },
    synergiesList() {
      return { receives: this.dependees, provides: this.dependants };
    },

    match() {
      return this.tree === this.socketTree;
    },
    model() {
      return this.getModel(this.slot?.modelId);
    },
    ...mapGetters({
      installing: "system/slotting",
      getSourceSlot: "system/sourceSlot",
      getSocketSource: "inventory/socketSource",
      getAbility: "inventory/ability",
      getAbilityDependants: "inventory/abilityDependants",
      getAbilityDependees: "inventory/abilityDependees",
      getModel: "inventory/model",
      getTree: "labels/tree",
      getEra: "labels/era",
    }),
  },
  methods: {
    async install() {
      if (this.sourceId) {
        await this.installingSource(this.sourceId);
        await this.installingIndex(this.slotIndex);

        if (this.id) {
          await this.installingSlot(this.id);
        }

        this.installModel(this.installing);
        this.installingReset();
      }
    },
    ...mapActions({
      installingReset: "system/slottingReset",
      installingSource: "system/slottingSource",
      installingIndex: "system/slottingIndex",
      installingSlot: "system/slottingSlot",
      installModel: "Game/Slots/create",
    }),
  },
};
</script>

<template>
  <div v-bem="{ online: !!slot, [tree]: true, match }">
    <template v-if="slot && ability">
      <div v-bem:badge><i v-bem:badgeIcon="{ [title]: true }" /></div>
      <ability-synergies
        v-for="(synergies, synergy) in synergiesList"
        v-bem:synergiesList="{ [synergy]: true }"
        :type="synergy"
        :source="ability"
        :minimum="3"
        :synergies="synergies"
        :key="synergy"
      />
      <div v-bem:tree="{ [tree]: true }">
        <i v-bem:treeIcon="{ [tree]: true }" />
      </div>
      <util-era v-bem:era :era="era" />
    </template>
    <div v-bem:install>
      <button v-bem:installTrigger v-if="isInstalling" @click="install()">
        {{ $t("Install") }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-slot {
  @apply relative;
  @apply flex flex-wrap;
  @apply justify-around items-center;
  @apply w-48 h-hex*48;
  @apply text-center text-dark;
  @apply px-2 pt-4 pb-14;
  @apply -mt-hex*6;
  @apply clip-hexagon;
  @apply overflow-hidden;

  &::before {
    content: "";
    @apply absolute inset-0.5;
    @apply m-px;
    @apply bg-grout;
    @apply clip-hexagon;
    @apply z-10;
  }

  &--online::before {
    @apply inset-1;
  }

  &::after {
    content: "";
    @apply absolute inset-0.5;
    @apply clip-hexagon;
  }

  & > * {
    @apply z-20;
  }

  @include trees using ($tree) {
    &::before {
      @apply bg-grout-#{$tree} bg-opacity-20;
    }
    &::after {
      @apply bg-#{$tree};
    }
  }

  &:not(&--match) {
    &::before {
      @apply bg-grout-light bg-opacity-20 #{!important};
    }
    &::after {
      @apply bg-light #{!important};
    }
  }

  &__synergies {
    &-list {
      @apply flex flex-col justify-between;
      @apply h-28;

      &--receives {
        @apply order-2;
      }

      &--provides {
        @apply order-4;
      }
    }
  }

  &__badge {
    @apply flex justify-center items-center;
    @apply w-24 h-24;
    @apply mx-1 mt-1;
    @apply bg-light bg-opacity-25;
    @apply rounded-full;
    @apply order-3;

    &-icon {
      @apply block;
      @apply w-12 h-12;
      @apply bg-light;
      @apply z-30;

      // TODO: get all icons here somehow
      @include icons("", Buzzie, Gamebryo);
    }
  }

  &__tree {
    @apply flex justify-center items-center;
    @apply justify-self-center self-center;
    @apply w-10 h-10;
    @apply mx-16;
    @apply bg-light bg-opacity-25;
    @apply rounded-full;
    @apply order-1;

    @include trees using ($tree) {
      @apply bg-#{$tree} bg-opacity-25;
    }

    &-icon {
      @apply block;
      @apply w-5 h-5;

      @include trees using ($tree) {
        @apply bg-#{$tree};
      }

      @include icons("", Neutral, Science, Economy, Society);
    }
  }

  &__era {
    @apply order-5;
    @apply mx-12;
  }

  &__install {
    @apply absolute inset-0;
    @apply flex items-center justify-center;
    @apply w-full;
    @apply p-1;
    @apply clip-hexagon;

    &::before {
      content: "";
      @apply bg-ash bg-opacity-50;
      @apply w-full h-full;
      @apply clip-hexagon;
    }

    &:hover &-trigger {
      @apply animate-none;
    }

    &-trigger {
      @apply button button-confirm;
      @apply absolute;
      @apply animate-ping;
      animation-duration: 3s;
    }
  }
}
</style>
