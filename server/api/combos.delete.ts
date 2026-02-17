import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'

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
  
  if (comboToDelete && comboToDelete.type === 'file' && comboToDelete.src.startsWith('/uploads')) {
    try {
      const fullPath = join(process.cwd(), 'public', comboToDelete.src)
      await unlink(fullPath)
    } catch (e) {
    }
  }

  const newCombos = currentCombos.filter((c: any) => c.id != body.id)
  await writeFile(jsonPath, JSON.stringify(newCombos, null, 2))

  return { success: true }
})