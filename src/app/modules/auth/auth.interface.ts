export interface TRegisterUser {
  name: string
  email: string
  password: string
  role: 'admin' | 'vendor' | 'user'
}

export interface TLoginUser {
  email: string
  password: string
}
