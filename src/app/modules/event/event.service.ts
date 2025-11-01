import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import QueryBuilder from '../../builder/QueryBuilder'
import { EventSearchableFields } from './event.constant'
import { TEvent } from './event.interface'
import { Event } from './event.model'
import { uploadToS3 } from '../../utils/s3'

const createEventIntoDB = async (payload: TEvent, file: any) => {
  // upload to image
  if (file) {
    payload.thumbnail = (await uploadToS3({
      file,
      fileName: `images/events/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string
  }

  const event = await Event.create(payload)
  if (!event) {
    throw new AppError(httpStatus.CONFLICT, 'Event not created!')
  }

  return event
}

const getAllEventsFromDB = async (query: Record<string, unknown>) => {
  const eventQuery = new QueryBuilder(Event.find(), query)
    .search(EventSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await eventQuery.modelQuery
  const meta = await eventQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getAEventFromDB = async (id: string) => {
  const result = await Event.findById(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found')
  }

  return result
}

const updateEventFromDB = async (
  id: string,
  payload: Partial<TEvent>,
  file: any,
) => {
  const event = await Event.findById(id)
  if (!event) {
    throw new AppError(httpStatus.FORBIDDEN, 'This Event is not found !')
  }

  if (file) {
    payload.thumbnail = (await uploadToS3({
      file,
      fileName: `images/events/${Math.floor(100000 + Math.random() * 900000)}`,
    })) as string
  }

  const updateEvent = await Event.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!updateEvent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not updated')
  }

  return updateEvent
}

const deleteAEventFromDB = async (id: string) => {
  const event = await Event.findById(id)
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found')
  }

  const result = await Event.findByIdAndDelete(id)
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event Delete failed!')
  }

  return result
}

export const EventService = {
  createEventIntoDB,
  getAllEventsFromDB,
  getAEventFromDB,
  updateEventFromDB,
  deleteAEventFromDB,
}
