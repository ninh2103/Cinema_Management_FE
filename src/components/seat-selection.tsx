import React, { useState } from 'react'

export default function SeatSelection() {
  const rows = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)) // Hàng A -> L
  const columns = Array.from({ length: 12 }, (_, i) => i + 1) // Số 1 -> 12

  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([])

  // Xử lý khi người dùng bấm vào ghế
  const handleSeatClick = (seat: string) => {
    setSelectedSeats((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]))
  }

  return (
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

      {/* Danh sách ghế đã chọn */}
      {/* <div className='mt-4 text-black'>
        <h3 className='font-semibold'>Ghế đã chọn:</h3>
        <div className='mt-2'>
          {selectedSeats.length > 0 ? (
            <ul className='list-disc list-inside'>
              {selectedSeats.map((seat) => (
                <li key={seat}>{seat}</li>
              ))}
            </ul>
          ) : (
            <p>Chưa có ghế nào được chọn.</p>
          )}
        </div>
      </div> */}
    </div>
  )
}
