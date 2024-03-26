import { admin } from '@/firebaseConfig'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Image from 'next/image'

async function fetchTopics(publicationName: string) {
  console.log(publicationName)
  const db = admin.firestore()
  const snapshot = await db
    .collection('publication_topics')
    .where('name', '==', publicationName)
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return data
  })
}

type Publication = {
  name: string
  display_name: string
  likes: number
  articlesCount: number
}

export default async function PublicationCard(publication: Publication) {
  //   const topics = await fetchTopics(publication.name)
  return (
    <Card className=" h-40 w-1/2">
      <CardHeader>
        <CardTitle className="flex">{publication.display_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription></CardDescription>
        <div className="flex">
          {/* <div className="flex flex-col">
            <p>Topics:</p>
            {topics
              .filter((topic) => topic.name === publication.name)
              .map((topic) => (
                <p key={topic.name}>{topic.topic}</p>
              ))}
          </div> */}
        </div>
      </CardContent>
      <CardFooter>
        <p>Likes: {publication.likes}</p>
        <p>Articles: {publication.articlesCount}</p>
      </CardFooter>
    </Card>
  )
}
