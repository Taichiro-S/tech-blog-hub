import Link from 'next/link'
import { supabase } from '@/utils/supabase'
import { Publication } from '@/utils/types'
import PublicationCard from '@/app/components/publication-card'
async function fetchPublications() {
  const { data: publications } = await supabase
    .from('publications')
    .select('*')
    .not('total_liked_count', 'is', null)
    .order('total_liked_count', { ascending: false })
    .range(0, 10)
  return publications as Publication[]
}

export default async function PublicationsLikedCountRanking() {
  const publications = await fetchPublications()
  if (!publications || publications.length === 0) {
    return <p>データがありません</p>
  }
  return (
    <div className="p-4 ">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        企業ランキング
      </p>
      <ul>
        {publications?.map((publication) => (
          <li key={publication.id} className="my-1 text-base">
            <PublicationCard {...publication} />
          </li>
        ))}
      </ul>
    </div>
  )
}
