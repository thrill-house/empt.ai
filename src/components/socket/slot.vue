<script>
import { mapGetters, mapActions } from "vuex";

import hover from "../../mixins/hover";
import AbilitySynergies from "../ability/synergies";
import EmotionDiagram from "../emotion/diagram";
import UtilEra from "../util/era";
import UtilTooltip from "../util/tooltip";

export default {
  name: "socket-slot",
  components: { AbilitySynergies, EmotionDiagram, UtilEra, UtilTooltip },
  mixins: [hover],
  props: {
    slotIndex: Number,
  },
  data: () => ({
    slotting: false,
    toggle: "badge",
  }),
  inject: ["socketId", "socketTree", "socketEra"],
  emits: ["addSlotValues"],
  created() {
    this.updateSlotValues();
  },
  computed: {
    id() {
      return this.slot?.$id;
    },
    modelId() {
      return this.slot?.modelId;
    },
    uniqueId() {
      return `${this.socketId}-${this.slotIndex}`;
    },
    source() {
      return this.getSocketSource(this.socketId);
    },
    slot() {
      return this.getSourceSlot(this.source.$id, this.slotIndex);
    },
    online() {
      return !!this.source?.$id;
    },
    installing() {
      return !!(
        this.getInstalling?.abilityId &&
        this.getInstalling?.modelId &&
        this.getInstalling?.modelId !== this.modelId
      );
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
    description() {
      return this.ability?.description;
    },
    tree() {
      return this.getTree(this.ability?.treeId)?.title || false;
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

    bases() {
      return this.getAbilityCoreBases(this.abilityId);
    },
    treeFactors() {
      return this.getAbilityTreeFactors(this.abilityId);
    },
    eraFactors() {
      return this.getAbilityEraFactors(this.abilityId);
    },

    match() {
      return this.tree === this.socketTree;
    },
    model() {
      return this.getModel(this.modelId);
    },
    ...mapGetters({
      getInstalling: "system/slotting",
      getSourceSlot: "system/sourceSlot",
      getSocketSource: "inventory/socketSource",
      getAbility: "inventory/ability",
      getAbilityDependants: "inventory/abilityDependants",
      getAbilityDependees: "inventory/abilityDependees",
      getAbilityCoreBases: "inventory/abilityCoreBases",
      getAbilityTreeFactors: "inventory/abilityTreeFactors",
      getAbilityEraFactors: "inventory/abilityEraFactors",
      getModel: "inventory/model",
      getTree: "labels/tree",
      getEra: "labels/era",
    }),
  },
  methods: {
    async install() {
      if (this.source?.$id) {
        this.slotting = true;

        await this.installingSource(this.source?.$id);
        await this.installingIndex(this.slotIndex);

        if (this.id) {
          await this.installingSlot(this.id);
        }

        const payload = this.getInstalling;

        this.installingReset();

        await this.installModel(payload);

        this.slotting = false;
      }
    },
    updateSlotValues() {
      if (this.slot) {
        this.$emit("updateSlotValues", {
          id: this.uniqueId,
          bases: this.bases,
          treeFactors: this.treeFactors,
          eraFactors: this.eraFactors,
        });
      } else {
        this.$emit("updateSlotValues", {
          id: this.uniqueId,
        });
      }
    },
    viewToggle(view) {
      this.toggle = view;
    },
    ...mapActions({
      installingReset: "system/slottingReset",
      installingSource: "system/slottingSource",
      installingIndex: "system/slottingIndex",
      installingSlot: "system/slottingSlot",
      installModel: "Game/Slots/create",
    }),
  },
  watch: {
    slot() {
      this.updateSlotValues();
    },
  },
};
</script>

<template>
  <div v-bem="{ [tree]: true, online, match, installing, slotting }">
    <template v-if="slot && ability">
      <div
        v-bem:badge="{ active: toggle === 'badge' }"
        @mouseenter="enter"
        @mouseleave="leave"
        @mousemove="move"
      >
        <i v-bem:badgeIcon="{ [title]: true }" />
      </div>
      <ability-synergies
        v-for="(synergies, synergy) in synergiesList"
        v-bem:synergiesList="{ [synergy]: true }"
        :type="synergy"
        :source="ability"
        :minimum="3"
        :synergies="synergies"
        :key="synergy"
      />
      <emotion-diagram
        v-bem:emotions="{ active: toggle === 'emotions' }"
        :sets="model.feelings"
        :scale="2"
        :labels="false"
        @mouseenter="enter"
        @mouseleave="leave"
        @mousemove="move"
      />
      <div v-bem:tree="{ [tree]: true }">
        <i v-bem:treeIcon="{ [tree]: true }" />
      </div>
      <util-era v-bem:era :era="era" />
    </template>
    <div v-if="installing" v-bem:install>
      <button v-bem:installTrigger @click="install()">
        {{ $t("Install") }}
      </button>
    </div>
    <i v-if="slotting" v-bem:slotting="{ installing: slotting }" />
    <teleport to="#app" v-if="!empty && hover">
      <util-tooltip v-bem:tooltip :position="position">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </util-tooltip>
    </teleport>
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
    @apply absolute inset-1;
    @apply m-px;
    @apply bg-grout;
    @apply clip-hexagon;
    @apply z-10;
  }

  &::after {
    content: "";
    @apply absolute inset-1;
    @apply clip-hexagon;
  }

  &:not(&--match) {
    &::before {
      @apply bg-grout-light bg-opacity-20 #{!important};
    }
    &::after {
      @apply bg-light #{!important};
    }
  }

  & > * {
    @apply z-20;
  }

  &--slotting > * {
    @apply hidden #{!important};
  }

  @include trees using ($tree) {
    &::before {
      @apply bg-grout-#{$tree} bg-opacity-20;
    }
    &::after {
      @apply bg-#{$tree};
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
    @apply mx-1 my-1;
    @apply bg-light bg-opacity-25;
    @apply rounded-full;
    @apply order-3;
    @apply invisible;

    &-icon {
      @apply block;
      @apply w-12 h-12;
      @apply bg-light;
      @apply z-30;

      @include icons("", $abilities...);
    }

    &--active {
      @apply visible;
    }
  }

  &__emotions {
    @apply hidden;
    @apply absolute inset-x-12 inset-y-hex*14;
    @apply transform -translate-y-px;
    @apply w-24 h-24;

    &--active {
      @apply block;
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

    &-trigger {
      @apply button button-confirm button-lg;
      @apply absolute;
    }
  }

  &__slotting {
    @apply absolute inset-0;
    @apply flex #{!important};
    @apply items-center justify-center;
    @apply w-full;
    @apply p-1;
    @apply clip-hexagon;

    &::before {
      content: "";
      @apply absolute;
      @apply w-16 h-16;
      @apply bg-light;
      @apply animate-bounce;
      @apply z-20;
    }

    @include icons("::before", installing);

    &::after {
      content: "";
      @apply bg-ash bg-opacity-50;
      @apply w-full h-full;
      @apply clip-hexagon;
      @apply z-10;
    }
  }

  &__tooltip {
    @apply w-48;

    h3 {
      @apply font-bold uppercase;
    }
    p {
      @apply text-xs;
    }
  }
}
</style>
