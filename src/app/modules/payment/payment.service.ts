import Stripe from 'stripe'
import config from '../../config'
import { TPayment } from './payment.interface'
import httpStatus from 'http-status'
import Payment from './payment.models'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import mongoose, { startSession } from 'mongoose'
import { PAYMENT_STATUS } from './payment.constants'
import { generateTransactionId } from '../../utils/generateTransctionId'
import {
  createCheckoutSession,
  paymentNotifyToAdmin,
  paymentNotifyToUser,
} from './payment.utils'
import Order from '../orders/orders.models'
import { User } from '../user/user.model'
import { ORDER_STATUS } from '../orders/orders.constants'
import { Items } from '../items/items.models'
import { Cart } from '../cart/cart.model'

const stripe = new Stripe(config.stripe?.stripe_api_secret as string, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

const initiatePayment = async (payload: TPayment) => {
  const transactionId = generateTransactionId()
  const { userId, orderId } = payload

  const user = await User.findById(userId)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }

  //* checking if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account is blocked !')
  }

  // Determine model type and fetch associated data
  const order = await Order.findById(orderId)
  if (!order || order?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!')
  }

  // Always set the total amount
  payload.amount = order.amount

  // Check for existing unpaid payment
  let paymentData = await Payment.findOne({ orderId, isPaid: false, userId })

  if (paymentData) {
    paymentData = await Payment.findByIdAndUpdate(
      paymentData._id,
      { transactionId },
      { new: true },
    )
  } else {
    payload.transactionId = transactionId
    paymentData = await Payment.create(payload)
  }

  if (!paymentData) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create payment',
    )
  }

  const checkoutSession = await createCheckoutSession({
    product: {
      amount: paymentData.amount,
      name: 'Order Payment',
      quantity: 1,
    },
    paymentId: paymentData._id,
  })

  return checkoutSession?.url
}

const confirmPayment = async (query: Record<string, any>) => {
  const { sessionId, paymentId } = query

  const session = await startSession()
  const PaymentSession = await stripe.checkout.sessions.retrieve(sessionId)
  const paymentIntentId = PaymentSession.payment_intent as string

  if (PaymentSession.status !== 'complete') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    )
  }

  try {
    session.startTransaction()
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        isPaid: true,
        status: PAYMENT_STATUS.paid,
        paymentIntentId: paymentIntentId,
      },
      { new: true, session },
    )

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!')
    }

    const orderData = await Order.findOneAndUpdate(
      payment?.orderId,
      {
        transactionId: payment?.transactionId,
        paymentStatus: PAYMENT_STATUS.paid,
        status: ORDER_STATUS.processing,
      },
      { session },
    )

    // when order confirm if order in document found then sent to user 2 mail
    if (!orderData) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found!')
    }

    const user = await User.findById(orderData.user)

    // ✅ Get order items and remove them from Cart if type is Product
    const orderItems = await Items.find({ order: orderData._id }).session(
      session,
    )

    if (orderItems?.length && user) {
      const cartDeletePromises = orderItems.map((item) =>
        Cart.deleteOne({
          user: user._id,
          reference: item.product,
        }).session(session),
      )

      await Promise.all(cartDeletePromises)
    }

    // sent notify to user when payment is success
    await paymentNotifyToUser('SUCCESS', payment)

    // sent notify to admin when payment is success
    await paymentNotifyToAdmin('SUCCESS', payment)

    await session.commitTransaction()
    return payment
  } catch (error: any) {
    await session.abortTransaction()
    if (paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
        })
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message)
      }
    }
    throw new AppError(httpStatus.BAD_GATEWAY, error.message)
  } finally {
    session.endSession()
  }
}

const getAllPaymentsFromDB = async (query: Record<string, any>) => {
  const reviewsModel = new QueryBuilder(
    Payment.find().populate([
      { path: 'order' },
      { path: 'user', select: 'name email photoUrl contactNo' },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields()

  const data = await reviewsModel.modelQuery
  const meta = await reviewsModel.countTotal()

  return {
    data,
    meta,
  }
}

const getAPaymentsFromDB = async (id: string) => {
  const payment = await Payment.findById(id).populate([
    { path: 'order' },
    { path: 'user', select: 'name email photoUrl contactNumber age' },
  ])
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found!')
  }

  return payment
}

const refundPayment = async (payload: any) => {
  if (!payload?.intendId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment intent ID is required')
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const refundData: Stripe.RefundCreateParams = {
      payment_intent: payload.intendId,
      ...(payload.amount && {
        amount: payload.amount * 100,
        reason: 'requested_by_customer',
      }),
    }

    const paymentData = await Payment.findOneAndUpdate(
      { paymentIntentId: payload.intendId },
      { session },
    )

    // Validate and update order status
    const order = await Order.findById(paymentData?.orderId)
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking record not found')
    }

    if (order.status !== ORDER_STATUS.cancelled) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Only cancelled order can be refunded. Please cancel the order first.',
      )
    }

    await Order.findByIdAndUpdate(
      paymentData?.orderId,
      { paymentStatus: PAYMENT_STATUS.refunded },
      { new: true, session },
    )

    // Find and update payment status
    const payment = await Payment.findOneAndUpdate(
      { paymentIntentId: payload.intendId },
      { status: 'refunded', isPaid: false },
      { new: true, session },
    )

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not updated')
    }

    // Process refund via Stripe
    const response = await stripe.refunds.create(refundData)

    // sent notify to user when payment is refund
    await paymentNotifyToUser('REFUND', payment)

    // sent notify to admin when payment is refund
    await paymentNotifyToAdmin('REFUND', payment)

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return response
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    console.error('Refund Error:', error)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Refund processing failed',
    )
  }
}

export const paymentService = {
  initiatePayment,
  confirmPayment,
  getAllPaymentsFromDB,
  getAPaymentsFromDB,
  refundPayment,
}
