import http from '@/lib/http'
import {
  CreateMovieBodyType,
  MovieListResType,
  MovieResType,
  UpdateMovieBodyType
} from '@/schemaValidations/movie.schema'

const movieApiRequest = {
  list: () => http.get<MovieListResType>('movie', { next: { tags: ['movie'] } }),
  addMovie: (body: CreateMovieBodyType) => http.post<MovieResType>('movie', body),
  updateMovie: (id: number, body: UpdateMovieBodyType) => http.patch<MovieResType>(`movie/${id}`, body),
  getMovie: (id: number) => http.get<MovieResType>(`movie/${id}`),
  deleteMovie: (id: number) => http.delete<MovieResType>(`movie/${id}`)
}

export default movieApiRequest
