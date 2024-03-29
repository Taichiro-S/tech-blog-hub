// import dotenv from 'dotenv'
// dotenv.config()
// import { createClient } from '@supabase/supabase-js'

const dotenv = require('dotenv')
dotenv.config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// export { supabase }
module.exports = { supabase }
