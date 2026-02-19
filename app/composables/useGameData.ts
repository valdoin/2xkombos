export const useGameData = () => {
  const difficultyConfig: Record<string, { label: string, color: string }> = {
    easy: { label: 'Facile', color: '#4CAF50' },
    medium: { label: 'Moyen', color: '#FFC107' },
    hard: { label: 'Difficile', color: '#FF4C4C' }
  }

  const characterData: Record<string, { file: string; pos: string; role: string }> = {
    ahri: { file: '1024px-Ahri_cs.png', pos: 'center 7%', role: 'Rushdown' },
    blitzcrank: { file: '1024px-Blitzcrank_cs.png', pos: 'center 4%', role: 'Grappler' },
    braum: { file: '1024px-Braum_cs.png', pos: 'center 15%', role: 'Bruiser' },
    caitlyn: { file: '1024px-Caitlyn_cs.png', pos: 'center 1%', role: 'Zoner' },
    darius: { file: '1024px-Darius_cs.png', pos: 'center 12%', role: 'All Rounder' },
    ekko: { file: '800px-Ekko_cs.png', pos: 'center 10%', role: 'Mixup' },
    illaoi: { file: '800px-Illaoi_cs.png', pos: 'center 13%', role: 'Bruiser' },
    jinx: { file: '800px-Jinx_cs.png', pos: 'center 15%', role: 'Zoner' },
    teemo: { file: '1024px-Teemo_cs.png', pos: 'center 55%', role: 'Trap' },
    vi: { file: '800px-Vi_cs.png', pos: 'center 8%', role: 'Rushdown' },
    warwick: { file: '1024px-Warwick_cs.png', pos: 'center 29%', role: 'Rushdown' },
    yasuo: { file: '800px-Yasuo_cs.png', pos: 'center 18%', role: 'All Rounder' },
  }

  const getCharacters = () => Object.entries(characterData).map(([id, data]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    image: `/characters/${data.file}`,
    role: data.role
  }))

  const getCharData = (charId: string) => {
    if (!charId) return { url: '', pos: 'center' }
    const data = characterData[charId.toLowerCase()]
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
    characterData,
    characters: getCharacters(),
    difficultyConfig,
    getCharData,
    getCharImage,
    getDifficultyInfo
  }
}