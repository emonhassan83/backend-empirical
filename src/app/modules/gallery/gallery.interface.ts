import { Model, Types } from 'mongoose'

export type TGallery = {
  _id?: string
  image: string
}

export type TGalleryModel = Model<TGallery, Record<string, unknown>>
