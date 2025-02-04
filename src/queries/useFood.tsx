import foodApiRequest from '@/apiRequest/food'
import { UpdateSnackBodyType } from '@/schemaValidations/snack.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSnackListQuery = () => {
  return useQuery({
    queryKey: ['snack'],
    queryFn: foodApiRequest.list
  })
}
export const useGetSnack = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['snack', id],
    queryFn: () => foodApiRequest.getSnack(id),
    enabled
  })
}

export const useAddSnackMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: foodApiRequest.addSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['snack']
      })
    }
  })
}
export const useUpdateSnackMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSnackBodyType & { id: number }) => foodApiRequest.updateSnack(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['snack'],
        exact: true
      })
    }
  })
}
export const useDeleteSnackMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: foodApiRequest.deleteSnack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['snack']
      })
    }
  })
}
