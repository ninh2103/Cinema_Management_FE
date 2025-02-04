import http from '@/lib/http'
import { UploadImageResType } from '@/schemaValidations/media.schema'

export const mediaApiRequest = {
  upload: (formData: FormData, folderType: string) =>
    http.post<UploadImageResType>('/media/upload', formData, {
      headers: {
        folder_type: folderType
      }
    }),
  video: (formData: FormData, folderType: string) =>
    http.post<UploadImageResType>('/media/video', formData, {
      headers: {
        folder_type: folderType
      }
    })
}
