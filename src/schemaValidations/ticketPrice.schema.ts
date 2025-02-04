import z from 'zod'

// Schema mô tả TicketPrice
export const TicketPriceSchema = z.object({
  Id: z.number(), // Mã sự kiện, kiểu String
  Type: z.string(), // Loại giá vé
  Price: z.number(),
  CreatedAt: z.date(), // Thời gian tạo
  UpdatedAt: z.date().nullable(), // Thời gian cập nhật, có thể là null
  TimeSlots: z.array(
    z.object({
      Id: z.number(), // Mã sự kiện, kiểu String
      StartTime: z.string(), // Thời gian bắt đầu
      EndTime: z.string() // Thời gian kết thúc
    })
  ),
  Holidays: z.array(
    z.object({
      Date: z.date()
    })
  )
})

export type TicketPriceSchemaType = z.TypeOf<typeof TicketPriceSchema>

// Schema phản hồi một đối tượng TicketPrice
export const TicketPriceRes = z.object({
  data: TicketPriceSchema, // Dữ liệu sự kiện
  message: z.string() // Thông điệp trả về
})

export type TicketPriceResType = z.TypeOf<typeof TicketPriceRes>

// Schema phản hồi danh sách TicketPrice
export const TicketPriceListRes = z.object({
  data: z.object({
    data: z.array(TicketPriceSchema), // Danh sách các sự kiện
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type TicketPriceListResType = z.TypeOf<typeof TicketPriceListRes>

// Schema cho request tạo TicketPrice
export const CreateTicketPriceBody = z.object({
  Type: z.string(), // Loại giá vé
  Price: z.number()
})

export type CreateTicketPriceBodyType = z.TypeOf<typeof CreateTicketPriceBody>

// Schema cho request cập nhật TicketPrice
export const UpdateTicketPriceBody = z.object({
  Type: z.string(), // Loại giá vé
  Price: z.number()
})

export type UpdateTicketPriceBodyType = z.TypeOf<typeof UpdateTicketPriceBody>
