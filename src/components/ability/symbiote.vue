<script>
import { mapGetters } from "vuex";

import hover from "../../mixins/hover";
import UtilTooltip from "../util/tooltip";

export default {
  name: "ability-symbiote",
  components: {
    UtilTooltip,
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
      getAbility: "inventory/getAbility",
      getAbilitySymbiosis: "inventory/getAbilitySymbiosis",
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
    <util-tooltip v-bem:tooltip :position="position">
      <dl>
        <dt v-bem:symbiosis v-if="type === 'receives'">
          {{
            $t("Receives from {sourceTitle} when both installed", {
              sourceTitle,
            })
          }}
        </dt>
        <dt v-bem:symbiosis v-else>
          {{
            $t("Provides {sourceTitle} when both installed", { sourceTitle })
          }}
        </dt>
        <dd>
          <dl v-bem:symbiosisValues>
            <template v-for="({ type, factor }, s) in symbiosis" :key="s">
              <dt v-bem:symbiosisType v-if="type === 'bandwidth'">
                {{ $t("Bandwidth") }}
              </dt>
              <dt v-bem:symbiosisType v-else-if="type === 'influence'">
                {{ $t("Influence") }}
              </dt>
              <dd
                v-bem:symbiosisValue="{ [type]: true }"
                v-format:percentage.+="factor"
              />
            </template>
          </dl>
        </dd>
      </dl>
    </util-tooltip>
  </teleport>
</template>

<style lang="scss">
.ability-symbiote {
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

    // TODO: Somehow import all icon modifiers in here in a loop
    &--Buzzie {
      @apply mask-buzzie;
    }

    &--Gamebryo {
      @apply mask-gamebryo;
    }

    &--unknown {
      @apply mask-unknown;
    }

    &--empty {
      @apply w-8 h-8;
      @apply rounded-full;
      @apply bg-transparent;
    }
  }

  &__tooltip {
    @apply flex;
    @apply font-normal text-sm;
    @apply w-32;
  }

  &__symbiosis {
    @apply mb-2 order-last;

    &-values {
      @apply flex flex-wrap justify-between;
      @apply w-full;
    }

    &-type {
      @apply sr-only;
    }
    &-value {
      @apply flex;
      @apply font-bold;

      &:before {
        content: "";
        @apply block;
        @apply w-5 h-5 mr-1;
        @apply bg-light;
      }

      &--bandwidth:before {
        @apply mask-bandwidth bg-bandwidth;
      }
      &--influence:before {
        @apply mask-influence bg-influence;
      }
    }
  }
}
</style>
