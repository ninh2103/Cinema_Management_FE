'use client'
import { useEventListQuery } from '@/queries/useEvent'
import Image from 'next/image'

export default function page() {
  const eventListQuery = useEventListQuery()
  const event = eventListQuery.data?.payload.data.data || []
  return (
    <div className='w-full space-y-4'>
      <div className='border-l border-blue-500 text-lg font-semibold'>Ưu đãi</div>
      <div className=' rounded-lg shadow-sm'>
        <div className='p-4 '>
          <div className='grid grid-cols-6 gap-4'>
            {event.map((events) => (
              <div key={events.Id} className='flex flex-col items-center space-y-2 w-[250px]'>
                <div className='relative group w-full h-[330px]'>
                  <Image
                    src={`http://localhost:4000/images/movie/${events.Photo}`}
                    alt={events.Slug}
                    width={250}
                    height={330}
                    className='rounded-md object-cover w-full h-full cursor-pointer'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50 rounded-md'></div>
                  <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <p className='cursor-pointer'>{events.Title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
