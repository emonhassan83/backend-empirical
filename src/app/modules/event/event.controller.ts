import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { EventService } from './event.service'

const createEvent = catchAsync(async (req, res) => {
  const result = await EventService.createEventIntoDB(req.body, req.file)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Event created successfully!',
    data: result,
  })
})

const getAllEvents = catchAsync(async (req, res) => {
  const result = await EventService.getAllEventsFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Events retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getAEvent = catchAsync(async (req, res) => {
  const result = await EventService.getAEventFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Event retrieved successfully!',
    data: result,
  })
})

const updateEvent = catchAsync(async (req, res) => {
  const result = await EventService.updateEventFromDB(
    req.params.id,
    req.body,
    req.file,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Event updated successfully!',
    data: result,
  })
})

const deleteAEvent = catchAsync(async (req, res) => {
  const result = await EventService.deleteAEventFromDB(req.params.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Event deleted successfully!',
    data: result,
  })
})

export const EventControllers = {
  createEvent,
  getAllEvents,
  getAEvent,
  updateEvent,
  deleteAEvent,
}
