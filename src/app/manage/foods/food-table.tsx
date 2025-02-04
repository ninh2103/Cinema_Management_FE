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
import { SnackListResType, SnackSchemaType } from '@/schemaValidations/snack.schema'
import EditDish from '@/app/manage/foods/edit-food'
import AddDish from '@/app/manage/foods/add-food'
import { useDeleteSnackMutation, useSnackListQuery } from '@/queries/useFood'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

type DishItem = SnackListResType['data']['data'][0]

const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void
  dishIdEdit: number | undefined
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}>({
  setDishIdEdit: (value: number | undefined) => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: (value: DishItem | null) => {}
})

export const columns: ColumnDef<SnackSchemaType>[] = [
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
            <AvatarFallback className='rounded-none'>{row.original.Name}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  {
    accessorKey: 'Name',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Name')}</div>
  },
  {
    accessorKey: 'Price',
    header: 'Giá',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Price')}</div>
  },
  {
    accessorKey: 'Block',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const value = Number(row.getValue('Block'))
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
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext)
      const openEditDish = () => {
        setDishIdEdit(row.original.Id)
      }

      const openDeleteDish = () => {
        setDishDelete(row.original)
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
            <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete
}: {
  dishDelete: DishItem | null
  setDishDelete: (value: DishItem | null) => void
}) {
  const { mutateAsync } = useDeleteSnackMutation()
  const deleteDish = async () => {
    if (dishDelete) {
      try {
        const result = await mutateAsync(dishDelete.Id)
        setDishDelete(null)
        toast({
          title: 'xóa món ăn thành công'
        })
      } catch (error) {
        error
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='bg-foreground text-primary-foreground rounded px-1'>{dishDelete?.Name}</span> sẽ
            bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteDish}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function DishTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>()
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null)
  const snackListQuery = useSnackListQuery()
  const data = snackListQuery.data?.payload.data.data || []
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
    <DishTableContext.Provider value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}>
      <div className='w-full'>
        <EditDish id={dishIdEdit} setId={setDishIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteDish dishDelete={dishDelete} setDishDelete={setDishDelete} />
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <AddDish />
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
    </DishTableContext.Provider>
  )
}
