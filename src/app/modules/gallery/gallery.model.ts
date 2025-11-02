import { Schema, model } from 'mongoose'
import { TGallery, TGalleryModel } from './gallery.interface'

const gallerySchema = new Schema<TGallery>(
  {
    image: { type: String, required: true },
  },
  { timestamps: true },
)

export const Gallery = model<TGallery, TGalleryModel>('Gallery', gallerySchema)
