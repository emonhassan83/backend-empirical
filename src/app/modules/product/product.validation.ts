import { z } from 'zod'
import { PRODUCT_CATEGORY, PRODUCT_STATUS } from './product.constants'

const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required!',
    }),
    category: z.enum(Object.values(PRODUCT_CATEGORY) as [string, ...string[]], {
      required_error: 'Product category is required!',
    }),
    description: z
      .string({
        required_error: 'Description is required!',
      })
      .min(10, 'Description must be at least 10 characters long'),
    specification: z
      .array(
        z.object({
          name: z.string().min(1, 'Specification name is required!'),
          description: z
            .string()
            .min(1, 'Specification description is required!'),
        }),
      )
      .optional(),
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
      .optional(),
    color: z
      .array(
        z.object({
          code: z.string().optional(),
          quantity: z
            .number()
            .min(0, 'Color quantity cannot be negative')
            .default(0),
        }),
      )
      .optional(),
    shippingCharge: z
      .array(
        z.object({
          country: z.string().min(1, 'Country is required for shipping charge'),
          price: z.number().positive('Shipping price must be positive'),
        }),
      )
      .optional(),
  }),
})

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.enum(Object.values(PRODUCT_CATEGORY) as [string, ...string[]], {
      required_error: 'Product category is required!',
    }).optional(),
    images: z
      .array(
        z.object({
          key: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .optional(),
    description: z.string().min(10).optional(),
    specification: z
      .array(
        z.object({
          name: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
        }),
      )
      .optional(),
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
      .optional(),
    color: z
      .array(
        z.object({
          code: z.string().optional(),
          quantity: z.number().min(0).optional(),
        }),
      )
      .optional(),
    shippingCharge: z
      .array(
        z.object({
          country: z.string().min(1).optional(),
          price: z.number().positive().optional(),
        }),
      )
      .optional(),
  }),
})

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(PRODUCT_STATUS) as [string, ...string[]], {
      required_error: 'Product status is required!',
    }),
  }),
})

export const productValidation = {
  createProductSchema,
  updateProductSchema,
  changeStatusValidationSchema,
}
