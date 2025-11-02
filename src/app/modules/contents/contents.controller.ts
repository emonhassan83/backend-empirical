import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { contentsService } from './contents.service'
import sendResponse from '../../utils/sendResponse'

const createContents = catchAsync(async (req: Request, res: Response) => {
  const result = await contentsService.createContents(req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content created successfully',
    data: result,
  })
})

// Get content
const getContent = catchAsync(async (req: Request, res: Response) => {
  const result = await contentsService.getContent(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content retrieved successfully',
    data: result.data[0],
  })
})

// Get Philosophy Content
const getPhilosophyContent = catchAsync(async (req: Request, res: Response) => {
  const result = await contentsService.getPhilosophyContent(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Philosophy content retrieved successfully',
    data: result.data[0],
  })
})

// Update contents
const updateContents = catchAsync(async (req: Request, res: Response) => {
  const result = await contentsService.updateContents(req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Content updated successfully',
    data: result,
  })
})

// Update contents
const updatePhilosophyContent = catchAsync(async (req: Request, res: Response) => {
  const result = await contentsService.updatePhilosophyContent(req.body, req.file)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Philosophy content updated successfully',
    data: result,
  })
})

export const contentsController = {
  createContents,
  getContent,
  getPhilosophyContent,
  updateContents,
  updatePhilosophyContent,
}
