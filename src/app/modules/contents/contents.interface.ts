import { Model, Types } from 'mongoose'

type TGlobalPrice = {
  eachPrice: number
  totalPrice: number
}

export interface TContents {
  _id?: string
  aboutUs?: string
  termsAndConditions?: string
  privacyPolicy?: string
  supports?: string
  philosophyImage?: string
  philosophyAboutUs?: string
  philosophyImpact?: string
  createdBy: Types.ObjectId
  isDeleted?: boolean
}

export type TContentsModel = Model<TContents, Record<string, unknown>>
