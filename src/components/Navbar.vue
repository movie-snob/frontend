<template>
  <nav>
    <b-navbar toggleable="sm" type="light" variant="light">
      <b-container>
        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

        <b-navbar-brand to="/movies/suggest">MovieSnob</b-navbar-brand>

        <b-collapse id="nav-text-collapse" is-nav>
          <b-navbar-nav>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template slot="button-content">{{ userName }}</template>
              <b-dropdown-item @click="logout">Выйти</b-dropdown-item>
            </b-nav-item-dropdown>
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
  methods: {
    logout() {
      this.loading = true

      this.$store.dispatch('Logout')
      this.$router.push('login')

      this.loading = false
    }
  }
}
</script>
