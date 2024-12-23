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
  Tag
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
    href: '/manage/showtiem'
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes'
  },

  {
    title: 'Phòng chiếu',
    Icon: School,
    href: '/manage/room'
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts'
  },
  {
    title: 'Vé',
    Icon: Ticket,
    href: '/manage/ticket'
  },
  {
    title: 'Khuyến mãi',
    Icon: Tag,
    href: '/manage/promotion'
  }
]

export default menuItems
