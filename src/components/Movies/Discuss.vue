<template>
  <b-modal :title="this.movieUnderDiscussion.title" v-model="this.isMovieUnderDiscussion" size="lg" id="discuss-modal">
    123
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Discuss',
  computed: {
    ...mapGetters([
      'onlineUsers'
    ])
  },
  props: ['movieUnderDiscussion', 'isMovieUnderDiscussion']
}
</script>
