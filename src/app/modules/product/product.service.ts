import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { TProduct } from './product.interface'
import Product from './product.models'
import { UploadedFiles } from '../../interface/common.interface'
import { uploadManyToS3 } from '../../utils/s3'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'

const createProduct = async (user: any, files: any, payload: TProduct) => {
  const userData = await User.findById(user?._id)
  if (!userData || userData?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found!')
  }

  // here upload file
  if (files) {
    const { images } = files as UploadedFiles

    // Upload product images
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = []

      images.forEach((image) => {
        imgsArray.push({
          file: image,
          path: `images/product`,
        })
      })

      const uploaded = await uploadManyToS3(imgsArray)
      // map to string[] (urls) if TProduct.images expects string[]
      payload.images = uploaded.map((u: { url: string; key?: string }) => u.url)
    }
  }

  const result = await Product.create(payload)
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product creation failed')
  }

  return result
}

const getAllProduct = async (queries: Record<string, any> = {}) => {
  const { priceRange, avgRating, ...query } = queries

  const productModel = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(['name', 'id', 'category'])
    .filter()
    .rangeFilter('price', priceRange)
    .sort()
    .paginate()
    .fields()

  const data = await productModel.modelQuery
  const meta = await productModel.countTotal()

  return {
    meta,
    data,
  }
}

const getProductById = async (id: string): Promise<any> => {
  const product = await Product.findById(id).populate([
    { path: 'author', select: 'id name email photoUrl' },
  ])
  if (!product || product?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found')
  }

  return product
}

const updateProduct = async (
  id: string,
  files: any,
  payload: Partial<TProduct>,
) => {
   // here upload file
  if (files) {
    const { images } = files as UploadedFiles

    // Upload product images
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = []

      images.forEach((image) => {
        imgsArray.push({
          file: image,
          path: `images/product`,
        })
      })

      const uploaded = await uploadManyToS3(imgsArray)
      // map to string[] (urls) if TProduct.images expects string[]
      payload.images = uploaded.map((u: { url: string; key?: string }) => u.url)
    }
  }

  // Update other product details
  try {
    const result = await Product.findByIdAndUpdate(id, payload, {
      new: true,
    })
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product update failed')
    }
  
    return result
  } catch (error) {
    console.log(error)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Product update failed',
    )
  }
}

const deleteProduct = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product deleting failed')
  }
  return result
}

export const productService = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
}
