<docs>
### Playing field
The component displays all **data sockets**, **socket slots** and **enabled abilities** on the field in their correct locations.

##### Instantiation
`<playing-field></playing-field>`

---
</docs>

<template>
  <div class="playing-field relative">
	  <div class="w-full">
		  <data-socket
		    v-for="(socket, index) in sockets"
		    :key="index"
		    :label="index"
		    class="my-2 py-2 border-t border-b border-solid border-grey w-full">
		  </data-socket>
	  </div>
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	import DataSocket from './data-socket.vue';
	
	export default {
	  name: 'playing-field',
	  components: {
	    DataSocket
	  },
	  props: {
	    label: String
	  },
	  store,
	  computed: mapState(['sockets'])
	}
</script>

<style lang="scss">
	@import '../assets/scss/default';
</style>
