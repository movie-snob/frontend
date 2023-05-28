<template>
  <layout>
    <template #header>
      <navbar />
    </template>
    <b-container>
      <b-row>
        <b-col>
          <h4 class="mt-3 mb-3">
            Архив
          </h4>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid>
      <b-table
        striped
        hover
        small
        :fields="fields"
        :items="reviewedMovies"
      >
        <template
          v-slot:cell(title)="data"
        >
          <a
            :href="'https://www.imdb.com/title/' + data.item.imdb_id"
            target="_blank"
            title="Перейти на IMDB"
          >
            {{ data.item.title }}
          </a>
        </template>
        <template
          v-for="user in users"
          :slot="`[user_${user.id}]`"
          slot-scope="data"
        >
          {{ data.item.scores.name }}
        </template>
      </b-table>
    </b-container>
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
      'users',
      'usersLoaded'
    ]),
    loaded() {
      return this.reviewedMoviesLoaded && this.usersLoaded
    },
    fields() {
      return [
        {
          key: 'watched_on',
          label: 'Дата выбора',
          sortable: true,
          formatter: value => moment(value * 1000).format('DD.MM.YYYY')
        },
        {
          key: 'title',
          label: 'Название'
        },
        {
          key: 'director',
          label: 'Режиссёр',
          sortable: true
        },
        {
          key: 'year',
          label: 'Год',
          sortable: true
        },
        {
          key: 'suggestedBy.name',
          label: 'Чей выбор',
          sortable: true
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
          label: user.name,
          sortable: true
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

<style lang="scss" scoped>
</style>
