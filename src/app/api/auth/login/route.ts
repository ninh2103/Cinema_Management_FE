import authApiRequest from '@/apiRequest/auth'
import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = cookies()
  try {
    const { payload } = await authApiRequest.sLogin(body)
    const { access_token, refresh_token } = payload.data
    const decodeAccessToken = jwt.decode(access_token) as { exp: number }
    const decodeRefreshToken = jwt.decode(refresh_token) as { exp: number }
    ;(await cookieStore).set('access_token', access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })
    ;(await cookieStore).set('refresh_token', refresh_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json({
        message: 'co loi'
      })
    }
  }
}
