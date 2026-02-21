import { createReadStream, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler((event) => {
  const paramFile = event.context.params?.file
  if (!paramFile) throw createError({ statusCode: 400 })

  const filename = decodeURIComponent(paramFile)
  const filePath = join(process.cwd(), 'uploads/videos', filename)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404 })
  }

  const stat = statSync(filePath)
  const fileSize = stat.size
  const range = getRequestHeader(event, 'range')

  setHeader(event, 'Accept-Ranges', 'bytes')
  setHeader(event, 'Content-Type', 'video/mp4')

  if (typeof range === 'string') {
    const parts = range.replace(/bytes=/, '').split('-')
    const startStr = parts[0] || '0'
    const endStr = parts[1]
    const start = parseInt(startStr, 10)
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = createReadStream(filePath, { start, end })
    
    setResponseStatus(event, 206)
    setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
    setHeader(event, 'Content-Length', chunksize)
    
    return sendStream(event, file)
  }

  setHeader(event, 'Content-Length', fileSize)
  return sendStream(event, createReadStream(filePath))
})