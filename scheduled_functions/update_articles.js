import { supabase } from './supabase.js'
// const { supabase } = require('./supabase.js')

// module.exports = { insertArticles }
export async function insertArticles(newArticles) {
  console.log('Inserting new articles')
  for (const article of newArticles) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('name', article.user.username)
      .single()

    if (!userData) {
      console.error('User or publication not found')
      continue
    }

    const { data: insertedArticle, error } = await supabase
      .from('articles')
      .upsert(
        [
          {
            post_type: article.post_type,
            title: article.title,
            slug: article.slug,
            liked_count: article.liked_count,
            body_letters_count: article.body_letters_count,
            emoji: article.emoji,
            published_at: article.published_at,
            path: article.path,
            user_id: userData.id,
          },
        ],
        { onConflict: ['slug'] },
      )

    if (error) {
      console.error('Error inserting article:', error)
    }
  }
}

export async function updateArticle(allArticles) {
  console.log(`Updating ${allArticles.length} articles`)
  const slugs = allArticles.map((article) => article.slug)
  const likedCounts = allArticles.map((article) => article.liked_count)
  const { data, error } = await supabase.rpc('update_articles', {
    slugs: slugs,
    liked_counts: likedCounts,
  })
  if (error) {
    console.error('Error updating articles:', error)
    return
  }
}
