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
import { ShowtimeListResType, ShowtimeSchemaType } from '@/schemaValidations/showtime.schema'
import EditShowtime from '@/app/manage/showtimes/edit-showtime'
import AddShowtime from '@/app/manage/showtimes/add-showtime'
import { useDeleteShowtimeMutation, useShowtimeListQuery } from '@/queries/useShowtime'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

type ShowtimeItem = ShowtimeListResType['data']['data'][0]

const ShowtimeTableContext = createContext<{
  setShowtimeIdEdit: (value: number) => void
  showtimeIdEdit: number | undefined
  showtimeDelete: ShowtimeItem | null
  setShowtimeDelete: (value: ShowtimeItem | null) => void
}>({
  setShowtimeIdEdit: (value: number | undefined) => {},
  showtimeIdEdit: undefined,
  showtimeDelete: null,
  setShowtimeDelete: (value: ShowtimeItem | null) => {}
})

export const columns: ColumnDef<ShowtimeSchemaType>[] = [
  {
    id: 'index',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div> // Hiển thị số thứ tự (bắt đầu từ 1)
  },

  {
    accessorKey: 'Date',
    header: 'Ngày',
    cell: ({ row }) => (
      <div className='capitalize'>
        {new Date(row.getValue('Date')).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </div>
    )
  },
  {
    header: 'Suất chiếu',
    cell: ({ row }) => {
      const TimeStart = row.original.TimeStart // Ví dụ: "12:00"
      const TimeEnd = row.original.TimeEnd // Ví dụ: "14:00"

      return (
        <div>
          {TimeStart} - {TimeEnd}
        </div>
      )
    }
  },

  {
    accessorKey: 'Closed',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const value = Number(row.getValue('Closed'))
      return (
        <div className='flex items-center space-x-2'>
          {value === 0 ? <Switch checked={true} disabled /> : <Switch checked={false} disabled />}
        </div>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setShowtimeIdEdit, setShowtimeDelete } = useContext(ShowtimeTableContext)
      const openEditShowtime = () => {
        setShowtimeIdEdit(row.original.Id)
      }

      const openDeleteShowtime = () => {
        setShowtimeDelete(row.original)
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
            <DropdownMenuItem onClick={openEditShowtime}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteShowtime}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteShowtime({
  showtimeDelete,
  setShowtimeDelete
}: {
  showtimeDelete: ShowtimeItem | null
  setShowtimeDelete: (value: ShowtimeItem | null) => void
}) {
  const { mutateAsync } = useDeleteShowtimeMutation()
  const deleteShowtime = async () => {
    if (showtimeDelete) {
      try {
        const result = await mutateAsync(showtimeDelete.Id)
        setShowtimeDelete(null)
        toast({
          title: result.payload.message
        })
      } catch (error) {
        error
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(showtimeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setShowtimeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{showtimeDelete?.Id}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteShowtime}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function ShowtimeTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [showtimeIdEdit, setShowtimeIdEdit] = useState<number | undefined>()
  const [showtimeDelete, setShowtimeDelete] = useState<ShowtimeItem | null>(null)
  const showtimeListQuery = useShowtimeListQuery()
  const data = showtimeListQuery.data?.payload.data.data || []
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
    <ShowtimeTableContext.Provider value={{ showtimeIdEdit, setShowtimeIdEdit, showtimeDelete, setShowtimeDelete }}>
      <div className='w-full'>
        <EditShowtime id={showtimeIdEdit} setId={setShowtimeIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteShowtime showtimeDelete={showtimeDelete} setShowtimeDelete={setShowtimeDelete} />
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <AddShowtime />
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
    </ShowtimeTableContext.Provider>
  )
}
