import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { productService } from './product.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { findAdmin } from '../../utils/findAdmin'

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.createProduct(
    req.user,
    req.files,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  })
})

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAllProduct(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All store products get successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProductById(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product get successfully',
    data: result,
  })
})

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.updateProduct(
    req.params.id,
    req.files,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  })
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req.params.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  })
})

export const productController = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
}
