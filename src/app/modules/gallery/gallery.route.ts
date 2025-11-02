import express from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import multer, { memoryStorage } from 'multer'
import parseData from '../../middleware/parseData'
import { GalleryControllers } from './gallery.controller'

const router = express.Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.fields([{ name: 'images', maxCount: 15 }]),
  parseData(),
  GalleryControllers.createGallery,
)

router.delete('/:id', auth(USER_ROLE.admin), GalleryControllers.deleteAGallery)

router.get('/', GalleryControllers.getAllGalleries)

router.get('/:id', GalleryControllers.getAGallery)

export const GalleryRoutes = router
