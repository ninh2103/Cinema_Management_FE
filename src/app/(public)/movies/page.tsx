'use client'
import { useMovieListQuery } from '@/queries/useMovie'
import Image from 'next/image'

export default function page() {
  const movieListQuery = useMovieListQuery()
  const movie = movieListQuery.data?.payload.data.data || []
  return (
    <div className='w-full space-y-4 z-50'>
      <div className='border-l border-blue-500 text-lg font-semibold'>Phim đang chiếu</div>
      <div className='p-4 '>
        <div className='grid grid-cols-4 gap-4'>
          {movie.map((movies) => (
            <div key={movies.Id} className='flex flex-col items-center space-y-2 w-[250px]'>
              <div className='relative group w-full h-[330px]'>
                <Image
                  src={`http://localhost:4000/images/movie/${movies.Photo}`}
                  alt={movies.NameEN}
                  width={250}
                  height={330}
                  className='rounded-md object-cover w-full h-full'
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
    </div>
  )
}
