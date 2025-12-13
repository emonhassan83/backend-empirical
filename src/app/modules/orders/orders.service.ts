import { startSession } from 'mongoose'
import Order from './orders.models'
import httpStatus from 'http-status'
import QueryBuilder from '../../builder/QueryBuilder'
import { User } from '../user/user.model'
import AppError from '../../errors/AppError'
import { Items } from '../items/items.models'
import { ItemsService } from '../items/items.service'
import { TOrder } from './orders.interface'
import Product from '../product/product.models'
import { ORDER_STATUS, TOrderStatus } from './orders.constants'
import { PAYMENT_STATUS } from '../payment/payment.constants'
import { orderStatusNotifyToUser } from './orders.utils'

const createOrders = async (payload: any, userId: string) => {
  const session = await startSession()
  session.startTransaction()

  try {
    const { items, orderData } = payload

    // ✅ Validate User
    const user = await User.findById(userId).session(session)
    if (!user || user.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (!items?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No items provided')
    }

    // ✅ Validate products and check stock
    for (const item of items) {
      const product = await Product.findById(item.product).session(session)
      if (!product || product.isDeleted) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product not found for ID: ${item.product}`,
        )
      }

      // ❌ Check stock availability
      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product: ${product.title}. Available: ${product.stock}`,
        )
      }
    }

    // ✅ Create main Order
    const createdOrder = await Order.create(
      [
        {
          ...orderData,
          user: userId,
          amount: payload.orderData.amount,
          status: ORDER_STATUS.pending,
          paymentStatus: PAYMENT_STATUS.unpaid,
        },
      ],
      { session },
    )

    if (!createdOrder?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order')
    }

    const order = createdOrder[0]

    // ✅ Create related Items
    const orderItems = items.map((item: any) => ({
      order: order._id,
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
    }))

    const createdItems = await Items.insertMany(orderItems, { session })
    if (!createdItems?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order items')
    }

    await session.commitTransaction()
    session.endSession()

    return {
      order,
      items: createdItems,
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error('❌ Transaction failed:', error)
    throw error
  }
}

const getAllOrders = async (query: Record<string, any>) => {
  const orders: any[] = []

  const orderModel = new QueryBuilder(
    Order.find({
      isDeleted: false,
      status: { $ne: ORDER_STATUS.pending },
    }).populate([
      {
        path: 'user',
        select: 'name',
      },
    ]),
    query,
  )
    .search(['id'])
    .filter()
    .paginate()
    .sort()

  // Fetch the main order data
  const data: any = await orderModel.modelQuery
  const meta = await orderModel.countTotal()

  if (data?.length > 0) {
    for (const order of data) {
      const items = await Items.find({ order: order._id })
        .populate({
          path: 'product',
          select: 'title images',
        })
        .select('product quantity price size')
        .lean()

      orders.push({
        ...order.toObject(),
        items,
      })
    }
  }

  return { data: orders, meta }
}

const getOrdersById = async (id: string) => {
  const result = await Order.findById(id).populate([
    {
      path: 'user',
      select: 'name email id contactNo photoUrl',
    },
  ])
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'order not found')
  }

  const items = await ItemsService.getItemsByOrderId(result?._id.toString())

  return { ...result.toObject(), items }
}

const updateOrders = async (id: string, payload: { status: TOrderStatus }) => {
  const { status } = payload

  const result: TOrder | null = await Order.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
    },
  ).populate('user')

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order updating failed')
  }

  // Notify user on status change
  await orderStatusNotifyToUser('STATUS_CHANGED', result.user, result)

  return result
}

const deleteOrders = async (id: string) => {
  const order = await Order.findById(id)
  if (!order) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order already deleted!')
  }

  // Fetch all items related to this order
  const items = await Items.find({ order: order._id })

  if (!items || items.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No items found for this order!')
  }

  // Loop through items and update product stock
  for (const item of items) {
    const product = await Product.findById(item.product)
    if (product) {
      product.stock += item.quantity
      product.sale -= item.quantity
      if (product.sale < 0) product.sale = 0
      await product.save()
    }
  }

  // Delete all order items
  await Items.deleteMany({ order: order._id })

  // Soft delete the order by setting `isDeleted: true`
  const deletedOrder = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  if (!deletedOrder) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order deletion failed!')
  }

  return deletedOrder
}

export const ordersService = {
  createOrders,
  getAllOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
}
