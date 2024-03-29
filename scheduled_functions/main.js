import { insertPublicationNames } from './update_publication_names.js'
import { insertUsers } from './update_users.js'
import { insertTopics } from './update_topics.js'
import { insertArticles, updateArticle } from './update_articles.js'
import { insertPublicationsUsers } from './update_publications_users.js'
import { insertArticlesTopics } from './update_articles_topics.js'
import {
  fetchOldZennPubArticles,
  fetchAllZennPubArticles,
} from './fetch_articles.js'
import { fetchNewTopics } from './fetch_topics.js'
import { updatePublications } from './update_publications.js'

// const { insertPublicationNames } = require('./update_publication_names.js')
// const { insertUsers } = require('./update_users.js')
// const { insertTopics } = require('./update_topics.js')
// const { insertArticles, updateArticle } = require('./update_articles.js')
// const { insertPublicationsUsers } = require('./update_publications_users.js')
// const { insertArticlesTopics } = require('./update_articles_topics.js')
// const {
//   fetchOldZennPubArticles,
//   fetchAllZennPubArticles,
// } = require('./fetch_articles.js')
// const { fetchNewTopics } = require('./fetch_topics.js')
// const { updatePublications } = require('./update_publications.js')

export async function main() {
  const start = new Date()
  const publicationNames = await insertPublicationNames()
  const oldArticleSlugs = await fetchOldZennPubArticles()
  const { allArticles, publicationMetaDatas } =
    await fetchAllZennPubArticles(publicationNames)

  const newArticles = allArticles.filter(
    (article) => !oldArticleSlugs.includes(article.slug),
  )
  console.log('New articles:', newArticles.length)
  const newTopics = await fetchNewTopics(newArticles)
  await updatePublications(publicationMetaDatas)
  await insertUsers(newArticles)
  await insertTopics(newTopics)
  await insertArticles(newArticles)
  await updateArticle(allArticles)
  await insertPublicationsUsers(newArticles)
  await insertArticlesTopics(newTopics)

  const end = new Date()

  // 処理にかかった時間を分単位で表示
  const elapsed = (end - start) / 1000 / 60
  console.log('Elapsed time:', elapsed)
}

main().catch(console.error)
