'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { create } from 'zustand'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
// const AppContext = createContext({
//   isAuth: false,
//   role: undefined as RoleType | undefined,
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket?: Socket | undefined) => {},
//   disConectSocket: () => {},
// });
type AppStoreType = {
  isAuth: boolean
  role: RoleType | undefined
  setRole: (role?: RoleType) => void
}

export const useAppStore = create<AppStoreType>()((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType) => {
    set({ role, isAuth: Boolean(role) })
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }
}))

// export const useAppContext = () => {
//   return useContext(AppContext);
// };
export default function AppProvider({ children }: { children: React.ReactNode }) {
  // const [socket, setSocket] = useState<Socket | undefined>();
  // const [role, setRoleState] = useState<RoleType | undefined>();
  const setRole = useAppStore((state) => state.setRole)

  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage()
      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRole(role)
      }
    }
    count.current++
  }, [setRole])
  // const setRole = useCallback((role?: RoleType | undefined) => {
  //   setRoleState(role);
  //   if (!role) {
  //     removeTokensFromLocalStorage();
  //   }
  // }, []);

  // const disConectSocket = useCallback(() => {
  //   socket?.disconnect();
  //   setSocket(undefined);
  // }, [socket, setSocket]);
  // const isAuth = Boolean(role);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
