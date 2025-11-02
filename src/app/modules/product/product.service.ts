import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { TProduct } from './product.interface'
import Product from './product.models'
import { UploadedFiles } from '../../interface/common.interface'
import { uploadManyToS3 } from '../../utils/s3'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import { calculateStockFromSizes } from './product.utils'

const createProduct = async (userId: string, files: any, payload: TProduct) => {
  const user = await User.findById(userId)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile not found!')
  }

  // Set author
  payload.author = user._id

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

  // Auto stock calculation if size array provided
  if (payload.size && payload.size.length > 0) {
    payload.stock = calculateStockFromSizes(payload.size)
  }

  const result = await Product.create(payload)
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product creation failed')
  }

  return result
}

const getAllProduct = async (queries: Record<string, any> = {}) => {
  const { priceRange, ...query } = queries

  const productModel = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(['title'])
    .filter()
    .rangeFilter('price', priceRange)
    .sort()
    .paginate()
    .fields()

  let data = await productModel.modelQuery
  const meta = await productModel.countTotal()

  // Add computed fields
  data = data.map((p: any) => ({
    ...p.toObject(),
    isStock: p.stock > 0,
    discountPrice: p.price - (p.price * (p.discount || 0)) / 100,
  }))

  return {
    meta,
    data,
  }
}

const getProductById = async (id: string): Promise<any> => {
  const product = await Product.findById(id).populate([
    { path: 'author', select: 'id name email photoUrl contractNo' },
  ])
  if (!product || product?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found')
  }

  const productObj = product.toObject()
  return {
    ...productObj,
    isStock: productObj.stock > 0,
    discountPrice:
      productObj.price - (productObj.price * (productObj.discount || 0)) / 100,
  }
}

const updateProduct = async (
  id: string,
  files: any,
  payload: Partial<TProduct>,
) => {
  // Handle image uploads
  if (files) {
    const { images } = files as UploadedFiles
    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/product`,
      }))

      const uploaded = await uploadManyToS3(imgsArray)
      payload.images = uploaded.map((u: { url: string }) => u.url)
    }
  }

  // If size array is being updated → recalc stock
  if (payload.size && payload.size.length > 0) {
    payload.stock = calculateStockFromSizes(payload.size)
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  })

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product update failed')
  }

  return result
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
