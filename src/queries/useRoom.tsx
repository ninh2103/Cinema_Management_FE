import roomApiRequest from '@/apiRequest/room'
import { UpdateCinemaroomBodyType } from '@/schemaValidations/room.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useRoomListQuery = () => {
  return useQuery({
    queryKey: ['room'],
    queryFn: roomApiRequest.list
  })
}
export const useGetRoom = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomApiRequest.getRoom(id),
    enabled
  })
}

export const useAddRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApiRequest.addRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room']
      })
    }
  })
}
export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateCinemaroomBodyType & { id: number }) => roomApiRequest.updateRoom(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room'],
        exact: true
      })
    }
  })
}
export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApiRequest.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['room']
      })
    }
  })
}
