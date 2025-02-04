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
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useGetRoom, useUpdateRoomMutation } from '@/queries/useRoom'
import { UpdateCinemaroomBody, UpdateCinemaroomBodyType } from '@/schemaValidations/room.schema'
import { toast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TypeCinemaRoom } from '@/lib/utils'

export default function EditRoom({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { data } = useGetRoom({
    id: id as number,
    enabled: Boolean(id)
  })
  const updateRoomMutation = useUpdateRoomMutation()
  const reset = () => {
    form.reset()
    setId(undefined)
  }

  const form = useForm<UpdateCinemaroomBodyType>({
    resolver: zodResolver(UpdateCinemaroomBody),
    defaultValues: {
      Block: undefined,
      Name: '',
      Type: undefined
    }
  })

  useEffect(() => {
    if (data) {
      const { Block, Name, Type } = data.payload.data
      form.reset({
        Block,
        Name,
        Type
      })
    }
  }, [data, form])

  const onSubmit = async (values: UpdateCinemaroomBodyType) => {
    let body: UpdateCinemaroomBodyType & { id: number } = {
      id: id as number,
      ...values
    }
    try {
      await updateRoomMutation.mutateAsync(body)
      toast({
        description: 'cập nhật nhân viên thành công'
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
          <DialogTitle>Cập nhật phim</DialogTitle>
          <DialogDescription>Nhập các trường cần cập nhật</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-room-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
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

              <FormField
                control={form.control}
                name='Type'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='type'>Loại Phòng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value?.toString() || ''}
                        >
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Chọn loại phòng' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={TypeCinemaRoom.Standard.toString()}>Phòng Chuẩn</SelectItem>
                              <SelectItem value={TypeCinemaRoom.VIP.toString()}>Phòng VIP</SelectItem>
                              <SelectItem value={TypeCinemaRoom.IMAX.toString()}>IMAX</SelectItem>
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
                name='Block'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='UserStatus'>Trạng thái</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        {/* Switch Component */}
                        <Switch
                          checked={field.value === 0} // Nếu giá trị là 'Active', bật Switch
                          onCheckedChange={
                            (checked) => field.onChange(checked ? 0 : 1) // Cập nhật giá trị khi thay đổi
                          }
                        />
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
          <Button type='submit' form='edit-room-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
