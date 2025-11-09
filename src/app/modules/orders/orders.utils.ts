import { modeType } from '../notification/notification.interface'
import { NotificationService } from '../notification/notification.service'

// Notify user when order status changes
export const orderStatusNotifyToUser = async (
  action: 'STATUS_CHANGED',
  user: any,
  order: any,
) => {
  let message
  let description

  switch (order?.status) {
    case 'processing':
      message = 'Order Processing Started'
      description = 'Your order is now being processed.'
      break
    case 'onTheWay':
      message = 'Order on the Way'
      description = 'Good news! Your order is on its way.'
      break
    case 'delivered':
      message = 'Order Delivered'
      description = 'Your order has been successfully delivered.'
      break
    case 'cancelled':
      message = 'Order Cancelled'
      description = 'Your order has been cancelled.'
      break
    default:
      message = 'Order Updated'
      description = 'Your order status has been updated.'
  }

  await NotificationService.createNotificationIntoDB({
    receiver: user?._id,
    message,
    description,
    reference: order?._id,
    model_type: modeType.Order,
  })
}
