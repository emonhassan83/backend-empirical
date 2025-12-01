import { TOrder, TOrderModel } from './orders.interface'
import { ORDER_STATUS, PAYMENT_STATUS } from './orders.constants'
import { model, Schema } from 'mongoose'
import { generateCryptoString } from '../../utils/generateCryptoString'

const orderSchema = new Schema<TOrder>(
  {
    id: {
      type: String,
      default: () => generateCryptoString(10),
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.unpaid,
    },
    transactionId: {
      type: String,
      default: null,
    },
    billingDetails: {
      type: {
        name: { type: String, default: null },
        address: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        email: {
          type: String,
          default: null,
        },
        zipCode: { type: Number, default: null },
        city: { type: String, default: null },
        country: { type: String, default: null },
        note: { type: String, default: null },
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// filter out deleted documents
orderSchema.pre('find', function (next) {
  //@ts-ignore
  this.find({ isDeleted: { $ne: true } })
  next()
})

orderSchema.pre('findOne', function (next) {
  //@ts-ignore
  this.findOne({ isDeleted: { $ne: true } })
  next()
})

orderSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

// Check if the model already exists before defining it
const Order = model<TOrder, TOrderModel>('Order', orderSchema)

export default Order
