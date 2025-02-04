import { Role } from '@/constants/type'
import z from 'zod'

export const LoginBody = z
  .object({
    Email: z.string().email(),
    Password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: z.object({
      id: z.string(), // ID là chuỗi
      fullname: z.string(), // Đổi từ name thành fullname
      email: z.string(),
      role: z.object({
        Name: z.enum([Role.Owner, Role.Employee, Role.Customer]) // Đổi role thành object với Name
      })
    })
  }),
  message: z.string(),
  statusCode: z.number() // Thêm statusCode nếu cần
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  message: z.string()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>
