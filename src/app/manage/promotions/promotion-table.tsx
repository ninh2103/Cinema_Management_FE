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
import { PromotionListResType, PromotionSchemaType } from '@/schemaValidations/promotion.schema'
import EditPromotion from '@/app/manage/promotions/edit-promotion'
import AddPromotion from '@/app/manage/promotions/add-promotion'
import { useDeletePromotionMutation, usePromotionListQuery } from '@/queries/usePromotion'
import { toast } from '@/hooks/use-toast'

type PromotionItem = PromotionListResType['data']['data'][0]

const PromotionTableContext = createContext<{
  setPromotionIdEdit: (value: number) => void
  promotionIdEdit: number | undefined
  promotionDelete: PromotionItem | null
  setPromotionDelete: (value: PromotionItem | null) => void
}>({
  setPromotionIdEdit: (value: number | undefined) => {},
  promotionIdEdit: undefined,
  promotionDelete: null,
  setPromotionDelete: (value: PromotionItem | null) => {}
})

export const columns: ColumnDef<PromotionSchemaType>[] = [
  {
    id: 'index',
    header: 'STT',
    cell: ({ row }) => <div>{row.index + 1}</div> // Hiển thị số thứ tự (bắt đầu từ 1)
  },
  {
    accessorKey: 'Value',
    header: 'Giá trị',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Value')}</div>
  },
  {
    accessorKey: 'Code',
    header: 'Mã giảm giá',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Code')}</div>
  },
  {
    header: 'Thời hạn',
    cell: ({ row }) => {
      const startDay = row.original.DateFrom
      const endDay = row.original.DateTo

      // Kiểm tra xem startDay và endDay có tồn tại
      if (!startDay || !endDay) {
        return <div>Chưa xác định</div>
      }

      // Định dạng ngày (nếu cần)
      const formattedStartDay = new Date(startDay).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      const formattedEndDay = new Date(endDay).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      return (
        <div>
          {formattedStartDay} - {formattedEndDay}
        </div>
      )
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setPromotionIdEdit, setPromotionDelete } = useContext(PromotionTableContext)
      const openEditPromotion = () => {
        setPromotionIdEdit(row.original.Id)
      }

      const openDeletePromotion = () => {
        setPromotionDelete(row.original)
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
            <DropdownMenuItem onClick={openEditPromotion}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeletePromotion}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeletePromotion({
  promotionDelete,
  setPromotionDelete
}: {
  promotionDelete: PromotionItem | null
  setPromotionDelete: (value: PromotionItem | null) => void
}) {
  const { mutateAsync } = useDeletePromotionMutation()
  const deletePromotion = async () => {
    if (promotionDelete) {
      try {
        const result = await mutateAsync(promotionDelete.Id)
        setPromotionDelete(null)
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
      open={Boolean(promotionDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPromotionDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{promotionDelete?.Id}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePromotion}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function PromotionTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [promotionIdEdit, setPromotionIdEdit] = useState<number | undefined>()
  const [promotionDelete, setPromotionDelete] = useState<PromotionItem | null>(null)
  const promotionListQuery = usePromotionListQuery()
  const data = promotionListQuery.data?.payload.data.data || []
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
    <PromotionTableContext.Provider
      value={{ promotionIdEdit, setPromotionIdEdit, promotionDelete, setPromotionDelete }}
    >
      <div className='w-full'>
        <EditPromotion id={promotionIdEdit} setId={setPromotionIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeletePromotion promotionDelete={promotionDelete} setPromotionDelete={setPromotionDelete} />
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <AddPromotion />
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
    </PromotionTableContext.Provider>
  )
}
