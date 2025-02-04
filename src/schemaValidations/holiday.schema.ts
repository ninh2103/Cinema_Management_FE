import z from 'zod'

// Schema mô tả Holiday
export const HolidaySchema = z.object({
  Id: z.number(), // Mã sự kiện, kiểu String
  Date: z.date(), // Ngày lễ
  CreatedAt: z.date(), // Thời gian tạo
  UpdatedAt: z.date().nullable() // Thời gian cập nhật, có thể là null
})

export type HolidaySchemaType = z.TypeOf<typeof HolidaySchema>

// Schema phản hồi một đối tượng Holiday
export const HolidayRes = z.object({
  data: HolidaySchema, // Dữ liệu sự kiện
  message: z.string() // Thông điệp trả về
})

export type HolidayResType = z.TypeOf<typeof HolidayRes>

// Schema phản hồi danh sách Holiday
export const HolidayListRes = z.object({
  data: z.object({
    data: z.array(HolidaySchema), // Danh sách các sự kiện
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type HolidayListResType = z.TypeOf<typeof HolidayListRes>

// Schema cho request tạo Holiday
export const CreateHolidayBody = z.object({
  Date: z.date() // Ngày lễ
})

export type CreateHolidayBodyType = z.TypeOf<typeof CreateHolidayBody>

// Schema cho request cập nhật Holiday
export const UpdateHolidayBody = z.object({
  Date: z.date() // Ngày lễ
})

export type UpdateHolidayBodyType = z.TypeOf<typeof UpdateHolidayBody>
