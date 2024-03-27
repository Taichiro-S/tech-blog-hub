import { supabase } from './supabase.js'

export async function insertArticlesTopics(newTopics) {
  console.log('Inserting articles_topics')
  for (const topic of newTopics) {
    const { data: articleData } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', topic.slug)
      .single()

    if (!articleData) {
      console.error(`Article not found: ${article.slug}`)
      continue
    }

    const { data: topicData } = await supabase
      .from('topics')
      .select('id')
      .eq('name', topic.name)
      .single()

    if (!topicData) {
      console.error(`Topic not found: ${topic.name}`)
      continue
    }

    // 重複チェックを行う
    const { data: existingData, error: selectError } = await supabase
      .from('articles_topics')
      .select('*')
      .eq('article_id', articleData.id)
      .eq('topic_id', topicData.id)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Error checking for duplicate: ${selectError.message}`)
      continue
    }

    if (!existingData) {
      const { error } = await supabase.from('articles_topics').insert([
        {
          article_id: articleData.id,
          topic_id: topicData.id,
        },
      ])

      if (error) {
        console.error(`Error inserting row: ${error.message}`)
        return
      }
    }
  }
  console.log('Inserted articles_topics')
}
