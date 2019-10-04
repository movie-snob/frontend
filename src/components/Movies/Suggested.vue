
<template>
  <div v-if="loaded">
    <layout>
      <template #header>
        <navbar />
      </template>
      <b-container>
        <b-row>
          <b-col>
            <h4 class="mt-3 mb-3">
              Предложенные фильмы
            </h4>
          </b-col>
        </b-row>
        <b-card-group
          v-if="suggestedMovies.length > 0"
          deck
        >
          <b-card
            v-for="movie in suggestedMovies"
            :key="movie.id"
            class="mb-3 suggested-movie"
            :img-src="moviePosterURL(movie, '200', 'poster')"
            :img-alt="movie.title"
            img-left
          >
            <b-card-title>
              {{ movie.title }}
              <a
                :href="'https://www.imdb.com/title/' + movie.imdb_id"
                class="imdb-link"
                target="blank"
                title="Перейти на IMDB"
              >
                <font-awesome-icon icon="external-link-alt" />
              </a>
            </b-card-title>
            <b-card-sub-title>
              {{ movie.director }}
            </b-card-sub-title>
            <b-card-text>
              <b-form-checkbox
                switch
                :checked="movie.watched_on !== null"
                @change.native="onMovieWatchedChange($event, movie)"
              >
                Просмотрено
                <b-form-input
                  type="date"
                  :value="movie.watched_on || today"
                />
              </b-form-checkbox>
            </b-card-text>
            <ul class="watched-by">
              <li
                v-for="user in users"
                :key="user.id"
              >
                <div class="icon">
                  <font-awesome-icon
                    v-if="user.watched_movies.includes(movie.id)"
                    class="check"
                    icon="check-square"
                  />
                  <font-awesome-icon
                    v-if="!user.watched_movies.includes(movie.id)"
                    class="times"
                    icon="times"
                  />
                </div>
                <strong v-if="user.id === movie.suggested_by.id">{{ user.name }}</strong>
                <span v-else>{{ user.name }}</span>
              </li>
            </ul>
            <b-button
              variant="primary"
              @click="reviewMovie(movie.id)"
            >
              Обсудить
            </b-button>
            &nbsp;
            <b-button
              v-if="movie.suggested_by.id === userId"
              variant="danger"
              @click="deleteMovie(movie)"
            >
              Удалить
            </b-button>
          </b-card>
        </b-card-group>
        <b-row>
          <b-col>
            <h6 class="mt-3">
              Предложить фильм
            </h6>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col>
            <b-form-input
              v-model="search"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              autofocus
              placeholder="Введите название фильма"
              @input="handleDebounceSearchInput"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <ul
              v-if="foundMovies.length > 0"
              class="list-unstyled"
            >
              <b-media
                v-for="movie in foundMovies"
                :key="movie.id"
                tag="li"
                title="Выбрать этот фильм"
                class="movie mb-3 p-2"
                @click="onSuggestedMovieClick(movie)"
              >
                <b-img
                  v-if="moviePosterURL(movie)"
                  slot="aside"
                  :src="moviePosterURL(movie)"
                  width="150"
                  :alt="movie.title"
                />
                <h5
                  v-if="movie.release_date"
                  class="mt-0 mb-1"
                >
                  {{ movie.original_title }} ({{ movieDateToYear(movie) }})
                </h5>
                <h5
                  v-if="!movie.release_date"
                  class="mt-0 mb-1"
                >
                  {{ movie.original_title }}
                </h5>
                <p class="mb-0">
                  {{ movie.overview }}
                </p>
              </b-media>
            </ul>
          </b-col>
        </b-row>
        <b-modal
          id="discuss-modal"
          v-model="discussionInProgress"
          hide-footer
          :title="`Обсуждаем «${movieUnderReview.title}»`"
        >
          <b-form
            class="mb-sm-3"
            @submit="onSubmitScore"
          >
            <h6>Моя оценка:</h6>
            <b-input-group>
              <b-form-input
                v-model="newScore"
                autofocus
                size="lg"
                maxlength="2"
              />
              <b-input-group-append>
                <b-button
                  size="sm"
                  variant="primary"
                  type="submit"
                >
                  Отправить
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form>
          <table class="discussion-table">
            <tr>
              <td
                v-for="user in users"
                :key="user.id"
                class="discussion-table__username"
              >
                {{ user.name }}
              </td>
            </tr>
            <tr>
              <td
                v-for="user in users"
                :key="user.id"
                class="discussion-table__score"
              >
                <font-awesome-icon
                  v-if="showQuestionMark(user)"
                  class="question"
                  icon="question"
                />
                <font-awesome-icon
                  v-if="showCheck(user)"
                  class="check"
                  icon="check"
                />
                <strong
                  v-if="showUserScore(user)"
                  v-highlight="movieUnderReview.score"
                >
                  {{ userScore(movieUnderReview, user) }}
                </strong>
              </td>
            </tr>
          </table>
        </b-modal>
      </b-container>
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
import jp from 'jsonpath'
import petrovich from 'petrovich'

