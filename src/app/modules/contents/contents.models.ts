import { Schema, model } from 'mongoose'
import { TContents, TContentsModel } from './contents.interface'

const contentsSchema = new Schema<TContents>(
  {
    aboutUs: {
      type: String,
    },
    termsAndConditions: {
      type: String,
    },
    privacyPolicy: {
      type: String,
    },
    supports: {
      type: String,
    },
    philosophyImage: {
      type: String,
    },
    philosophyAboutUs: {
      type: String,
    },
    philosophyImpact: {
      type: String,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

export const Contents = model<TContents, TContentsModel>(
  'Contents',
  contentsSchema,
)
