import express from 'express'
import zodValidationRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import multer, { memoryStorage } from 'multer'
import parseData from '../../middleware/parseData'
import { ArticleValidation } from './article.validation'
import { ArticleControllers } from './article.controller'

const router = express.Router()
const storage = memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  zodValidationRequest(ArticleValidation.createValidationSchema),
  ArticleControllers.createArticle,
)

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  upload.single('image'),
  parseData(),
  zodValidationRequest(ArticleValidation.updateValidationSchema),
  ArticleControllers.updateArticle,
)

router.delete('/:id', auth(USER_ROLE.admin), ArticleControllers.deleteAArticle)

router.get('/', ArticleControllers.getAllArticles)

router.get('/', ArticleControllers.getAllArticlesByCategory)

router.get('/:id', ArticleControllers.getAArticle)

export const ArticleRoutes = router
