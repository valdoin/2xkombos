import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'

async function deleteVideo(src: string) {
  if (!src) return

  let fullPath = ''

  if (src.startsWith('/uploads/videos/')) {
    fullPath = join(process.cwd(), 'public', src)
  } else if (src.startsWith('/videos/')) {
    fullPath = join(process.cwd(), 'uploads', src)
  }

  if (fullPath) {
    try {
      await unlink(fullPath)
    } catch (e) {}
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  const jsonPath = join(process.cwd(), 'server/data/combos.json')
  
  let currentCombos = []
  try {
    const fileContent = await readFile(jsonPath, 'utf-8')
    currentCombos = JSON.parse(fileContent)
  } catch (e) {
    return { success: false }
  }

  const comboToDelete = currentCombos.find((c: any) => c.id == body.id)
  const variantsToDelete = currentCombos.filter((c: any) => c.parentId == body.id)

  if (comboToDelete && comboToDelete.type === 'file') {
    await deleteVideo(comboToDelete.src)
  }

  for (const variant of variantsToDelete) {
    if (variant.type === 'file') {
      await deleteVideo(variant.src)
    }
  }

  const newCombos = currentCombos.filter((c: any) => c.id != body.id && c.parentId != body.id)
  await writeFile(jsonPath, JSON.stringify(newCombos, null, 2))

  return { success: true }
})