<docs>
### The events
The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation
`<the-events></the-events>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'the-events',
  store,
  data: () => ({
    off: true,
  }),
  computed: {
    start() {
      return this.session.start;
    },
    now() {
      return this.session.now;
    },
    events() {
      return this.getEvents();
    },
    ...mapState(['session', 'eras']),
    ...mapGetters(['getEvents']),
  },
};
</script>

<template>
  <div class="the-events">
    <button class="button orange" @click="off = !off">
      {{ $t('Toggle') }}
    </button>
    <div class="debug mt-4" :class="{ hidden: off }">
      <div v-if="events">
        <div
          v-for="event in events"
          :key="event"
          class="event py-2 border-t border-solid border-grey"
        >
          <pre v-if="event.timestamp < now">{{ event }}</pre>
          <pre v-else>{{ $t('Not a valid event') }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.the-events {
}
</style>
