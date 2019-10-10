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

export const removeMovie = async (id) => {
  return request({
    url: `/films/${id}`,
    method: 'delete'
  })
}

export const fetchSuggestedMovies = async () => {
  return request({
    url: '/films/suggested',
    method: 'get'
  })
}

export const fetchReviewedMovies = async () => {
  return request({
    url: '/films/reviewed',
    method: 'get'
  })
}

export const markWatched = async (id, userId, date) => {
  return request({
    url: `/films/${id}/watched?user_id=${userId}`,
    method: 'post',
    data: {
      date
    }
  })
}

export const markUnwatched = async (id, userId) => {
  return request({
    url: `/films/${id}/unwatched?user_id=${userId}`,
    method: 'post'
  })
}

export const scoreMovie = async (id, score) => {
  return request({
    url: `/films/${id}/score`,
    method: 'patch',
    data: {
      score
    }
  })
}
