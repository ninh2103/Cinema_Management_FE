import movieApiRequest from '@/apiRequest/movie'
import { UpdateMovieBodyType } from '@/schemaValidations/movie.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMovieListQuery = () => {
  return useQuery({
    queryKey: ['movie'],
    queryFn: movieApiRequest.list
  })
}
export const useGetMovie = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApiRequest.getMovie(id),
    enabled
  })
}

export const useAddMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: movieApiRequest.addMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movie']
      })
    }
  })
}
export const useUpdateMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateMovieBodyType & { id: number }) => movieApiRequest.updateMovie(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movie'],
        exact: true
      })
    }
  })
}
export const useDeleteMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: movieApiRequest.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movie']
      })
    }
  })
}
