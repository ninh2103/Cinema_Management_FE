'use client'

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/auto-pagination'
import { CinemaroomListResType, CinemaroomSchemaType } from '@/schemaValidations/room.schema'
import EditRoom from '@/app/manage/rooms/edit-room'
import AddRoom from '@/app/manage/rooms/add-room'
import { useDeleteRoomMutation, useRoomListQuery } from '@/queries/useRoom'
import { Switch } from '@/components/ui/switch'
import { TypeCinemaRoom } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

type RoomItem = CinemaroomListResType['data']['data'][0]

const RoomTableContext = createContext<{
  setRoomIdEdit: (value: number) => void
  roomIdEdit: number | undefined
  roomDelete: RoomItem | null
  setRoomDelete: (value: RoomItem | null) => void
}>({
  setRoomIdEdit: (value: number | undefined) => {},
  roomIdEdit: undefined,
  roomDelete: null,
  setRoomDelete: (value: RoomItem | null) => {}
})

export const columns: ColumnDef<CinemaroomSchemaType>[] = [
  {
    id: 'index',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div> // Hiển thị số thứ tự (bắt đầu từ 1)
  },
  {
    accessorKey: 'Name',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Name')}</div>
  },
  {
    accessorKey: 'Block',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const value = Number(row.getValue('Block'))
      return (
        <div className='flex items-center space-x-2'>
          {value === 1 ? <Switch checked={false} disabled /> : <Switch checked={true} disabled />}
        </div>
      )
    }
  },
  {
    accessorKey: 'Type',
    header: 'Loại phòng',
    cell: ({ row }) => {
      const value = row.getValue('Type')

      let typeText = ''
      switch (value) {
        case TypeCinemaRoom.Standard:
          typeText = 'Phòng chuẩn'
          break
        case TypeCinemaRoom.VIP:
          typeText = 'Phòng VIP'
          break
        case TypeCinemaRoom.IMAX:
          typeText = 'Phòng IMAX'
          break
        default:
          typeText = 'Không xác định'
          break
      }

      return (
        <div className='flex items-center space-x-2'>
          <span>{typeText}</span>
        </div>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setRoomIdEdit, setRoomDelete } = useContext(RoomTableContext)
      const openEditRoom = () => {
        setRoomIdEdit(row.original.Id)
      }

      const openDeleteRoom = () => {
        setRoomDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditRoom}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteRoom}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteRoom({
  roomDelete,
  setRoomDelete
}: {
  roomDelete: RoomItem | null
  setRoomDelete: (value: RoomItem | null) => void
}) {
  const { mutateAsync } = useDeleteRoomMutation()
  const deleteRoom = async () => {
    if (roomDelete) {
      try {
        const result = await mutateAsync(roomDelete.Id)
        setRoomDelete(null)
        toast({
          title: 'xóa phòng thành công'
        })
      } catch (error) {
        error
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(roomDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRoomDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{roomDelete?.Name}</span> sẽ
            bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRoom}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function RoomTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [roomIdEdit, setRoomIdEdit] = useState<number | undefined>()
  const [roomDelete, setRoomDelete] = useState<RoomItem | null>(null)
  const roomListQuery = useRoomListQuery()
  const data = roomListQuery.data?.payload.data.data || []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <RoomTableContext.Provider value={{ roomIdEdit, setRoomIdEdit, roomDelete, setRoomDelete }}>
      <div className='w-full'>
        <EditRoom id={roomIdEdit} setId={setRoomIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteRoom roomDelete={roomDelete} setRoomDelete={setRoomDelete} />
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <AddRoom />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1 '>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/accounts'
            />
          </div>
        </div>
      </div>
    </RoomTableContext.Provider>
  )
}
