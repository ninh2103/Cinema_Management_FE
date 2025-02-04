import ticketPriceApiRequest from '@/apiRequest/ticketPrice'
import { UpdateTicketPriceBodyType } from '@/schemaValidations/ticketPrice.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTicketPriceListQuery = () => {
  return useQuery({
    queryKey: ['ticketPrice'],
    queryFn: ticketPriceApiRequest.list
  })
}
export const useGetTicketPrice = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['ticketPrice', id],
    queryFn: () => ticketPriceApiRequest.getTicketPrice(id),
    enabled
  })
}

export const useAddTicketPriceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ticketPriceApiRequest.addTicketPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketPrice']
      })
    }
  })
}
export const useUpdateTicketPriceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTicketPriceBodyType & { id: number }) =>
      ticketPriceApiRequest.updateTicketPrice(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketPrice'],
        exact: true
      })
    }
  })
}
export const useDeleteTicketPriceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ticketPriceApiRequest.deleteTicketPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticketPrice']
      })
    }
  })
}
