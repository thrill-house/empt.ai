<script>
import { mapGetters } from "vuex";
import { invokeMap, pickBy, sortBy } from "lodash-es";

import AbilityProfile from "../ability/profile";

export default {
  name: "game-inventory",
  components: {
    AbilityProfile,
  },
  data: () => ({
    toggles: null,
    filters: null,
    abilityRefs: [],
  }),
  computed: {
    filteredAbilities() {
      return this.filters
        ? pickBy(this.getAbilities, this.filters)
        : this.getAbilities;
    },
    trees() {
      // TODO: Move this sorting somewhere more useful
      return sortBy(this.getTrees, ({ title }) => {
        switch (title) {
          case "Neutral":
            return 1;
          case "Science":
            return 2;
          case "Economy":
            return 3;
          case "Society":
            return 4;
        }
      });
    },
    eras() {
      // TODO: Move this sorting somewhere more useful
      return sortBy(this.getEras, ({ title }) => {
        switch (title) {
          case "Hobbyist":
            return 1;
          case "University":
            return 2;
          case "Business":
            return 3;
          case "Government":
            return 4;
          case "Consciousness":
            return 4;
        }
      });
    },
    actions() {
      return {
        trees: this.trees,
        eras: this.eras,
      };
    },
    ...mapGetters({
      getAbilities: "inventory/abilities",
      getTrees: "App/Trees/all",
      getEras: "App/Eras/all",
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
        @mouseenter="addToggle(action)"
        @mouseleave="delete toggles?.[action]"
        :key="action"
      >
        <ol v-bem:filterList="{ [action]: true, active: toggles?.[action] }">
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
    <ability-profile
      v-bem:profile
      v-for="(ability, a) in filteredAbilities"
      :id="a"
      :key="a"
      :ref="setAbilityRef"
    />
  </section>
</template>

<style lang="scss">
@import "../../styles/mixins";

.game-inventory {
  @apply w-full;

  &__actions {
    @apply relative flex justify-between;
    @apply w-full h-16;
    @apply px-4 py-3;
    @apply bg-sky bg-opacity-50;
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