import { z } from 'zod'

const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required!',
    }),
    description: z
      .string({
        required_error: 'Description is required!',
      })
      .min(10, 'Description must be at least 10 characters long'),
    stock: z
      .number({
        required_error: 'Stock is required!',
      })
      .int('Stock must be an integer!')
      .min(1, 'Stock must be at least 1')
      .optional(),
    price: z
      .number({
        required_error: 'Price is required!',
      })
      .positive('Price must be a positive number'),
    discount: z
      .number({
        required_error: 'Discount is required!',
      })
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount cannot exceed 100%')
      .default(0),
    size: z
      .array(
        z.object({
          type: z.string().optional(),
          quantity: z
            .number()
            .min(0, 'Size quantity cannot be negative')
            .default(0),
        }),
      )
  }),
})

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().min(10).optional(),
    stock: z.number().int().min(0).optional(),
    price: z.number().positive().optional(),
    discount: z.number().min(0).max(100).optional(),
    size: z
      .array(
        z.object({
          type: z.string().optional(),
          quantity: z.number().min(0).optional(),
        }),
      )
      .optional()
  }),
})

export const productValidation = {
  createProductSchema,
  updateProductSchema
}
