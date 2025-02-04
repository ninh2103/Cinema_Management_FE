import http from '@/lib/http'
import {
  CreateHolidayBodyType,
  HolidayListResType,
  HolidayResType,
  UpdateHolidayBodyType
} from '@/schemaValidations/holiday.schema'

const holidayApiRequest = {
  list: () => http.get<HolidayListResType>('holiday', { next: { tags: ['holiday'] } }),
  addHoliday: (body: CreateHolidayBodyType) => http.post<HolidayResType>('holiday', body),
  updateHoliday: (id: number, body: UpdateHolidayBodyType) => http.patch<HolidayResType>(`holiday/${id}`, body),
  getHoliday: (id: number) => http.get<HolidayResType>(`holiday/${id}`),
  deleteHoliday: (id: number) => http.delete<HolidayResType>(`holiday/${id}`)
}

export default holidayApiRequest
