import { Model, Types } from 'mongoose'
import { TProductSize } from '../product/product.constants'

export type TCart = {
  _id?: string
  user: Types.ObjectId
  product: Types.ObjectId
  size: TProductSize
  quantity: number
}

export type TCartModel = Model<TCart, Record<string, unknown>>
