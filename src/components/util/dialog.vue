<script>
export default {
  name: "util-dialog",
  data: () => ({
    open: false,
  }),
  methods: {
    show() {
      this.open = true;
      this.$el?.showModal();
    },
    close() {
      this.open = false;
      this.$el?.close();
    },
  },
};
</script>

<template>
  <dialog v-bem>
    <template v-if="open">
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
.util-dialog {
  @apply fixed inset-0;
  @apply w-192;
  @apply p-6;
  @apply bg-navy text-light;
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
