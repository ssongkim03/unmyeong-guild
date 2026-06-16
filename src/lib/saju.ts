const { Lunar } = require('lunar-javascript')

// ============================================================
// 기본 데이터
// ============================================================

export const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

// 천간 오행
export const STEM_ELEMENT: Record<string, string> = {
  '甲':'wood','乙':'wood',
  '丙':'fire','丁':'fire',
  '戊':'earth','己':'earth',
  '庚':'metal','辛':'metal',
  '壬':'water','癸':'water',
}

// 천간 음양
export const STEM_YIN_YANG: Record<string, string> = {
  '甲':'양','乙':'음','丙':'양','丁':'음','戊':'양',
  '己':'음','庚':'양','辛':'음','壬':'양','癸':'음',
}

// 지지 오행
export const BRANCH_ELEMENT: Record<string, string> = {
  '子':'water','丑':'earth','寅':'wood','卯':'wood',
  '辰':'earth','巳':'fire','午':'fire','未':'earth',
  '申':'metal','酉':'metal','戌':'earth','亥':'water',
}

// 지장간 (地藏干) — 지지 안에 숨은 천간
export const HIDDEN_STEMS: Record<string, Array<{ stem: string; ratio: number }>> = {
  '子': [{ stem: '壬', ratio: 0.3 }, { stem: '癸', ratio: 0.7 }],
  '丑': [{ stem: '癸', ratio: 0.3 }, { stem: '辛', ratio: 0.3 }, { stem: '己', ratio: 0.4 }],
  '寅': [{ stem: '戊', ratio: 0.2 }, { stem: '丙', ratio: 0.3 }, { stem: '甲', ratio: 0.5 }],
  '卯': [{ stem: '甲', ratio: 0.3 }, { stem: '乙', ratio: 0.7 }],
  '辰': [{ stem: '乙', ratio: 0.2 }, { stem: '癸', ratio: 0.3 }, { stem: '戊', ratio: 0.5 }],
  '巳': [{ stem: '戊', ratio: 0.2 }, { stem: '庚', ratio: 0.3 }, { stem: '丙', ratio: 0.5 }],
  '午': [{ stem: '丙', ratio: 0.3 }, { stem: '己', ratio: 0.2 }, { stem: '丁', ratio: 0.5 }],
  '未': [{ stem: '丁', ratio: 0.2 }, { stem: '乙', ratio: 0.3 }, { stem: '己', ratio: 0.5 }],
  '申': [{ stem: '戊', ratio: 0.2 }, { stem: '壬', ratio: 0.3 }, { stem: '庚', ratio: 0.5 }],
  '酉': [{ stem: '庚', ratio: 0.3 }, { stem: '辛', ratio: 0.7 }],
  '戌': [{ stem: '辛', ratio: 0.2 }, { stem: '丁', ratio: 0.3 }, { stem: '戊', ratio: 0.5 }],
  '亥': [{ stem: '甲', ratio: 0.3 }, { stem: '壬', ratio: 0.7 }],
}

// 천간합 (天干合)
export const STEM_HARMONY: Record<string, string> = {
  '甲':'己', '己':'甲',
  '乙':'庚', '庚':'乙',
  '丙':'辛', '辛':'丙',
  '丁':'壬', '壬':'丁',
  '戊':'癸', '癸':'戊',
}

// 지지합 (地支合)
export const BRANCH_HARMONY: Record<string, string> = {
  '子':'丑', '丑':'子',
  '寅':'亥', '亥':'寅',
  '卯':'戌', '戌':'卯',
  '辰':'酉', '酉':'辰',
  '巳':'申', '申':'巳',
  '午':'未', '未':'午',
}

// 지지충 (地支沖)
export const BRANCH_CLASH: Record<string, string> = {
  '子':'午', '午':'子',
  '丑':'未', '未':'丑',
  '寅':'申', '申':'寅',
  '卯':'酉', '酉':'卯',
  '辰':'戌', '戌':'辰',
  '巳':'亥', '亥':'巳',
}

// 지지형 (地支刑) — 삼형살
export const BRANCH_PUNISHMENT: Record<string, string[]> = {
  '寅': ['巳'], '巳': ['申'], '申': ['寅'],
  '丑': ['戌'], '戌': ['未'], '未': ['丑'],
  '子': ['卯'], '卯': ['子'],
}

// 삼합 (三合)
export const THREE_HARMONY: string[][] = [
  ['申','子','辰'], // 수국
  ['寅','午','戌'], // 화국
  ['巳','酉','丑'], // 금국
  ['亥','卯','未'], // 목국
]

// 오행 상생 (相生)
export const ELEMENT_GENERATE: Record<string, string> = {
  'wood': 'fire',
  'fire': 'earth',
  'earth': 'metal',
  'metal': 'water',
  'water': 'wood',
}

