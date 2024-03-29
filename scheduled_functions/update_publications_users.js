// import { supabase } from './supabase.js'
const { supabase } = require('./supabase.js')

module.exports = { insertPublicationsUsers }

async function insertPublicationsUsers(newArticles) {
  console.log('Inserting publications_users')
  for (const article of newArticles) {
    const { data: publicationData } = await supabase
      .from('publications')
      .select('id')
      .eq('name', article.publication.name)
      .single()

    if (!publicationData) {
      console.error(`Article not found: ${article.slug}`)
      continue
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('name', article.user.username)
      .single()

    if (!userData) {
      console.error(`User not found: ${article.user.username}`)
      continue
    }

    // 重複チェックを行う
    const { data: existingData, error: selectError } = await supabase
      .from('publications_users')
      .select('*')
      .eq('publication_id', publicationData.id)
      .eq('user_id', userData.id)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Error checking for duplicate: ${selectError.message}`)
      continue
    }

    if (!existingData) {
      const { error } = await supabase.from('publications_users').insert([
        {
          publication_id: publicationData.id,
          user_id: userData.id,
        },
      ])

      if (error) {
        console.error(`Error inserting row: ${error.message}`)
      }
    }
  }
  console.log('Inserted publications_users')
}
