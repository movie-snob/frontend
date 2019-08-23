<template>
  <layout>
    <template #header>
      <navbar />
    </template>
    <b-row>
      <b-col>
        <h4 class="mt-3 mb-3">
          Архив
        </h4>
      </b-col>
    </b-row>
    <b-table
      striped
      hover
      small
      sticky-header
      borderless
      :fields="fields"
      :items="reviewedMovies"
    >
      <template
        v-for="user in users"
        slot="[user_${user.id}]"
        slot-scope="data"
      >
        {{ data.item.scores.name }}
      </template>
    </b-table>
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'

import progress from 'nprogress'
import moment from 'moment'

import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  name: 'Archive',
  components: {
    'layout': Layout,
    'navbar': Navbar
  },
  computed: {
    ...mapGetters([
      'reviewedMovies',
      'reviewedMoviesLoaded',
      'users'
    ]),
    loaded() {
      return this.reviewedMoviesLoaded && this.usersLoaded
    },
    fields() {
      return [
        {
          key: 'watched_on',
          label: 'Дата',
          sortable: true,
          formatter: value => moment(value * 1000).format('DD.MM.YYYY')
        },
        {
          key: 'title',
          label: 'Название'
        },
        {
          key: 'year',
          label: 'Год',
          sortable: true
        },
        {
          key: 'suggested_by.name',
          label: 'Чей выбор'
        },
        ...this.userNames,
        {
          key: 'avg',
          label: 'Средняя оценка',
          sortable: true
        }
      ]
    },
    userNames() {
      return this.users.map(user => {
        return {
          key: `scores.user_${user.id}.score`,
          label: user.name
        }
      })
    }
  },
  async mounted() {
    if (!this.loaded) {
      progress.start()

      await Promise.all([
        this.$store.dispatch('FetchReviewedMovies'),
        this.$store.dispatch('FetchUsers')
      ])

      progress.done()
    }
  },
  methods: {
    normalizeDate(value) {
      return moment(value).format('DD.MM.YYYY')
    }
  }
}
</script>
