import timeSlotApiRequest from '@/apiRequest/timeSlot'
import { UpdateTimeSlotBodyType } from '@/schemaValidations/timeSlot.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTimeSlotListQuery = () => {
  return useQuery({
    queryKey: ['timeSlot'],
    queryFn: timeSlotApiRequest.list
  })
}
export const useGetTimeSlot = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['timeSlot', id],
    queryFn: () => timeSlotApiRequest.getTimeSlot(id),
    enabled
  })
}

export const useAddTimeSlotMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: timeSlotApiRequest.addTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timeSlot']
      })
    }
  })
}
export const useUpdateTimeSlotMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTimeSlotBodyType & { id: number }) =>
      timeSlotApiRequest.updateTimeSlot(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timeSlot'],
        exact: true
      })
    }
  })
}
export const useDeleteTimeSlotMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: timeSlotApiRequest.deleteTimeSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timeSlot']
      })
    }
  })
}
