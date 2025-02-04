import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  MeResType,
  UpdateEmployeeAccountBodyType
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  list: () => http.get<AccountListResType>('user', { next: { tags: ['user'] } }),
  addAccount: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('user', body),
  updateAccount: (id: number, body: UpdateEmployeeAccountBodyType) => http.patch<AccountResType>(`user/${id}`, body),
  getAccount: (id: number) => http.get<AccountResType>(`user/${id}`),
  deleteAccount: (id: number) => http.delete<AccountResType>(`user/${id}`),
  me: () => http.get<MeResType>('/user/me')
}

export default accountApiRequest
