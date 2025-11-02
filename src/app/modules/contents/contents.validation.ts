import { z } from 'zod'

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
  }),
})

const updatePhilosophyValidationSchema = z.object({
  body: z.object({
    philosophyAboutUs: z
      .string({ required_error: 'philosophy about us is required' })
      .optional(),
    philosophyImpact: z
      .string({ required_error: 'philosophy impact is required' })
      .optional(),
  }),
})

export const contentsValidation = {
  createValidationSchema,
  updateValidationSchema,
  updatePhilosophyValidationSchema,
}
