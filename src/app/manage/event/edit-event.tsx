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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'

import { useGetEvent, useUpdateEventMutation } from '@/queries/useEvent'
import { UpdateEventBody, UpdateEventBodyType } from '@/schemaValidations/event.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUploadMediaMutation } from '@/queries/useMedia'

export default function EditEvent({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const form = useForm<UpdateEventBodyType>({
    resolver: zodResolver(UpdateEventBody),
    defaultValues: {
      Author: '',
      Content: '',
      Photo: undefined,
      Slug: '',
      Time: undefined,
      Title: ''
    }
  })

  const { data } = useGetEvent({
    id: id as number,
    enabled: Boolean(id)
  })
  const updateEventMutation = useUpdateEventMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const avatar = form.watch('Photo')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])
  const reset = () => {
    form.reset()
    setFile(null)
    setId(undefined)
  }

  useEffect(() => {
    if (data) {
      const { Author, Content, Time, Slug, Title } = data.payload.data
      form.reset({
        Author,
        Content,
        Slug,
        Time,
        Title,
        Photo: undefined
      })
    }
  }, [data, form])

  const onSubmit = async (values: UpdateEventBodyType) => {
    let body: UpdateEventBodyType & { id: number } = {
      id: id as number,
      ...values
    }
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImage = await uploadMediaMutation.mutateAsync({ formData, folderType: 'movie' })
        const imageUrl = `${uploadImage.payload.data.fileName}`
        body = {
          ...body,
          Photo: imageUrl
        }
        form.setValue('Photo', imageUrl)
      }
      await updateEventMutation.mutateAsync(body)
      toast({
        description: 'cập nhật sự kiện thành công'
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
          <DialogTitle>Cập nhập sự kiện</DialogTitle>
          <DialogDescription>Nhập các trường cần cập nhật</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-event-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='Photo'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className='rounded-none'>{'Photo'}</AvatarFallback>
                      </Avatar>
                      <Input
                        type='file'
                        accept='image/*'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0]
                          if (selectedFile) {
                            setFile(selectedFile)
                            form.setValue('Photo', selectedFile.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Title'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tiêu đề</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='Slug'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tên</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Content'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Nội dung</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='Author'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tác Giả</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='Time'
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
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='edit-event-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
