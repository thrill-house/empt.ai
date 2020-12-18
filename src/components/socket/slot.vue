<script>
export default {
  name: "socket-slot",
  props: {
    slotIndex: Number,
  },
  inject: ["id", "socket"],
  computed: {},
};
</script>

<template>
  <div v-bem>
    {{ slotIndex }}
  </div>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-slot {
  @apply relative;
  @apply flex flex-col;
  @apply justify-center items-center;
  @apply w-48 h-hex*48;
  @apply text-center text-dark;
  @apply px-2 py-4;
  @apply -mt-hex*6;
  @apply overflow-hidden;

  &:before {
    content: "";
    @apply absolute inset-1;
    @apply m-px;
    @apply bg-grout;
    @apply bg-grout-light bg-opacity-25;
    @apply clip-hexagon;
    @apply z-10;
  }

  &:after {
    content: "";
    @apply absolute inset-1;

    @apply clip-hexagon;
    @apply bg-light;
  }
}
</style>
