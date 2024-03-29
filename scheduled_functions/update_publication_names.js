// import axios from 'axios'
// import xml2js from 'xml2js'
// import { promisify } from 'util'
// import { gunzip } from 'zlib'
// import { supabase } from './supabase.js'

// const gunzipAsync = promisify(gunzip)

const axios = require('axios')
const xml2js = require('xml2js')
const util = require('util')
const zlib = require('zlib')
const supabase = require('./supabase.js')

const gunzipAsync = util.promisify(zlib.gunzip)

module.exports = { insertPublicationNames }

async function insertPublicationNames() {
  console.log('Fetching publication names')
  try {
    const publicationUrl = 'https://zenn.dev/sitemaps/publication1.xml.gz'
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

    console.log(`fetched ${publicationNames.length} publication names`)

    const { data, err } = await supabase.from('publications').select('name')

    if (err) {
      console.error('Error fetching publication_names:', err.message)
      return
    }

    if (data.length === publicationNames.length) {
      console.log('No new publication names found.')
      return data.map((d) => d.name)
    }

    const newPublicationsNames = publicationNames.filter(
      (publicationName) => !data.some((d) => d.name === publicationName),
    )

    console.log(`found ${newPublicationsNames.length} new publication names`)
    console.log('Inserting publication names')

    for (const publicationName of newPublicationsNames) {
      let { data: publicationData, error: publicationError } = await supabase
        .from('publications')
        .insert([{ name: publicationName }])
        .select('name')

      if (publicationError) {
        console.error(
          'Error inserting publication_names:',
          publicationError.message,
        )
      }
    }
    console.log('Updated publication names.')
    return publicationNames
  } catch (error) {
    console.error('ERROR:', error)
  }
}
