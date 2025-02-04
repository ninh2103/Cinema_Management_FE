import z from 'zod'

// Schema cho Suất chiếu
export const ShowtimeSchema = z.object({
  Id: z.number(), // Mã suất chiếu
  IdFilm: z.string(), // ID bộ phim
  IdRoom: z.string(), // ID phòng chiếu
  TimeStart: z.string(), // Thời gian bắt đầu suất chiếu
  TimeEnd: z.string(), // Thời gian kết thúc suất chiếu
  Date: z.date(), // Giá vé
  Closed: z.number(), // Trạng thái (có thể cập nhật)
  CreatedAt: z.date(), // Thời gian tạo suất chiếu
  UpdatedAt: z.date().nullable(),
  room: z.object({
    Name: z.string()
  }) // Thời gian cập nhật suất chiếu, có thể null
})

export type ShowtimeSchemaType = z.TypeOf<typeof ShowtimeSchema>

// Schema cho phản hồi khi lấy thông tin 1 suất chiếu
export const ShowtimeRes = z.object({
  data: ShowtimeSchema, // Dữ liệu suất chiếu
  message: z.string() // Thông điệp trả về
})

export type ShowtimeResType = z.TypeOf<typeof ShowtimeRes>

// Schema cho phản hồi khi lấy danh sách suất chiếu
export const ShowtimeListRes = z.object({
  data: z.object({
    data: z.array(ShowtimeSchema), // List of movie objects
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type ShowtimeListResType = z.TypeOf<typeof ShowtimeListRes>

// Schema cho dữ liệu gửi lên khi tạo mới suất chiếu
export const CreateShowtimeBody = z.object({
  IdFilm: z.string(), // ID bộ phim
  IdRoom: z.string(), // ID phòng chiếu
  TimeStart: z.string(), // Thời gian bắt đầu suất chiếu
  TimeEnd: z.string(), // Thời gian kết thúc suất chiếu
  Date: z.date() // Giá vé
})

export type CreateShowtimeBodyType = z.TypeOf<typeof CreateShowtimeBody>

// Schema cho dữ liệu gửi lên khi cập nhật suất chiếu
export const UpdateShowtimeBody = z.object({
  IdFilm: z.string(), // ID bộ phim
  IdRoom: z.string(), // ID phòng chiếu
  TimeStart: z.string(), // Thời gian bắt đầu suất chiếu
  TimeEnd: z.string(), // Thời gian kết thúc suất chiếu
  Date: z.date(), // Giá vé
  Closed: z.number() // Trạng thái (có thể cập nhật)
})

export type UpdateShowtimeBodyType = z.TypeOf<typeof UpdateShowtimeBody>
