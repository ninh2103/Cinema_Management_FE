import eventApiRequest from '@/apiRequest/event'
import { UpdateEventBodyType } from '@/schemaValidations/event.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useEventListQuery = () => {
  return useQuery({
    queryKey: ['event'],
    queryFn: eventApiRequest.list
  })
}
export const useGetEvent = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApiRequest.getEvent(id),
    enabled
  })
}

export const useAddEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventApiRequest.addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event']
      })
    }
  })
}
export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEventBodyType & { id: number }) => eventApiRequest.updateEvent(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event'],
        exact: true
      })
    }
  })
}
export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventApiRequest.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['event']
      })
    }
  })
}
