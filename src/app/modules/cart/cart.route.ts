import express from 'express'
import zodValidationRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { CartControllers } from './cart.controller'
import { CartValidation } from './cart.validation'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.user),
  zodValidationRequest(CartValidation.createValidationSchema),
  CartControllers.addACart,
)

router.delete(
  '/my-cart',
  auth(USER_ROLE.user),
  CartControllers.deleteMyCarts,
)

router.delete(
  '/:id',
  auth(USER_ROLE.user),
  CartControllers.deleteACart,
)

router.get(
  '/',
  auth(USER_ROLE.user),
  CartControllers.getAllCarts,
)

router.get(
  '/:id',
  auth(USER_ROLE.user),
  CartControllers.getACart,
)

export const CartRoutes = router
