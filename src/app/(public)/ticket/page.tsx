'use client'
import { Button } from '@/components/ui/button'
import { useSnackListQuery } from '@/queries/useFood'
import { useGetMovie, useMovieListQuery } from '@/queries/useMovie'
import { CircleChevronDown, CircleChevronUp } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

import Quantity from '@/components/quantity-provider'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useTicketPriceListQuery } from '@/queries/useTicketPrice'
import { formatCurrency } from '@/lib/utils'

export default function StepNavigation() {
  const movieListQuery = useMovieListQuery()
  const movie = movieListQuery.data?.payload.data.data || []
  const snackListQuery = useSnackListQuery()
  const snack = snackListQuery.data?.payload.data.data || []
  const ticketPriceListQuery = useTicketPriceListQuery()
  const ticketPrice = ticketPriceListQuery.data?.payload.data.data || []
  const defaultTicketPrice = ticketPrice[0]?.Price || 0

  const [currentStep, setCurrentStep] = useState(1)
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHours, setSelectedHours] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [selectedMovieId, setSelectedMovieId] = useState<number>()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])

  const rows = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)) // Hàng A -> L
  const columns = Array.from({ length: 12 }, (_, i) => i + 1) // Số 1 -> 12

  const { data } = useGetMovie({ id: selectedMovieId as number, enabled: !!selectedMovieId })
  const movieData = data?.payload.data // Gọi API với selectedMovieId

  type Showtime = {
    TimeStart: string
    TimeEnd: string
    Id: string | number
    room: { Name: string }
  }

  // Adjusted grouping of showtimes by date and room
  const groupedShowtime: Record<string, Showtime[]> = movie.reduce(
    (acc: Record<string, Showtime[]>, film) => {
      const showtimes = film.showtimes || []
      showtimes.forEach(({ Date: date, TimeStart, TimeEnd, Id, room }) => {
        const dateKey = new Date(date).toLocaleDateString() // Group by date
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push({ TimeStart, TimeEnd, Id, room })
      })
      return acc
    },
    {} // Initial empty object
  )

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section)
  }

  const handleSeatClick = (seat: string) => {
    const isSelected = selectedSeats.includes(seat)

    if (isSelected) {
      // Nếu ghế đã được chọn thì bỏ chọn
      setSelectedSeats(selectedSeats.filter((s) => s !== seat))
    } else {
      // Nếu ghế chưa được chọn thì thêm ghế vào danh sách đã chọn
      setSelectedSeats([...selectedSeats, seat])
    }

    // Thêm logic để gán giá vé cho ghế
    const updatedSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter((s) => s !== seat)
      : [...selectedSeats, seat]

    setSelectedSeats(updatedSeats)
  }
  const steps = ['Chọn Phim/Xuất', 'Chọn Ghế', 'Chọn Thức Ăn', 'Thanh Toán', 'Xác Nhận']

  const handleQuantityChange = (snackId: number, quantity: number) => {
    setOrders((prevOrders) => {
      const snacks = snack.find((item) => item.Id === snackId) // Tìm món ăn trong danh sách snack
      if (!snack) return prevOrders // Nếu không tìm thấy món, không làm gì cả.

      if (quantity === 0) {
        return prevOrders.filter((order) => order.snackId !== snackId)
      }

      const index = prevOrders.findIndex((order) => order.snackId === snackId)
      if (index === -1) {
        return [...prevOrders, { snackId, quantity, price: Number(snacks?.Price) }]
      }

      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }

      return newOrders
    })
  }

  const calculateTotal = () => {
    return orders.reduce((total, order) => {
      const snacks = snack.find((item) => item.Id === order.snackId) // Lấy thông tin món ăn để tính tiền
      if (!snack) return total // Nếu không tìm thấy món, trả về tổng hiện tại.

      return total + order.quantity * Number(snacks?.Price)
    }, 0)
  }

  const resultTicket = defaultTicketPrice * selectedSeats.length

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
                  <div className='p-4'>
                    <div className='grid grid-cols-3 gap-4'>
                      {movie.map((movies) => (
                        <div
                          key={movies.Id}
                          className='flex flex-col items-center space-y-2 w-[250px]'
                          onClick={() => setSelectedMovieId(movies.Id)} // Cập nhật selectedMovieId khi click vào phim
                        >
                          <div className='relative group w-full h-[330px]'>
                            <Image
                              src={`http://localhost:4000/images/movie/${movies.Photo}`}
                              alt={movies.NameEN}
                              width={250}
                              height={330}
                              className='rounded-md object-cover w-full h-full cursor-pointer'
                            />
                          </div>
                          <div className='space-y-1 text-center'>
                            <h3 className='font-medium text-white leading-none'>{movies.NameEN}</h3>
                            <p className='text-xs text-muted-foreground'>{movies.NameVN}</p>
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
                  <div className='p-4'>
                    <div className='flex flex-wrap  space-x-6 mt-4'>
                      {Object.entries(groupedShowtime).map(([date, times]) => (
                        <div key={date} className='flex flex-col items-center mr-6 mb-4'>
                          {/* Hiển thị Ngày */}
                          <button
                            onClick={() => setSelectedDate(date)}
                            className={`px-4 py-2 rounded-lg ${
                              selectedDate === date ? 'bg-orange-600 text-white' : 'bg-white text-black'
                            }`}
                          >
                            <span className='font-medium'>{date}</span>
                          </button>

                          {/* Hiển thị Suất Chiếu */}
                          {selectedDate === date && (
                            <div className='flex flex-wrap space-x-4 mt-2'>
                              {times.map(({ TimeStart, TimeEnd, Id, room }) => (
                                <Button
                                  key={Id}
                                  onClick={() => {
                                    setSelectedHours(`${TimeStart} - ${TimeEnd}`)
                                    setSelectedRoom(room.Name) // Cập nhật selectedRoom khi chọn phòng
                                  }}
                                  className={`px-4 py-2 rounded-lg ${
                                    selectedHours === `${TimeStart} - ${TimeEnd}`
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white text-black'
                                  }`}
                                >
                                  <span className='font-medium'>{`${TimeStart} - ${TimeEnd}`}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
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
              <div className='p-4 bg-gray-100 rounded-lg'>
                {/* Lưới ghế */}
                <div className='flex flex-col items-center'>
                  <div className='grid grid-cols-[2fr_repeat(12,_1fr)_2fr] gap-1'>
                    <div></div>
                    {columns
                      .slice()
                      .reverse()
                      .map((col) => (
                        <div key={`header-${col}`} className=' text-black text-center font-bold'>
                          {col}
                        </div>
                      ))}
                    <div></div>

                    {/* Ghế ngồi */}
                    {rows
                      .slice()
                      .reverse()
                      .map((row) => (
                        <React.Fragment key={`row-${row}`}>
                          {/* Chữ hàng bên trái */}
                          <div className=' text-black flex items-center justify-center font-bold'>{row}</div>

                          {/* Các ghế */}
                          {columns
                            .slice()
                            .reverse()
                            .map((col) => {
                              const seat = `${row}${col}` // Tên ghế
                              const isSelected = selectedSeats.includes(seat) // Kiểm tra ghế đã chọn

                              return (
                                <button
                                  key={seat}
                                  onClick={() => handleSeatClick(seat)} // Xử lý bấm vào ghế
                                  className={`w-8 h-8 rounded border text-black text-center transition ${
                                    isSelected ? 'bg-orange-500 text-white' : 'border-gray-400 hover:bg-orange-300'
                                  }`}
                                >
                                  {col}
                                </button>
                              )
                            })}

                          {/* Chữ hàng bên phải */}
                          <div key={`right-${row}`} className=' text-black flex items-center justify-center font-bold'>
                            {row}
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Màn hình và chú thích */}
                <div className='mt-8 text-center text-black font-semibold'>Màn hình</div>
                <div className='border-t-2 border-orange-500 mt-1'></div>
                <div className='flex justify-center mt-4 gap-4 text-sm'>
                  <div className=' text-black flex items-center gap-2'>
                    <div className='w-4 h-4 bg-gray-300'></div> Ghế đã bán
                  </div>
                  <div className='flex text-black items-center gap-2'>
                    <div className='w-4 h-4 bg-orange-400'></div> Ghế đang chọn
                  </div>
                  <div className='flex text-black items-center gap-2'>
                    <div className='w-4 h-4 border border-gray-400'></div> Ghế đơn
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className='border rounded-lg shadow-sm p-4 bg-gray-50'>
              <h1 className='text-lg font-bold text-black'>Chọn đồ ăn</h1>
              <div className='max-w-full w-full rounded-lg shadow-lg p-6 bg-gray-100'>
                {snack.map((snacks) => (
                  <div key={snacks.Id} className='flex w-full mb-2'>
                    <div className='flex-shrink-0'>
                      <img
                        src={`http://localhost:4000/images/movie/${snacks.Photo}`}
                        alt={snacks.Name}
                        className='rounded-lg w-20 h-20 object-cover cursor-pointer'
                      />
                    </div>

                    <div className='ml-4 flex flex-col justify-center'>
                      <h1 className='font-mono text-black'>{snacks.Name}</h1>
                      <p className='text-black font-thin text-sm'>{snacks.Price} vnđ</p>
                    </div>

                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                      <div className='flex gap-1'>
                        <Quantity
                          onChange={(value) => handleQuantityChange(snacks.Id, value)}
                          value={orders.find((order) => order.snackId === snacks.Id)?.quantity ?? 0}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className='w-1/3 border rounded-lg shadow-sm p-4 bg-gray-100'>
          {selectedMovieId && movieData && (
            <>
              <div className='flex gap-6'>
                <div className='w-1/3'>
                  <img
                    src={`http://localhost:4000/images/movie/${movieData.Photo}`}
                    alt={movieData.NameEN}
                    width={250}
                    height={350}
                    className='rounded-lg'
                  />
                </div>
                <div className='w-2/3'>
                  <h1 className='text-lg font-semibold text-black'>{movieData.NameEN}</h1>
                  <p className='text-black font-thin mt-2'>Chi tiết: {movieData.Detail}</p>
                  {selectedSeats.length > 0 ? (
                    <div className='flex justify-between'>
                      <p className='text-black '>
                        Ghế: {selectedSeats.join(', ')} {selectedSeats.length > 0 ? `x${selectedSeats.length}` : ''}
                      </p>
                      <p className='text-black font-thin '>
                        {formatCurrency(defaultTicketPrice * selectedSeats.length)}
                      </p>
                    </div>
                  ) : (
                    ''
                  )}
                  {orders.map((order) => {
                    const snacks = snack.find((item) => item.Id === order.snackId)
                    return (
                      <div key={order.snackId} className='flex justify-between'>
                        <span className='text-black'>
                          {snacks?.Name} x{order.quantity}
                        </span>
                        <span className='text-black font-thin'>
                          {formatCurrency(order.quantity * Number(snacks?.Price))}{' '}
                        </span>
                      </div>
                    )
                  })}

                  <div className='border-t mt-2 pt-2 flex justify-between'>
                    <h3 className='text-black font-semibold'>Tổng tiền:</h3>
                    <p className='text-black'>{formatCurrency(calculateTotal() + resultTicket)} </p>
                  </div>
                </div>
              </div>
              <p className='text-black font-light mt-2'>{`${selectedDate} - ${selectedRoom}`}</p>
              <p className='text-black font-light mt-2'>Suất: {selectedHours}</p>
            </>
          )}

          {data && (
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
          )}
        </div>
      </div>
    </div>
  )
}
