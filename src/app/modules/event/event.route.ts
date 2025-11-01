import express from 'express'
import zodValidationRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import multer, { memoryStorage } from 'multer'
import parseData from '../../middleware/parseData'
import { EventValidation } from './event.validation'
import { EventControllers } from './event.controller'

const router = express.Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  zodValidationRequest(EventValidation.createValidationSchema),
  EventControllers.createEvent,
)

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  zodValidationRequest(EventValidation.updateValidationSchema),
  EventControllers.updateEvent,
)

router.delete('/:id', auth(USER_ROLE.admin), EventControllers.deleteAEvent)

router.get('/', EventControllers.getAllEvents)

router.get('/:id', EventControllers.getAEvent)

export const EventRoutes = router
