import { Schema, model } from 'mongoose'
import { TCart, TCartModel } from './cart.interface'

const cartSchema = new Schema<TCart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id is required'],
    },
  },
  {
    timestamps: true,
  },
)

export const Cart = model<TCart, TCartModel>('Cart', cartSchema)
