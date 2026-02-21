import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'No data' })

  const data: any = {}
  let videoPath = ''

  const uploadDir = join(process.cwd(), 'uploads/videos')
  const dataDir = join(process.cwd(), 'server/data')
  const jsonPath = join(dataDir, 'combos.json')

  await mkdir(uploadDir, { recursive: true })
  await mkdir(dataDir, { recursive: true })

  for (const field of formData) {
    if (field.name === 'file' && field.filename) {
      const filename = `${Date.now()}-${field.filename.replace(/\s+/g, '-')}`
      videoPath = `/videos/${filename}`
      await writeFile(join(uploadDir, filename), field.data)
    } else if (field.name) {
      data[field.name] = field.data.toString()
    }
  }

  const newCombo = {
    id: Date.now(),
    characterId: data.characterId,
    title: data.title,
    damage: Number(data.damage),
    inputs: data.inputs,
    type: data.type,
    difficulty: data.difficulty,
    src: data.type === 'youtube' ? data.youtubeUrl : videoPath,
    parentId: data.parentId ? Number(data.parentId) : null,
    tagCharacterId: data.tagCharacterId || null,
    tagMechanic: data.tagMechanic || null
  }

  let currentCombos = []
  try {
    const fileContent = await readFile(jsonPath, 'utf-8')
    currentCombos = JSON.parse(fileContent)
  } catch (e) {
    currentCombos = []
  }

  currentCombos.push(newCombo)
  await writeFile(jsonPath, JSON.stringify(currentCombos, null, 2))

  return newCombo
})