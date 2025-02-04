import z from 'zod'

// Define the schema for creating a movie
export const CreateMovieBody = z.object({
  NameEN: z.string(),
  NameVN: z.string(),
  Directors: z.string(),
  Cast: z.string(),
  Premiere: z.date(),
  Time: z.number(),
  Detail: z.string(),
  Trailer: z.string(),
  AgeLimit: z.string(),
  Photo: z.string(),
  Status: z.string(),
  Rating: z.string()
})

export type CreateMovieBodyType = z.TypeOf<typeof CreateMovieBody>

// Define the schema for updating a movie
export const UpdateMovieBody = CreateMovieBody
export type UpdateMovieBodyType = CreateMovieBodyType

// Define the schema for a single movie object

export const MovieSchema = z.object({
  Id: z.number(),
  NameEN: z.string(),
  NameVN: z.string(),
  Directors: z.string(),
  Cast: z.string(),
  Premiere: z.date(),
  Time: z.number(),
  Detail: z.string(),
  Trailer: z.string(),
  AgeLimit: z.string(),
  Photo: z.string(),
  Status: z.string(),
  Rating: z.string(),
  CreatedAt: z.date(),
  UpdatedAt: z.date().optional(),
  showtimes: z.array(
    z.object({
      Id: z.string(), // Mã suất chiếu (đổi từ z.number() thành z.string() nếu ID là chuỗi)
      IdFilm: z.string(), // ID bộ phim
      IdRoom: z.string(), // ID phòng chiếu
      TimeStart: z.string(), // Thời gian bắt đầu suất chiếu
      TimeEnd: z.string(), // Thời gian kết thúc suất chiếu
      Date: z.date(), // Ngày suất chiếu
      Closed: z.number(), // Trạng thái (có thể cập nhật)
      CreatedAt: z.date(), // Thời gian tạo suất chiếu
      UpdatedAt: z.date().nullable(), // Thời gian cập nhật
      room: z.object({
        Name: z.string() // Tên phòng chiếu
      })
    })
  ) // showtimes là một mảng các đối tượng
})

export type MovieSchemaType = z.TypeOf<typeof MovieSchema>

// Define the schema for the response of a single movie
export const MovieRes = z.object({
  data: MovieSchema,
  message: z.string()
})

export type MovieResType = z.TypeOf<typeof MovieRes>

// Define the schema for the response with a list of movies, including meta information for pagination
export const MovieListRes = z.object({
  data: z.object({
    data: z.array(MovieSchema), // List of movie objects
    meta: z.object({
      totalItems: z.number(),
      currentPage: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number()
    })
  }),
  message: z.string()
})

export type MovieListResType = z.TypeOf<typeof MovieListRes>
