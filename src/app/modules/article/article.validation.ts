import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long')
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
  }),
})

export const ArticleValidation = {
  createValidationSchema,
  updateValidationSchema
}
