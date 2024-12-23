import React from 'react'

export default function SeatSelection() {
  const rows = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)) // Hàng A -> L
  const columns = Array.from({ length: 12 }, (_, i) => i + 1) // Số 1 -> 12

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
                  .map((col) => (
                    <button
                      key={`${row}-${col}`}
                      className='w-8 h-8 rounded border text-black border-gray-400 text-center hover:bg-orange-500 hover:text-white transition'
                    >
                      {col}
                    </button>
                  ))}

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
  )
}
