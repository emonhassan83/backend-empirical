import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ordersService } from './orders.service'

const createOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.createOrders(req?.body, req.user._id)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: result,
  })
})

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.getAllOrders(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Orders fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getOrdersById = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.getOrdersById(req.params.id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order fetched successfully',
    data: result,
  })
})

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  req.query.user = req.user._id
  const result = await ordersService.getAllOrders(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My orders fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const updateOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.updateOrders(req.params.id, req.body)

  let message = 'Order updated successfully'

  if (req?.body?.status) {
    message = 'Order status updated successfully'
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message,
    data: result,
  })
})


const deleteOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await ordersService.deleteOrders(req.params.id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  })
})

export const ordersController = {
  createOrders,
  getAllOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
  getMyOrders
}
