import axios from 'axios'

export interface CreateOrderData {
  items: {
    nftId: string
    name: string
    quantity: number
    price: number
  }[]
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  paymentMethod: string
}

export interface Order extends CreateOrderData {
  id: string
  status: 'confirmed' | 'pending' | 'refused'
  createdAt: string
}


export type PaymentScenario = 'confirmed' | 'pending' | 'refused'

export async function createOrder(
  data: CreateOrderData,
  scenario?: PaymentScenario,
): Promise<Order> {
  const response = await axios.post<Order>(
    '/api/orders',
    data,
    {
      params: scenario ? { scenario } : undefined,
    },
  )

  return response.data
}