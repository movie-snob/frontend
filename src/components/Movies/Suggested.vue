
<template>
  <div v-if="loaded">
    <layout>
      <template #header>
        <navbar/>
      </template>
      <b-row>
        <b-col>
          <h6 class="mt-3">Предложенные фильмы</h6>
        </b-col>
      </b-row>
      <b-card-group deck v-if="suggestedMovies.length > 0">
        <b-card
          class="mb-3 suggested-movie"
          title-tag="h5"
          :title="movie.title"
          v-for="movie in suggestedMovies"
          :key="movie.id"
          :img-src="moviePosterURL(movie, '200', 'poster')"
          :img-alt="movie.title"
          img-left>
          <b-card-text>
            <b-form-checkbox
              @change.native="onMovieWatchedChange($event, movie)"
              switch
              :checked="movie.watched_on !== null">
              Просмотрено <b-form-input type="date" @change.native="onWatchedDateChange($event, movie)" :value="movie.watched_on || today" />
            </b-form-checkbox>
          </b-card-text>
          <b-button variant="primary">Обсудить и оценить</b-button>
        </b-card>
      </b-card-group>
      <b-row>
        <b-col>
          <h6 class="mt-3">Предложить фильм</h6>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col>
          <b-form-input
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            autofocus
            v-model="search"
            @input="handleDebounceSearchInput"
            placeholder="Введите название фильма"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ul v-if="foundMovies.length > 0" class="list-unstyled">
            <b-media
              @click="onSuggestedMovieClick(movie)"
              v-for="movie in foundMovies"
              :key="movie.id"
              tag="li"
              title="Выбрать этот фильм"
              class="movie mb-3 p-2">
              <b-img v-if="moviePosterURL(movie)" slot="aside" :src="moviePosterURL(movie)" width="150" :alt="movie.title"></b-img>

              <h5 v-if="movie.release_date" class="mt-0 mb-1">{{ movie.original_title }} ({{ movieDateToYear(movie) }})</h5>
              <h5 v-if="!movie.release_date" class="mt-0 mb-1">{{ movie.original_title }}</h5>
              <p class="mb-0">
                {{ movie.overview }}
              </p>
            </b-media>
          </ul>
        </b-col>
      </b-row>
    </layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import progress from 'nprogress'
import 'nprogress/nprogress.css'
import debounce from 'lodash.debounce'
import swal from 'sweetalert'
import moment from 'moment'

import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  data() {
    return {
      search: ''
    }
  },
  name: 'Suggested',
  components: {
    'layout': Layout,
    'navbar': Navbar
  },
  computed: {
    ...mapGetters([
      'userName',
      'userLoaded',
      'foundMovies',
      'suggestedMovies',
      'suggestedMoviesLoaded'
    ]),
    loaded() {
      return this.userLoaded && this.suggestedMoviesLoaded
    },
    today() {
      return moment().format('YYYY-MM-DD')
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce(async (query) => {
      progress.start()

      await this.$store.dispatch('SearchMovies', { query })

      progress.done()
    }, 500)
  },
  async mounted() {
    if (!this.userLoaded) {
      progress.start()

      await Promise.all([
        this.$store.dispatch('GetUserInfo'),
        this.$store.dispatch('FetchSuggestedMovies')
      ])

      progress.done()
    }
  },
  methods: {
    moviePosterURL(movie, width = '200', posterKey = 'poster_path') {
      if (!movie[posterKey]) {
        return
      }

      return `http://image.tmdb.org/t/p/w${width}${movie[posterKey]}`
    },
    movieDateToYear(movie) {
      if (!movie.release_date) {
        return
      }
      return movie.release_date.split('-')[0]
    },
    async onSuggestedMovieClick(movie) {
      const confirm = await swal(`Предложить к просмотру «${movie.original_title}»?`, {
        buttons: ["Нет, не то", "Да, его!"],
      });

      if (!confirm) {
        return
      }

      progress.start()

      await this.$store.dispatch('SuggestMovie', {
        title: movie.original_title,
        year: this.movieDateToYear(movie),
        poster: movie.poster_path,
        movieDBId: movie.id
      })

      progress.done()

      this.$store.dispatch('EmptySearchMoviesList')
      this.search = ''

      this.$bvToast.toast(`«${movie.original_title}» предложен к просмотру`, {
        title: 'Ура!',
        variant: 'success',
        solid: true
      })
    },
    onMovieWatchedChange(event, movie) {
      const watched = event.target.checked
      const date = event.target.parentNode.querySelector('input[type=date]').value

      if (watched) {
        this.$store.dispatch('MarkWatched', {
          id: movie.id,
          date
        })
      } else {
        this.$store.dispatch('MarkUnwatched', {
          id: movie.id
        })
      }
    },
    onWatchedDateChange(event, movie) {
      const watched = event.target.parentNode.previousSibling.checked
      const date = event.target.value

      if (watched) {
        this.$store.dispatch('MarkWatched', {
          id: movie.id,
          date
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.movie {
  &:hover {
    background: #f5f5f5;
    cursor: pointer;
  }
}
.suggested-movie {
  min-width: 45%;
  max-width: 50%;
}
</style>
