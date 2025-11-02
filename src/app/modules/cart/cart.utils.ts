import { modeType } from '../notification/notification.interface'
import { messages } from '../notification/notification.constant'
import { NotificationService } from '../notification/notification.service'

export const cartProductNotifyToUser = async (action: 'ADDED', user: any, cart: any) => {
  // Determine the message and description based on the action
  let message
  let description

  switch (action) {
    case 'ADDED':
      message = messages.cartManagement.addCart
      description = `You have successfully added a product to your cart.`
      break
    default:
      throw new Error('Invalid action type')
  }

  // Create a notification entry
  await NotificationService.createNotificationIntoDB({
    receiver: user?._id,
    message,
    description,
    reference: cart?._id,
    model_type: modeType.Cart,
  })
}
