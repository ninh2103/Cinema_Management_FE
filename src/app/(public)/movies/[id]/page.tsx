'use client'
import { CalendarDays, Clock10 } from 'lucide-react'
import React, { useState } from 'react'
const dates = [
  { label: 'Hôm Nay', date: '13/12' },
  { label: 'Thứ Bảy', date: '14/12' },
  { label: 'Chủ Nhật', date: '15/12' }
]

const hours = [{ label: '18h:00' }, { label: '20h:00' }, { label: '00h:00' }]
export default function page() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHours, setSelectedHours] = useState('')
  return (
    <div className='w-full space-y-4'>
      <div className='relative'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <div className='relative w-full' style={{ height: '500px' }}>
          {' '}
          <video className='absolute top-0 left-0 w-full h-full object-cover' autoPlay loop muted playsInline>
            <source src='#' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Movie Details Section */}
      <div className='max-w-4xl rounded-lg shadow-lg p-6'>
        <div className='flex gap-6'>
          <div className='w-1/3'>
            <img src='/phim.jpg' alt='Moana 2 poster' width={250} height={350} className='rounded-lg' />
          </div>
          <div className='w-2/3'>
            <h1 className='text-3xl font-bold text-white-800'>Hành Trình Của Moana 2</h1>
            <div className='flex items-center'>
              <div className='flex items-center'>
                <Clock10 className='w-5 h-5 text-white mr-1 mt-1' />
                <p className='text-white-600 mt-1'>90 phút</p>
              </div>
              <div className='flex items-center ml-2'>
                <CalendarDays className='w-5 h-5 text-white mr-1 mt-1' />
                <p className='text-white-600 mt-1'>29/11/2024</p>
              </div>
            </div>

            <div className='flex items-center mt-4'>
              <span className='text-yellow-500 font-semibold text-lg'>★ 8.9</span>
            </div>
            <p className='text-white-600 font-thin mt-2'>Quốc gia: Mỹ</p>
            <p className='text-white-600 font-thin mt-2'>Nhà sản xuất: Walt Disney Pictures</p>
            <p className='text-white-600 font-thin mt-2'>Thể loại: Hoạt Hình</p>
            <p className='text-white-600 font-thin mt-2'>Đạo diễn: David G. Derrick Jr.</p>

            {/* Actors Section */}
            <div className='mt-4'>
              <p className='text-white-800 font-thin mt-1'>Diễn viên:</p>
              <div className='flex white-4 mt-2'>
                <span className='bg-gray-200 text-gray-800 rounded-full px-4 py-1'>Auli'i Cravalho</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='border-l border-blue-500 text-lg font-semibold'> Nội dung phim</div>
      <p className='text-sm font-light mt-4'>
        “Hành Trình của Moana 2” là màn tái hợp của Moana và Maui sau 3 năm, trở lại trong chuyến phiêu lưu cùng với
        những thành viên mới. Theo tiếng gọi của tổ tiên, Moana sẽ tham gia cuộc hành trình đến những vùng biển xa xôi
        của Châu Đại Dương và sẽ đi tới vùng biển nguy hiểm, đã mất tích từ lâu.
      </p>
      <div className='border-l border-blue-500 text-lg font-semibold'> Lịch chiếu</div>
      <div className='border rounded-lg shadow-sm'>
        <div className='flex justify-between items-center p-4 cursor-pointer '>
          <span className='font-medium text-lg text-white'>Chọn xuất</span>
        </div>

        <div className='p-4 '>
          <div className='flex justify-center space-x-6 mt-4'>
            {dates.map(({ label, date }) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg ${
                  selectedDate === date ? 'bg-blue-600 text-white' : 'bg-white text-black'
                }`}
              >
                <span className='font-medium'>{label}</span>
                <span className='text-sm'>{date}</span>
              </button>
            ))}
          </div>
          <hr className='my-4 border-t border-gray-300 w-full' />
          <span className='font-mono text-lg text-white'>Chọn khung giờ</span>
          <div className='flex justify-center space-x-6 mt-4'>
            {hours.map(({ label }) => (
              <button
                key={label}
                onClick={() => setSelectedHours(label)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg ${
                  selectedHours === label ? 'bg-blue-600 text-white' : 'bg-white text-black'
                }`}
              >
                <span className='font-medium'>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
