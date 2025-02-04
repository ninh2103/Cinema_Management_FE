import { EntityError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '@/types/jwt.types'
import { SnackResType } from '@/schemaValidations/snack.schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

// export const handleErrorApi = ({
//   error,
//   setError,
//   duration
// }: {
//   error: any
//   setError?: UseFormSetError<any>
//   duration?: number
// }) => {
//   if (error instanceof EntityError && setError) {
//     error.payload.errors.forEach((item) => {
//       setError(item.field, {
//         type: 'server',
//         message: item.message
//       })
//     })
//   } else {
//     toast({
//       title: 'Lỗi',
//       description: error?.payload?.message ?? ' không xác định',
//       variant: 'destructive',
//       duration: duration ?? 5000
//     })
//   }
// }

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('access_token') : null
}
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refresh_token') : null
}
export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem('access_token', value)
}
export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem('refresh_token', value)
}

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('access_token')
  isBrowser && localStorage.removeItem('refresh_token')
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}
export const TypeCinemaRoom = {
  Standard: 0, // Không hoạt động
  VIP: 1, // Đang hoạt động
  IMAX: 2 // Ẩn
} as const

export const CinemaTypeRoomValue = [TypeCinemaRoom.Standard, TypeCinemaRoom.VIP, TypeCinemaRoom.IMAX] as const
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}
