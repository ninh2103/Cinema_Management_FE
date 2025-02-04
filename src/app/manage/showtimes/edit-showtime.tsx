'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { UpdateShowtimeBody, UpdateShowtimeBodyType } from '@/schemaValidations/showtime.schema'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetShowtime, useUpdateShowtimeMutation } from '@/queries/useShowtime'
import { useMovieListQuery } from '@/queries/useMovie'
import { useRoomListQuery } from '@/queries/useRoom'
import { toast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'

export default function EditShowtime({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const UpdateShowtimeMutation = useUpdateShowtimeMutation()
  const movieListQuery = useMovieListQuery()
  const roomListQuery = useRoomListQuery()

  const data2 = movieListQuery.data?.payload.data.data || []
  const data1 = roomListQuery.data?.payload.data.data || []

  const { data } = useGetShowtime({
    id: id as number,
    enabled: Boolean(id)
  })

  const form = useForm<UpdateShowtimeBodyType>({
    resolver: zodResolver(UpdateShowtimeBody),
    defaultValues: {
      Closed: undefined,
      Date: undefined,
      IdFilm: '',
      IdRoom: '',
      TimeEnd: '',
      TimeStart: ''
    }
  })

  useEffect(() => {
    if (data) {
      const { Date, IdRoom, IdFilm, TimeEnd, TimeStart, Closed } = data.payload.data
      form.reset({
        Closed,
        IdFilm,
        IdRoom,
        TimeEnd,
        TimeStart,
        Date
      })
    }
  }, [data, form])

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: UpdateShowtimeBodyType) => {
    let body: UpdateShowtimeBodyType & { id: number } = {
      id: id as number,
      ...values
    }
    try {
      await UpdateShowtimeMutation.mutateAsync(body)
      toast({
        description: 'cập nhật khuyến mãi thành công'
      })
      reset()
      onSubmitSuccess && onSubmitSuccess()
    } catch (error) {
      toast({
        description: 'Lỗi cập nhật thông tin người dùng. Vui lòng thử lại.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) setId(undefined)
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật suất chiếu</DialogTitle>
          <DialogDescription>Nhập các trường cần cập nhật</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-showtime-form'
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
                      <FormLabel>Ngày</FormLabel>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          type='date'
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </div>
                    </div>
                    <FormMessage />
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
                              {data2.map((movie) => (
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

              <FormField
                control={form.control}
                name='Closed'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='Block'>Trạng thái</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        {/* Switch Component */}
                        <Switch
                          checked={field.value === 0}
                          onCheckedChange={(checked) => field.onChange(checked ? 0 : 1)}
                        />
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
          <Button type='submit' form='edit-showtime-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
