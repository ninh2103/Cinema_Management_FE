import http from '@/lib/http'
import {
  CreatePromotionBodyType,
  PromotionListResType,
  PromotionResType,
  UpdatePromotionBodyType
} from '@/schemaValidations/promotion.schema'

const promotionApiRequest = {
  list: () => http.get<PromotionListResType>('promotion', { next: { tags: ['promotion'] } }),
  addPromotion: (body: CreatePromotionBodyType) => http.post<PromotionResType>('promotion', body),
  updatePromotion: (id: number, body: UpdatePromotionBodyType) => http.patch<PromotionResType>(`promotion/${id}`, body),
  getPromotion: (id: number) => http.get<PromotionResType>(`promotion/${id}`),
  deletePromotion: (id: number) => http.delete<PromotionResType>(`promotion/${id}`)
}

export default promotionApiRequest
