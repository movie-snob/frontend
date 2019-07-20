<template>
  <nav>
    <b-navbar toggleable="sm" type="light" variant="light">
      <b-container>
        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

        <b-navbar-brand to="/movies/suggest">MovieSnob</b-navbar-brand>

        <b-collapse id="nav-text-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/movies/suggest">Предложить</b-nav-item>
            <b-nav-item to="/movies/discuss">Обсудить</b-nav-item>
            <b-nav-item to="/movies/archive">Архив</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-text>
              {{ userName }}
            </b-nav-text>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import progress from 'nprogress'
import 'nprogress/nprogress.css'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters([
      'userName',
      'userLoaded'
    ]),

  },
  mounted() {
    if (!this.userLoaded) {
      progress.start()

      this.$store.dispatch('GetUserInfo'),

      progress.done()
    }
  },
}
</script>
