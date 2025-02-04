import z from 'zod'

export const CinemaroomSchema = z.object({
  Id: z.number(), // Mã phòng chiếu
  Name: z.string(), // Tên phòng chiếu
  Type: z.number(), // Loại phòng chiếu
  Block: z.number(), // Tình trạng phòng chiếu
  CreatedAt: z.date(), // Thời gian tạo
  UpdatedAt: z.date().nullable() // Thời gian cập nhật, có thể là null
})

export type CinemaroomSchemaType = z.TypeOf<typeof CinemaroomSchema>

export const CinemaroomRes = z.object({
  data: CinemaroomSchema, // Dữ liệu phòng chiếu
  message: z.string() // Thông điệp trả về
})

export type CinemaroomResType = z.TypeOf<typeof CinemaroomRes>

export const CinemaroomListRes = z.object({
  data: z.object({
    data: z.array(CinemaroomSchema), // List of movie objects
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type CinemaroomListResType = z.TypeOf<typeof CinemaroomListRes>

export const CreateCinemaroomBody = z.object({
  Name: z.string() // Tên phòng chiếu
})

export type CreateCinemaroomBodyType = z.TypeOf<typeof CreateCinemaroomBody>

export const UpdateCinemaroomBody = z.object({
  Name: z.string().optional(), // Tên phòng chiếu, có thể cập nhật
  Type: z.number().optional(), // Loại phòng chiếu, có thể cập nhật
  Block: z.number().optional() // Tình trạng phòng chiếu, có thể cập nhật
})

export type UpdateCinemaroomBodyType = z.TypeOf<typeof UpdateCinemaroomBody>
