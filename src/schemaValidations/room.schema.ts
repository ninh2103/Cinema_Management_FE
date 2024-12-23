import z from 'zod'

export const CinemaroomSchema = z.object({
  Id: z.string(), // Mã phòng chiếu
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
  data: z.array(CinemaroomSchema), // Danh sách phòng chiếu
  message: z.string(), // Thông điệp trả về
  meta: z.object({
    totalItems: z.number(), // Tổng số phòng chiếu
    currentPage: z.number(), // Trang hiện tại
    itemsPerPage: z.number(), // Số lượng phòng chiếu trên mỗi trang
    totalPages: z.number() // Tổng số trang
  })
})

export type CinemaroomListResType = z.TypeOf<typeof CinemaroomListRes>

export const CreateCinemaroomBody = z.object({
  Name: z.string(), // Tên phòng chiếu
  Type: z.number(), // Loại phòng chiếu
  Block: z.number() // Tình trạng phòng chiếu
})

export type CreateCinemaroomBodyType = z.TypeOf<typeof CreateCinemaroomBody>

export const UpdateCinemaroomBody = z.object({
  Name: z.string().optional(), // Tên phòng chiếu, có thể cập nhật
  Type: z.number().optional(), // Loại phòng chiếu, có thể cập nhật
  Block: z.number().optional() // Tình trạng phòng chiếu, có thể cập nhật
})

export type UpdateCinemaroomBodyType = z.TypeOf<typeof UpdateCinemaroomBody>
