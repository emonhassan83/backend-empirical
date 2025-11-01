import { Model } from 'mongoose'

export type TEvent = {
  _id?: string
  title: string
  date: string
  time: string
  location: string
  thumbnail: string
  description: string
}

export type TEventModel = Model<TEvent, Record<string, unknown>>
