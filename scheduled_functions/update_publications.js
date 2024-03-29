import { supabase } from './supabase.js'

// const { supabase } = require('./supabase.js')

// module.exports = { updatePublications }

export async function updatePublications(publicationsMetadatas) {
  console.log('Updating publications')

  const names = publicationsMetadatas.map((pm) => pm.name)
  const numIds = publicationsMetadatas.map((pm) => pm.num_id)
  const displayNames = publicationsMetadatas.map((pm) => pm.display_name)
  const avatarSmallUrls = publicationsMetadatas.map((pm) => pm.avatar_small_url)
  const totalLikedCounts = publicationsMetadatas.map(
    (pm) => pm.total_liked_count,
  )
  const totalArticleCounts = publicationsMetadatas.map(
    (pm) => pm.total_article_count,
  )

  const { data, error } = await supabase.rpc('update_publications', {
    names: names,
    num_ids: numIds,
    display_names: displayNames,
    avatar_small_urls: avatarSmallUrls,
    total_liked_counts: totalLikedCounts,
    total_article_counts: totalArticleCounts,
  })

  if (error) {
    console.error('Error updating publications:', error)
  }
}
