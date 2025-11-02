import { Model, Types } from 'mongoose'
import { TOrder } from '../orders/orders.interface'

export interface TItems {
  product: Types.ObjectId
  order: Types.ObjectId | TOrder
  quantity: number
  price: number
  size?: string
}

export type TItemsModel = Model<TItems, Record<string, unknown>>
