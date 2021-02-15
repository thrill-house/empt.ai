<script>
import { mapGetters, mapState } from "vuex";
import dayjs from "dayjs";

export default {
  name: "game-wallet",
  data: () => ({
    toppingUp: false,
  }),
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
    ...mapState({
      identityId: "identityId",
    }),
    ...mapGetters({
      accountSynced: "Player/accountSynced",
      accountSyncing: "Player/accountSyncing",
      confirmedBalance: "Player/confirmedBalance",
      unconfirmedBalance: "Player/unconfirmedBalance",
      unusedAddress: "Player/unusedAddress",
      identitySynced: "Player/identitySynced",
      identitySyncing: "Player/identitySyncing",
      client: "Player/client",
      credit: "Player/credit",
    }),
  },
  methods: {
    async topUp() {
      this.toppingUp = true;
      await this.client.platform.identities.topUp(this.identityId, 10000);
      this.toppingUp = false;
    },
  },
};
</script>

<template>
  <div v-bem :data-label="$t(`Status`)">
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
      :data-postfix="$t(`credits`)"
      :title="$t(`Available credit`)"
    >
      {{ credit }}
    </meter>
  </div>
  <button
    v-bem:topup="{ loading: toppingUp }"
    :title="$t(`Top up credits`)"
    :disabled="toppingUp"
    @click="topUp()"
  >
    <label v-bem:topupLabel>{{
      !toppingUp ? $t(`Top up credits`) : $t(`Topping up credits...`)
    }}</label>
  </button>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-wallet {
  @apply flex items-center justify-center;
  @apply h-6;
  @apply mt-2 pr-2;
  @apply bg-grout bg-grout-sky bg-opacity-50;

  &::before {
    content: attr(data-label);
    @apply absolute top-0 left-0;
    @apply flex items-center justify-end;
    @apply transform -translate-x-full;
    @apply h-6 w-28;
    @apply pr-1;
    @apply text-2xs text-grey;
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

    //Webkit styling
    &::-webkit-meter-bar {
      @apply w-4 h-2;
      @apply mr-1;
      @apply border-none;
      @apply rounded-sm;
    }

    &::-webkit-meter-optimum-value {
      @apply bg-go;
    }

    &::-webkit-meter-suboptimum-value {
      @apply bg-wait;
    }

    &::-webkit-meter-even-less-good-value {
      @apply bg-stop;
    }

    //Mozilla styling
    @supports (-moz-appearance: none) {
      @apply w-4 h-2;
      @apply mr-1;
      @apply border-none;
      @apply rounded-sm;
      @apply bg-none bg-light;
    }

    &::-moz-meter-bar {
      @apply border-none;
      @apply rounded-sm;
    }

    &:-moz-meter-optimum::-moz-meter-bar {
      @apply bg-none bg-go;
    }

    &:-moz-meter-sub-optimum::-moz-meter-bar {
      @apply bg-none bg-wait;
    }

    &:-moz-meter-sub-sub-optimum::-moz-meter-bar {
      @apply bg-none bg-stop;
    }

    &::after {
      content: attr(value) " " attr(data-postfix);
      @apply block;
      @apply w-auto;
      @apply text-xs;
      @apply whitespace-nowrap;
    }
  }

  &__topup {
    @apply flex items-center justify-center;
    @apply bg-grout bg-grout-sky bg-opacity-50;
    @apply w-6 h-6 mx-2 mt-2;

    &::before {
      content: "";
      @apply block w-3.5 h-3.5;
      @apply bg-light;
      @apply mask-topup;
    }

    &--loading {
      &:before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }

    &-label {
      @apply hidden absolute right-0;
      @apply whitespace-nowrap;
      @apply -mr-2;
      @apply transform translate-x-full;
      @apply uppercase;
    }

    &:hover &-label {
      @apply block;
    }
  }
}
</style>
