<docs>
### Game events
The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation
`<game-events></game-events>`
</docs>

<template>
  <div id="game-events">
    <button class="button orange" @click="off = !off">Toggle</button>
    <div class="debug mt-4" :class="{ hidden: off }">
      <div v-if="events">
        <div class="event py-2 border-t border-solid border-grey" v-for="(event) in events" v-if="event.timestamp < now">
    	    <pre>{{ event }}</pre>
        </div>
        <div v-else>Not a valid event</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import store from "../store";
import _ from "lodash";

export default {
  name: "game-events",
  store,
  data: function() {
    return {
      off: true
    };
  },
  computed: {
    start: function() {
      return this.session.start;
    },
    now: function() {
      return this.session.now;
    },
    events: function() {
      return this.getEvents();
    },
    ...mapState(["session", "eras"]),
    ...mapGetters(["getEvents"])
  }
};
</script>

<style lang="scss">
</style>
