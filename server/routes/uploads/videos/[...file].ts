import { createReadStream, existsSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const filename = event.context.params?.file
  if (!filename) throw createError({ statusCode: 400 })

  const filePath = join(process.cwd(), 'public/uploads/videos', filename)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404 })
  }

  setHeader(event, 'Content-Type', 'video/mp4')
  
  return sendStream(event, createReadStream(filePath))
})