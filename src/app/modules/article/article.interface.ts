import { Model, Types } from 'mongoose'

export type TArticle = {
  _id?: string
  title: string
  thumbnail: string
  description: string
}

export type TArticleModel = Model<TArticle, Record<string, unknown>>
