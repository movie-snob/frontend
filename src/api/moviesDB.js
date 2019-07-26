import axios from 'axios'

export const searchMovie = async (query) => {
  const api_key = process.env.VUE_APP_MOVIEDB_AP_KEY

  return axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${api_key}`)
}
