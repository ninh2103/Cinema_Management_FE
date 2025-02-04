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
import { Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UpdateMovieBody, UpdateMovieBodyType } from '@/schemaValidations/movie.schema'

export default function EditTicket({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<UpdateMovieBodyType>({
    resolver: zodResolver(UpdateMovieBody),
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
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) setId(undefined)
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật phim</DialogTitle>
          <DialogDescription>Nhập các trường cần cập nhật</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log('Form data:', data)
              onSubmitSuccess?.()
            })}
            noValidate
            className='grid auto-rows-max gap-6'
            id='edit-movie-form'
          >
            {/* Ảnh đại diện */}
            <FormField
              control={form.control}
              name='Photo'
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-4 items-center'>
                    <Avatar className='w-[100px] h-[100px] rounded-md object-cover'>
                      <AvatarImage src={previewAvatarFromFile} />
                      <AvatarFallback className='rounded-none'>Ảnh</AvatarFallback>
                    </Avatar>
                    <Input
                      type='file'
                      accept='image/*'
                      ref={avatarInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setFile(file)
                          field.onChange('http://localhost:3000/' + file.name)
                        }
                      }}
                      className='hidden'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => avatarInputRef.current?.click()}
                      className='flex items-center gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Upload ảnh
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            {/* Các trường nhập liệu */}
            {[
              { label: 'Tên (EN)', name: 'NameEN', placeholder: 'Tên tiếng Anh' },
              { label: 'Tên (VN)', name: 'NameVN', placeholder: 'Tên tiếng Việt' },
              { label: 'Đạo diễn', name: 'Directors', placeholder: 'Tên đạo diễn' },
              { label: 'Diễn viên', name: 'Cast', placeholder: 'Danh sách diễn viên' },
              { label: 'Thời lượng', name: 'Time', placeholder: 'Thời lượng (phút)', type: 'number' },
              { label: 'Trailer', name: 'Trailer', placeholder: 'URL Trailer' },
              { label: 'Giới hạn tuổi', name: 'AgeLimit', placeholder: 'Giới hạn tuổi' }
            ].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof UpdateMovieBodyType}
                render={({ field: fieldProps }) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof UpdateMovieBodyType}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label>{field.label}</Label>
                          <div className='col-span-3'>
                            <Input
                              type={field.type || 'text'}
                              placeholder={field.placeholder}
                              value={
                                fieldProps.value instanceof Date
                                  ? fieldProps.value.toISOString().split('T')[0] // Chuyển Date thành chuỗi định dạng YYYY-MM-DD
                                  : fieldProps.value || ''
                              } // Nếu không phải Date thì giữ nguyên giá trị
                              onChange={fieldProps.onChange}
                              onBlur={fieldProps.onBlur}
                            />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              />
            ))}

            {/* Ngày khởi chiếu */}
            <FormField
              control={form.control}
              name='Premiere'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label>Ngày khởi chiếu</Label>
                    <div className='col-span-3'>
                      <Input
                        type='date'
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='edit-movie-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
