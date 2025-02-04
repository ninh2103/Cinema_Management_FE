import showtimeApiRequest from '@/apiRequest/showtime'
import { UpdateShowtimeBodyType } from '@/schemaValidations/showtime.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useShowtimeListQuery = () => {
  return useQuery({
    queryKey: ['showtime'],
    queryFn: showtimeApiRequest.list
  })
}
export const useGetShowtime = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['showtime', id],
    queryFn: () => showtimeApiRequest.getShowtime(id),
    enabled
  })
}

export const useAddShowtimeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: showtimeApiRequest.addShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime']
      })
    }
  })
}
export const useUpdateShowtimeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateShowtimeBodyType & { id: number }) =>
      showtimeApiRequest.updateShowtime(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime'],
        exact: true
      })
    }
  })
}
export const useDeleteShowtimeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: showtimeApiRequest.deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['showtime']
      })
    }
  })
}
