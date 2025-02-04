import http from '@/lib/http'
import {
  CreateShowtimeBodyType,
  ShowtimeListResType,
  ShowtimeResType,
  UpdateShowtimeBodyType
} from '@/schemaValidations/showtime.schema'

const showtimeApiRequest = {
  list: () => http.get<ShowtimeListResType>('showtime', { next: { tags: ['showtime'] } }),
  addShowtime: (body: CreateShowtimeBodyType) => http.post<ShowtimeResType>('showtime', body),
  updateShowtime: (id: number, body: UpdateShowtimeBodyType) => http.patch<ShowtimeResType>(`showtime/${id}`, body),
  getShowtime: (id: number) => http.get<ShowtimeResType>(`showtime/${id}`),
  deleteShowtime: (id: number) => http.delete<ShowtimeResType>(`showtime/${id}`)
}

export default showtimeApiRequest
