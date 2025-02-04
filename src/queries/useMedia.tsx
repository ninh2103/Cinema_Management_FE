import { mediaApiRequest } from '@/apiRequest/media'
import { useMutation } from '@tanstack/react-query'

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: ({ formData, folderType }: { formData: FormData; folderType: string }) =>
      mediaApiRequest.upload(formData, folderType)
  })
}

export const useUploadVideoMutation = () => {
  return useMutation({
    mutationFn: ({ formData, folderType }: { formData: FormData; folderType: string }) =>
      mediaApiRequest.video(formData, folderType)
  })
}
