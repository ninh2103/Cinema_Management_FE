'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { useAppStore } from '@/components/app-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from '@/hooks/use-toast'

export default function LoginForm() {
  const loginMutation = useLoginMutation()
  const searchParams = useSearchParams()
  const clearToken = searchParams.get('clearTokens')
  const setRole = useAppStore((state) => state.setRole)
  const router = useRouter()
  useEffect(() => {
    if (clearToken) {
      setRole()
    }
  }, [clearToken, setRole])

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      Email: '',
      Password: ''
    }
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isLoading) return
    try {
      const result = await loginMutation.mutateAsync(data)
      const userRole = result.payload.data.user.role.Name

      toast({
        description: result.payload.message
      })

      // Gán role vào store hoặc trạng thái
      setRole(userRole)

      // Điều hướng dựa trên vai trò của người dùng
      // if (userRole === 'Customer') {
      //   router.push('/') // Trang dành cho khách hàng
      // } else if (userRole === 'Employee') {
      //   router.push('/manage/accounts') // Trang dành cho nhân viên
      // } else if (userRole === 'Owner') {
      //   router.push('/manage/dashboard') // Trang dành cho quản lý
      // } else {
      //   toast({
      //     description: 'Role không xác định, vui lòng liên hệ quản trị viên!'
      //   })
      // }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        description: 'Đăng nhập thất bại, vui lòng thử lại!'
      })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
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
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Button variant='outline' className='w-full' type='button'>
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
