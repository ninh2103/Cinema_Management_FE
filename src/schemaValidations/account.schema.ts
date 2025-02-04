import { Role } from '@/constants/type'

import z from 'zod'

// Schema Account theo Prisma
export const AccountSchema = z.object({
  Id: z.number(), // Sử dụng kiểu dữ liệu `number` cho id, phù hợp với Prisma `Int`
  FullName: z.string(), // Tên tài khoản
  Email: z.string().email(), // Email tài khoản
  Role: z.enum([Role.Owner, Role.Employee]), // Vai trò của tài khoản
  Photo: z.string().nullable().optional(), // Avatar có thể null hoặc không có
  Birthday: z.date(),
  Gender: z.string(),
  Phone: z.string().optional(),
  UserStatus: z.string(),
  CreatedAt: z.date(), // Ngày tạo tài khoản
  UpdatedAt: z.date() // Ngày cập nhật tài khoản
})

export type AccountType = z.TypeOf<typeof AccountSchema>

// Phản hồi khi lấy danh sách tài khoản
export const AccountListRes = z.object({
  data: AccountSchema, // Danh sách tài khoản
  message: z.string() // Thông điệp trả về
})

export type AccountResType = z.TypeOf<typeof AccountListRes>

// Phản hồi khi lấy thông tin tài khoản
export const AccountRes = z
  .object({
    data: z.object({
      data: z.array(AccountSchema), // List of movie objects
      meta: z.object({
        totalItems: z.number(),
        currentPage: z.number(),
        itemsPerPage: z.number(),
        totalPages: z.number()
      })
    })
  })
  .strict()

export type AccountListResType = z.TypeOf<typeof AccountRes>

// Schema tạo tài khoản nhân viên mới
export const CreateEmployeeAccountBody = z
  .object({
    FullName: z.string().trim().min(2).max(256), // Tên tài khoản
    Email: z.string().email(), // Email tài khoản
    Photo: z.string().url().optional(), // Avatar (optional)
    Password: z.string().min(6).max(100), // Mật khẩu
    Birthday: z.date(),
    Gender: z.string(),
    Phone: z.string().optional()
  })
  .strict()
// .superRefine(({ confirmPassword, password }, ctx) => {
//   if (confirmPassword !== password) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'Mật khẩu không khớp',
//       path: ['confirmPassword']
//     })
//   }
// })

export type CreateEmployeeAccountBodyType = z.TypeOf<typeof CreateEmployeeAccountBody>

// Schema cập nhật tài khoản nhân viên
export const UpdateEmployeeAccountBody = z
  .object({
    FullName: z.string().trim().min(2).max(256), // Tên tài khoản
    Email: z.string().email(), // Email tài khoản
    Photo: z.string().url().optional(), // Avatar (optional)
    Password: z.string().min(6).max(100).optional(), // Mật khẩu (optional)
    Birthday: z.date(),
    Gender: z.string(),
    Phone: z.string(),
    UserStatus: z.string()
  })
  .strict()
// .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
//   if (changePassword) {
//     if (!password || !confirmPassword) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Hãy nhập mật khẩu mới và xác nhận mật khẩu mới',
//         path: ['changePassword']
//       })
//     } else if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Mật khẩu không khớp',
//         path: ['confirmPassword']
//       })
//     }
//   }
// })

export type UpdateEmployeeAccountBodyType = z.TypeOf<typeof UpdateEmployeeAccountBody>

// Schema cập nhật thông tin của chính mình (Me)
export const UpdateMeBody = z
  .object({
    FullName: z.string().trim().min(2).max(256), // Tên tài khoản
    Photo: z.string().url().optional() // Avatar (optional)
  })
  .strict()

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

// Schema thay đổi mật khẩu
// export const ChangePasswordBody = z
//   .object({
//     oldPassword: z.string().min(6).max(100), // Mật khẩu cũ
//     password: z.string().min(6).max(100), // Mật khẩu mới
//     confirmPassword: z.string().min(6).max(100) // Xác nhận mật khẩu mới
//   })
//   .strict()
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Mật khẩu mới không khớp',
//         path: ['confirmPassword']
//       })
//     }
//   })

// export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const MeSchema = z.object({
  UserId: z.string(), // Sử dụng kiểu dữ liệu `number` cho id, phù hợp với Prisma `Int`
  FullName: z.string(), // Tên tài khoản
  Username: z.string(), // Tên tài khoản
  Role: z.enum([Role.Owner, Role.Employee]), // Vai trò của tài khoản
  Photo: z.string().nullable().optional() // Avatar có thể null hoặc không có
})

export const MeListType = z.object({
  data: z.object({
    data: MeSchema, // Danh sách tài khoản
    message: z.string() // Thông điệp trả về
  })
})

export type MeResType = z.TypeOf<typeof MeListType>
