const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')
const xml2js = require('xml2js')
const zlib = require('zlib')
const util = require('util')

const gunzipAsync = util.promisify(zlib.gunzip)

// SupabaseのプロジェクトURLとAPIキーを設定

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertPublicationNames() {
  try {
    const publicationUrl = 'https://zenn.dev/sitemaps/publication1.xml.gz'
    // サイトマップから企業名のリストを取得
    const response = await axios.get(publicationUrl, {
      responseType: 'arraybuffer',
    })
    const gzippedData = response.data
    const xmlData = await gunzipAsync(gzippedData)
    const xmlString = xmlData.toString()
    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(xmlString)
    const urls = result.urlset.url.map((u) => u.loc[0])
    const publicationNames = urls.map((url) => url.split('/').pop())

    for (const publicationName of publicationNames) {
      let { data: publicationData, error: publicationError } = await supabase
        .from('publications')
        .upsert(
          [
            {
              name: publicationName,
            },
          ],
          { onConflict: ['name'] },
        )

      if (publicationError) {
        console.error(
          'Error inserting publication_names:',
          publicationError.message,
          publicationError.status,
        )
        return
      }
    }
  } catch (error) {
    console.error('ERROR:', error)
  }

  console.log('Data insertion completed.')
}

async function upsertPublications() {
  try {
    for (const [publicationName, articles] of Object.entries(publications)) {
      if (articles.length > 0) {
        const publication = articles[0].publication
        let { data: publicationData, error: publicationError } = await supabase
          .from('publications')
          .upsert(
            [
              {
                name: publication.name,
                num_id: publication.id,
                display_name: publication.display_name,
                avatar_small_url: publication.avatar_small_url,
              },
            ],
            { onConflict: ['name'] },
          )

        if (publicationError) {
          console.error(
            'Error inserting publication_names:',
            publicationError.message,
            publicationError.status,
          )
          return
        }
        console.log('Inserted publication_names:', publicationName)
      }
    }
  } catch (error) {
    console.error('ERROR:', error)
  }

  console.log('Data insertion completed.')
}

// ユーザーデータをSupabaseに挿入する関数
async function insertUsers() {
  for (const [publicationName, articles] of Object.entries(publications)) {
    for (const article of articles) {
      const user = article.user
      // ユーザーを挿入
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
      }
    }
  }
}

// 記事データをSupabaseに挿入する関数
async function insertArticles() {
  for (const [publicationName, articles] of Object.entries(publications)) {
    for (const article of articles) {
      // ユーザーIDと出版物IDを取得
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
      } else {
        console.log('Inserted article:', article.slug)
      }
    }
  }
}

async function insertTopics() {
  for (const [publicationName, articles] of Object.entries(publications)) {
    for (const article of articles) {
      for (const topic of article.topics) {
        const { data: insertedTopic, error } = await supabase
          .from('topics')
          .upsert(
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
        } else {
          console.log('Inserted topic:', topic.name)
        }
      }
    }
  }
}

async function insertArticlesTopics() {
  for (const [publicationName, articles] of Object.entries(publications)) {
    for (const article of articles) {
      const { data: articleData } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .single()

      if (!articleData) {
        console.error(`Article not found: ${article.slug}`)
        continue
      }

      for (const topic of article.topics) {
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('name', topic.name)
          .single()

        if (!topicData) {
          console.error(`Topic not found: ${topic.name}`)
          continue
        }

        const { error } = await supabase.from('articles_topics').insert([
          {
            article_id: articleData.id,
            topic_id: topicData.id,
          },
        ])

        if (error) {
          console.error('Error inserting article_topic:', error)
        } else {
          console.log(
            `Inserted article_topic: Article ${articleData.id} - Topic ${topicData.id}`,
          )
        }
      }
    }
  }
}

async function insertPublicationsUsers() {
  for (const [publicationName, articles] of Object.entries(publications)) {
    for (const article of articles) {
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

        console.log(`Inserted data: ${publicationData.id} - ${userData.id}`)

        if (error) {
          console.error(`Error inserting row: ${error.message}`)
        }
      } else {
        console.log(
          `Duplicate found for ${publicationData.id} - ${userData.id}. Skipping insertion.`,
        )
      }
    }
  }
}

insertPublicationsUsers()
