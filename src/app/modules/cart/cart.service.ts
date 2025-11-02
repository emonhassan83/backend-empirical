import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { TCart } from './cart.interface'
import { Cart } from './cart.model'
import { User } from '../user/user.model'
import Product from '../product/product.models'
import { cartProductNotifyToUser } from './cart.utils'

const addACartIntoDB = async (payload: TCart) => {
  const { user: userId, product: productId } = payload

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

  // Step 3: Check if the product already exists in user's cart
  const existingCartItem = await Cart.findOne({
    user: userId,
    product: productId,
  })

  if (existingCartItem) return existingCartItem

  // Step 4: Create new cart item
  const newCart = await Cart.create(payload)
  if (!newCart) {
    throw new AppError(httpStatus.CONFLICT, 'Cart product not added!')
  }

  // Step 5: Notify user (if needed)
  await cartProductNotifyToUser('ADDED', user, newCart)

  return newCart
}

const getAllCartFromDB = async (query: Record<string, unknown>) => {
  const cartQuery = new QueryBuilder(
    Cart.find().populate([
      { path: 'user', select: 'id name email photoUrl' },
      { path: 'product' },
    ]),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const carts = await cartQuery.modelQuery
  const meta = await cartQuery.countTotal()

  return {
    meta,
    result: carts,
  }
}

const getACartFromDB = async (id: string) => {
  const cart = await Cart.findById(id).populate([
    { path: 'user', select: 'id name email photoUrl' },
    { path: 'product' },
  ])
  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart product not found')
  }

  return cart
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
