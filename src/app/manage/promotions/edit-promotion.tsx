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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { UpdatePromotionBody, UpdatePromotionBodyType } from '@/schemaValidations/promotion.schema'
import { useGetPromotion, useUpdatePromotionMutation } from '@/queries/usePromotion'
import { toast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEventListQuery } from '@/queries/useEvent'

export default function EditPromotion({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const form = useForm<UpdatePromotionBodyType>({
    resolver: zodResolver(UpdatePromotionBody),
    defaultValues: {
      Code: '',
      DateFrom: undefined,
      DateTo: undefined,
      Value: 0,
      IdEvent: ''
    }
  })

  const { data } = useGetPromotion({
    id: id as number,
    enabled: Boolean(id)
  })
  const updatePromotionMutation = useUpdatePromotionMutation()
  const eventListQuery = useEventListQuery()
  const result = eventListQuery.data?.payload.data.data || []
  const reset = () => {
    form.reset()
    setId(undefined)
  }

  useEffect(() => {
    if (data) {
      const { Code, DateFrom, DateTo, Value, IdEvent } = data.payload.data
      form.reset({
        Code,
        DateFrom,
        DateTo,
        Value: Value,
        IdEvent
      })
    }
  }, [data, form])

  const onSubmit = async (values: UpdatePromotionBodyType) => {
    let body: UpdatePromotionBodyType & { id: number } = {
      id: id as number,
      ...values
    }
    try {
      await updatePromotionMutation.mutateAsync(body)
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
          <DialogTitle>Cập nhập khuyến mãi</DialogTitle>
          <DialogDescription>Nhập các trường cần cập nhật</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-promotion-form'
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
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
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
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
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
                              {result.map((event) => (
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
          <Button type='submit' form='edit-promotion-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
