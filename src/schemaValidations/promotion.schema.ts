import z from 'zod'

// Schema cho Khuyến mãi (Promotion)
export const PromotionSchema = z.object({
  Id: z.string(), // Mã khuyến mãi
  MovieId: z.string(), // Mã phim (liên kết với phim)
  Discount: z.number().min(0, 'Discount must be a positive number').max(100, 'Discount cannot be greater than 100'), // Tỷ lệ giảm giá (0-100)
  StartDate: z.date(), // Ngày bắt đầu khuyến mãi
  EndDate: z.date(), // Ngày kết thúc khuyến mãi
  Status: z.enum(['Active', 'Inactive', 'Expired']), // Trạng thái khuyến mãi (Active: đang hoạt động, Inactive: không hoạt động, Expired: hết hạn)
  CreatedAt: z.date(), // Thời gian tạo khuyến mãi
  UpdatedAt: z.date().nullable() // Thời gian cập nhật khuyến mãi (có thể null)
})

export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>

// Schema cho phản hồi khi lấy thông tin 1 khuyến mãi
export const PromotionRes = z.object({
  data: PromotionSchema, // Dữ liệu khuyến mãi
  message: z.string() // Thông điệp trả về
})

export type PromotionResType = z.TypeOf<typeof PromotionRes>

// Schema cho phản hồi khi lấy danh sách khuyến mãi
export const PromotionListRes = z.object({
  data: z.array(PromotionSchema), // Danh sách khuyến mãi
  message: z.string(), // Thông điệp trả về
  meta: z.object({
    totalItems: z.number(), // Tổng số khuyến mãi
    currentPage: z.number(), // Trang hiện tại
    itemsPerPage: z.number(), // Số lượng khuyến mãi trên mỗi trang
    totalPages: z.number() // Tổng số trang
  })
})

export type PromotionListResType = z.TypeOf<typeof PromotionListRes>

// Schema cho dữ liệu gửi lên khi tạo mới khuyến mãi
export const CreatePromotionBody = z.object({
  MovieId: z.string().min(1, 'MovieId is required'), // Mã phim, bắt buộc
  Discount: z.number().min(0, 'Discount must be a positive number').max(100, 'Discount cannot be greater than 100'), // Tỷ lệ giảm giá, bắt buộc
  StartDate: z.date(), // Ngày bắt đầu, bắt buộc
  EndDate: z.date().refine((val) => val > new Date(), {
    message: 'EndDate must be in the future' // Ngày kết thúc phải lớn hơn ngày hiện tại
  }), // Ngày kết thúc khuyến mãi, bắt buộc
  Status: z.enum(['Active', 'Inactive', 'Expired']) // Trạng thái khuyến mãi, bắt buộc
})

export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>

// Schema cho dữ liệu gửi lên khi cập nhật khuyến mãi
export const UpdatePromotionBody = z.object({
  MovieId: z.string().min(1, 'MovieId is required').optional(), // Mã phim (có thể cập nhật)
  Discount: z
    .number()
    .min(0, 'Discount must be a positive number')
    .max(100, 'Discount cannot be greater than 100')
    .optional(), // Tỷ lệ giảm giá (có thể cập nhật)
  StartDate: z.date().optional(), // Ngày bắt đầu (có thể cập nhật)
  EndDate: z
    .date()
    .refine((val) => val > new Date(), {
      message: 'EndDate must be in the future' // Ngày kết thúc phải lớn hơn ngày hiện tại
    })
    .optional(), // Ngày kết thúc (có thể cập nhật)
  Status: z.enum(['Active', 'Inactive', 'Expired']).optional() // Trạng thái khuyến mãi (có thể cập nhật)
})

export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>
