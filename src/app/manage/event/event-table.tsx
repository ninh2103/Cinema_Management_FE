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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EventListResType, EventSchemaType } from '@/schemaValidations/event.schema'
import { useDeleteEventMutation, useEventListQuery } from '@/queries/useEvent'
import EditEvent from '@/app/manage/event/edit-event'
import AddEvent from '@/app/manage/event/add-event'
import { toast } from '@/hooks/use-toast'

type EventItem = EventListResType['data']['data'][0]

const EventTableContext = createContext<{
  setEventIdEdit: (value: number) => void
  eventIdEdit: number | undefined
  eventDelete: EventItem | null
  setEventDelete: (value: EventItem | null) => void
}>({
  setEventIdEdit: (value: number | undefined) => {},
  eventIdEdit: undefined,
  eventDelete: null,
  setEventDelete: (value: EventItem | null) => {}
})

export const columns: ColumnDef<EventSchemaType>[] = [
  {
    id: 'index',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div> // Hiển thị số thứ tự (bắt đầu từ 1)
  },
  {
    accessorKey: 'Photo',
    header: 'Ảnh',
    cell: ({ row }) => {
      const serverUrl = 'http://localhost:4000/images/movie/'
      const photoName = row.getValue('Photo')
      const fullPhotoUrl = `${serverUrl}${photoName}`

      return (
        <div>
          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md overflow-hidden'>
            {/* Hiển thị ảnh */}
            <AvatarImage src={fullPhotoUrl} alt={row.original.Photo} />
            {/* Nội dung fallback nếu ảnh không hiển thị */}
            <AvatarFallback className='rounded-none'>{row.original.Title}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  {
    accessorKey: 'Title',
    header: 'Tiêu đề sự kiện',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Title')}</div>
  },

  {
    accessorKey: 'Content',
    header: 'Nội dung sự kiện',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Content')}</div>
  },
  {
    accessorKey: 'Author',
    header: 'Tác giả',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Author')}</div>
  },
  {
    accessorKey: 'Time',
    header: 'Ngày',
    cell: ({ row }) => (
      <div className='capitalize'>
        {new Date(row.getValue('Time')).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </div>
    )
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEventIdEdit, setEventDelete } = useContext(EventTableContext)
      const openEditEvent = () => {
        setEventIdEdit(row.original.Id)
      }

      const openDeleteEvent = () => {
        setEventDelete(row.original)
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
            <DropdownMenuItem onClick={openEditEvent}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteEvent}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteEvent({
  eventDelete,
  setEventDelete
}: {
  eventDelete: EventItem | null
  setEventDelete: (value: EventItem | null) => void
}) {
  const { mutateAsync } = useDeleteEventMutation()
  const deleteEvent = async () => {
    if (eventDelete) {
      try {
        const result = await mutateAsync(eventDelete.Id)
        setEventDelete(null)
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
      open={Boolean(eventDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEventDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{eventDelete?.Id}</span> sẽ
            bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteEvent}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function EventTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [eventIdEdit, setEventIdEdit] = useState<number | undefined>()
  const [eventDelete, setEventDelete] = useState<EventItem | null>(null)
  const eventListQuery = useEventListQuery()
  const data = eventListQuery.data?.payload.data.data || []
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
    <EventTableContext.Provider value={{ eventIdEdit, setEventIdEdit, eventDelete, setEventDelete }}>
      <div className='w-full'>
        <EditEvent id={eventIdEdit} setId={setEventIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteEvent eventDelete={eventDelete} setEventDelete={setEventDelete} />
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <AddEvent />
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
    </EventTableContext.Provider>
  )
}
