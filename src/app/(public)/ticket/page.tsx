'use client'
import SeatSelection from '@/components/seat-selection'
import Snack from '@/components/snack-provider'
import { Button } from '@/components/ui/button'
import { listenNowAlbums } from '@/lib/albums'
import { CircleChevronDown, CircleChevronUp } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const dates = [
  { label: 'Hôm Nay', date: '13/12' },
  { label: 'Thứ Bảy', date: '14/12' },
  { label: 'Chủ Nhật', date: '15/12' }
]

const hours = [{ label: '18h:00' }, { label: '20h:00' }, { label: '00h:00' }]

export default function StepNavigation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHours, setSelectedHours] = useState('')

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section)
  }

  const steps = ['Chọn Phim/Xuất', 'Chọn Ghế', 'Chọn Thức Ăn', 'Thanh Toán', 'Xác Nhận']

  return (
    <div className='w-full space-y-4'>
      {/* Navigation Steps */}
      <div className='flex justify-center mt-3 text-lg font-thin'>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-center mr-4 relative cursor-pointer ${
              currentStep === index + 1 ? 'text-blue-400' : 'text-white'
            }`}
            onClick={() => setCurrentStep(index + 1)}
          >
            {step}
            <div
              className={`absolute left-0 right-0 bottom-0 h-[2px] rounded-sm transition-all duration-300 ${
                currentStep === index + 1 ? 'bg-blue-600' : 'bg-transparent'
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className='flex space-x-4'>
        {/* Left Section */}
        <div className='w-2/3 space-y-4'>
          {currentStep === 1 && (
            <>
              {/* Section 1: Chọn Phim */}
              <div className='border rounded-lg shadow-sm'>
                <div
                  className='flex justify-between items-center p-4 cursor-pointer bg-white'
                  onClick={() => toggleSection(1)}
                >
                  <span className='font-medium text-lg text-black'>Chọn phim</span>
                  <span className='text-black cursor-pointer'>
                    {openSection === 1 ? <CircleChevronUp /> : <CircleChevronDown />}
                  </span>
                </div>
                {openSection === 1 && (
                  <div className='p-4 bg-gray-50'>
                    <div className='grid grid-cols-3 gap-4'>
                      {listenNowAlbums.map((album) => (
                        <div key={album.name} className='flex flex-col items-center space-y-2 w-[250px]'>
                          <div className='relative group w-full h-[330px]'>
                            <Image
                              src={album.cover}
                              alt={album.name}
                              width={250}
                              height={330}
                              className='rounded-md object-cover w-full h-full cursor-pointer'
                            />
                          </div>
                          <div className='space-y-1 text-center'>
                            <h3 className='font-medium text-black leading-none'>{album.name}</h3>
                            <p className='text-xs text-muted-foreground'>{album.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Chọn Suất */}
              <div className='border rounded-lg shadow-sm'>
                <div
                  className='flex justify-between items-center p-4 cursor-pointer bg-white'
                  onClick={() => toggleSection(2)}
                >
                  <span className='font-medium text-lg text-black'>Chọn xuất</span>
                  <span className='text-black cursor-pointer'>
                    {openSection === 2 ? <CircleChevronUp /> : <CircleChevronDown />}
                  </span>
                </div>
                {openSection === 2 && (
                  <div className='p-4 bg-gray-50'>
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
                    <span className='font-mono text-lg text-black'>Chọn khung giờ</span>
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
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className='border rounded-lg shadow-sm p-4 bg-gray-50'>
              <h1 className='text-lg font-bold text-black'>Chọn Ghế</h1>
              <SeatSelection />
            </div>
          )}

          {currentStep === 3 && (
            <div className='border rounded-lg shadow-sm p-4 bg-gray-50'>
              <h1 className='text-lg font-bold text-black'>Chọn Combo</h1>
              <Snack />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className='w-1/3 border rounded-lg shadow-sm p-4 bg-gray-100'>
          <div className='flex gap-6'>
            <div className='w-1/3'>
              <img src='/phim.jpg' alt='Moana 2 poster' width={250} height={350} className='rounded-lg' />
            </div>
            <div className='w-2/3'>
              <h1 className='text-lg font-semibold text-black'>Hành Trình Của Moana 2</h1>
              <p className='text-black font-thin mt-2'>Quốc gia: Mỹ</p>
            </div>
          </div>
          <p className='text-black font-light mt-2'>Special Cinema-Rạp 2</p>
          <p className='text-black font-light mt-2'>Suất: 18:00 - thứ sáu, 13/12/2024</p>
          <div className='flex justify-center items-center space-x-4 mt-4'>
            <Button
              className='px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition'
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            >
              Quay lại
            </Button>
            <Button
              className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-800 transition'
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