// 오행 상극 (相剋)
export const ELEMENT_OVERCOME: Record<string, string> = {
  'wood': 'earth',
  'earth': 'water',
  'water': 'fire',
  'fire': 'metal',
  'metal': 'wood',
}

// 일간 → 일주 이름
export const DAY_MASTER_NAME: Record<string, string> = {
  '甲': '甲木', '乙': '乙木',
  '丙': '丙火', '丁': '丁火',
  '戊': '戊土', '己': '己土',
  '庚': '庚金', '辛': '辛金',
  '壬': '壬水', '癸': '癸水',
}

// 시진 → 지지
export const HOUR_TO_BRANCH: Record<string, string> = {
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

// ============================================================
// 십성 (十星) 계산
// ============================================================

// 오행 관계로 십성 결정
export function getTenGod(dayStem: string, targetStem: string): string {
  const dayEl = STEM_ELEMENT[dayStem]
  const targetEl = STEM_ELEMENT[targetStem]
  const dayYY = STEM_YIN_YANG[dayStem]
  const targetYY = STEM_YIN_YANG[targetStem]
  const sameYY = dayYY === targetYY

  if (dayStem === targetStem) return '비견'
  if (dayEl === targetEl) return sameYY ? '비견' : '겁재'

  // 일간이 생하는 오행 (식상)
  if (ELEMENT_GENERATE[dayEl] === targetEl) return sameYY ? '식신' : '상관'

  // 일간을 극하는 오행 (관성)
  if (ELEMENT_OVERCOME[targetEl] === dayEl) return sameYY ? '편관' : '정관'

  // 일간이 극하는 오행 (재성)
  if (ELEMENT_OVERCOME[dayEl] === targetEl) return sameYY ? '편재' : '정재'

  // 일간을 생하는 오행 (인성)
  if (ELEMENT_GENERATE[targetEl] === dayEl) return sameYY ? '편인' : '정인'

  return '?'
}

// 십성 그룹
export function getTenGodGroup(tenGod: string): string {
  const groups: Record<string, string> = {
    '비견': '비겁', '겁재': '비겁',
    '식신': '식상', '상관': '식상',
    '편재': '재성', '정재': '재성',
    '편관': '관성', '정관': '관성',
    '편인': '인성', '정인': '인성',
  }
  return groups[tenGod] || '?'
}

// ============================================================
// 시간 천간 계산 (오자법)
// ============================================================
function getHourStem(dayStemIdx: number, hourBranch: string): string {
  const branchIdx = EARTHLY_BRANCHES.indexOf(hourBranch)
  const startStemIdx = ((dayStemIdx % 5) * 2) % 10
  const stemIdx = (startStemIdx + branchIdx) % 10
  return HEAVENLY_STEMS[stemIdx]
}

// ============================================================
// 오행 점수 계산 (지장간 포함)
// ============================================================
export type ElementScore = {
  wood: number
  fire: number
  earth: number
  metal: number
  water: number
}

function calcElementScore(
  stems: string[],
  branches: string[]
): ElementScore {
  const score: ElementScore = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  type El = keyof ElementScore

  // 천간 점수 (각 10점)
  stems.forEach(s => {
    const el = STEM_ELEMENT[s] as El
    if (el) score[el] += 10
  })

  // 지지 본기 점수 (각 8점)
  branches.forEach(b => {
    const el = BRANCH_ELEMENT[b] as El
    if (el) score[el] += 8

    // 지장간 점수 (비율 반영)
    const hidden = HIDDEN_STEMS[b] || []
    hidden.forEach(h => {
      const hEl = STEM_ELEMENT[h.stem] as El
      if (hEl) score[hEl] += Math.round(h.ratio * 7)
    })
  })

  return score
}

// 0~100 정규화
function normalizeScore(score: ElementScore): ElementScore {
  const total = Object.values(score).reduce((a, b) => a + b, 0)
  if (total === 0) return score
  return {
    wood:  Math.round((score.wood  / total) * 100),
    fire:  Math.round((score.fire  / total) * 100),
    earth: Math.round((score.earth / total) * 100),
    metal: Math.round((score.metal / total) * 100),
    water: Math.round((score.water / total) * 100),
  }
}

// ============================================================
// 십성 분포 분석
// ============================================================
export type TenGodAnalysis = {
  tenGods: Record<string, number>  // 십성별 개수
  dominant: string[]               // 주요 십성 그룹
  personality: string              // 성격 요약
  career: string                   // 직업 적성
  love: string                     // 연애 스타일
}

function analyzeTenGods(dayStem: string, allStems: string[]): TenGodAnalysis {
  const tenGods: Record<string, number> = {}
  const groups: Record<string, number> = {
    '비겁': 0, '식상': 0, '재성': 0, '관성': 0, '인성': 0
  }

  allStems.filter(s => s !== dayStem).forEach(s => {
    const tg = getTenGod(dayStem, s)
    tenGods[tg] = (tenGods[tg] || 0) + 1
    const group = getTenGodGroup(tg)
    if (group in groups) groups[group]++
  })

  // 가장 많은 십성 그룹
  const dominant = Object.entries(groups)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0)
    .slice(0, 2)
    .map(([k]) => k)

  // 십성 그룹별 성격/직업/연애 해설
  const groupDesc: Record<string, { personality: string; career: string; love: string }> = {
    '비겁': {
      personality: '자존심이 강하고 독립적이에요. 경쟁심이 있고 자기 방식대로 하려는 성향이 강해요.',
      career: '자영업, 스포츠, 영업, 독립적인 전문직에서 능력을 발휘해요.',
      love: '자존심이 강해서 먼저 굽히기 어렵지만, 한번 마음을 주면 의리 있게 지켜요.',
    },
    '식상': {
      personality: '창의적이고 표현력이 뛰어나요. 자유롭고 개성 강한 스타일로 새로운 것을 즐겨요.',
      career: '예술, 기획, 미디어, 교육, 요리 등 창의적인 분야에서 빛나요.',
      love: '감정 표현이 풍부하고 로맨틱해요. 다양한 감정을 솔직하게 드러내는 편이에요.',
    },
    '재성': {
      personality: '현실적이고 실용적이에요. 목표 지향적이고 경제적 감각이 뛰어나요.',
      career: '사업, 금융, 투자, 무역 등 재물을 다루는 분야에서 강해요.',
      love: '현실적인 사랑을 추구해요. 상대방에게 실질적인 도움을 주는 방식으로 애정을 표현해요.',
    },
    '관성': {
      personality: '책임감이 강하고 원칙을 중시해요. 사회적 평판과 명예를 중요하게 생각해요.',
      career: '공직, 법조계, 경영, 관리직 등 조직 내 리더십 역할에 강해요.',
      love: '진지하고 책임감 있는 연애를 해요. 가볍게 만나기보다 진중한 관계를 원해요.',
    },
    '인성': {
      personality: '학구적이고 사려 깊어요. 지식 습득을 좋아하고 직관력과 통찰력이 뛰어나요.',
      career: '학문, 연구, 상담, 종교, 철학 등 깊이 있는 분야에서 두각을 나타내요.',
      love: '감정보다 이성이 앞서는 편이에요. 신중하게 상대를 파악한 후 마음을 열어요.',
    },
  }

  const mainGroup = dominant[0] || '비겁'
  const subGroup = dominant[1]

  const mainDesc = groupDesc[mainGroup]
  const personality = subGroup
    ? `${mainDesc.personality} 또한 ${groupDesc[subGroup].personality.split('.')[0]}는 면도 있어요.`
    : mainDesc.personality

  return {
    tenGods,
    dominant,
    personality,
    career: mainDesc.career,
    love: mainDesc.love,
  }
}

