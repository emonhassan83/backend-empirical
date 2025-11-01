import { Model, Types } from 'mongoose'

export interface TProduct {
  deleteKey?: string[]
  id: string
  author: Types.ObjectId
  name: string
  images: string[]
  description: string
  stock: number
  sales: number
  price: number
  discount: number
  size?: {
    type: string
    quantity: number
  }[]
  shippingCharge?: {
    country: string
    price: number
  }[]
  avgRating: number
  ratingCount: number
  isDeleted: boolean
}

export type TProductModel = Model<TProduct, Record<string, any>>
