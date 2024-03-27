import type { Database } from '@/database.types'

export type Publication = Database['public']['Tables']['publications']['Row']
export type Topic = Database['public']['Tables']['topics']['Row']
export type PubWithTopics = Publication & {
  topics: Topic[]
}
