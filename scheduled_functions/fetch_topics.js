import axios from 'axios'
import { sleep } from './utils.js'

// const axios = require('axios')
// const { sleep } = require('./utils.js')

// module.exports = { fetchNewTopics }

export async function fetchNewTopics(newArticles) {
  let req = 0
  console.log('Fetching topics')
  const newTopics = []
  for (const article of newArticles) {
    console.log('Fetching topics from:', article.slug)
    const url = `https://zenn.dev/api/articles/${article.slug}`
    const response = await axios.get(url)
    req++
    // await sleep(1000)
    const topics = response.data.article.topics
    for (const topic of topics) {
      topic['slug'] = article.slug
    }
    newTopics.push(...topics)
  }
  console.log('Total requests:', req)
  console.log('Total topics:', newTopics.length)
  return newTopics
}
