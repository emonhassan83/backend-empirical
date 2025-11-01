import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long'),
    date: z.string({
      required_error: 'Date is required',
    }),
    time: z
      .string({
        required_error: 'Time is required',
      })
      .min(3, 'time must be at least 3 characters long'),
    location: z
      .string({
        required_error: 'Location is required',
      })
      .min(3, 'Location must be at least 3 characters long'),
  }),
})

const updateValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters long')
      .optional(),
    thumbnail: z
      .string({
        required_error: 'Article thumbnail photo is required! ',
      })
      .url()
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long')
      .optional(),
    date: z
      .string({
        required_error: 'Date is required',
      })
      .optional(),
    time: z
      .string({
        required_error: 'Time is required',
      })
      .min(3, 'time must be at least 3 characters long')
      .optional(),
    location: z
      .string({
        required_error: 'Location is required',
      })
      .min(3, 'Location must be at least 3 characters long')
      .optional(),
  }),
})

export const EventValidation = {
  createValidationSchema,
  updateValidationSchema,
}
