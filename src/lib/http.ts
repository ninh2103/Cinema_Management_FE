import envConfig from '@/config'
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { LoginResType } from '@/types/auth'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload, message = 'Lỗi Http' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Lỗi Thực Thể' })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null
export const isClient = typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }
  const baseHeaders: {
    [key: string]: string
  } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json'
        }
  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENPOINT : options.baseUrl
  const fullUrl = `${baseUrl}/${normalizePath(url)}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as any,
    body,
    method
  })

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  // Xử lý lỗi từ API (Http Interceptor)
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // Xử lý logout khi lỗi xác thực
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch(`${envConfig.NEXT_PUBLIC_API_ENPOINT}/users/logout`, {
            method: 'POST',
            body: null,
            headers: {
              ...baseHeaders
            } as any
          })
          try {
            await clientLogoutRequest
          } catch (error) {
          } finally {
            removeTokensFromLocalStorage()
            clientLogoutRequest = null
            location.href = '/login' // Điều hướng người dùng tới trang đăng nhập sau khi logout
          }
        }
      }
    } else {
      throw new HttpError(data)
    }
  }

  // Xử lý login và lưu token từ phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url)
    if (normalizeUrl === '/login') {
      const { access_token, refresh_token } = (payload as LoginResType).result
      setRefreshTokenToLocalStorage(refresh_token)
      setAccessTokenToLocalStorage(access_token)
    } else if (normalizeUrl === '/token') {
      const { access_token, refresh_token } = payload as {
        access_token: string
        refresh_token: string
      }
      setAccessTokenToLocalStorage(access_token)
      setRefreshTokenToLocalStorage(refresh_token)
    } else if (normalizeUrl === '/logout') {
      removeTokensFromLocalStorage()
    }
  }

  return data
}

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
