import accountApiRequest from '@/apiRequest/account'
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountListQuery = () => {
  return useQuery({
    queryKey: ['account'],
    queryFn: accountApiRequest.list
  })
}
export const useGetAccount = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountApiRequest.getAccount(id),
    enabled
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['account']
      })
    }
  })
}
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateAccount(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['account'],
        exact: true
      })
    }
  })
}
export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Account']
      })
    }
  })
}
export const useAccontProfile = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me
  })
}
