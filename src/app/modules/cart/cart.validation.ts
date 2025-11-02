import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User ID is required' }),
    product: z.string({ required_error: 'Product ID is required' }),
  }),
})

export const CartValidation = {
  createValidationSchema,
}
