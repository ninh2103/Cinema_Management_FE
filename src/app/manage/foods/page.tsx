import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Suspense } from 'react'
import MovieTable from '@/app/manage/movies/movie-table'
import DishTable from '@/app/manage/foods/food-table'

export default function Dashboard() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Đồ ăn</CardTitle>
            <CardDescription>Quản lý thức ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <DishTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
