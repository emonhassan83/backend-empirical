import { Model, Types } from 'mongoose'
import { TUser } from '../user/user.interface'
import { TOrderStatus, TPaymentStatus } from './orders.constants'

export enum ORDER_MODEL_TYPE {
  Product = 'Product',
  GalleryPhotos = 'GalleryPhotos',
  Gallery = 'Gallery',
}

export interface TOrder {
  _id?: Types.ObjectId
  id: string
  user: Types.ObjectId | TUser
  amount: number
  status: TOrderStatus
  paymentStatus: TPaymentStatus
  transactionId?: string
  // deliveryCharge: number
  billingDetails: {
    name?: string
    email: string
    address?: string
    phoneNumber?: string
    zipCode: number
    city: string
    country: string
    note: string
  }
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TOrderModel = Model<TOrder, Record<string, unknown>>
