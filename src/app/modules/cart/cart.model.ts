import { Schema, model } from 'mongoose'
import { TCart, TCartModel } from './cart.interface'
import { PRODUCT_SIZE } from '../product/product.constants'

const cartSchema = new Schema<TCart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id is required'],
    },
    size: {
      type: String,
      enum: Object.keys(PRODUCT_SIZE),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Cart = model<TCart, TCartModel>('Cart', cartSchema)
