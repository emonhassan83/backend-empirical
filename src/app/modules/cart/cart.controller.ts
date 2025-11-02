import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { CartService } from './cart.service'

const addACart = catchAsync(async (req, res) => {
  const result = await CartService.addACartIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Cart product added successfully!',
    data: result,
  })
})

const getAllCarts = catchAsync(async (req, res) => {
  req.query['user'] = req.user._id
  const result = await CartService.getAllCartFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart products retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getACart = catchAsync(async (req, res) => {
  const result = await CartService.getACartFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product retrieved successfully!',
    data: result,
  })
})

const deleteACart = catchAsync(async (req, res) => {
  const result = await CartService.deleteACartFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product delete successfully!',
    data: result,
  })
})

const deleteMyCarts = catchAsync(async (req, res) => {
  const result = await CartService.deleteMyCartsFromDB(req.user._id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'My cart products delete successfully!',
    data: result,
  })
})

export const CartControllers = {
  addACart,
  getAllCarts,
  getACart,
  deleteACart,
  deleteMyCarts
}
