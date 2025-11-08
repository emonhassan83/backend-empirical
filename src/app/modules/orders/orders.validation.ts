import { z } from 'zod'
import { ORDER_STATUS } from './orders.constants'

// Basic MongoDB ObjectId validator (24 hex chars)
const objectIdRegex = /^[0-9a-fA-F]{24}$/
const ObjectIdString = z
  .string()
  .regex(objectIdRegex, 'Invalid ObjectId format')

// Item schema
const ItemSchema = z.object({
  product: ObjectIdString,
  quantity: z
    .number({ required_error: 'quantity is required' })
    .int('quantity must be an integer')
    .positive('quantity must be greater than 0'),
  price: z
    .number({ required_error: 'price is required' })
    .nonnegative('price must be >= 0'),
})

// Billing details
const BillingDetailsSchema = z.object({
  name: z.string().min(1, 'name is required'),
  address: z.string().min(1, 'address is required'),
  phoneNumber: z
    .string()
    .min(6, 'phoneNumber seems too short')
    .max(30, 'phoneNumber seems too long'),
  email: z.string().email('invalid email'),
  zipCode: z.union([z.number(), z.string()]).optional(), // allow number or string zip (coerce upstream if needed)
  city: z.string().min(1, 'city is required'),
  country: z.string().min(1, 'country is required'),
})

// Order data
const createOrderSchema = z.object({
  body: z.object({
    items: z.array(ItemSchema).min(1, 'At least one item is required'),
    user: ObjectIdString,
    amount: z
      .number({ required_error: 'amount is required' })
      .nonnegative('amount must be >= 0'),
    deliveryCharge: z
      .number()
      .nonnegative('deliveryCharge must be >= 0')
      .default(0),
    billingDetails: BillingDetailsSchema,
  }),
})

// Order data
const changeStatusOrderSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]], {
      required_error: 'Order status is required!',
    }),
  }),
})

export const OrderValidation = {
  createOrderSchema,
  changeStatusOrderSchema,
}
