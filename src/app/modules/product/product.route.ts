import { Router } from 'express'
import { productController } from './product.controller'
import auth from '../../middleware/auth'
import parseData from '../../middleware/parseData'
import validateRequest from '../../middleware/validateRequest'
import { productValidation } from './product.validation'
import multer, { memoryStorage } from 'multer'
import { USER_ROLE } from '../user/user.constant'

const router = Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  upload.fields([{ name: 'images', maxCount: 12 }]),
  auth(USER_ROLE.admin),
  parseData(),
  validateRequest(productValidation.createProductSchema),
  productController.createProduct,
)

router.put(
  '/:id',
  upload.fields([{ name: 'images', maxCount: 12 }]),
  auth(USER_ROLE.admin),
  parseData(),
  validateRequest(productValidation.updateProductSchema),
  productController.updateProduct,
)

router.delete('/:id', auth(USER_ROLE.admin), productController.deleteProduct)

router.get('/:id', productController.getProductById)

router.get('/', productController.getAllProduct)

export const ProductRoutes = router
