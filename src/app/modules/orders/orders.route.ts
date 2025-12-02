import { Router } from 'express'
import { ordersController } from './orders.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import zodValidationRequest from '../../middleware/validateRequest'
import { OrderValidation } from './orders.validation'

const router = Router()

router.post(
  '/',
  auth(USER_ROLE.user),
  zodValidationRequest(OrderValidation.createOrderSchema),
  ordersController.createOrders,
)

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  zodValidationRequest(OrderValidation.changeStatusOrderSchema),
  ordersController.updateOrders,
)

router.delete('/:id',   auth(USER_ROLE.admin, USER_ROLE.user), ordersController.deleteOrders)

router.get('/my-orders', auth(USER_ROLE.user), ordersController.getMyOrders)

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ordersController.getOrdersById,
)

router.get(
  '/',
  auth(USER_ROLE.admin),
  ordersController.getAllOrders,
)

export const OrdersRoutes = router
