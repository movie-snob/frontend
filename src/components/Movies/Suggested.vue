
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
            <div class="chosen-by">выбран {{ nameToInstrumental(movie.suggested_by.name) }}</div>
            <b-form-checkbox
              @change.native="onMovieWatchedChange($event, movie)"
              switch
              :checked="movie.watched_on !== null">
              Просмотрено
              <b-form-input
              type="date"
              :value="movie.watched_on || today" />
            </b-form-checkbox>
          </b-card-text>
          <ul>
            <li
              v-for="user in users"
              :key="user.id">
              <span>
                {{ user.name }}
              </span>
              <b-badge v-if="user.watched_movies.includes(movie.id)">просмотрено</b-badge>
            </li>
          </ul>
          <b-button variant="primary">Обсудить фильм</b-button>
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
import t from 'typy'
import RussianName from '../../lib/name'

import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  data() {
    return {
      search: '',
      socket: null
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
      'suggestedMoviesLoaded',
      'users',
      'usersLoaded'
    ]),
    loaded() {
      return this.suggestedMoviesLoaded && this.usersLoaded
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
    this.processSocketMessages()

    if (!this.loaded) {
      progress.start()

      await Promise.all([
        this.$store.dispatch('FetchSuggestedMovies'),
        this.$store.dispatch('FetchUsers')
      ])

      progress.done()
    }
  },
  beforeDestroy() {
    this.socket.close()
  },
  methods: {
    nameToInstrumental(name) {
      const rn = new RussianName(name)
      return rn.fullName(rn.gcaseTvor)
    },
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
    },
    processSocketMessages() {
      const wsURL = 'ws://localhost:3000/cable'
      this.socket = new WebSocket(wsURL)

      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        const type = t(data, 'message.type').safeObject

        if (type === 'users_list') {
          this.$store.dispatch('SetUsers', JSON.parse(data.message.users))
        }
      }
      this.socket.onopen = () => {
        const msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'OnlineChannel',
          }),
        };
        this.socket.send(JSON.stringify(msg));
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
.chosen-by {
  font-size: 0.9em;
  font-style: italic;
  margin-bottom: 12px;
}
.card-title {
  margin-bottom: 0;
}
</style>
