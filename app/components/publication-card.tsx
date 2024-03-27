import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Publication } from '@/utils/types'
import Link from 'next/link'

export default async function PublicationCard(publication: Publication) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link prefetch={false} href={`/publications/${publication.name}`}>
            {publication.display_name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {publication.total_liked_count} いいね
          {publication.total_article_count} 記事
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
