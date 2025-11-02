import httpStatus from 'http-status'
import { TContents } from './contents.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { Contents } from './contents.models'
import AppError from '../../errors/AppError'
import { findAdmin } from '../../utils/findAdmin'
import { uploadToS3 } from '../../utils/s3'

// Create a new content
const createContents = async (payload: TContents) => {
  // auto assign created by admin
  const admin = await findAdmin()
  if (admin) admin._id = payload.createdBy

  const result = await Contents.create(payload)
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Content creation failed')
  }

  return result
}

// Get all contents
const getContent = async (query: Record<string, any>) => {
  const ContentModel = new QueryBuilder(
    Contents.find().select('aboutUs termsAndConditions privacyPolicy') as any,
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields()

  const data = await ContentModel.modelQuery
  const meta = await ContentModel.countTotal()
  return {
    data,
    meta,
  }
}

// Get content by ID
const getPhilosophyContent = async (query: Record<string, any>) => {
  const ContentModel = new QueryBuilder(
    Contents.find().select(
      'philosophyImage philosophyAboutUs philosophyImpact',
    ) as any,
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields()

  const data = await ContentModel.modelQuery
  const meta = await ContentModel.countTotal()
  return {
    data,
    meta,
  }
}

// Update content
const updateContents = async (payload: Partial<TContents>) => {
  const content = await Contents.findOne().select(
    'aboutUs termsAndConditions privacyPolicy',
  )
  if (!content || content?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found!')
  }

  // Update the content document
  Object.assign(content, payload)
  await content.save()

  return content
}

// Delete content
const updatePhilosophyContent = async (
  payload: Partial<TContents>,
  file: any,
) => {
  const content = await Contents.findOne().select(
    'philosophyImage philosophyAboutUs philosophyImpact',
  )
  if (!content || content?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Content not found!')
  }

  if (file) {
    payload.philosophyImage = (await uploadToS3({
      file,
      fileName: `images/content/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string
  }

  // Update the content document
  Object.assign(content, payload)
  await content.save()

  return content
}

export const contentsService = {
  createContents,
  getContent,
  getPhilosophyContent,
  updateContents,
  updatePhilosophyContent,
}
