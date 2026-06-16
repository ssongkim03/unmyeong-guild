const { Lunar } = require('lunar-javascript')

// 천간
const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
// 지지
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

// 천간 오행
const STEM_ELEMENT: Record<string, string> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth','己': 'earth',
  '庚': 'metal','辛': 'metal',
  '壬': 'water','癸': 'water',
}

// 지지 오행
const BRANCH_ELEMENT: Record<string, string> = {
  '子': 'water', '丑': 'earth',
  '寅': 'wood',  '卯': 'wood',
  '辰': 'earth', '巳': 'fire',
  '午': 'fire',  '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '戌': 'earth', '亥': 'water',
}

// 일간 → 클래스
const DAY_STEM_TO_DAY_MASTER: Record<string, string> = {
  '甲': '甲木', '乙': '乙木',
  '丙': '丙火', '丁': '丁火',
  '戊': '戊土', '己': '己土',
  '庚': '庚金', '辛': '辛金',
  '壬': '壬水', '癸': '癸水',
}

// 시간(시진) → 시지
const HOUR_TO_BRANCH: Record<string, string> = {
  '자시(23~01시)': '子',
  '축시(01~03시)': '丑',
  '인시(03~05시)': '寅',
  '묘시(05~07시)': '卯',
  '진시(07~09시)': '辰',
  '사시(09~11시)': '巳',
  '오시(11~13시)': '午',
  '미시(13~15시)': '未',
  '신시(15~17시)': '申',
  '유시(17~19시)': '酉',
  '술시(19~21시)': '戌',
  '해시(21~23시)': '亥',
}

// 시간 천간 계산 (일간 기준 오자법)
function getHourStem(dayStemIdx: number, hourBranch: string): string {
  const branchIdx = EARTHLY_BRANCHES.indexOf(hourBranch)
  // 자시 기준 시간 천간 시작점 (갑자일 → 갑자시)
  const startStemIdx = ((dayStemIdx % 5) * 2) % 10
  const stemIdx = (startStemIdx + branchIdx) % 10
  return HEAVENLY_STEMS[stemIdx]
}

export type SajuResult = {
  // 사주 8글자
  yearStem: string   // 년간
  yearBranch: string // 년지
  monthStem: string  // 월간
  monthBranch: string // 월지
  dayStem: string    // 일간
  dayBranch: string  // 일지
  hourStem: string | null   // 시간
  hourBranch: string | null // 시지

  // 일주 (일간+일지)
  dayMaster: string  // 예: 甲木

  // 오행 카운트 (8글자 기준)
  elementCount: {
    wood: number
    fire: number
    earth: number
    metal: number
    water: number
  }

  // 오행 스탯 (0~100 정규화)
  stats: {
    wood: number
    fire: number
    earth: number
    metal: number
    water: number
  }

  // 사주 8글자 텍스트
  pillars: string
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hourStr?: string
): SajuResult {
  // 양력 → 음력 변환 후 만세력 계산
  const lunar = Lunar.fromDate(new Date(year, month - 1, day))

  // 년주
  const yearStemIdx = lunar.getYearGanIndex()
  const yearBranchIdx = lunar.getYearZhiIndex()
  const yearStem = HEAVENLY_STEMS[yearStemIdx]
  const yearBranch = EARTHLY_BRANCHES[yearBranchIdx]

  // 월주
  const monthStemIdx = lunar.getMonthGanIndex()
  const monthBranchIdx = lunar.getMonthZhiIndex()
  const monthStem = HEAVENLY_STEMS[monthStemIdx]
  const monthBranch = EARTHLY_BRANCHES[monthBranchIdx]

  // 일주
  const dayStemIdx = lunar.getDayGanIndex()
  const dayBranchIdx = lunar.getDayZhiIndex()
  const dayStem = HEAVENLY_STEMS[dayStemIdx]
  const dayBranch = EARTHLY_BRANCHES[dayBranchIdx]

  // 시주
  let hourStem: string | null = null
  let hourBranch: string | null = null
  if (hourStr && HOUR_TO_BRANCH[hourStr]) {
    hourBranch = HOUR_TO_BRANCH[hourStr]
    hourStem = getHourStem(dayStemIdx, hourBranch)
  }

  // 오행 카운트
  const elementCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  type ElementKey = keyof typeof elementCount

  const allStems = [yearStem, monthStem, dayStem, ...(hourStem ? [hourStem] : [])]
  const allBranches = [yearBranch, monthBranch, dayBranch, ...(hourBranch ? [hourBranch] : [])]

  allStems.forEach(s => {
    const el = STEM_ELEMENT[s] as ElementKey
    if (el) elementCount[el]++
  })
  allBranches.forEach(b => {
    const el = BRANCH_ELEMENT[b] as ElementKey
    if (el) elementCount[el]++
  })

  // 0~100 정규화
  const total = Object.values(elementCount).reduce((a, b) => a + b, 0)
  const stats = {
    wood:  Math.round((elementCount.wood  / total) * 100),
    fire:  Math.round((elementCount.fire  / total) * 100),
    earth: Math.round((elementCount.earth / total) * 100),
    metal: Math.round((elementCount.metal / total) * 100),
    water: Math.round((elementCount.water / total) * 100),
  }

  // 일주 텍스트
  const dayMaster = DAY_STEM_TO_DAY_MASTER[dayStem] ?? `${dayStem}?`

  // 사주 텍스트
  const pillars = hourStem
    ? `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${dayStem}${dayBranch} ${hourStem}${hourBranch}`
    : `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${dayStem}${dayBranch}`

  return {
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem, hourBranch,
    dayMaster,
    elementCount,
    stats,
    pillars,
  }
}