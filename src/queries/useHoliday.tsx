import holidayApiRequest from '@/apiRequest/holiday'
import { UpdateHolidayBodyType } from '@/schemaValidations/holiday.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useHolidayListQuery = () => {
  return useQuery({
    queryKey: ['holiday'],
    queryFn: holidayApiRequest.list
  })
}
export const useGetHoliday = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['holiday', id],
    queryFn: () => holidayApiRequest.getHoliday(id),
    enabled
  })
}

export const useAddHolidayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: holidayApiRequest.addHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['holiday']
      })
    }
  })
}
export const useUpdateHolidayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateHolidayBodyType & { id: number }) => holidayApiRequest.updateHoliday(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['holiday'],
        exact: true
      })
    }
  })
}
export const useDeleteHolidayMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: holidayApiRequest.deleteHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['holiday']
      })
    }
  })
}
