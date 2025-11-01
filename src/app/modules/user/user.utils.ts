import { modeType } from '../notification/notification.interface'
import { messages } from '../notification/notification.constant'
import { TUser } from './user.interface'
import { findAdmin } from '../../utils/findAdmin'
import { NotificationService } from '../notification/notification.service'

export const sendUserStatusNotifYToAdmin = async (
  status: 'active' | 'blocked',
  user: TUser,
) => {
  const admin = await findAdmin()
  if (!admin) throw new Error('Admin not found!')

  // Determine the message and description based on the status
  let message
  let description

  if (status === 'active') {
    message = messages.userManagement.accountActivated
    description = `User ${user?.name} (ID: ${user?.id}) has been successfully activated.`
  } else {
    message = messages.userManagement.accountDeactivated
    description = `User ${user?.name} (ID: ${user?.id}) has been blocked from accessing the system.`
  }

  // Create a notification entry
  await NotificationService.createNotificationIntoDB({
    receiver: admin?._id,
    message,
    description,
    model_type: modeType.User,
  })
}

export const sendUserStatusNotifYToUser = async (
  status: 'active' | 'blocked',
  user: TUser,
) => {
  const admin = await findAdmin()

  // Determine the message and description based on the status
  let message
  let description

  if (status === 'active') {
    message = messages.userManagement.accountActivated
    description = `Your account has been successfully activated. You can now access all available features.`
  } else {
    message = messages.userManagement.accountDeactivated
    description = `Your account has been blocked. Please contact support for further assistance.`
  }

  // Create a notification entry
  await NotificationService.createNotificationIntoDB({
    receiver: user?._id,
    message,
    description,
    model_type: modeType.User,
  })
}
