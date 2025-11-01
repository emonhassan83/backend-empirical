import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { ArticleService } from './article.service'

const createArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.createArticleIntoDB(req.body, req.file)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Article created successfully!',
    data: result,
  })
})

const getAllArticles = catchAsync(async (req, res) => {
  const result = await ArticleService.getAllArticlesFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Articles retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAllArticlesByCategory = catchAsync(async (req, res) => {
  req.query['category'] = req.query
  const result = await ArticleService.getAllArticlesFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Articles by category retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.getAArticleFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Article retrieved successfully!',
    data: result,
  })
})

const updateArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.updateArticleFromDB(
    req.params.id,
    req.body,
    req.file,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Article updated successfully!',
    data: result,
  })
})

const deleteAArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.deleteAArticleFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Article deleted successfully!',
    data: result,
  })
})

export const ArticleControllers = {
  createArticle,
  getAllArticles,
  getAllArticlesByCategory,
  getAArticle,
  updateArticle,
  deleteAArticle,
}
