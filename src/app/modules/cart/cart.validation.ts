import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    user: z.string({ error: 'User ID is required' }),
    product: z.string({ error: 'Product ID is required' }),
    size: z.string({ error: 'Product size is required' }),
    quantity: z
      .number({ error: 'Quantity is required' })
      .min(1, { message: 'Quantity must be at least 1' }),
  }),
})

export const CartValidation = {
  createValidationSchema,
}
