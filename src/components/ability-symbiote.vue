<docs>
### Ability synergy
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-synergy label.string="ability-label" type.string="dependency || dependant"></ability-synergy>`
</docs>

<script>
// import store from '../store';
import { mapGetters } from "vuex";

import BaseBadge from "./base-badge";
import BaseHover from "./base-hover";
import BaseIcon from "./base-icon";
import TheTooltip from "./the-tooltip";

export default {
  name: "ability-synergy",
  extends: BaseHover,
  components: {
    BaseBadge,
    BaseIcon,
    TheTooltip,
  },
  props: {
    label: [String, Boolean],
    type: String,
    source: {
      type: [Object, Boolean],
      default: false,
    },
  },
  computed: {
    name() {
      return this.isAvailable ? this.ability.name : "??????";
    },
    ability() {
      return !this.empty ? this.getAbility(this.label) : false;
    },
    isSlotted() {
      return this.event.length ? true : false;
    },
    isDependency() {
      return this.type === "dependency";
    },
    isDependant() {
      return this.type === "dependant";
    },
    isEmpty() {
      return !this.label;
    },
    isAvailable() {
      return !this.isEmpty && this.isEraActive;
    },
    isUnknown() {
      return !this.isEmpty && !this.isEraActive;
    },
    isEraActive() {
      return !this.isEmpty ? this.getIsEraActive(this.ability.era) : false;
    },
    event() {
      return !this.isEmpty ? this.getAbilitySlotEvent(this.label) : {};
    },
    icon() {
      return !this.isEmpty
        ? this.isAvailable
          ? this.label
          : "unknown"
        : "empty";
    },
    color() {
      return this.isDependant ? (this.isSlotted ? "sky" : "ash") : "ash";
    },
    iconColor() {
      return this.isDependency && this.isSlotted ? "sky" : "light";
    },
    borderColor() {
      return this.isDependency ? (this.isSlotted ? "sky" : "light") : false;
    },
    borderSize() {
      return this.borderColor ? "medium" : false;
    },
    slotted() {
      return {
        slotted: this.isSlotted,
        "not-slotted": !this.isSlotted,
      };
    },
    status() {
      return {
        unknown: this.isUnknown,
        empty: this.isEmpty,
        ...this.slotted,
      };
    },
    factor() {
      return this.source && this.ability
        ? this.isDependency
          ? this.source.factors.influence.dependencies[this.label]
          : this.ability.factors.influence.dependencies[this.source.label]
        : false;
    },
    ...mapGetters(["getAbility", "getAbilitySlotEvent", "getIsEraActive"]),
  },
  emits: ["over", "out", "move"],
};
</script>

<template>
  <base-badge
    v-bem="status"
    size="tiny"
    :color="color"
    :borderColor="borderColor"
    :borderSize="borderSize"
    @mouseover="over"
    @mouseout="out"
    @mousemove="move"
  >
    <base-icon v-bem:icon size="tiny" :color="iconColor" :label="icon" />
    <portal v-if="hover && factor" to="tooltips">
      <the-tooltip v-bem:tooltip="slotted" :position="position">
        <template v-if="isDependency">
          <span v-bem:percentage="slotted" v-format:percentage.+="factor" />
          {{ $t("with") }} <span v-bem:name>{{ name }}</span>
        </template>
        <template v-else>
          <span v-bem:name>{{ name }}</span> {{ $t("gains") }}
          <span v-bem:percentage="slotted" v-format:percentage.+="factor" />
        </template>
      </the-tooltip>
    </portal>
  </base-badge>
</template>

<style lang="scss">
@import "../styles/util";

.ability-synergy {
  &--slotted {
    animation: pulse 3s infinite;
  }

  &--unknown {
    @apply opacity-25;
  }

  &--empty {
    @apply opacity-10;
  }

  &__tooltip {
    @apply font-normal text-sm;

    &--not-slotted {
      @apply line-through;
    }
  }

  &__percentage {
    &--slotted {
      @apply text-sky;
    }

    &--not-slotted {
      @apply text-grey;
    }
  }

  &__percentage,
  &__name {
    @apply font-bold;
  }
}
</style>
