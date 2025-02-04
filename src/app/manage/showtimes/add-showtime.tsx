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
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CreateShowtimeBody, CreateShowtimeBodyType } from '@/schemaValidations/showtime.schema'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAddShowtimeMutation } from '@/queries/useShowtime'
import { useMovieListQuery } from '@/queries/useMovie'
import { useRoomListQuery } from '@/queries/useRoom'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

export default function AddShowtime() {
  const AddShowtimeMutation = useAddShowtimeMutation()
  const movieListQuery = useMovieListQuery()
  const roomListQuery = useRoomListQuery()

  const data = movieListQuery.data?.payload.data.data || []
  const data1 = roomListQuery.data?.payload.data.data || []
  const [open, setOpen] = useState(false)

  const form = useForm<CreateShowtimeBodyType>({
    resolver: zodResolver(CreateShowtimeBody),
    defaultValues: {
      IdFilm: '',
      Date: undefined,
      IdRoom: '',
      TimeEnd: '',
      TimeStart: ''
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateShowtimeBodyType) => {
    let body = values
    try {
      await AddShowtimeMutation.mutateAsync(body)
      toast({
        description: 'thêm suất chiếu thành công'
      })
      reset()
      setOpen(false)
    } catch (error) {
      toast({
        description: 'Lỗi cập nhật thông tin người dùng. Vui lòng thử lại.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog
      onOpenChange={(Value) => {
        if (!Value) {
          reset()
        }
        setOpen(Value)
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo suất chiếu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo suất chiếu</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm suất chiếu mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-showtime-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
              {/* Thời gian bắt đầu */}
              <FormField
                control={form.control}
                name='TimeStart'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='timeStart'>Giờ bắt đầu</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='timeStart' type='time' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Thời gian kết thúc */}
              <FormField
                control={form.control}
                name='TimeEnd'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='timeEnd'>Giờ kết thúc</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='timeEnd' type='time' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Ngày */}
              <FormField
                control={form.control}
                name='Date'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='date'>Ngày</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='date'
                          type='date'
                          className='w-full'
                          {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const selectedDate = e.target.value
                            field.onChange(new Date(selectedDate))
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Sự kiện */}
              <FormField
                control={form.control}
                name='IdFilm'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='event'>Phim</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn phim' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {data.map((movie) => (
                                <SelectItem key={movie.Id} value={String(movie.Id)}>
                                  {movie.NameVN}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='IdRoom'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='event'>Phòng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn phòng' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {data1.map((room) => (
                                <SelectItem key={room.Id} value={String(room.Id)}>
                                  {room.Name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Nút submit */}
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='add-showtime-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
