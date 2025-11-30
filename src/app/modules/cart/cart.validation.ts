import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User ID is required' }),
    product: z.string({ required_error: 'Product ID is required' }),
    size: z.string({ required_error: 'Product size is required' }),
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .min(1, { message: 'Quantity must be at least 1' }),
  }),
})

export const CartValidation = {
  createValidationSchema,
}
