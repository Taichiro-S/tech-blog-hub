import { admin } from '../firebaseConfig'
import PublicationCard from './components/publication-card'

async function getPublications() {
  const db = admin.firestore()
  const snapshot = await db.collection('publication_names').get()
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    // Convert Firestore Timestamps to ISO strings (or another serializable format)
    if (data.updatedAt?.toDate) {
      // Check if `updatedAt` exists and is a Timestamp
      data.updatedAt = data.updatedAt.toDate().toISOString()
    }
    return data
  })
}

async function fetchPubsRanking() {
  const db = admin.firestore()
  const snapshot = await db
    .collection('publication_articles')
    .orderBy('likes', 'desc')
    .limit(10)
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    if (data.updatedAt?.toDate) {
      data.updatedAt = data.updatedAt.toDate().toISOString()
    }
    return data
  })
}

export default async function Page() {
  const publications = await fetchPubsRanking()
  console.log(publications)
  return (
    <div>
      <h1>Publications</h1>
      {publications.map((publication) => (
        <PublicationCard key={publication.name} publication={publication} />
      ))}
    </div>
  )
}
