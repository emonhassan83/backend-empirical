import { Model, Types } from 'mongoose'
import { TOrder } from '../orders/orders.interface'

export enum ITEM_MODEL_TYPE {
  Product = 'Product',
  GalleryPhotos = 'GalleryPhotos',
  Gallery = 'Gallery',
}

export interface TItems {
  product: Types.ObjectId
  author: Types.ObjectId
  order: Types.ObjectId | TOrder
  quantity: number
  price: number
  size?: string
}

export type TItemsModel = Model<TItems, Record<string, unknown>>