import Layout from '../Layout'
import Navbar from '../Navbar'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCheck, faTimes, faQuestion, faCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheckSquare, faCheck, faTimes, faQuestion, faCircle, faExternalLinkAlt)

export default {
  name: 'Suggested',
  components: {
    'layout': Layout,
    'navbar': Navbar,
    'font-awesome-icon': FontAwesomeIcon
  },
  data() {
    return {
      search: '',
      socket: null,
      discussionInProgress: false,
      newScore: null,
      movieUnderReviewId: null,
      socketConnectionInterval: null
    }
  },
  computed: {
    ...mapGetters([
      'userId',
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
    },
    movieUnderReview() {
      return this.suggestedMovies.find(movie => this.movieUnderReviewId === movie.id) || {}
    },
    allUsersVoted() {
      const userCount = this.users.length

      if (!this.movieUnderReview.scores) {
        return false
      }

      return this.movieUnderReview.scores.filter(movie => movie.score !== null).length === userCount
    }
  },
  created() {
    this.connectToWebSocket()

    this.socketConnectionInterval = setInterval(() => {
      if (this.socket.readyState !== WebSocket.OPEN) {
        this.connectToWebSocket()
      }
    }, 300);

    this.handleDebounceSearchInput = debounce(async (query) => {
      progress.start()

      await this.$store.dispatch('SearchMovies', { query })

      progress.done()
    }, 500)
  },
  async mounted() {
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
    clearInterval(this.socketConnectionInterval)
  },
  methods: {
    nameToInstrumental(name, gender) {
      const genders = ['male', 'female']
      const userGender = genders[gender]

      return petrovich[userGender].first.instrumental(name)
    },
    moviePosterURL(movie, width = '200', posterKey = 'poster_path') {
      if (!movie[posterKey]) {
        return
      }

      return `https://image.tmdb.org/t/p/w${width}${movie[posterKey]}`
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
    connectToWebSocket() {
      const protocol = (window.location.protocol === "https:") ? "wss://" : "ws://"
      this.socket = new WebSocket(`${protocol}${window.location.host}/api/cable`)

      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        const type = jp.query(data, '$.message.type')[0]

        if (type === 'scores') {
          this.$store.dispatch('SetScores', {
            id: data.message.movie_id,
            scores: data.message.scores
          })
        }
      }
      this.socket.onopen = () => {
        const msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'ReviewChannel',
          }),
        };
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(msg));
        }
      }
    },
    reviewMovie(movieId) {
      this.newScore = null
      this.movieUnderReviewId = movieId
      this.$store.dispatch('SetMovieUnderReview', movieId)
      this.discussionInProgress = true
    },
    async deleteMovie(movie) {
      const confirm = await swal(`Удалить «${movie.title}»?`, {
        buttons: ["Нет", "Да!"],
      });

      if (!confirm) {
        return
      }

      this.$store.dispatch('RemoveMovieSuggestion', movie.id)
    },
    onSubmitScore(e) {
      e.preventDefault()

      const score = parseInt(this.newScore)

      if (isNaN(score) || score < 1 || score > 10) {
        return
      }
      this.$store.dispatch('ScoreMovie', {
        id: this.movieUnderReview.id,
        score: this.newScore
      })
    },
    userScore(movie, user) {
      return jp.query(movie, `$.scores[?(@.user_id == ${user.id})].score`)[0]
    },
    showUserScore(user) {
      return user.id === this.userId && this.userScore(this.movieUnderReview, user) || this.allUsersVoted
    },
    showQuestionMark(user) {
      return !this.userScore(this.movieUnderReview, user)
    },
    showCheck(user) {
      return (user.id !== this.userId && this.userScore(this.movieUnderReview, user)) && !this.allUsersVoted
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
  margin: 0 0 12px;
}
.card-subtitle {
  margin-bottom: 10px;
}
a.imdb-link {
  vertical-align: super;
  font-size: 0.6em;
}
ul.watched-by {
  list-style-type: none;
  padding-left: 0;
  li {
    display: flex;
    padding-left: 5px;
    svg {
      margin-right: 3px;
    }
  }
  .icon {
    margin-right: 3px;
    text-align: center;
    width: 16px;
  }
}
.check {
  color: #28a745;
}
.times {
  color: red;
}
.question {
  color: #e0e0e0;
}
.online-indicator {
  display: inline-block;
  position: relative;
  top: -8px;
  font-size: 7px;
  left: -2px;
  &.online {
    color: #21d421;
  }
  &.offline {
    color: red;
  }
}
.discussion-table {
  width: 100%;
  text-align: center;
  table-layout: fixed;
  td {
    padding: 5px;
  }
  &__score {
    font-size: 1.5em;
  }
}
@keyframes highlight {
  0% {background-color: transparent;}
  50% {background-color: yellow;}
  100% {background-color: transparent;}
}

.highlight {
  padding: 0 5px;
  animation-name: highlight;
  animation-duration: 1s;
}
</style>