// ============================================================
// 궁합 계산
// ============================================================
export type CompatibilityDetail = {
  score: number
  grade: string
  label: string
  stemHarmony: boolean      // 천간합
  branchHarmony: boolean    // 지지합
  branchClash: boolean      // 지지충
  branchPunishment: boolean // 지지형
  threeHarmony: boolean     // 삼합
  elementRelation: string   // 오행 관계
  details: string[]         // 세부 분석
}

export function calculateCompatibility(
  charA: { dayStem: string; dayBranch: string; monthBranch: string },
  charB: { dayStem: string; dayBranch: string; monthBranch: string }
): CompatibilityDetail {
  let score = 50
  const details: string[] = []

  // 1. 천간합 확인
  const stemHarmony = STEM_HARMONY[charA.dayStem] === charB.dayStem
  if (stemHarmony) {
    score += 20
    details.push(`✅ 천간합(${charA.dayStem}${charB.dayStem}합) — 서로 끌리는 운명적 인연이에요`)
  }

  // 2. 일지 합 확인
  const branchHarmony = BRANCH_HARMONY[charA.dayBranch] === charB.dayBranch
  if (branchHarmony) {
    score += 15
    details.push(`✅ 일지합(${charA.dayBranch}${charB.dayBranch}합) — 생활 방식과 가치관이 잘 맞아요`)
  }

  // 3. 일지 충 확인
  const branchClash = BRANCH_CLASH[charA.dayBranch] === charB.dayBranch
  if (branchClash) {
    score -= 15
    details.push(`⚡ 일지충(${charA.dayBranch}${charB.dayBranch}충) — 생활 방식이 충돌할 수 있어요`)
  }

  // 4. 형살 확인
  const punishA = BRANCH_PUNISHMENT[charA.dayBranch] || []
  const branchPunishment = punishA.includes(charB.dayBranch)
  if (branchPunishment) {
    score -= 10
    details.push(`⚠️ 형살 — 서로 자극하는 관계예요. 노력이 필요해요`)
  }

  // 5. 삼합 확인
  const threeHarmony = THREE_HARMONY.some(group =>
    group.includes(charA.dayBranch) && group.includes(charB.dayBranch)
  )
  if (threeHarmony) {
    score += 12
    details.push(`✅ 삼합 — 같은 방향을 바라보는 이상적인 파트너예요`)
  }

  // 6. 오행 상생/상극
  const elA = STEM_ELEMENT[charA.dayStem]
  const elB = STEM_ELEMENT[charB.dayStem]
  let elementRelation = '중립'

  if (ELEMENT_GENERATE[elA] === elB) {
    score += 10
    elementRelation = `${elA}생${elB} — A가 B를 도와주는 관계`
    details.push(`✅ 오행 상생 — 자연스럽게 서로를 보완해요`)
  } else if (ELEMENT_GENERATE[elB] === elA) {
    score += 10
    elementRelation = `${elB}생${elA} — B가 A를 도와주는 관계`
    details.push(`✅ 오행 상생 — 자연스럽게 서로를 보완해요`)
  } else if (ELEMENT_OVERCOME[elA] === elB) {
    score -= 8
    elementRelation = `${elA}극${elB} — A가 B를 제압하는 관계`
    details.push(`⚠️ 오행 상극 — 한쪽이 지배적일 수 있어요`)
  } else if (ELEMENT_OVERCOME[elB] === elA) {
    score -= 8
    elementRelation = `${elB}극${elA} — B가 A를 제압하는 관계`
    details.push(`⚠️ 오행 상극 — 한쪽이 지배적일 수 있어요`)
  } else {
    details.push(`💫 오행 중립 — 서로 큰 영향을 주지 않는 독립적인 관계예요`)
  }

  // 점수 범위 제한
  score = Math.max(10, Math.min(98, score))

  // 등급
  let grade = 'D'
  let label = '라이벌'
  if (score >= 90) { grade = 'S'; label = '소울메이트' }
  else if (score >= 75) { grade = 'A'; label = '최강 파티' }
  else if (score >= 60) { grade = 'B'; label = '좋은 전우' }
  else if (score >= 40) { grade = 'C'; label = '동반자' }

  return {
    score,
    grade,
    label,
    stemHarmony,
    branchHarmony,
    branchClash,
    branchPunishment,
    threeHarmony,
    elementRelation,
    details,
  }
}

