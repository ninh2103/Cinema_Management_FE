import z from 'zod'

// Schema cho Snack
export const SnackSchema = z.object({
  Id: z.string(), // Mã snack
  Name: z.string().min(1, 'Name is required'), // Tên snack, bắt buộc
  Description: z.string().optional(), // Mô tả snack, tùy chọn
  Price: z.number().min(0, 'Price must be a positive number'), // Giá snack, phải là số dương
  Category: z.enum(['Candy', 'Popcorn', 'Drinks', 'Chips', 'Others']), // Loại snack
  Image: z.string().url().optional(), // Đường dẫn hình ảnh snack, tùy chọn và phải là URL hợp lệ
  CreatedAt: z.date(), // Thời gian tạo snack
  UpdatedAt: z.date().nullable() // Thời gian cập nhật snack, có thể null
})

export type SnackSchemaType = z.TypeOf<typeof SnackSchema>

// Schema cho phản hồi khi lấy thông tin 1 snack
export const SnackRes = z.object({
  data: SnackSchema, // Dữ liệu snack
  message: z.string() // Thông điệp trả về
})

export type SnackResType = z.TypeOf<typeof SnackRes>

// Schema cho phản hồi khi lấy danh sách snack
export const SnackListRes = z.object({
  data: z.array(SnackSchema), // Danh sách snack
  message: z.string(), // Thông điệp trả về
  meta: z.object({
    totalItems: z.number(), // Tổng số snack
    currentPage: z.number(), // Trang hiện tại
    itemsPerPage: z.number(), // Số lượng snack trên mỗi trang
    totalPages: z.number() // Tổng số trang
  })
})

export type SnackListResType = z.TypeOf<typeof SnackListRes>

// Schema cho dữ liệu gửi lên khi tạo mới snack
export const CreateSnackBody = z.object({
  Name: z.string().min(1, 'Name is required'), // Tên snack
  Description: z.string().optional(), // Mô tả snack
  Price: z.number().min(0, 'Price must be a positive number'), // Giá snack
  Category: z.enum(['Candy', 'Popcorn', 'Drinks', 'Chips', 'Others']), // Loại snack
  Image: z.string().url().optional() // Đường dẫn hình ảnh snack
})

export type CreateSnackBodyType = z.TypeOf<typeof CreateSnackBody>

// Schema cho dữ liệu gửi lên khi cập nhật snack
export const UpdateSnackBody = z.object({
  Name: z.string().min(1, 'Name is required').optional(), // Tên snack (có thể cập nhật)
  Description: z.string().optional(), // Mô tả snack (có thể cập nhật)
  Price: z.number().min(0, 'Price must be a positive number').optional(), // Giá snack (có thể cập nhật)
  Category: z.enum(['Candy', 'Popcorn', 'Drinks', 'Chips', 'Others']).optional(), // Loại snack (có thể cập nhật)
  Image: z.string().url().optional() // Đường dẫn hình ảnh snack (có thể cập nhật)
})

export type UpdateSnackBodyType = z.TypeOf<typeof UpdateSnackBody>
