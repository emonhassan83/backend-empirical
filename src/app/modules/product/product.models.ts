import { model, Schema } from 'mongoose'
import { TProduct, TProductModel } from './product.interface'
import { generateCryptoString } from '../../utils/generateCryptoString'

const productSchema = new Schema<TProduct>(
  {
    id: {
      type: String,
      unique: true,
      default: () => generateCryptoString(10),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    size: {
      type: [
        {
          _id: false, // Prevent _id from being created
          type: {
            type: String,
            default: null,
          },
          quantity: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Product = model<TProduct, TProductModel>('Product', productSchema)

export default Product
