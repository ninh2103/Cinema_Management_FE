'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getRefreshTokenFromLocalStorage } from '@/lib/utils'

export default function RegisterForm() {
  const form = useForm({
    defaultValues: {
      Email: '',
      Gender: '',
      Password: '',
      Birthday: '',
      FullName: ''
    }
  })

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng Kí</CardTitle>
        <CardDescription>Điền thông tin của bạn vào form để đăng kí tài khoản.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='Email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Mật khẩu</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Gender'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='text'>Giới tính</Label>
                      </div>
                      <Input id='password' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Birthday'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='data_of_birth'>Ngày sinh</Label>
                      </div>
                      <Input id='date' type='date' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='FullName'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='name'>Tên</Label>
                      </div>
                      <Input id='text' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng Kí
              </Button>
              <div className='flex'>
                <Link href={`/login`} className='w-1/3 text-center'>
                  Đăng nhập
                </Link>
                <Link href={''} className='w-2/3 text-center'>
                  Đăng nhập bằng Google
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
