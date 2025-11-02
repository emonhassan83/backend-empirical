import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { GalleryService } from './gallery.service'

const createGallery = catchAsync(async (req, res) => {
  const result = await GalleryService.createGalleryIntoDB(req.body, req.files)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Gallery created successfully!',
    data: result,
  })
})

const getAllGalleries = catchAsync(async (req, res) => {
  const result = await GalleryService.getAllGalleriesFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Galleries retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAGallery = catchAsync(async (req, res) => {
  const result = await GalleryService.getAGalleryFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Gallery retrieved successfully!',
    data: result,
  })
})

const deleteAGallery = catchAsync(async (req, res) => {
  const result = await GalleryService.deleteAGalleryFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Gallery deleted successfully!',
    data: result,
  })
})

export const GalleryControllers = {
  createGallery,
  getAllGalleries,
  getAGallery,
  deleteAGallery,
}
