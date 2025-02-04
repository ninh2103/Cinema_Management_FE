import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Clapperboard,
  Clock9,
  School,
  Ticket,
  Tag,
  CalendarCheck
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard'
  },

  {
    title: 'Phim',
    Icon: Clapperboard,
    href: '/manage/movies'
  },
  {
    title: 'Suất chiếu',
    Icon: Clock9,
    href: '/manage/showtimes'
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/foods'
  },

  {
    title: 'Phòng chiếu',
    Icon: School,
    href: '/manage/rooms'
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts'
  },
  {
    title: 'Vé',
    Icon: Ticket,
    href: '/manage/tickets'
  },
  {
    title: 'Sự kiện',
    Icon: CalendarCheck,
    href: '/manage/event'
  },
  {
    title: 'Khuyến mãi',
    Icon: Tag,
    href: '/manage/promotions'
  }
]

export default menuItems
