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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreateSnackBody, CreateSnackBodyType } from '@/schemaValidations/snack.schema'
import { useAddSnackMutation } from '@/queries/useFood'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { toast } from '@/hooks/use-toast'

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const AddFoodMutation = useAddSnackMutation()
  const [open, setOpen] = useState(false)
  const uploadMediaMutation = useUploadMediaMutation()

  const form = useForm<CreateSnackBodyType>({
    resolver: zodResolver(CreateSnackBody),
    defaultValues: {
      Name: '',
      Photo: undefined,
      Price: 0,
      Type: ''
    }
  })

  const avatar = form.watch('Photo')
  const name = form.watch('Name')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])
  const reset = () => {
    form.reset()
    setFile(null)
  }
  const onSubmit = async (values: CreateSnackBodyType) => {
    let body = values
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
      await AddFoodMutation.mutateAsync(body)
      toast({
        description: 'thêm món ăn  thành công'
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo món ăn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Create món ăn</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm món mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-food-form'
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
                        <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
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
                name='Type'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Loại</Label>
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
                name='Price'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='price'>Giá</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='price'
                          className='w-full'
                          {...field}
                          value={field.value || ''} // Đảm bảo giá trị ban đầu không undefined
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) // Ép kiểu số
                            field.onChange(isNaN(value) ? 0 : value) // Xử lý nếu giá trị không hợp lệ
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='Name'
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-food-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
