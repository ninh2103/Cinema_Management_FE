import z from 'zod'

// Schema cho Khuyến mãi (Promotion)
export const PromotionSchema = z.object({
  Id: z.number(), // Mã khuyến mãi
  Code: z.string(),
  Value: z.number().min(0, 'Value must be a positive number').max(100, 'Value cannot be greater than 100'), // Tỷ lệ giảm giá (0-100)
  DateFrom: z.date(), // Ngày bắt đầu khuyến mãi
  DateTo: z.date(),
  IdEvent: z.string(), // Ngày kết thúc khuyến mãi
  CreatedAt: z.date(), // Thời gian tạo khuyến mãi
  UpdatedAt: z.date().nullable() // Thời gian cập nhật khuyến mãi (có thể null)
})

export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>

// Schema cho phản hồi khi lấy thông tin 1 khuyến mãi
export const PromotionRes = z.object({
  data: z.object({
    data: z.array(PromotionSchema), // List of movie objects
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string() // Thông điệp trả về
})

export type PromotionListResType = z.TypeOf<typeof PromotionRes>

// Schema cho phản hồi khi lấy danh sách khuyến mãi
export const PromotionListRes = z.object({
  data: PromotionSchema, // Danh sách khuyến mãi
  message: z.string() // Thông điệp trả về
})

export type PromotionResType = z.TypeOf<typeof PromotionListRes>

// Schema cho dữ liệu gửi lên khi tạo mới khuyến mãi
export const CreatePromotionBody = z.object({
  Code: z.string(),
  Value: z.number().min(0, 'Value must be a positive number').max(100, 'Value cannot be greater than 100'), // Tỷ lệ giảm giá, bắt buộc
  DateFrom: z.date(), // Ngày bắt đầu, bắt buộc
  DateTo: z.date().refine((val) => val > new Date(), {
    message: 'DateTo must be in the future' // Ngày kết thúc phải lớn hơn ngày hiện tại
  }),
  IdEvent: z.string()
})

export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>

// Schema cho dữ liệu gửi lên khi cập nhật khuyến mãi
export const UpdatePromotionBody = z.object({
  Code: z.string(),
  Value: z.number().min(0, 'Value must be a positive number').max(100, 'Value cannot be greater than 100').optional(), // Tỷ lệ giảm giá (có thể cập nhật)
  DateFrom: z.date().optional(), // Ngày bắt đầu (có thể cập nhật)
  DateTo: z
    .date()
    .refine((val) => val > new Date(), {
      message: 'DateTo must be in the future' // Ngày kết thúc phải lớn hơn ngày hiện tại
    })
    .optional(),
  IdEvent: z.string() // Ngày kết thúc (có thể cập nhật)
})

export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>
