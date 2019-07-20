const getters = {
  token: state => state.auth.token,
  userName: state => state.auth.user.name,
  userEmail: state => state.auth.user.email,
  userLoaded: state => state.auth.user.loaded,
  foundMovies: state => state.movies.moviesSearch.results,
  suggestedMovies: state => state.movies.suggested,
  suggestedMoviesLoaded: state => state.movies.suggestedMoviesLoaded
}

export default getters
