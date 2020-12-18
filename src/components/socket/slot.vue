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
  @apply justify-between items-center;
  @apply w-48 h-hex*48;
  @apply text-center;
  @apply px-2 py-4;
  @apply mx-1 -mt-hex/16;
  @apply overflow-hidden;
  @apply clip-hexagon;

  @apply bg-light;
}
</style>
