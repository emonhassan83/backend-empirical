import { model, Schema } from 'mongoose'
import { ITEM_MODEL_TYPE, TItems, TItemsModel } from './items.interface'

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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export const Items = model<TItems, TItemsModel>('Items', itemsSchema)
