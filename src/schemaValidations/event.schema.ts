import z from 'zod'

// Schema mô tả Event
export const EventSchema = z.object({
  Id: z.number(), // Mã sự kiện, kiểu String
  Title: z.string(), // Tên sự kiện
  Slug: z.string(), // Từ khóa tên sự kiện
  Content: z.string(), // Nội dung sự kiện
  Photo: z.string(), // Ảnh sự kiện
  Author: z.string(), // Tác giả sự kiện
  Time: z.date(), // Thời gian tạo sự kiện
  CreatedAt: z.date(), // Thời gian tạo
  UpdatedAt: z.date().nullable() // Thời gian cập nhật, có thể là null
})

export type EventSchemaType = z.TypeOf<typeof EventSchema>

// Schema phản hồi một đối tượng Event
export const EventRes = z.object({
  data: EventSchema, // Dữ liệu sự kiện
  message: z.string() // Thông điệp trả về
})

export type EventResType = z.TypeOf<typeof EventRes>

// Schema phản hồi danh sách Event
export const EventListRes = z.object({
  data: z.object({
    data: z.array(EventSchema), // Danh sách các sự kiện
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type EventListResType = z.TypeOf<typeof EventListRes>

// Schema cho request tạo Event
export const CreateEventBody = z.object({
  Title: z.string(), // Tên sự kiện
  Slug: z.string(), // Từ khóa tên sự kiện
  Content: z.string(), // Nội dung sự kiện
  Photo: z.string(), // Ảnh sự kiện
  Author: z.string(), // Tác giả sự kiện
  Time: z.date() // Thời gian tạo sự kiện
})

export type CreateEventBodyType = z.TypeOf<typeof CreateEventBody>

// Schema cho request cập nhật Event
export const UpdateEventBody = z.object({
  Title: z.string().optional(), // Tên sự kiện
  Slug: z.string().optional(), // Từ khóa tên sự kiện
  Content: z.string().optional(), // Nội dung sự kiện
  Photo: z.string().optional(), // Ảnh sự kiện
  Author: z.string().optional(), // Tác giả sự kiện
  Time: z.date().optional() // Thời gian tạo sự kiện
})

export type UpdateEventBodyType = z.TypeOf<typeof UpdateEventBody>
