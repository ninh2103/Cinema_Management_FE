import z from 'zod'

// Schema cho Suất chiếu
export const ShowtimeSchema = z.object({
  Id: z.string(), // Mã suất chiếu
  MovieId: z.string(), // ID bộ phim
  CinemaroomId: z.string(), // ID phòng chiếu
  StartTime: z.date(), // Thời gian bắt đầu suất chiếu
  EndTime: z.date(), // Thời gian kết thúc suất chiếu
  Price: z.number(), // Giá vé
  Status: z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled']), // Trạng thái suất chiếu
  CreatedAt: z.date(), // Thời gian tạo suất chiếu
  UpdatedAt: z.date().nullable() // Thời gian cập nhật suất chiếu, có thể null
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
  data: z.array(ShowtimeSchema), // Danh sách suất chiếu
  message: z.string(), // Thông điệp trả về
  meta: z.object({
    totalItems: z.number(), // Tổng số suất chiếu
    currentPage: z.number(), // Trang hiện tại
    itemsPerPage: z.number(), // Số lượng suất chiếu trên mỗi trang
    totalPages: z.number() // Tổng số trang
  })
})

export type ShowtimeListResType = z.TypeOf<typeof ShowtimeListRes>

// Schema cho dữ liệu gửi lên khi tạo mới suất chiếu
export const CreateShowtimeBody = z.object({
  MovieId: z.string(), // ID của bộ phim
  CinemaroomId: z.string(), // ID của phòng chiếu
  StartTime: z.date(), // Thời gian bắt đầu suất chiếu
  EndTime: z.date(), // Thời gian kết thúc suất chiếu
  Price: z.number(), // Giá vé
  Status: z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled']) // Trạng thái suất chiếu
})

export type CreateShowtimeBodyType = z.TypeOf<typeof CreateShowtimeBody>

// Schema cho dữ liệu gửi lên khi cập nhật suất chiếu
export const UpdateShowtimeBody = z.object({
  MovieId: z.string().optional(), // ID bộ phim (có thể cập nhật)
  CinemaroomId: z.string().optional(), // ID phòng chiếu (có thể cập nhật)
  StartTime: z.date().optional(), // Thời gian bắt đầu (có thể cập nhật)
  EndTime: z.date().optional(), // Thời gian kết thúc (có thể cập nhật)
  Price: z.number().optional(), // Giá vé (có thể cập nhật)
  Status: z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled']).optional() // Trạng thái (có thể cập nhật)
})

export type UpdateShowtimeBodyType = z.TypeOf<typeof UpdateShowtimeBody>
