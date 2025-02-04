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
import { MovieListResType, MovieSchemaType } from '@/schemaValidations/movie.schema'
import AddMovie from '@/app/manage/movies/add-movie'
import EditMovie from '@/app/manage/movies/edit-movie'
import { useDeleteMovieMutation, useMovieListQuery } from '@/queries/useMovie'
import { toast } from '@/hooks/use-toast'

type MovieItem = MovieListResType['data']['data'][0]

const MovieTableContext = createContext<{
  setMovieIdEdit: (value: number) => void
  movieIdEdit: number | undefined
  movieDelete: MovieItem | null
  setMovieDelete: (value: MovieItem | null) => void
}>({
  setMovieIdEdit: (value: number | undefined) => {},
  movieIdEdit: undefined,
  movieDelete: null,
  setMovieDelete: (value: MovieItem | null) => {}
})

export const columns: ColumnDef<MovieSchemaType>[] = [
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
            <AvatarImage src={fullPhotoUrl} alt={row.original.NameVN} />
            {/* Nội dung fallback nếu ảnh không hiển thị */}
            <AvatarFallback className='rounded-none'>{row.original.NameVN}</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },

  {
    accessorKey: 'NameVN',
    header: 'Tên phim',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('NameVN')}</div>
  },
  {
    accessorKey: 'Directors',
    header: 'Đạo diễn',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Directors')}</div>
  },
  {
    accessorKey: 'Detail',
    header: 'Chi tiết phim',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Detail')}</div>
  },
  {
    accessorKey: 'Status',
    header: 'Trạng thái',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('Status')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setMovieIdEdit, setMovieDelete } = useContext(MovieTableContext)
      const openEditMovie = () => {
        setMovieIdEdit(row.original.Id)
      }

      const openDeleteMovie = () => {
        setMovieDelete(row.original)
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
            <DropdownMenuItem onClick={openEditMovie}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteMovie}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteMovie({
  movieDelete,
  setMovieDelete
}: {
  movieDelete: MovieItem | null
  setMovieDelete: (value: MovieItem | null) => void
}) {
  const { mutateAsync } = useDeleteMovieMutation()
  const deleteMovie = async () => {
    if (movieDelete) {
      try {
        const result = await mutateAsync(movieDelete.Id)
        setMovieDelete(null)
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
      open={Boolean(movieDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setMovieDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa phim?</AlertDialogTitle>
          <AlertDialogDescription>
            Phim <span className='bg-foreground text-primary-foreground rounded px-1'>{movieDelete?.NameVN}</span> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteMovie}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function MovieTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [movieIdEdit, setMovieIdEdit] = useState<number | undefined>()
  const [movieDelete, setMovieDelete] = useState<MovieItem | null>(null)
  const movieMutation = useMovieListQuery()
  const data = movieMutation.data?.payload.data.data || []
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
    <MovieTableContext.Provider value={{ movieIdEdit, setMovieIdEdit, movieDelete, setMovieDelete }}>
      <div className='w-full'>
        <EditMovie id={movieIdEdit} setId={setMovieIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteMovie movieDelete={movieDelete} setMovieDelete={setMovieDelete} />
        <div className='flex items-center py-4'>
          {/* <Input
            placeholder='Filter emails...'
            value={(table.getColumn('Rating')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('Rating')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          /> */}
          <div className='ml-auto flex items-center gap-2'>
            <AddMovie />
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
    </MovieTableContext.Provider>
  )
}
