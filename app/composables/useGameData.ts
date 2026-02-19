export const useGameData = () => {
  const difficultyConfig: Record<string, { label: string, color: string }> = {
    easy: { label: 'Facile', color: '#4CAF50' },
    medium: { label: 'Moyen', color: '#FFC107' },
    hard: { label: 'Difficile', color: '#FF4C4C' }
  }
  const characterAssets: Record<string, { file: string, pos: string }> = {
    ahri: { file: '1024px-Ahri_cs.png', pos: 'center 7%' },
    blitzcrank: { file: '1024px-Blitzcrank_cs.png', pos: 'center 4%' },
    braum: { file: '1024px-Braum_cs.png', pos: 'center 15%' },
    caitlyn: { file: '1024px-Caitlyn_cs.png', pos: 'center 1%' },
    darius: { file: '1024px-Darius_cs.png', pos: 'center 12%' },
    ekko: { file: '800px-Ekko_cs.png', pos: 'center 10%' },
    illaoi: { file: '800px-Illaoi_cs.png', pos: 'center 13%' },
    jinx: { file: '800px-Jinx_cs.png', pos: 'center 15%' },
    teemo: { file: '1024px-Teemo_cs.png', pos: 'center 55%' },
    vi: { file: '800px-Vi_cs.png', pos: 'center 8%' },
    warwick: { file: '1024px-Warwick_cs.png', pos: 'center 29%' },
    yasuo: { file: '800px-Yasuo_cs.png', pos: 'center 18%' },
  }

  const characters = Object.keys(characterAssets).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1)
  }))

  const getCharData = (charId: string) => {
    if (!charId) return { url: '', pos: 'center' }
    const data = characterAssets[charId.toLowerCase()]
    return data
      ? { url: `/characters/${data.file}`, pos: data.pos }
      : { url: '', pos: 'center' }
  }

  const getCharImage = (charId: string) => {
    const data = getCharData(charId)
    return data.url
  }

  const getDifficultyInfo = (diffKey?: string) => {
    return difficultyConfig[diffKey || ''] || { label: 'Inconnu', color: '#9E9E9E' }
  }

  return {
    characterAssets,
    characters,
    difficultyConfig,
    getCharData,
    getCharImage,
    getDifficultyInfo
  }
}