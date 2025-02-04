import http from '@/lib/http'

import {
  CinemaroomListResType,
  CinemaroomResType,
  CreateCinemaroomBodyType,
  UpdateCinemaroomBodyType
} from '@/schemaValidations/room.schema'

const roomApiRequest = {
  list: () => http.get<CinemaroomListResType>('cinemaroom', { next: { tags: ['cinemaroom'] } }),
  addRoom: (body: CreateCinemaroomBodyType) => http.post<CinemaroomResType>('cinemaroom', body),
  updateRoom: (id: number, body: UpdateCinemaroomBodyType) => http.patch<CinemaroomResType>(`cinemaroom/${id}`, body),
  getRoom: (id: number) => http.get<CinemaroomResType>(`cinemaroom/${id}`),
  deleteRoom: (id: number) => http.delete<CinemaroomResType>(`cinemaroom/${id}`)
}

export default roomApiRequest
