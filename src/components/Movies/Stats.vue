<template>
  <layout>
    <template #header>
      <navbar />
    </template>
    <b-container>
      <b-row>
        <b-col>
          <h4 class="mt-3 mb-3">
            Статистика
          </h4>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <h5>Средние оценки</h5>
      <ul>
        <li
          v-for="statsRecord in stats.avg_scores"
          :key="statsRecord.user_id"
        >
          {{ statsRecord.user_name }}
          <strong>{{ statsRecord.avg_score }}</strong>
        </li>
      </ul>
    </b-container>
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'

import progress from 'nprogress'

import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  name: 'Stats',
  components: {
    'layout': Layout,
    'navbar': Navbar
  },
  computed: {
    ...mapGetters([
      'stats',
      'statsLoaded'
    ]),
  },
  async mounted() {
    if (!this.statsLoaded) {
      progress.start()

      await this.$store.dispatch('FetchStats')

      progress.done()
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
