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
import { CreateCinemaroomBody, CreateCinemaroomBodyType } from '@/schemaValidations/room.schema'
import { useAddRoomMutation } from '@/queries/useRoom'
import { toast } from '@/hooks/use-toast'

export default function AddRoom() {
  const [open, setOpen] = useState(false)
  const addRoomMutation = useAddRoomMutation()

  const form = useForm<CreateCinemaroomBodyType>({
    resolver: zodResolver(CreateCinemaroomBody),
    defaultValues: {
      Name: ''
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateCinemaroomBodyType) => {
    let body = values
    try {
      await addRoomMutation.mutateAsync(body)
      toast({
        description: 'thêm mới phòng thành công'
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
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>tạo phòng chiếu</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Tạo phòng chiếu</DialogTitle>
          <DialogDescription>Nhập đầy đủ thông tin để thêm phòng chiếu mới</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-room-form'
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
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='add-room-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
