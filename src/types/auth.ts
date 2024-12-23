import { z } from 'zod'

export interface LoginBody {
  password: string
  email: string
}
export const AuthRes = z.object({
  result: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  message: z.string()
})
export type LoginResType = z.TypeOf<typeof AuthRes>
export interface LogoutBody {
  refresh_token: string
}
export const LogoutRes = z.object({
  message: z.string()
})
export type LogoutResType = z.TypeOf<typeof LogoutRes>

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  date_of_birth: z.string().datetime(),
  comfim_password: z.string(),
  name: z.string()
})
export type RegisterBodyType = z.TypeOf<typeof userSchema>
export type ResponseResType = z.TypeOf<typeof AuthRes>

const verifySchema = z.object({
  email_verify_token: z.string().email()
})
export type VerifyBodyType = z.TypeOf<typeof verifySchema>
export type VerifyResType = z.TypeOf<typeof LogoutRes>
