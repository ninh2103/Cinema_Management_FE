import z from 'zod'

// Schema cho Snack
export const SnackSchema = z.object({
  Id: z.number(), // Mã snack
  Name: z.string().min(1, 'Name is required'), // Tên snack, bắt buộc
  Price: z.number(), // Giá snack, phải là số dương
  Type: z.string(),
  Photo: z.string().url().optional(),
  Block: z.number(), // Đường dẫn hình ảnh snack, tùy chọn và phải là URL hợp lệ
  CreatedAt: z.date(), // Thời gian tạo snack
  UpdatedAt: z.date().nullable() // Thời gian cập nhật snack, có thể null
})

export type SnackSchemaType = z.TypeOf<typeof SnackSchema>

// Schema cho phản hồi khi lấy thông tin 1 snack
export const SnackRes = z.object({
  data: z.object({
    data: z.array(SnackSchema), // List of movie objects
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string() // Thông điệp trả về
})

export type SnackListResType = z.TypeOf<typeof SnackRes>

// Schema cho phản hồi khi lấy danh sách snack
export const SnackListRes = z.object({
  data: SnackSchema, // Danh sách snack
  message: z.string() // Thông điệp trả về
})

export type SnackResType = z.TypeOf<typeof SnackListRes>

// Schema cho dữ liệu gửi lên khi tạo mới snack
export const CreateSnackBody = z.object({
  Name: z.string().min(1, 'Name is required'), // Tên snack
  Price: z.number(), // Giá snack
  Type: z.string(),
  Photo: z.string().url().optional() // Đường dẫn hình ảnh snack
})

export type CreateSnackBodyType = z.TypeOf<typeof CreateSnackBody>

// Schema cho dữ liệu gửi lên khi cập nhật snack
export const UpdateSnackBody = z.object({
  Name: z.string().min(1, 'Name is required').optional(), // Tên snack (có thể cập nhật)
  Price: z.number(), // Giá snack (có thể cập nhật)
  Type: z.string(),
  Block: z.number(),
  Photo: z.string().url().optional() // Đường dẫn hình ảnh snack (có thể cập nhật)
})

export type UpdateSnackBodyType = z.TypeOf<typeof UpdateSnackBody>
