import { Role, TokenType } from '@/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleType = (typeof Role)[keyof typeof Role]
export interface TokenPayload {
  user_id: string
  verify: number
  token_type: TokenTypeValue
  exp: number
  iat: number
}

export interface TableTokenPayload {
  iat: number
  number: number
  tokenType: (typeof TokenType)['TableToken']
}
