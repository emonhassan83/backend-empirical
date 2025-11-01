import { z } from 'zod'

const globalPriceSchema = z.object({
  eachPrice: z
    .number({
      required_error: 'Global each photo price is required',
    })
    .optional(),
  totalPrice: z
    .number({
      required_error: 'Global total photo price is required',
    })
    .optional(),
})

const createValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ required_error: 'about us is required' }).optional(),
    termsAndConditions: z
      .string({ required_error: 'terms and conditions us is required' })
      .optional(),
    privacyPolicy: z
      .string({ required_error: 'privacy policy us is required' })
      .optional(),
    supports: z
      .string({ required_error: 'supports us is required' })
      .optional(),
    globalPrice: globalPriceSchema.optional(),
  }),
})

const updateValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ required_error: 'about us is required' }).optional(),
    termsAndConditions: z
      .string({ required_error: 'terms and conditions us is required' })
      .optional(),
    privacyPolicy: z
      .string({ required_error: 'privacy policy us is required' })
      .optional(),
    supports: z
      .string({ required_error: 'supports us is required' })
      .optional(),
    globalPrice: globalPriceSchema.optional(),
    createBy: z.string({ required_error: 'createBy is required' }).optional(),
  }),
})

export const contentsValidation = {
  createValidationSchema,
  updateValidationSchema,
}
