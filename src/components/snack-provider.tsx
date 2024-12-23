import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'

export default function Snack() {
  return (
    <div className='flex justify-between max-w-full w-full rounded-lg shadow-lg p-6 bg-gray-100'>
      <div className='flex w-full'>
        {/* Phần hình ảnh */}
        <div className='flex-shrink-0'>
          <img src='/Corn_Boom.jpg' alt='Moana 2 poster' className='rounded-lg w-20 h-20 object-cover cursor-pointer' />
        </div>

        {/* Phần thông tin */}
        <div className='ml-4 flex flex-col justify-center'>
          <h1 className='font-mono text-black'>iCombo 1 Big Extra STD</h1>
          <p className='text-black font-thin text-sm'>1 Ly nước ngọt size L + 01 Hộp bắp + 1 Snack</p>
          <p className='text-black font-thin text-sm'>Giá: 99.000 ₫</p>
        </div>
      </div>

      {/* Phần tăng giảm số lượng */}
      <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
        <div className='flex gap-1'>
          <Button className='h-6 w-6 p-0'>
            <Minus className='w-3 h-3' />
          </Button>
          <Input type='text' readOnly className='h-6 p-1 w-8 text-center' />
          <Button className='h-6 w-6 p-0'>
            <Plus className='w-3 h-3' />
          </Button>
        </div>
      </div>
    </div>
  )
}
