// import { supabase } from './supabase.js'

const { supabase } = require('./supabase.js')

module.exports = { insertTopics }

async function insertTopics(newTopics) {
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
