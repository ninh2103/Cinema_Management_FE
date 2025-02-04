import promotionApiRequest from '@/apiRequest/promotion'
import { UpdatePromotionBodyType } from '@/schemaValidations/promotion.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const usePromotionListQuery = () => {
  return useQuery({
    queryKey: ['promotion'],
    queryFn: promotionApiRequest.list
  })
}
export const useGetPromotion = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => promotionApiRequest.getPromotion(id),
    enabled
  })
}

export const useAddPromotionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: promotionApiRequest.addPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotion']
      })
    }
  })
}
export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdatePromotionBodyType & { id: number }) =>
      promotionApiRequest.updatePromotion(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotion'],
        exact: true
      })
    }
  })
}
export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: promotionApiRequest.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotion']
      })
    }
  })
}
