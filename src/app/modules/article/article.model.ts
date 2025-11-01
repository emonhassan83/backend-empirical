import { Schema, model } from 'mongoose'
import { TArticle, TArticleModel } from './article.interface'

const articleSchema = new Schema<TArticle>(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true },
)

export const Article = model<TArticle, TArticleModel>('Article', articleSchema)
