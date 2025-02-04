import z from 'zod'

export const UploadImageRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    fileName: z.string()
  })
})

export type UploadImageResType = z.infer<typeof UploadImageRes>
