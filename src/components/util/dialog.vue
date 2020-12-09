<script>
export default {
  name: "util-dialog",
  props: {
    tag: String,
  },
};
</script>

<template>
  <dialog v-bem>
    <header v-bem:header>
      <h3 v-bem:headerTitle><slot name="title" /></h3>
    </header>
    <slot />
  </dialog>
</template>

<style lang="scss">
.util-dialog {
  @apply fixed inset-0;
  @apply w-192 h-128;
  @apply px-4 py-2;
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
}
</style>
