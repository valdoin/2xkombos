export const useCombos = () => {
  const combos = useState<any[]>('combos', () => [])

  const loadCombos = async () => {
    try {
      const data = await $fetch('/api/combos')
      combos.value = data as any[]
    } catch (e) {
      console.error(e)
    }
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const id = (match && match[2] && match[2].length === 11) ? match[2] : null
    return id ? `https://www.youtube.com/embed/${id}` : ''
  }

  const addCombo = async (comboData: any) => {
    const fd = new FormData()
    fd.append('characterId', comboData.characterId)
    fd.append('title', comboData.title)
    fd.append('damage', comboData.damage)
    fd.append('inputs', comboData.inputs)
    fd.append('type', comboData.type)
    fd.append('difficulty', comboData.difficulty)

    if (comboData.type === 'youtube') {
      fd.append('youtubeUrl', getEmbedUrl(comboData.youtubeUrl))
    } else if (comboData.file) {
      fd.append('file', comboData.file)
    }

    try {
      const response = await $fetch('/api/combos', {
        method: 'POST',
        body: fd
      })
      combos.value.push(response)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    combos,
    addCombo,
    loadCombos,
    getCombosByChar: (charId: string) => computed(() => combos.value.filter(c => c.characterId === charId)),
    getComboById: (id: string | number) => computed(() => combos.value.find(c => c.id === Number(id)))
  }
}