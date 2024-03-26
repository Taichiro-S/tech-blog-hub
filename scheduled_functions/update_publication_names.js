import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import xml2js from 'xml2js'
import { promisify } from 'util'
import { gunzip } from 'zlib'

const gunzipAsync = promisify(gunzip)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export async function insertPublicationNames() {
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

    for (const publicationName of publicationNames) {
      let { data: publicationData, error: publicationError } = await supabase
        .from('publications')
        .upsert([{ name: publicationName }], { onConflict: ['name'] })

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
