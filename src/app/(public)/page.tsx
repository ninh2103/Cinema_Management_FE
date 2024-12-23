import { AlbumArtwork } from '@/components/album-artwork'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { listenNowAlbums, madeForYouAlbums } from '@/lib/albums'
import { CirclePlay, HandCoins, Popcorn } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='w-full space-y-4'>
      <div className='relative'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/paner.jpg'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>Rạp Chiếu Phim Đặc Biệt</h1>
          <p className='text-center text-sm sm:text-base mt-4'>Tận hưởng,trải nghiệm từng khoản khắc</p>
        </div>
      </div>
      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold'>Đa dạng thể loại phim</h2>
        <div className='flex items-center space-x-4'>
          {' '}
          {/* Thêm space-x-4 để tạo khoảng cách ngang */}
          <div className='border-l border-blue-500 text-lg font-semibold'>Phim</div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          {listenNowAlbums.map((album) => (
            <div key={album.name} className='flex flex-col items-center space-y-2 w-[250px]'>
              {/* Vùng chứa ảnh và lớp phủ */}
              <div className='relative group w-full h-[330px]'>
                {/* Ảnh */}
                <Image
                  src={album.cover}
                  alt={album.name}
                  width={250}
                  height={330}
                  className='rounded-md object-cover w-full h-full'
                />

                {/* Lớp phủ mờ */}
                <div className='absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50 rounded-md'></div>

                {/* Nút hiển thị khi hover */}
                <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                  <button className='bg-yellow-100 flex text-black px-4 py-2 rounded-md shadow-md'>
                    <HandCoins className='text-sm mr-1' /> <p className='font-serif'>Mua vé</p>
                  </button>
                  <button className='bg-yellow-100 flex text-black px-4 py-2 rounded-md shadow-md'>
                    <CirclePlay className='text-sm mr-1' /> <p className='font-serif'>Trailer</p>
                  </button>
                </div>
              </div>

              {/* Thông tin bên dưới ảnh */}
              <div className='space-y-1 text-center'>
                <h3 className='font-medium leading-none'>{album.name}</h3>
                <p className='text-xs text-muted-foreground'>{album.artist}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center space-x-4'>
          {' '}
          {/* Thêm space-x-4 để tạo khoảng cách ngang */}
          <div className='border-l border-blue-500 text-lg font-semibold'>Tin khuyến mãi</div>
        </div>
        <div className='relative'>
          <ScrollArea>
            <div className='flex space-x-20 pb-4'>
              {madeForYouAlbums.map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className='w-[150px]'
                  aspectRatio='square'
                  width={150}
                  height={150}
                />
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </section>
    </div>
  )
}
