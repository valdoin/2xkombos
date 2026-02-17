import { writeFile, readFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'No data' })

  const uploadDir = join(process.cwd(), 'public/uploads/videos')
  const dataDir = join(process.cwd(), 'server/data')
  const jsonPath = join(dataDir, 'combos.json')

  await mkdir(uploadDir, { recursive: true })

  const data: any = {}
  let newVideoPath = null

  for (const field of formData) {
    if (field.name === 'file' && field.filename) {
      const filename = `${Date.now()}-${field.filename}`
      newVideoPath = `/uploads/videos/${filename}`
      await writeFile(join(process.cwd(), 'public', newVideoPath), field.data)
    } else if (field.name) {
      data[field.name] = field.data.toString()
    }
  }

  let currentCombos = []
  try {
    const fileContent = await readFile(jsonPath, 'utf-8')
    currentCombos = JSON.parse(fileContent)
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }

  const index = currentCombos.findIndex((c: any) => c.id == data.id)
  if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Combo not found' })

  const oldCombo = currentCombos[index]

  if (oldCombo.type === 'file' && oldCombo.src.startsWith('/uploads')) {
    if (data.type === 'youtube' || (data.type === 'file' && newVideoPath)) {
      try {
        await unlink(join(process.cwd(), 'public', oldCombo.src))
      } catch (e) {}
    }
  }

  const updatedCombo = {
    ...oldCombo,
    characterId: data.characterId,
    title: data.title,
    damage: Number(data.damage),
    inputs: data.inputs,
    difficulty: data.difficulty,
    type: data.type
  }

  if (data.type === 'youtube') {
    updatedCombo.src = data.youtubeUrl
  } else if (data.type === 'file' && newVideoPath) {
    updatedCombo.src = newVideoPath
  }

  currentCombos[index] = updatedCombo
  await writeFile(jsonPath, JSON.stringify(currentCombos, null, 2))

  return updatedCombo
})