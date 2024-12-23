'use client'

import Link from 'next/link'

const menuItems = [
  {
    title: 'Thể loại',
    href: '/category'
  },
  {
    title: 'Vé',
    href: '/ticket'
  },
  {
    title: 'Sự kiện',
    href: '/event'
  },
  {
    title: 'Phim',
    href: '/movies'
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Đăng kí',
    href: '/register',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  return menuItems.map((item) => {
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
