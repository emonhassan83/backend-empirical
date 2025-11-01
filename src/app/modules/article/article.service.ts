import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { ArticleSearchableFields } from './article.constant'
import { TArticle } from './article.interface'
import { Article } from './article.model'
import { uploadToS3 } from '../../utils/s3'

const createArticleIntoDB = async (payload: TArticle, file: any) => {
  // upload to image
  if (file) {
    payload.thumbnail = (await uploadToS3({
      file,
      fileName: `images/articles/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string
  }

  const article = await Article.create(payload)
  if (!article) {
    throw new AppError(httpStatus.CONFLICT, 'Article not created!')
  }

  return article
}

const getAllArticlesFromDB = async (query: Record<string, unknown>) => {
  const articleQuery = new QueryBuilder(Article.find(), query)
    .search(ArticleSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await articleQuery.modelQuery
  const meta = await articleQuery.countTotal()
  if (!articleQuery) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found!')
  }

  return {
    meta,
    result,
  }
}

const getAArticleFromDB = async (id: string) => {
  const result = await Article.findById(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found')
  }

  return result
}

const updateArticleFromDB = async (
  id: string,
  payload: Partial<TArticle>,
  file: any,
) => {
  const article = await Article.findById(id)
  if (!article) {
    throw new AppError(httpStatus.FORBIDDEN, 'This article is not found !')
  }

  if (file) {
    payload.thumbnail = (await uploadToS3({
      file,
      fileName: `images/articles/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string
  }

  const updateArticle = await Article.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!updateArticle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not updated')
  }

  return updateArticle
}

const deleteAArticleFromDB = async (id: string) => {
  const article = await Article.findById(id)
  if (!article) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article not found')
  }

  const result = await Article.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Article Delete failed!')
  }

  return result
}

export const ArticleService = {
  createArticleIntoDB,
  getAllArticlesFromDB,
  getAArticleFromDB,
  updateArticleFromDB,
  deleteAArticleFromDB,
}
