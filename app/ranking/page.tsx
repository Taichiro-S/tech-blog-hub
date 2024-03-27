import { columns } from './columns'
import { DataTable } from './data-table'
import { supabase } from '@/utils/supabase'
import { Publication } from '@/utils/types'

export const revalidate = 0

async function fetchPublications() {
  const { data: publications } = await supabase
    .from('publications')
    .select('*')
    .not('total_liked_count', 'is', null)
    .order('total_liked_count', { ascending: false })
  return publications as Publication[]
}

export default async function Page() {
  const publications = await fetchPublications()
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={publications} />
    </div>
  )
}
