import http from '@/lib/http'

import {
  CreateTicketPriceBodyType,
  TicketPriceListResType,
  TicketPriceResType,
  UpdateTicketPriceBodyType
} from '@/schemaValidations/ticketPrice.schema'

const ticketPriceApiRequest = {
  list: () => http.get<TicketPriceListResType>('ticket-price', { next: { tags: ['ticket-price'] } }),
  addTicketPrice: (body: CreateTicketPriceBodyType) => http.post<TicketPriceResType>('ticket-price', body),
  updateTicketPrice: (id: number, body: UpdateTicketPriceBodyType) =>
    http.patch<TicketPriceResType>(`ticket-price/${id}`, body),
  getTicketPrice: (id: number) => http.get<TicketPriceResType>(`ticket-price/${id}`),
  deleteTicketPrice: (id: number) => http.delete<TicketPriceResType>(`ticket-price/${id}`)
}

export default ticketPriceApiRequest
