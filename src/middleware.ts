import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminPaths = ['/manage']
const customerPaths = ['/profile', '/'] // Các đường dẫn chỉ dành cho khách hàng
const sharedPaths = ['/'] // Đường dẫn chung cho cả admin và khách hàng

const privatePaths = [...adminPaths, ...customerPaths, ...sharedPaths]
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const refreshToken = request.cookies.get('refresh_token')?.value
  const accessToken = request.cookies.get('access_token')?.value

  // 1. Người dùng chưa đăng nhập thì không được truy cập privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    // 2. Người dùng đã đăng nhập thì không được truy cập trang login
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 3. Nếu không có accessToken, chuyển hướng đến trang login
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/login', request.url)
      //url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // 4. Xử lý phân quyền dựa trên role
    const role = decodeToken(refreshToken).role

    const isAdminAccessingCustomerPath = role === Role.Owner && customerPaths.some((path) => pathname.startsWith(path))

    const isCustomerAccessingAdminPath = role === Role.Customer && adminPaths.some((path) => pathname.startsWith(path))

    // Admin không được vào đường dẫn của khách hàng hoặc ngược lại
    if (isCustomerAccessingAdminPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/profile/:path*', '/', '/login']
}
