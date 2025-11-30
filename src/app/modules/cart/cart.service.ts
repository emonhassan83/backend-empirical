import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { TCart } from './cart.interface'
import { Cart } from './cart.model'
import { User } from '../user/user.model'
import Product from '../product/product.models'

const addACartIntoDB = async (payload: TCart) => {
  const { user: userId, product: productId, size, quantity } = payload

  // Step 1: Validate user
  const user = await User.findById(userId)
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }

  // Step 2: Validate product
  const product = await Product.findById(productId)
  if (!product || product.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found or deleted!')
  }

  // Validate size array exists
  if (!product.size || product.size.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This product has no size information configured!',
    )
  }

  // ✅ Step 3: Validate size & stock availability
  const sizeInfo = product.size.find((s) => s.type === size)

  if (!sizeInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This product does not have size: ${size}`,
    )
  }

  if (sizeInfo.quantity < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only ${sizeInfo.quantity} items available for size ${size}`,
    )
  }

  // (Optional) Step 4: Prevent duplicate cart entries for same product+size
  const existingCart = await Cart.findOne({
    user: userId,
    product: productId,
    size,
  })

  if (existingCart) {
    // corporate-friendly approach → update quantity instead of blocking
    existingCart.quantity += quantity
    await existingCart.save()

    return existingCart
  }

  // Step 5: Create cart entry
  const newCart = await Cart.create(payload)
  if (!newCart) {
    throw new AppError(httpStatus.CONFLICT, 'Cart product not added!')
  }

  return newCart
}

const getAllCartFromDB = async (query: Record<string, unknown>) => {
  const cartQuery = new QueryBuilder(
    Cart.find().populate([
      { path: 'product' },
    ]),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  let carts = await cartQuery.modelQuery
  const meta = await cartQuery.countTotal()

  // ⭐ Add computed fields
  carts = carts.map((cart: any) => {
    const product = cart.product

    const discountPrice = product
      ? product.price - (product.price * (product.discount || 0)) / 100
      : 0

    const isStock = product?.stock > 0

    const sizeInfo = product?.size?.find((s: any) => s.type === cart.size)

    const sizeAvailable = sizeInfo ? sizeInfo.quantity : 0

    return {
      ...cart.toObject(),
      discountPrice,
      isStock,
      sizeAvailable,
    }
  })

  return {
    meta,
    result: carts,
  }
}

const getACartFromDB = async (id: string) => {
  const cart = await Cart.findById(id).populate([
    { path: 'product' },
  ])

  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart product not found')
  }

  const product: any = cart.product

  // ⭐ Compute discount price
  const discountPrice = product
    ? product.price - (product.price * (product.discount || 0)) / 100
    : 0

  // ⭐ Product-level stock status
  const isStock = product?.stock > 0

  // ⭐ Size-specific availability
  const sizeInfo = product?.size?.find((s: any) => s.type === cart.size)
  const sizeAvailable = sizeInfo ? sizeInfo.quantity : 0

  return {
    ...cart.toObject(),
    discountPrice,
    isStock,
    sizeAvailable,
  }
}

const deleteACartFromDB = async (id: string) => {
  const cart = await Cart.findById(id)
  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart product not found')
  }

  const result = await Cart.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart product delete failed')
  }

  return result
}

const deleteMyCartsFromDB = async (userId: string) => {
  const user = await User.findById(userId)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // check if user has any cart products
  const carts = await Cart.find({ user: userId })
  if (!carts || carts.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No cart products found for this user',
    )
  }

  const result = await Cart.deleteMany({ user: userId })
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart products delete failed')
  }

  return result
}

export const CartService = {
  addACartIntoDB,
  getAllCartFromDB,
  getACartFromDB,
  deleteACartFromDB,
  deleteMyCartsFromDB,
}
