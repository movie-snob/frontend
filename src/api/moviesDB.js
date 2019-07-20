import axios from 'axios'

export const searchMovie = async (query) => {
  const api_key = '49027f1d5d38f0459abe59fe5ab521ee'

  return axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${api_key}`)
}
