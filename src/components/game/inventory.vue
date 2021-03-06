<script>
import { mapGetters } from "vuex";
import { invokeMap, keys, pickBy, sortBy } from "lodash-es";

import AbilityComponent from "../ability/component";

export default {
  name: "game-inventory",
  components: {
    AbilityComponent,
  },
  data: () => ({
    toggles: null,
    filters: null,
    abilityRefs: [],
  }),
  computed: {
    filteredAbilities() {
      return sortBy(
        this.filters ? pickBy(this.abilities, this.filters) : this.abilities,
        "title"
      );
    },
    actions() {
      return {
        trees: this.trees,
        eras:
          this.currentEra > 1
            ? pickBy(this.eras, (era) => era.stage <= this.currentEra)
            : {},
      };
    },
    ...mapGetters({
      abilities: "inventory/abilities",
      trees: "labels/trees",
      eras: "labels/eras",
      currentEra: "score/currentEra",
    }),
  },
  methods: {
    addToggle(key) {
      this.toggles = { ...this.toggles, [key]: true };
    },
    setAbilityRef(el) {
      this.abilityRefs.push(el);
    },
    addFilter(key, value) {
      this.filters = { ...this.filters, [key]: value };
    },
    keys,
    invokeMap,
  },
};
</script>

<template>
  <section v-bem>
    <nav v-bem:actions>
      <div
        v-for="(actionFilter, action) in { trees: 'treeId', eras: 'eraId' }"
        v-bem:action.filter
        :key="action"
        @mouseenter="addToggle(action)"
        @mouseleave="delete toggles?.[action]"
      >
        <ol
          v-if="keys(actions[action]).length"
          v-bem:filterList="{ [action]: true, active: toggles?.[action] }"
        >
          <li v-bem:filterOption="{ active: !filters?.[actionFilter] }">
            <button
              v-bem:filterToggle="{ [action]: true }"
              @click="delete filters?.[actionFilter]"
            >
              {{ $t("All {items}", { items: $t(action) }) }}
            </button>
          </li>
          <li
            v-bem:filterOption="{ active: $id === filters?.[actionFilter] }"
            v-for="({ $id, title }, a) in actions[action]"
            :key="a"
          >
            <button
              v-bem:filterToggle="{ [title]: true }"
              @click="addFilter(actionFilter, $id)"
            >
              {{ $t(title) }}
            </button>
          </li>
        </ol>
      </div>
      <div
        v-bem:action.view
        @mouseenter="addToggle('view')"
        @mouseleave="delete toggles.view"
      >
        <ul v-bem:viewList="{ active: toggles?.view }">
          <li v-bem:viewOption>
            <button
              v-bem:viewToggle="{ attributes: true }"
              @click="invokeMap(abilityRefs, 'viewToggle', 'attributes')"
            >
              {{ $t("Attributes") }}
            </button>
          </li>
          <li v-bem:viewOption>
            <button
              v-bem:viewToggle="{ synergies: true }"
              @click="invokeMap(abilityRefs, 'viewToggle', 'synergies')"
            >
              {{ $t("Synergies") }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <ability-component
      v-bem:component
      v-for="{ $id } in filteredAbilities"
      :id="$id"
      :key="$id"
      :ref="setAbilityRef"
    />
  </section>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-inventory {
  @apply w-full h-full;
  @apply overflow-auto;

  &__actions {
    @apply sticky flex justify-between;
    @apply top-0;
    @apply w-full h-16;
    @apply px-4 py-3;
    @apply bg-grout bg-grout-sky bg-opacity-50;
    @apply shadow-lg;
    @apply border-b border-navy;
    @apply z-50;
  }

  &__action {
    @apply relative;
    @apply w-1/5 h-10;

    &--filter {
      @apply w-2/5;
    }
  }

  &__filter {
    @apply absolute;

    &-list {
      @apply px-2;
      @apply clip-corners;

      &:hover {
        @apply bg-navy;
      }
    }

    &-option {
      @apply items-center;
      @apply hidden;
      @apply h-10;
      @apply leading-10;

      &--active {
        @apply flex;
      }
    }

    &-toggle {
      @apply flex items-center;
      @apply text-sm;

      &:hover {
        @apply underline;
      }

      &::before {
        content: "";
        @apply inline-block;
        @apply w-6 h-6 mr-2;
        @apply bg-light;
      }

      @include icons(
        "::before",
        trees,
        Neutral,
        Science,
        Economy,
        Society,
        eras,
        Hobbyist,
        University,
        Business,
        Government,
        Consciousness
      );
    }

    &-list--active &-option {
      @apply flex;
    }
  }

  &__view {
    &-list {
      @apply flex flex-col absolute;
      @apply top-0 right-0;
      @apply px-2;

      &::before {
        content: "";
        @apply block;
        @apply self-end;
        @apply w-4 h-4 mt-3;
        @apply bg-light;
        @apply mask-view;
      }

      &--active {
        @apply block;
        @apply bg-navy;
        @apply clip-corners;

        &::before {
          @apply hidden;
        }
      }
    }

    &-option {
      @apply items-center;
      @apply hidden;
      @apply h-10;
      @apply leading-10;
    }

    &-list--active &-option {
      @apply flex;
    }

    &-toggle {
      @apply flex items-center;
      @apply text-sm;

      &:hover {
        @apply underline;
      }

      &::before {
        content: "";
        @apply inline-block;
        @apply w-6 h-6 mr-2;
        @apply bg-light;
      }

      @include icons("::before", attributes, synergies);
    }
  }
}
</style>