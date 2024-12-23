import { listenNowAlbums } from '@/lib/albums'
import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div className='w-full space-y-4 z-50'>
      <div className='border-l border-blue-500 text-lg font-semibold'>Phim đang chiếu</div>
      <div className='p-4 bg-gray-50'>
        <div className='grid grid-cols-4 gap-4'>
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
    </div>
  )
}
