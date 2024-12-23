import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

export default function SearchText() {
  return (
    <div className='relative flex-grow flex items-center'>
      <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
      <Input type='search' placeholder='Tìm kiếm phim' className='w-full rounded-lg bg-background pl-10 pr-3 py-2' />
    </div>
  )
}
