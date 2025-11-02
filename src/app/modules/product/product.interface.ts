import { Model, Types } from 'mongoose'
import { TProductSize } from './product.constants'

export interface TProduct {
  id: string
  author: Types.ObjectId
  title: string
  images: string[]
  description: string
  stock: number
  sale: number
  price: number
  discount: number
  size?: {
    type: TProductSize
    quantity: number
  }[]
  isDeleted: boolean
}

export type TProductModel = Model<TProduct, Record<string, any>>
