import { supabase } from './supabase.js'

export async function insertTopics(newTopics) {
  console.log('Inserting topics')
  for (const topic of newTopics) {
    const { data: insertedTopic, error } = await supabase.from('topics').upsert(
      [
        {
          name: topic.name,
          display_name: topic.display_name,
          taggings_count: topic.taggings_count,
          image_url: topic.image_url,
        },
      ],
      { onConflict: ['name'] },
    )

    if (error) {
      console.error('Error inserting topic:', error)
      return
    }
  }
}

// export async function insertTopics(newTopics) {
//   console.log('Inserting topics')
//   const names = newTopics.map((pm) => pm.name)
//   const displayNames = newTopics.map((pm) => pm.display_name)
//   const taggingsCounts = newTopics.map((pm) => pm.taggings_counts)
//   const imageUrls = newTopics.map((pm) => pm.image_urls)

//   const { data, error } = await supabase.rpc('update_topics', {
//     names: names,
//     display_names: displayNames,
//     taggings_counts: taggingsCounts,
//     image_urls: imageUrls,
//   })

//   if (error) {
//     console.error('Error inserting topic:', error)
//     return
//   }
// }
