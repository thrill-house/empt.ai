<script>
import { mapGetters } from "vuex";
import { keys } from "lodash-es";

import hover from "../../mixins/hover";
import UtilTooltip from "../util/tooltip";
import ValueOutput from "../value/output";

export default {
  name: "ability-synergy",
  components: {
    UtilTooltip,
    ValueOutput,
  },
  mixins: [hover],
  props: {
    id: [String, Boolean],
    type: String,
    source: {
      type: [Object, Boolean],
      default: false,
    },
  },
  computed: {
    ability() {
      return this.getAbility(this.id);
    },
    eraStage() {
      return this.getEra(this.ability?.eraId)?.stage;
    },
    title() {
      return this.ability?.title || null;
    },
    slotted() {
      return !!keys(this.getCurrentAbilitySlots(this.id)).length;
    },
    unknown() {
      return this.eraStage > this.currentEra;
    },
    empty() {
      return !this.id;
    },
    sourceTitle() {
      return !this.unknown ? this.ability?.title : this.$t("Unknown");
    },
    relationship() {
      return this.type === "receives"
        ? [this.source?.$id, this.id]
        : [this.id, this.source?.$id];
    },
    symbiosis() {
      return this.getAbilitySymbiosis(...this.relationship);
    },
    ...mapGetters({
      getAbility: "inventory/ability",
      getAbilitySymbiosis: "inventory/abilitySymbiosis",
      getCurrentAbilitySlots: "system/currentAbilitySlots",
      getEra: "labels/era",
      currentEra: "score/currentEra",
    }),
  },
};
</script>

<template>
  <div
    v-bem="{ [type]: true, slotted, empty, unknown }"
    @mouseenter="enter"
    @mouseleave="leave"
    @mousemove="move"
  >
    <i v-bem:icon="{ [title]: true, type, empty, unknown }" />
  </div>
  <teleport to="#app" v-if="!empty && hover">
    <util-tooltip tag="dl" v-bem:tooltip :position="position">
      <dt v-if="type === `receives`" v-bem:symbiosis>
        {{
          $t("Receives from {sourceTitle} when both installed", {
            sourceTitle,
          })
        }}
      </dt>
      <dt v-else-if="type === `provides`" v-bem:symbiosis>
        {{
          $t("Provides to {sourceTitle} when both installed", {
            sourceTitle,
          })
        }}
      </dt>
      <dd>
        <dl v-bem:symbiosisValues>
          <value-output
            v-for="({ type, factor }, s) in symbiosis"
            :key="s"
            :type="type"
            :factor="factor"
          />
        </dl>
      </dd>
    </util-tooltip>
  </teleport>
</template>

<style lang="scss">
@import "../../styles/helper";

.ability-synergy {
  @apply flex items-center justify-center;
  @apply w-8 h-8;
  @apply rounded-full;
  @apply opacity-50;

  &--slotted {
    @apply border border-light;
    @apply opacity-100;
  }

  &--receives {
    @apply bg-ash;
  }

  &--provides {
    @apply bg-sky;
  }

  &--empty {
    @apply animate-none;
    @apply bg-light;
    @apply opacity-10;
  }

  &__icon {
    @apply block;
    @apply w-5 h-5;
    @apply bg-light;

    @include icons("", $abilities...);

    &--empty {
      @apply w-8 h-8;
      @apply rounded-full;
      @apply bg-transparent;
    }
  }

  &__tooltip {
    @apply flex flex-col;
    @apply font-normal text-sm;
    @apply w-32;
  }

  &__symbiosis {
    @apply mb-2;

    &-values {
      @apply flex flex-wrap justify-between;
      @apply w-full;
    }
  }
}
</style>
