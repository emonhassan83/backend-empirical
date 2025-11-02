import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { TGallery } from './gallery.interface'
import { Gallery } from './gallery.model'
import { uploadToS3 } from '../../utils/s3'

const createGalleryIntoDB = async (payload: Partial<TGallery>, files: any) => {
  const { images } = files as { images: Express.Multer.File[] }

  if (!files || !images.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No files provided!')
  }

  const createdGalleries: TGallery[] = []

  // Loop through each file
  for (const image of images) {
    // Upload to S3
    const uploadedUrl = (await uploadToS3({
      file: image,
      fileName: `images/gallery/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string

    // Create a new gallery document for each file
    const gallery = await Gallery.create({
      ...payload,
      image: uploadedUrl,
    })

    createdGalleries.push(gallery)
  }

  return createdGalleries
}

const getAllGalleriesFromDB = async (query: Record<string, unknown>) => {
  const GalleryQuery = new QueryBuilder(Gallery.find(), query)
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await GalleryQuery.modelQuery
  const meta = await GalleryQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getAGalleryFromDB = async (id: string) => {
  const result = await Gallery.findById(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gallery not found')
  }

  return result
}

const deleteAGalleryFromDB = async (id: string) => {
  const gallery = await Gallery.findById(id)
  if (!gallery) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gallery not found')
  }

  const result = await Gallery.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Gallery Delete failed!')
  }

  return result
}

export const GalleryService = {
  createGalleryIntoDB,
  getAllGalleriesFromDB,
  getAGalleryFromDB,
  deleteAGalleryFromDB,
}
