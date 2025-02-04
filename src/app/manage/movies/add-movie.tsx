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
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CreateMovieBody, CreateMovieBodyType } from '@/schemaValidations/movie.schema'
import { useAddMovieMutation } from '@/queries/useMovie'
import { useUploadMediaMutation, useUploadVideoMutation } from '@/queries/useMedia'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AddMovie() {
  const AddMovieMutation = useAddMovieMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const uploadVideoMutation = useUploadVideoMutation()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)

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
      Photo: '',
      Status: '',
      Rating: ''
    }
  })

  const reset = () => {
    form.reset()
    setPhotoFile(null)
    setVideoFile(null)
  }

  // Giả sử bạn đã có các biến tệp được chọn từ form, như: photoFile, backgroundFile, trailerFile
  const photo = form.watch('Photo')
  const trailer = form.watch('Trailer')

  const previewPhotoFromFile = useMemo(() => {
    return photoFile ? URL.createObjectURL(photoFile) : photo
  }, [photoFile, photo])

  const previewVideoFromFile = useMemo(() => {
    return videoFile ? URL.createObjectURL(videoFile) : trailer
  }, [videoFile, trailer])

  const uploadFile = async (
    file: File,
    folderType: string,
    mutation: typeof uploadMediaMutation | typeof uploadVideoMutation
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await mutation.mutateAsync({ formData, folderType })
    return response.payload.data.fileName
  }

  const onSubmit = async (values: CreateMovieBodyType) => {
    let body = values
    try {
      // Upload Photo
      if (photoFile) {
        const imageUrl = await uploadFile(photoFile, 'movie', uploadMediaMutation)
        body = { ...body, Photo: imageUrl }
        form.setValue('Photo', imageUrl)
      }

      if (videoFile) {
        const videoUrl = await uploadFile(videoFile, 'movie', uploadVideoMutation)
        body = { ...body, Trailer: videoUrl }
        form.setValue('Trailer', videoUrl)
      }

      await AddMovieMutation.mutateAsync(body)
      toast({ description: 'Thêm phim thành công' })
      reset()
      setOpen(false)
    } catch (error) {
      console.error('lỗi:', error)
      toast({ description: 'Thêm phim thất bại.', variant: 'destructive' })
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo phim</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[800px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Thêm phim</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm phim mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid grid-cols-1 sm:grid-cols-2 gap-4 py-4'
            id='add-movie-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => {})}
          >
            {/* NameEN Input */}
            <FormField
              control={form.control}
              name='NameEN'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phim (EN)</FormLabel>
                  <Input placeholder='Enter English movie name' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* NameVN Input */}
            <FormField
              control={form.control}
              name='NameVN'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phim (VN)</FormLabel>
                  <Input placeholder='Enter Vietnamese movie name' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Directors Input */}
            <FormField
              control={form.control}
              name='Directors'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đạo diễn</FormLabel>
                  <Input placeholder='Enter directors' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Cast Input */}
            <FormField
              control={form.control}
              name='Cast'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diễn viên</FormLabel>
                  <Input placeholder='Enter cast' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Premiere Input */}
            <FormField
              control={form.control}
              name='Premiere'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày chiếu</FormLabel>
                  <Input
                    type='date'
                    {...field}
                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const selectedDate = e.target.value
                      // Chuyển giá trị chuỗi thành Date nếu cần
                      field.onChange(new Date(selectedDate))
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Input */}
            <FormField
              control={form.control}
              name='Time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng phim </FormLabel>
                  <Input
                    type='number'
                    placeholder='Enter duration'
                    {...field}
                    value={field.value || ''} // Đảm bảo value là kiểu number hoặc string (chuỗi rỗng nếu không có giá trị)
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? '' : Number(value)) // Chuyển đổi giá trị thành number, hoặc để trống nếu không có input
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AgeLimit Input */}
            <FormField
              control={form.control}
              name='AgeLimit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Độ tuổi</FormLabel>
                  <Input placeholder='Enter age limit' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Rating Input */}
            <FormField
              control={form.control}
              name='Rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xếp hạng</FormLabel>
                  <Input placeholder='Enter rating' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Status Input */}
            <FormField
              control={form.control}
              name='Status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Input placeholder='Enter movie status' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Detail Input */}
            <FormField
              control={form.control}
              name='Detail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi tiết phim</FormLabel>
                  <Input placeholder='Enter movie details' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='Photo'
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-start justify-start'>
                    <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                      <AvatarImage src={previewPhotoFromFile} />
                      <AvatarFallback className='rounded-none'>{'Logo'}</AvatarFallback>
                    </Avatar>
                    <Input
                      type='file'
                      accept='image/*'
                      ref={photoInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) {
                          setPhotoFile(selectedFile)
                          form.setValue('Photo', selectedFile.name)
                        }
                      }}
                      className='hidden'
                    />
                    <button
                      className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                      type='button'
                      onClick={() => photoInputRef.current?.click()}
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
              name='Trailer'
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-start justify-start'>
                    <div className='aspect-square w-[100px] h-[100px]'>
                      <div className='w-full h-full bg-muted rounded-md flex items-center justify-center'>
                        {previewVideoFromFile ? (
                          <video controls className='w-full h-full'>
                            <source src={previewVideoFromFile} type={videoFile?.type || 'video/mp4'} />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                          </video>
                        ) : (
                          <span>Video</span>
                        )}
                      </div>
                    </div>

                    <Input
                      type='file'
                      accept='video/*'
                      ref={videoInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) {
                          setVideoFile(selectedFile)
                          form.setValue('Trailer', selectedFile.name)
                        }
                      }}
                      className='hidden'
                    />
                    <button
                      className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                      type='button'
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Upload className='h-4 w-4 text-muted-foreground' />
                      <span className='sr-only'>Upload</span>
                    </button>
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
