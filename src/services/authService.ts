import axios from 'axios'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface RegisterResponse {
  user: AuthUser
}

export async function registerUser(
  data: RegisterData,
): Promise<AuthUser> {
  const response = await axios.post<RegisterResponse>(
    '/api/auth/register',
    data,
  )

  return response.data.user
}


export interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  user: AuthUser
}

export async function loginUser(
  data: LoginData,
): Promise<AuthUser> {
  const response = await axios.post<LoginResponse>(
    '/api/auth/login',
    data,
  )

  return response.data.user
}