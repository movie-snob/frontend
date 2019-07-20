import { searchMovie } from '../../api/moviesDB'
import { suggestMovie, fetchSuggestedMovies, markWatched, markUnwatched } from '../../api/movies';

const movies = {
  state: {
    moviesSearch: {
      results: []
    },
    suggested: [],
    suggestedMoviesLoaded: false
  },
  mutations: {
    'SET_SEARCH_RESULTS': (state, movies) => {
      state.moviesSearch = movies
    },
    'SET_SUGGESTED': (state, movies) => {
      state.suggested = movies
      state.suggestedMoviesLoaded = true
    },
    'SET_WATCHED': (state, { id, date }) => {
      state.suggested = state.suggested.map(movie => {
        if (movie.id === id) {
          movie.watched_on = date
        }

        return movie
      })
    },
    'SET_UNWATCHED': (state, id) => {
      state.suggested = state.suggested.map(movie => {
        if (movie.id === id) {
          movie.watched_on = null
        }

        return movie
      })
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

    MarkWatched({ commit }, { id, date }) {
      markWatched(id, date)

      commit('SET_WATCHED', { id, date })
    },
    MarkUnwatched({ commit }, { id }) {
      markUnwatched(id)

      commit('SET_UNWATCHED', id)
    }
  }
}

export default movies
