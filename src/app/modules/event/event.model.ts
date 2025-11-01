import { Schema, model } from 'mongoose'
import { TEvent, TEventModel } from './event.interface'

const eventSchema = new Schema<TEvent>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true },
)

export const Event = model<TEvent, TEventModel>('Event', eventSchema)
