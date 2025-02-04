import z from 'zod'

// Schema mô tả TimeSlot
export const TimeSlotSchema = z.object({
  Id: z.number(), // Mã sự kiện, kiểu String
  StartTime: z.string(), // Thời gian bắt đầu
  EndTime: z.string(), // Thời gian kết thúc
  CreatedAt: z.date(), // Thời gian tạo
  UpdatedAt: z.date().nullable() // Thời gian cập nhật, có thể là null
})

export type TimeSlotSchemaType = z.TypeOf<typeof TimeSlotSchema>

// Schema phản hồi một đối tượng TimeSlot
export const TimeSlotRes = z.object({
  data: TimeSlotSchema, // Dữ liệu sự kiện
  message: z.string() // Thông điệp trả về
})

export type TimeSlotResType = z.TypeOf<typeof TimeSlotRes>

// Schema phản hồi danh sách TimeSlot
export const TimeSlotListRes = z.object({
  data: z.object({
    data: z.array(TimeSlotSchema), // Danh sách các sự kiện
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type TimeSlotListResType = z.TypeOf<typeof TimeSlotListRes>

// Schema cho request tạo TimeSlot
export const CreateTimeSlotBody = z.object({
  StartTime: z.string(), // Thời gian bắt đầu
  EndTime: z.string() // Thời gian kết thúc
})

export type CreateTimeSlotBodyType = z.TypeOf<typeof CreateTimeSlotBody>

// Schema cho request cập nhật TimeSlot
export const UpdateTimeSlotBody = z.object({
  StartTime: z.string(), // Thời gian bắt đầu
  EndTime: z.string() // Thời gian kết thúc
})

export type UpdateTimeSlotBodyType = z.TypeOf<typeof UpdateTimeSlotBody>
