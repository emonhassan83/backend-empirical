import { Router } from 'express'
import { contentsController } from './contents.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import zodValidationRequest from '../../middleware/validateRequest'
import { contentsValidation } from './contents.validation'
import multer, { memoryStorage } from 'multer'
import parseData from '../../middleware/parseData'

const router = Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  auth(USER_ROLE.admin),
  zodValidationRequest(contentsValidation.createValidationSchema),
  contentsController.createContents,
)

router.put(
  '/philosophy',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  zodValidationRequest(contentsValidation.updatePhilosophyValidationSchema),
  contentsController.updatePhilosophyContent,
)

router.put(
  '/',
  auth(USER_ROLE.admin),
  zodValidationRequest(contentsValidation.updateValidationSchema),
  contentsController.updateContents,
)

router.get('/philosophy', contentsController.getPhilosophyContent)

router.get('/', contentsController.getContent)

export const ContentsRoutes = router
