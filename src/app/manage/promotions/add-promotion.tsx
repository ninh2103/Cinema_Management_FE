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
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CreatePromotionBody, CreatePromotionBodyType } from '@/schemaValidations/promotion.schema'
import { useAddPromotionMutation } from '@/queries/usePromotion'
import { toast } from '@/hooks/use-toast'
import { useEventListQuery } from '@/queries/useEvent'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AddPromotion() {
  const AddPromotionMutation = useAddPromotionMutation()
  const eventListQuery = useEventListQuery()
  const data = eventListQuery.data?.payload.data.data || []
  const [open, setOpen] = useState(false)

  const form = useForm<CreatePromotionBodyType>({
    resolver: zodResolver(CreatePromotionBody),
    defaultValues: {
      Code: '',
      DateFrom: undefined,
      DateTo: undefined,
      Value: 0,
      IdEvent: ''
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreatePromotionBodyType) => {
    let body = values
    try {
      await AddPromotionMutation.mutateAsync(body)
      toast({
        description: 'thêm khuyến mãi thành công'
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Tạo khuyến mãi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo khuyến mãi</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm khuyến mãi mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-promotion-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='Code'
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
                name='Value'
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
                name='DateFrom'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <div className='col-span-3 w-full space-y-2'>
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
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='DateTo'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <div className='col-span-3 w-full space-y-2'>
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
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='IdEvent'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='IdEvent'>Sự kiện</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn sự kiện' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {data.map((event) => (
                                <SelectItem key={event.Id} value={event.Id}>
                                  {event.Title}
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
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-promotion-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
