import http from '@/lib/http'
import {
  CreateEventBodyType,
  EventListResType,
  EventResType,
  UpdateEventBodyType
} from '@/schemaValidations/event.schema'

const eventApiRequest = {
  list: () => http.get<EventListResType>('event', { next: { tags: ['event'] } }),
  addEvent: (body: CreateEventBodyType) => http.post<EventResType>('event', body),
  updateEvent: (id: number, body: UpdateEventBodyType) => http.patch<EventResType>(`event/${id}`, body),
  getEvent: (id: number) => http.get<EventResType>(`event/${id}`),
  deleteEvent: (id: number) => http.delete<EventResType>(`event/${id}`)
}

export default eventApiRequest
