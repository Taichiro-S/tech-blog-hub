import { supabase } from '@/utils/supabase'

async function fetchTopics(pubId: string) {
  const { data: userIds } = await supabase
    .from('publications_users')
    .select('user_id')
    .eq('publication_id', pubId)

  if (!userIds) return []

  const { data: articleIds } = await supabase
    .from('articles')
    .select('id')
    .in(
      'user_id',
      userIds.map((u) => u.user_id),
    )

  if (!articleIds) return []

  const { data: topicIds } = await supabase
    .from('articles_topics')
    .select('topic_id')
    .in('article_id', articleIds)

  if (!topicIds) return []

  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .in(
      'id',
      topicIds.map((t) => t.topic_id),
    )
  return topics
}
