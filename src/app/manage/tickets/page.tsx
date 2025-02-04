import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Suspense } from 'react'
import MovieTable from '@/app/manage/movies/movie-table'
import TicketTable from '@/app/manage/tickets/ticket-table'

export default function Dashboard() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Vé</CardTitle>
            <CardDescription>Quản lý Vé</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <TicketTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
