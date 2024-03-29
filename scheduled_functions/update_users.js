import { supabase } from './supabase.js'

// const { supabase } = require('./supabase.js')

// module.exports = { insertUsers }
export async function insertUsers(newArticles) {
  console.log('Inserting users')
  for (const article of newArticles) {
    const user = article.user
    const { data: insertedUser, error } = await supabase.from('users').upsert(
      [
        {
          num_id: user.id,
          name: user.username,
          display_name: user.name,
          avatar_small_url: user.avatar_small_url,
        },
      ],
      { onConflict: ['num_id'] },
    )

    if (error) {
      console.error('Error inserting user:', error)
      return
    }
  }
}
