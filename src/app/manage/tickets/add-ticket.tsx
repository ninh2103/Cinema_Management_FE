'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { CreateMovieBody, CreateMovieBodyType } from '@/schemaValidations/movie.schema'

export default function AddTicket() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CreateMovieBodyType>({
    resolver: zodResolver(CreateMovieBody),
    defaultValues: {
      NameEN: '',
      NameVN: '',
      Directors: '',
      Cast: '',
      Premiere: undefined,
      Time: 0,
      Detail: '',
      Trailer: '',
      AgeLimit: '',
      Photo: undefined,
      Background: '',
      Status: '',
      Rating: ''
    }
  })

  const avatar = form.watch('Photo')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Movie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Create Movie</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm phim mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid gap-4 py-4' id='add-movie-form'>
            {/* Photo */}

            {/* Other Fields */}
            {[
              { label: 'Tên phim chính', name: 'NameEN', placeholder: 'Enter main name' },
              { label: 'Tên phim phụ', name: 'NameVN', placeholder: 'Enter sub name' },
              { label: 'Đạo diễn', name: 'Directors', placeholder: 'Enter directors' },
              { label: 'Diễn viên', name: 'Cast', placeholder: 'Enter cast' },
              { label: 'Chi tiết phim', name: 'Detail', placeholder: 'Enter movie details' },
              { label: 'Trailer', name: 'Trailer', placeholder: 'Enter trailer link' },
              { label: 'Giới hạn độ tuổi', name: 'AgeLimit', placeholder: 'Enter age limit' },
              { label: 'Tình trạng phim', name: 'Status', placeholder: 'Enter movie status' },
              { label: 'Xếp hạng', name: 'Rating', placeholder: 'Enter rating' },
              { label: 'Ảnh poster', name: 'Background', placeholder: 'Enter background link' }
            ].map(({ label, name, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof CreateMovieBodyType}
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label>{label}</Label>
                      <Input
                        className='col-span-3'
                        placeholder={placeholder}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ))}
            {/* Premiere */}
            <FormField
              control={form.control}
              name='Premiere'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label>Ngày khởi chiếu</Label>
                    <Input
                      id='premiere'
                      type='date'
                      className='col-span-3 appearance-none border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Ngày khởi chiếu'
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {/* Time */}
            <FormField
              control={form.control}
              name='Time'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label>Thời lượng</Label>
                    <Input type='number' className='col-span-3' placeholder='Enter time in minutes' {...field} />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-movie-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
