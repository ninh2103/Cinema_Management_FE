import http from '@/lib/http'

import {
  CreateTimeSlotBodyType,
  TimeSlotListResType,
  TimeSlotResType,
  UpdateTimeSlotBodyType
} from '@/schemaValidations/timeSlot.schema'

const timeSlotApiRequest = {
  list: () => http.get<TimeSlotListResType>('time-slot', { next: { tags: ['time-slot'] } }),
  addTimeSlot: (body: CreateTimeSlotBodyType) => http.post<TimeSlotResType>('time-slot', body),
  updateTimeSlot: (id: number, body: UpdateTimeSlotBodyType) => http.patch<TimeSlotResType>(`time-slot/${id}`, body),
  getTimeSlot: (id: number) => http.get<TimeSlotResType>(`time-slot/${id}`),
  deleteTimeSlot: (id: number) => http.delete<TimeSlotResType>(`time-slot/${id}`)
}

export default timeSlotApiRequest
