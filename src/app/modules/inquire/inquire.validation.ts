import { z } from 'zod'

const sentEmailSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Inquire name is required' }),
    email: z.string({ error: 'Inquire email is required' }),
    subject: z.string({ error: 'Inquire subject is required' }),
    message: z.string({ error: 'Inquire message is required' }),
  }),
})

export const InquireValidations = {
  sentEmailSchema,
}
