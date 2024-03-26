import { insertPublicationNames } from './update_publication_names.js'

async function main() {
  await insertPublicationNames()
  // 他の同期的に実行したい関数をここに追加
}

main().catch(console.error)
