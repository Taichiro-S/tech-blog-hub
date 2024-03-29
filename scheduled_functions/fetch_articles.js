import axios from 'axios'
import { supabase } from './supabase.js'
import { sleep } from './utils.js'
// const axios = require('axios')
// const { supabase } = require('./supabase.js')
// const { sleep } = require('./utils.js')

// module.exports = { fetchAllZennPubArticles, fetchOldZennPubArticles }

export async function fetchAllZennPubArticles(publicationNames) {
  console.log('Fetching articles')
  const allArticles = []
  const publicationMetaDatas = []
  let req = 0
  for (const publicationName of publicationNames) {
    console.log('Fetching articles from:', publicationName)
    let total_liked_count = 0
    let total_article_count = 0
    let page = 1
    let hasNext = true
    while (hasNext) {
      const articlesUrl = `https://zenn.dev/api/articles?order=latest&publication_name=${publicationName}&count=100&page=${page}`
      const response = await axios.get(articlesUrl)
      // await sleep(1000)
      req++
      const articles = response.data.articles
      if (articles.length === 0) {
        console.error('Articles not found')
        break
      }
      const publication = articles[0].publication
      if (!publication || publication.name !== publicationName) {
        console.error('Publication not found')
        break
      }
      hasNext = !!response.data.next_page
      allArticles.push(...articles)
      total_article_count += articles.length
      for (const article of articles) {
        total_liked_count += article.liked_count
      }
      if (hasNext) {
        page++
      } else {
        publicationMetaDatas.push({
          name: publicationName,
          display_name: articles[0].publication.display_name,
          avatar_small_url: articles[0].publication.avatar_small_url,
          num_id: articles[0].publication.id,
          total_liked_count,
          total_article_count,
        })
      }
    }
  }
  console.log('Total requests:', req)
  console.log('Total articles:', allArticles.length)
  return { allArticles, publicationMetaDatas }
}

export async function fetchOldZennPubArticles() {
  let startIndex = 0
  const limit = 1000
  let slugs = []
  while (true) {
    let { data, err } = await supabase
      .from('articles')
      .select('slug')
      .range(startIndex, startIndex + limit - 1)
    if (err) {
      console.error('Error fetching articles:', err.message)
      return
    }
    slugs = slugs.concat(data.map((item) => item.slug))
    if (data.length < limit) {
      break
    }
    startIndex += limit
  }
  return slugs
}
