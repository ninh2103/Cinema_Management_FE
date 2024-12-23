import Image from 'next/image'
import React from 'react'

export const fakeCombos = [
  {
    Slug: 'u22-vui-ve---bap-nuoc-sieu-hat-de',
    Title: 'U22 Vui Vẻ - Bắp Nước Siêu Hạt Dẻ',
    Content: [
      'Cuối 2022, Galaxy Cinema dành tặng các Stars từ 22 tuổi trở xuống một phần quà ưu khủng',
      'Từ 01.11.2022, Galaxy Cinema chính thức ra mắt Combo ưu tiên chỉ dành riêng cho các Stars từ 13 đến 22 tuổi.',
      'Đến Galaxy Cinema, thưởng thức loạt phim hay và mua ngay Combo 1 U22 đủ bắp giòn nước ngọt chỉ từ 49k. Muốn thêm phần nước, hãy chọn Combo 2 U22 chỉ từ 59k.',
      'Và đừng quên, Galaxy Cinema cũng có giá vẻ ưu đãi khủng dành cho các Stars U22 tại ĐÂY!',
      'Lưu ý: Các rạp tại Tp. Hồ Chí Minh, Hà Nội, Hải Phòng, Đà Nẵng thêm 10k mỗi loại Combo. '
    ],
    Photo: ['/event1.jpg', '/event2.jpg'],
    Time: '16/12/2024 - 16/1/2025',
    Condition: [
      'Áp dụng tại tất cả các rạp Galaxy Cinema toàn quốc. Mang theo CMND/CCCD để được nhận ưu đãi.',
      'Áp dụng khi mua trực tiếp tại quầy.',
      'Vui lòng xuất trình đồng thời giấy tờ tùy thân có ngày sinh hoặc vé U22 kèm thông tin thành viên hợp lệ (thẻ thành viên, app) khi mua combo.',
      'Mỗi khách hàng mua tối đa 01 Combo 1/ Combo 2 U22 mỗi lần.'
    ]
  }
]

export default function Page() {
  return (
    <div className='w-full space-y-6'>
      <div className='border-l-4 border-blue-500 pl-4 text-lg font-semibold'>Chi tiết sự kiện</div>
      <hr className='my-4 border-t border-gray-300 w-full' />
      {fakeCombos.map((data, index) => (
        <div key={index} className='space-y-4'>
          <h2 className='font-light text-xl'>{data.Title}</h2>
          <div className='space-y-2'>
            {data.Content.map((content, idx) => (
              <p key={idx} className='text-sm font-thin'>
                {content}
              </p>
            ))}
          </div>
          <div className='flex justify-center mt-4'>
            <div className='relative group w-1/3 h-[600px]'>
              <Image
                src={data.Photo[0]}
                alt={data.Slug}
                width={250}
                height={330}
                className='rounded-md object-cover w-full h-full cursor-pointer'
              />
            </div>
          </div>
          <p>{data.Content[4]}</p>
          <div className='flex justify-center mt-4'>
            <div className='relative group w-1/3 h-[600px]'>
              <Image
                src={data.Photo[1]}
                alt={data.Slug}
                width={250}
                height={330}
                className='rounded-md object-cover w-full h-full cursor-pointer'
              />
            </div>
          </div>
          {/* Điều kiện áp dụng */}
          {data.Condition && (
            <div className='mt-4 p-4 rounded-md'>
              Điều kiện áp dụng:
              <ul className='font-thin'>
                <li className='text-sm'>{data.Condition[0]}</li>
                <li className='text-sm'>{data.Condition[1]}</li>
                <li className='text-sm'>{data.Condition[2]}</li>
                <li className='text-sm'>{data.Condition[3]}</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
