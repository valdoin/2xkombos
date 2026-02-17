export const useInputData = () => {
  const iconMap: Record<string, string> = {
    '1': '/inputs/2XKO_DownBack_Input_icon.png',
    '2': '/inputs/2XKO_Down_Input_icon.png',
    '3': '/inputs/2XKO_DownForward_Input_icon.png',
    '4': '/inputs/2XKO_Back_Input_icon.png',
    '6': '/inputs/2XKO_Forward_Input_icon.png',
    '7': '/inputs/2XKO_UpBack_Input_icon.png',
    '8': '/inputs/2XKO_Up_Input_icon.png',
    '9': '/inputs/2XKO_UpForward_Input_icon.png',
    'L': '/inputs/2XKO_Light_Input_icon.png',
    'M': '/inputs/2XKO_Medium_Input_icon.png',
    'H': '/inputs/2XKO_Heavy_Input_icon.png',
    'S1': '/inputs/2XKO_S1_Input_icon.png',
    'S2': '/inputs/2XKO_S2_Input_icon.png',
    'T': '/inputs/2XKO_Tag_Input_icon.png',
    'Dash': '/inputs/2XKO_DoubleForward_Input_icon.png',
    'BackDash': '/inputs/2XKO_DoubleBack_Input_icon.png',
    '>': '/inputs/2XKO_Sequence_icon.png'
  }

  const directions = [
    { label: 'DB', value: '1', img: iconMap['1'] },
    { label: 'D', value: '2', img: iconMap['2'] },
    { label: 'DF', value: '3', img: iconMap['3'] },
    { label: 'B', value: '4', img: iconMap['4'] },
    { label: 'F', value: '6', img: iconMap['6'] },
    { label: 'UB', value: '7', img: iconMap['7'] },
    { label: 'U', value: '8', img: iconMap['8'] },
    { label: 'UF', value: '9', img: iconMap['9'] },
  ]

  const attacks = [
    { label: 'L', value: 'L', img: iconMap['L'] },
    { label: 'M', value: 'M', img: iconMap['M'] },
    { label: 'H', value: 'H', img: iconMap['H'] },
    { label: 'S1', value: 'S1', img: iconMap['S1'] },
    { label: 'S2', value: 'S2', img: iconMap['S2'] },
    { label: 'Tag', value: 'T', img: iconMap['T'] },
    { label: 'Sequence', value :'>', img: iconMap['>']}
  ]

  const movements = [
    { label: 'Dash', value: 'Dash', img: iconMap['Dash'] },
    { label: 'BackDash', value: 'BackDash', img: iconMap['BackDash'] },
  ]

  const getInputIcon = (key: string) => iconMap[key] || null

  return { 
    iconMap,
    directions,
    attacks,
    movements,
    getInputIcon
  }
}