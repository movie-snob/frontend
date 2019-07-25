import { searchMovie } from '../../api/moviesDB'
import { suggestMovie, fetchSuggestedMovies, markWatched, markUnwatched, scoreMovie } from '../../api/movies';
import { fetchUsers } from '../../api/users'

const app = {
  state: {
    moviesSearch: {
      results: []
    },
    suggested: [],
    suggestedMoviesLoaded: false,
    users: [],
    usersLoaded: false,
    movieUnderReview: {}
  },
  mutations: {
    'SET_SEARCH_RESULTS': (state, movies) => {
      state.moviesSearch = movies
    },
    'SET_SUGGESTED': (state, movies) => {
      state.suggested = movies
      state.suggestedMoviesLoaded = true
    },
    'SET_WATCHED': (state, { movieId, userId, date }) => {
      state.suggested = state.suggested.map(movie => {
        if (movie.id === movieId) {
          movie.watched_on = date
        }

        return movie
      })

      state.users = state.users.map(user => {
        if (user.id === userId) {
          user.watched_movies = [...user.watched_movies, movieId]
        }

        return user
      })
    },
    'SET_UNWATCHED': (state, { movieId, userId }) => {
      state.suggested = state.suggested.map(movie => {
        if (movie.id === movieId) {
          movie.watched_on = null
        }

        return movie
      })

      state.users = state.users.map(user => {
        if (user.id === userId) {
          user.watched_movies = user.watched_movies.filter(id => movieId !== id)
        }

        return user
      })
    },
    'SET_USERS': (state, users) => {
      state.users = users
      state.usersLoaded = true
    },
    'SET_MOVIE_UNDER_REVIEW': (state, movie) => {
      state.movieUnderReview = movie
    },
    'SET_MOVIE_SCORE': (state, score) => {
      state.movieUnderReview.score = score
    }
  },
  actions: {
    async SearchMovies({ commit }, { query }) {
      const moviesResponse = await searchMovie(query)

      commit('SET_SEARCH_RESULTS', moviesResponse.data)
    },
    EmptySearchMoviesList({ commit }){
      commit('SET_SEARCH_RESULTS', { results: [] })
    },
    async SuggestMovie({ commit }, { title, year, poster, movieDBId }) {
      const response = await suggestMovie(title, year, poster, movieDBId)

      commit('SET_SUGGESTED', response.data)
    },
    async FetchSuggestedMovies({ commit }) {
      const response = await fetchSuggestedMovies()

      commit('SET_SUGGESTED', response.data)
    },
    MarkWatched({ commit, rootState }, { id, date }) {
      markWatched(id, date)

      commit('SET_WATCHED', { movieId: id, userId: rootState.auth.user.id, date })
    },
    MarkUnwatched({ commit, rootState }, { id }) {
      markUnwatched(id)

      commit('SET_UNWATCHED', { movieId: id, userId: rootState.auth.user.id })
    },
    async FetchUsers({ commit }) {
      const response = await fetchUsers()

      commit('SET_USERS', response.data)
    },
    async SetUsers({ commit }, users) {
      commit('SET_USERS', users)
    },
    SetMovieUnderReview({ commit }, movie) {
      commit('SET_MOVIE_UNDER_REVIEW', movie)
    },
    ScoreMovie({ commit }, { id, score }) {
      scoreMovie(id, score)

      commit('SET_MOVIE_SCORE', score)
    }
  }
}

export default app
