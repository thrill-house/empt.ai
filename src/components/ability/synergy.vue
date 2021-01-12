<script>
import { mapGetters } from "vuex";

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
    title() {
      // TODO: Figure out title based on if we are active or not.
      return this.ability?.title || null;
    },
    slotted() {
      // TODO: Figure out if this symbiosis is active currently.
      return false;
    },
    unknown() {
      // TODO: Figure out if we are allowed to see this yet?
      return false;
    },
    empty() {
      return !this.id;
    },
    sourceTitle() {
      return this.source?.title || null;
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
      <dt v-bem:symbiosis>
        {{
          {
            receives: $t("Receives from {sourceTitle} when both installed.", {
              sourceTitle,
            }),
            provides: $t("Provides to {sourceTitle} when both installed.", {
              sourceTitle,
            }),
          }[type]
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

  &--slotted {
    @apply animate-pulse;
    @apply border border-light;
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
