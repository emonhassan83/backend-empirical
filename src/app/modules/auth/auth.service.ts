import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { JwtPayload } from 'jsonwebtoken'
import emailSender from '../../utils/emailSender'
import { User } from '../user/user.model'
import {
  authNotifyAdmin,
  createToken,
  TExpiresIn,
  verifyToken,
} from './auth.utils'
import { TLoginUser } from './auth.interface'
import { generateOtp } from '../../utils/generateOtp'
import moment from 'moment'

const loginUser = async (payload: TLoginUser) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  //* checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  // if user is not verify yet throw error
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'User account is not verified')
  }

  //* create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as TExpiresIn,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as TExpiresIn,
  )

  return {
    user: {
      _id: user?._id,
      fullname: user?.name,
      email: user?.email,
      photoUrl: user?.photoUrl,
      status: user?.status,
    },
    accessToken,
    refreshToken,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(userData?.email)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  //* checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  //* hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  const updateUserPassword = await User.findOneAndUpdate(
    {
      _id: userData._id,
      role: userData.role,
    },
    {
      $set: {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
      },
    },
    { new: true },
  )

  //if password is not updated throw error
  if (!updateUserPassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Password was not updated. Please try again!',
    )
  }

  // Send a notification to the admin informing them about the successful password change
  user?.role === 'admin' && (await authNotifyAdmin('PASSWORD_CHANGE'))

  // return null;
}

const refreshToken = async (token: string) => {
  //* checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(decoded?.email)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as TExpiresIn,
  )

  return {
    accessToken,
  }
}

const forgetPassword = async (payload: { email: string }) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  //* create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  }

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  )

  const currentTime = new Date()
  const otp = generateOtp()
  const expiresAt = moment(currentTime).add(5, 'minute')

  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
      status: true
    },
  })

  // const resetUILink = `${config.reset_pass_link}?id=${user._id}&token=${resetToken} `

  await emailSender(
    user?.email,
    'Your One-Time OTP',
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: left; padding: 10px 20px;">
          <h2 style="color: #333;">Your One-Time OTP</h2>
          <p style="color: #555; margin-top: 10px;">Dear ${user?.name},</p>
          <p style="color: #555;">Use the following One-Time Password (OTP) to proceed with your request. This OTP is valid for a limited time.</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="padding: 10px 20px; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #555;">This OTP is valid until: <strong>${expiresAt.toLocaleString()}</strong></p>
          <p style="color: #555;">If you did not request this OTP, please ignore this email.</p>
          <p style="color: #555;">Thank you,<br/>The Empirical Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          <p>&copy; ${new Date().getFullYear()} Empirical. All rights reserved.</p>
        </div>
      </div>
    `,
  )

  // Send a notification to the admin informing them about the forgot password request
  user?.role === 'admin' && (await authNotifyAdmin('PASSWORD_FORGET'))

  return { verifyToken: resetToken }
}

const resetPassword = async (
  payload: { email: string; newPassword: string; confirmPassword: string },
  token: string,
) => {
  //* checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email)
  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  // if session is expired
  if (new Date() > user?.verification?.expiresAt) {
    throw new AppError(httpStatus.FORBIDDEN, 'Session has expired')
  }

  // if user verification status is not available
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'OTP is not verified yet')
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string)
  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
  }

  // if new password and confirm Password is not match
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match',
    )
  }

  //* hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  const passwordResetUser = await User.findOneAndUpdate(
    {
      _id: decoded._id,
      role: decoded.role,
    },
    {
      $set: {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
        verification: {
          otp: 0,
          status: true,
        },
      },
    },
    { new: true },
  )

  // console.log({ decoded, user, passwordResetUser })

  //if password is not updated throw error
  if (!passwordResetUser) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Password was not reset. Please try again!',
    )
  }

  // Send a notification to the admin informing them about the password reset
  user?.role === 'admin' && (await authNotifyAdmin('PASSWORD_RESET'))
}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
}
