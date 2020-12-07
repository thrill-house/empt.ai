<script>
import { mapGetters } from "vuex";
import { invokeMap, matches, pickBy, sortBy } from "lodash-es";

import AbilityProfile from "../ability/profile";

export default {
  name: "game-inventory",
  components: {
    AbilityProfile,
  },
  data: () => ({
    toggles: null,
    // Trees: false,
    // toggleEras: false,
    filters: null,
    abilityRefs: [],
  }),
  computed: {
    filteredAbilities() {
      return this.filters
        ? pickBy(this.abilities, matches(this.filters))
        : this.abilities;
    },
    trees() {
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
    ...mapGetters({
      abilities: "inventory/getAbilities",
      getTrees: "app/Trees/all",
      getEras: "app/Eras/all",
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
      <div v-bem:action.filter>
        <ol
          v-bem:filterList="{ tree: true, active: toggles?.trees }"
          @mouseenter="addToggle('trees')"
          @mouseleave="delete toggles.trees"
        >
          <li v-bem:filterOption="{ active: !filters?.treeId }">
            <button
              v-bem:filterToggle="{ Tree: true }"
              @click="delete filters.treeId"
            >
              {{ $t("All trees") }}
            </button>
          </li>
          <li
            v-bem:filterOption="{ active: $id === filters?.treeId }"
            v-for="({ $id, title }, t) in trees"
            :key="t"
          >
            <button
              v-bem:filterToggle="{ [title]: true }"
              @click="addFilter('treeId', $id)"
            >
              {{ $t(title) }}
            </button>
          </li>
        </ol>
      </div>
      <div v-bem:action.filter>
        <ol
          v-bem:filterList="{ era: true, active: toggles?.eras }"
          @mouseenter="addToggle('eras')"
          @mouseleave="delete toggles.eras"
        >
          <li v-bem:filterOption="{ active: !filters?.eraId }">
            <button
              v-bem:filterToggle="{ Era: true }"
              @click="delete filters.eraId"
            >
              {{ $t("All eras") }}
            </button>
          </li>
          <li
            v-bem:filterOption="{ active: $id === filters?.eraId }"
            v-for="({ $id, title }, e) in eras"
            :key="e"
          >
            <button
              v-bem:filterToggle="{ [title]: true }"
              @click="addFilter('eraId', $id)"
            >
              {{ $t(title) }}
            </button>
          </li>
        </ol>
      </div>
      <div v-bem:action.switch>
        <ul>
          <li>
            <button @click="invokeMap(abilityRefs, 'viewToggle', 'attributes')">
              {{ $t("Attributes") }}
            </button>
          </li>
          <li>
            <button @click="invokeMap(abilityRefs, 'viewToggle', 'symbiotes')">
              {{ $t("Symbiotes") }}
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
.game-inventory {
  @apply w-full;

  &__actions {
    @apply relative flex justify-between;
    @apply w-full;
    @apply px-4 pt-4;
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
      @apply p-2;
      @apply leading-10;
      @apply rounded-xl;

      &:hover {
        @apply bg-sky bg-opacity-90;
      }

      &--trees {
      }

      &--eras {
      }
    }

    &-option {
      @apply hidden;

      &--active {
        @apply block;
      }
    }

    &-toggle {
      @apply flex items-center;
      @apply text-sm;

      &:before {
        content: "";
        @apply inline-block;
        @apply w-6 h-6 mr-2;
        @apply bg-light;
      }

      &:hover {
        @apply underline;
      }

      &--Tree {
        &:before {
          @apply mask-tree;
        }
      }

      &--Neutral {
        &:before {
          @apply mask-neutral;
        }
      }

      &--Science {
        &:before {
          @apply mask-science;
        }
      }

      &--Economy {
        &:before {
          @apply mask-economy;
        }
      }

      &--Society {
        &:before {
          @apply mask-society;
        }
      }

      &--Era {
        &:before {
          @apply mask-era;
        }
      }

      &--Hobbyist {
        &:before {
          @apply mask-hobbyist;
        }
      }

      &--University {
        &:before {
          @apply mask-university;
        }
      }

      &--Business {
        &:before {
          @apply mask-business;
        }
      }

      &--Government {
        &:before {
          @apply mask-government;
        }
      }

      &--Consciousness {
        &:before {
          @apply mask-consciousness;
        }
      }
    }

    // &-option--active &-toggle {
    //   @apply underline;
    // }

    &-list--active &-option {
      @apply block;
    }
  }
}
</style>