// ============================================================
// 메인 사주 계산 함수
// ============================================================
export type SajuResult = {
  // 사주 8글자
  yearStem: string
  yearBranch: string
  monthStem: string
  monthBranch: string
  dayStem: string
  dayBranch: string
  hourStem: string | null
  hourBranch: string | null

  // 일주
  dayMaster: string
  dayPillar: string  // 일주 (예: 己巳)

  // 오행 점수 (지장간 포함)
  elementScore: ElementScore
  stats: ElementScore  // 0~100 정규화

  // 십성 분석
  tenGodAnalysis: TenGodAnalysis

  // 사주 텍스트
  pillars: string

  // 궁합용 데이터
  compatibilityData: {
    dayStem: string
    dayBranch: string
    monthBranch: string
  }
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hourStr?: string
): SajuResult {
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

  // 오행 점수 계산 (지장간 포함)
  const allStems = [yearStem, monthStem, dayStem, ...(hourStem ? [hourStem] : [])]
  const allBranches = [yearBranch, monthBranch, dayBranch, ...(hourBranch ? [hourBranch] : [])]

  const elementScore = calcElementScore(allStems, allBranches)
  const stats = normalizeScore(elementScore)

  // 십성 분석
  const hiddenStemsList = allBranches.flatMap(b =>
    (HIDDEN_STEMS[b] || []).map(h => h.stem)
  )
  const allStemsForAnalysis = [...allStems, ...hiddenStemsList]
  const tenGodAnalysis = analyzeTenGods(dayStem, allStemsForAnalysis)

  const dayMaster = DAY_MASTER_NAME[dayStem] ?? `${dayStem}?`
  const dayPillar = `${dayStem}${dayBranch}`

  const pillars = hourStem
    ? `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${dayStem}${dayBranch} ${hourStem}${hourBranch}`
    : `${yearStem}${yearBranch} ${monthStem}${monthBranch} ${dayStem}${dayBranch}`

  return {
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem, hourBranch,
    dayMaster,
    dayPillar,
    elementScore,
    stats,
    tenGodAnalysis,
    pillars,
    compatibilityData: {
      dayStem,
      dayBranch,
      monthBranch,
    },
  }
}