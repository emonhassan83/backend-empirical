import { model, Schema } from 'mongoose'
import { TItems, TItemsModel } from './items.interface'
import { PRODUCT_SIZE } from '../product/product.constants'

const itemsSchema = new Schema<TItems>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order id is required'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    size: {
      type: String,
      enum: PRODUCT_SIZE,
      default: PRODUCT_SIZE.free_size,
    },
  },
  {
    timestamps: true,
  },
)

export const Items = model<TItems, TItemsModel>('Items', itemsSchema)
