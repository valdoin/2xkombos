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
    if (comboData.id) fd.append('id', comboData.id)
    fd.append('characterId', comboData.characterId)
    fd.append('title', comboData.title)
    fd.append('damage', comboData.damage)
    fd.append('inputs', comboData.inputs)
    fd.append('type', comboData.type)
    fd.append('difficulty', comboData.difficulty)

    if (comboData.parentId) fd.append('parentId', comboData.parentId)
    if (comboData.tagCharacterId) fd.append('tagCharacterId', comboData.tagCharacterId)
    if (comboData.tagMechanic) fd.append('tagMechanic', comboData.tagMechanic)

    if (comboData.type === 'youtube') {
      fd.append('youtubeUrl', getEmbedUrl(comboData.youtubeUrl))
    } else if (comboData.file) {
      fd.append('file', comboData.file)
    }

    try {
      const method = comboData.id ? 'PUT' : 'POST'
      const response = await $fetch('/api/combos', {
        method,
        body: fd
      })

      if (method === 'POST') {
        combos.value.push(response)
      } else {
        const index = combos.value.findIndex(c => c.id === response.id)
        if (index !== -1) combos.value[index] = response
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deleteCombo = async (id: number) => {
    try {
      await $fetch('/api/combos', {
        method: 'DELETE',
        body: { id }
      })
      combos.value = combos.value.filter(c => c.id !== id)
    } catch (e) {
      console.error(e)
    }
  }

  const getTagVariations = (parentId: number) => computed(() => 
    combos.value.filter(c => c.parentId === parentId)
  )

  return {
    combos,
    addCombo,
    deleteCombo,
    loadCombos,
    getCombosByChar: (charId: string) => computed(() => combos.value.filter(c => c.characterId === charId && !c.parentId)),
    getComboById: (id: string | number) => computed(() => combos.value.find(c => c.id === Number(id))),
    getTagVariations
  }
}