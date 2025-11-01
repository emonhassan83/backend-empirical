export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
} as const

export const USER_STATUS = {
  active: 'active',
  blocked: 'blocked',
} as const

export type TUserRole = keyof typeof USER_ROLE
export type TUserStatus = keyof typeof USER_STATUS

export const UserSearchableFields = ['id', 'fullname', 'username', 'email', 'role', 'status']
