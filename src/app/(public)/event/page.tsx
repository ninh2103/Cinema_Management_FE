import { listenNowAlbums } from '@/lib/albums'
import Image from 'next/image'

export default function page() {
  return (
    <div className='w-full space-y-4'>
      <div className='border-l border-blue-500 text-lg font-semibold'>Ưu đãi</div>
      <div className='border rounded-lg shadow-sm'>
        <div className='p-4 bg-gray-50'>
          <div className='grid grid-cols-6 gap-4'>
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
                  <div className='absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50 rounded-md'></div>
                  <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <p className='cursor-pointer'>{album.name}</p>
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
