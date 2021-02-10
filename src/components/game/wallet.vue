<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  name: "game-wallet",
  computed: {
    dashBalance() {
      return this.confirmedBalance ? this.confirmedBalance / 100000000 : 0;
    },
    accountSyncedAgo() {
      return dayjs(this.accountSynced).fromNow();
    },
    identitySyncedAgo() {
      return dayjs(this.identitySynced).fromNow();
    },
    ...mapGetters({
      accountSynced: "Player/accountSynced",
      accountSyncing: "Player/accountSyncing",
      confirmedBalance: "Player/confirmedBalance",
      unconfirmedBalance: "Player/unconfirmedBalance",
      unusedAddress: "Player/unusedAddress",
      identitySynced: "Player/identitySynced",
      identitySyncing: "Player/identitySyncing",
      credit: "Player/credit",
    }),
  },
  methods: {
    async topUp() {
      // TODO: Top up
    },
  },
};
</script>

<template>
  <div v-bem>
    <time
      v-bem:sync="{ syncing: accountSyncing, synced: !!accountSynced }"
      :datetime="accountSynced"
      :title="
        (accountSyncing && $t(`Synchronising account`)) ||
        $t(`Last synchronised {syncTime}`, { syncTime: accountSyncedAgo })
      "
    >
      {{ $t("Account") }}
    </time>
    <time
      v-bem:sync="{ syncing: identitySyncing, synced: !!identitySynced }"
      :datetime="identitySynced"
      :title="
        (identitySyncing && $t(`Synchronising identity`)) ||
        $t(`Last synchronised {syncTime}`, { syncTime: identitySyncedAgo })
      "
    >
      {{ $t("Identity") }}
    </time>
    <meter
      v-bem:credit
      min="0"
      low="2000000"
      high="6000000"
      optimum="8000000"
      max="10000000"
      :value="credit || `0`"
      :title="$t(`Available credit`)"
    >
      {{ credit }}
    </meter>
  </div>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-wallet {
  @apply flex items-center justify-center;
  @apply h-6;
  @apply mt-2 pr-2;
  @apply bg-grout bg-grout-sky bg-opacity-50;

  &::before {
    content: "";
    @apply absolute block top-0 left-0;
    @apply transform -translate-x-full;
    @apply h-6 w-28;
    @apply bg-grout bg-grout-sky bg-opacity-50;
  }

  &__label {
    @apply text-xs;
  }

  &__sync {
    @apply relative;
    @apply flex items-center;
    @apply text-xs;

    & + & {
      @apply ml-2;
    }

    &::before {
      content: "";
      @apply block;
      @apply w-2 h-2;
      @apply mr-1;
      @apply rounded-full;
      @apply bg-grey;
    }

    &--syncing {
      &::before {
        @apply bg-wait;
        @apply w-1.5 h-1.5;
        @apply animate-ping;
      }
    }

    &--synced {
      &::before {
        @apply bg-go;
      }
    }
  }

  &__credit {
    @apply relative;
    @apply flex;
    @apply w-auto;
    @apply ml-2;
    @apply border-none;

    &::-webkit-meter-bar {
      @apply w-4 h-2;
      @apply mr-1;
      @apply border-none;
      @apply rounded-sm;
    }
    &::-moz-meter-bar {
      @apply w-4 h-2;
      @apply mr-1;
      @apply border-none;
      @apply rounded-sm;
    }

    &::-webkit-meter-optimum-value {
      @apply bg-go;
    }
    &::-moz-meter-optimum {
      @apply bg-go;
    }

    &::-webkit-meter-suboptimum-value {
      @apply bg-wait;
    }
    &::-moz-meter-sub-optimum {
      @apply bg-wait;
    }

    &::-webkit-meter-even-less-good-value {
      @apply bg-stop;
    }
    &::-moz-meter-sub-sub-optimum {
      @apply bg-stop;
    }

    &::after {
      content: attr(value);
      @apply block;
      @apply w-auto;
      @apply text-xs;
    }
  }
}
</style>
