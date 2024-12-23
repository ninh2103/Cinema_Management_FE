import z from 'zod'

// Schema cho Ticket (Vé)
export const TicketSchema = z.object({
  Id: z.string(), // Mã vé
  MovieId: z.string(), // Mã phim (liên kết với phim)
  ShowtimeId: z.string(), // Mã suất chiếu (liên kết với suất chiếu)
  Seat: z.string().min(1, 'Seat is required'), // Ghế, ví dụ: "A1", "B3"
  Price: z.number().min(0, 'Price must be a positive number'), // Giá vé
  Status: z.enum(['Available', 'Booked', 'Cancelled']), // Trạng thái vé (Available: có sẵn, Booked: đã đặt, Cancelled: đã hủy)
  CreatedAt: z.date(), // Thời gian tạo vé
  UpdatedAt: z.date().nullable() // Thời gian cập nhật vé (có thể null)
})

export type TicketSchemaType = z.TypeOf<typeof TicketSchema>

// Schema cho phản hồi khi lấy thông tin 1 vé
export const TicketRes = z.object({
  data: TicketSchema, // Dữ liệu vé
  message: z.string() // Thông điệp trả về
})

export type TicketResType = z.TypeOf<typeof TicketRes>

// Schema cho phản hồi khi lấy danh sách vé
export const TicketListRes = z.object({
  data: z.array(TicketSchema), // Danh sách vé
  message: z.string(), // Thông điệp trả về
  meta: z.object({
    totalItems: z.number(), // Tổng số vé
    currentPage: z.number(), // Trang hiện tại
    itemsPerPage: z.number(), // Số lượng vé trên mỗi trang
    totalPages: z.number() // Tổng số trang
  })
})

export type TicketListResType = z.TypeOf<typeof TicketListRes>

// Schema cho dữ liệu gửi lên khi tạo mới vé
export const CreateTicketBody = z.object({
  MovieId: z.string().min(1, 'MovieId is required'), // Mã phim, bắt buộc
  ShowtimeId: z.string().min(1, 'ShowtimeId is required'), // Mã suất chiếu, bắt buộc
  Seat: z.string().min(1, 'Seat is required'), // Ghế, bắt buộc
  Price: z.number().min(0, 'Price must be a positive number'), // Giá vé, bắt buộc
  Status: z.enum(['Available', 'Booked', 'Cancelled']) // Trạng thái vé
})

export type CreateTicketBodyType = z.TypeOf<typeof CreateTicketBody>

// Schema cho dữ liệu gửi lên khi cập nhật vé
export const UpdateTicketBody = z.object({
  MovieId: z.string().min(1, 'MovieId is required').optional(), // Mã phim (có thể cập nhật)
  ShowtimeId: z.string().min(1, 'ShowtimeId is required').optional(), // Mã suất chiếu (có thể cập nhật)
  Seat: z.string().min(1, 'Seat is required').optional(), // Ghế (có thể cập nhật)
  Price: z.number().min(0, 'Price must be a positive number').optional(), // Giá vé (có thể cập nhật)
  Status: z.enum(['Available', 'Booked', 'Cancelled']).optional() // Trạng thái vé (có thể cập nhật)
})

export type UpdateTicketBodyType = z.TypeOf<typeof UpdateTicketBody>
