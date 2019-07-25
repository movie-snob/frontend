const getters = {
  token: state => state.auth.token,
  userName: state => state.auth.user.name,
  userId: state => state.auth.user.id,
  userEmail: state => state.auth.user.email,
  userLoaded: state => state.auth.user.loaded,
  foundMovies: state => state.app.moviesSearch.results,
  suggestedMovies: state => state.app.suggested,
  suggestedMoviesLoaded: state => state.app.suggestedMoviesLoaded,
  users: state => state.app.users,
  usersLoaded: state => state.app.usersLoaded,
  movieUnderReview: state => state.app.movieUnderReview
}

export default getters
