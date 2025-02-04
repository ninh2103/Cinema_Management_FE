import http from '@/lib/http'

import {
  CreateSnackBodyType,
  SnackListResType,
  SnackResType,
  UpdateSnackBodyType
} from '@/schemaValidations/snack.schema'

const foodApiRequest = {
  list: () => http.get<SnackListResType>('snack', { next: { tags: ['snack'] } }),
  addSnack: (body: CreateSnackBodyType) => http.post<SnackResType>('snack', body),
  updateSnack: (id: number, body: UpdateSnackBodyType) => http.patch<SnackResType>(`snack/${id}`, body),
  getSnack: (id: number) => http.get<SnackResType>(`snack/${id}`),
  deleteSnack: (id: number) => http.delete<SnackResType>(`snack/${id}`)
}

export default foodApiRequest
