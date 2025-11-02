import { Model, Types } from 'mongoose'

export type TCart = {
  _id?: string
  user: Types.ObjectId
  product: Types.ObjectId
}

export type TCartModel = Model<TCart, Record<string, unknown>>
