import request from '../utils/request'

export const suggestMovie = async (title, year, poster, movieDBId) => {
  return request({
    url: '/films',
    method: 'post',
    data: {
      title,
      year,
      poster,
      movie_db_id: movieDBId
    }
  })
}

export const fetchSuggestedMovies = async () => {
  return request({
    url: '/films/suggested',
    method: 'get'
  })
}

export const markWatched = async (id, date) => {
  return request({
    url: `/films/${id}/watched`,
    method: 'post',
    data: {
      date
    }
  })
}

export const markUnwatched = async (id) => {
  return request({
    url: `/films/${id}/unwatched`,
    method: 'post'
  })
}
