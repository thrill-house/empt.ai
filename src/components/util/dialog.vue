<script>
export default {
  name: "util-dialog",
  props: {
    open: Boolean,
  },
  data: () => ({
    visible: false,
  }),
  mounted() {
    if (this.open) {
      this.show();
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.$el?.showModal();
    },
    close() {
      this.visible = false;
      this.$el?.close();
    },
  },
  watch: {
    open(openVal) {
      if (openVal) {
        this.show();
      } else {
        this.close();
      }
    },
  },
};
</script>

<template>
  <dialog v-bem>
    <template v-if="visible">
      <header v-bem:header>
        <h3 v-bem:headerTitle><slot name="title" /></h3>
      </header>
      <div v-bem:content>
        <slot name="default" />
      </div>
    </template>
  </dialog>
</template>

<style lang="scss">
@import "../../styles/helper";

.util-dialog {
  @apply fixed inset-0;
  @apply w-192;
  @apply p-6;
  @apply text-light bg-ash bg-opacity-75;
  @apply z-50;
  @apply clip-2-corners;

  &::backdrop {
    @apply fixed inset-0;
    @apply bg-midnight bg-opacity-75;
    @apply z-40;
  }

  &__header {
    @apply flex flex-nowrap items-center justify-center;

    &::before,
    &::after {
      content: "";
      @apply flex-grow;
      @apply h-px;
      @apply bg-light;
    }

    &-title {
      @apply flex-grow-0;
      @apply text-2xl uppercase;
      @apply px-4;
    }
  }

  &__content {
    @apply flex flex-col;
    @apply mt-8;
  }
}
</style>
