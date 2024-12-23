import { CalendarDays, Clock10 } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div className='w-full space-y-4'>
      <div className='border-l border-blue-500 text-lg font-semibold'>Phim điện ảnh</div>
      <hr className='my-4 border-t border-gray-300 w-full' />

      <div className='max-w-4xl rounded-lg shadow-lg p-6'>
        <div className='flex gap-6'>
          <div className='w-1/3'>
            <img src='/phim.jpg' alt='Moana 2 poster' className='rounded-lg w-full h-40 object-cover cursor-pointer' />
          </div>
          <div className='w-2/3'>
            <h1 className='text-xl font-light text-white-800'>Hành Trình Của Moana 2</h1>
            <div>
              <p className='font-thin'>
                “Hành Trình của Moana 2” là màn tái hợp của Moana và Maui sau 3 năm, trở lại trong chuyến phiêu lưu cùng
                với những thành viên mới. Theo tiếng gọi của tổ tiên, Moana sẽ tham gia cuộc hành trình đến những vùng
                biển xa xôi của Châu Đại Dương và sẽ đi tới vùng biển nguy hiểm, đã mất tích từ lâu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
