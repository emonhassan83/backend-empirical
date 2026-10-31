import { z } from 'zod'

const createValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ error: 'about us is required' }).optional(),
    termsAndConditions: z
      .string({ error: 'terms and conditions us is required' })
      .optional(),
    privacyPolicy: z
      .string({ error: 'privacy policy us is required' })
      .optional(),
    supports: z.string({ error: 'supports us is required' }).optional(),
  }),
})

const updateValidationSchema = z.object({
  body: z.object({
    aboutUs: z.string({ error: 'about us is required' }).optional(),
    termsAndConditions: z
      .string({ error: 'terms and conditions us is required' })
      .optional(),
    privacyPolicy: z
      .string({ error: 'privacy policy us is required' })
      .optional(),
    supports: z.string({ error: 'supports us is required' }).optional(),
  }),
})

const updatePhilosophyValidationSchema = z.object({
  body: z.object({
    philosophyAboutUs: z
      .string({ error: 'philosophy about us is required' })
      .optional(),
    philosophyImpact: z
      .string({ error: 'philosophy impact is required' })
      .optional(),
  }),
})

export const contentsValidation = {
  createValidationSchema,
  updateValidationSchema,
  updatePhilosophyValidationSchema,
}
