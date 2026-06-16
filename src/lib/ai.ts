import Groq from 'groq-sdk'
import { SajuFormData, ElementStat, CharacterClass } from '@/types'
import { DAY_MASTER_CLASS, CLASS_NAME_KR, generateShareCode } from '@/lib/utils'
import { calculateSaju, calculateCompatibility, ElementScore } from '@/lib/saju'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

const MODEL = 'llama-3.3-70b-versatile'

type SajuAnalysisResult = {
  dayMaster: string
  characterClass: CharacterClass
  classNameKr: string
  stats: ElementStat
  personality: string
  career: string
  love: string
  pillars: string
  dayPillar: string
  tenGodDominant: string[]
  shareCode: string
}

export async function analyzeSaju(form: SajuFormData): Promise<SajuAnalysisResult> {
  // 만세력 + 지장간 + 십성 계산
  const saju = calculateSaju(
    form.birthYear,
    form.birthMonth,
    form.birthDay,
    form.birthHour || undefined
  )

  const { tenGodAnalysis } = saju

  // AI는 십성 분석 결과를 받아서 더 풍부한 해설 생성
  const prompt = `당신은 한국 사주명리학 전문가입니다.
아래 사주 분석 결과를 바탕으로 MZ세대가 공감할 수 있는 친근한 말투로 해설해주세요.
반드시 JSON만 반환하세요. 백틱 없이 순수 JSON만.

사주: ${saju.pillars}
일간: ${saju.dayMaster}
일주: ${saju.dayPillar}
오행: 목${saju.elementScore.wood} 화${saju.elementScore.fire} 토${saju.elementScore.earth} 금${saju.elementScore.metal} 수${saju.elementScore.water}
주요 십성: ${tenGodAnalysis.dominant.join(', ')}
성별: ${form.gender === 'male' ? '남성' : '여성'}

십성 기반 기본 성격: ${tenGodAnalysis.personality}
십성 기반 직업 적성: ${tenGodAnalysis.career}
십성 기반 연애 스타일: ${tenGodAnalysis.love}

위 내용을 참고해서 아래 JSON 반환:
{
  "personality": "성격 해설 (2~3문장, RPG 캐릭터 설명처럼 생동감 있게)",
  "career": "직업/진로 해설 (2문장)",
  "love": "연애 스타일 해설 (2문장)",
  "todayAdvice": "오늘의 한마디 조언 (1문장, 위로나 응원 포함)"
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()

  let aiResult = {
    personality: tenGodAnalysis.personality,
    career: tenGodAnalysis.career,
    love: tenGodAnalysis.love,
    todayAdvice: '오늘도 당신의 운명을 개척해나가세요 ✨',
  }

  try {
    const parsed = JSON.parse(clean)
    aiResult = { ...aiResult, ...parsed }
  } catch {}

  const characterClass = DAY_MASTER_CLASS[saju.dayMaster] ?? 'Warrior'

  return {
    dayMaster: saju.dayMaster,
    characterClass,
    classNameKr: CLASS_NAME_KR[characterClass],
    stats: saju.stats,
    personality: aiResult.personality,
    career: aiResult.career,
    love: aiResult.love,
    pillars: saju.pillars,
    dayPillar: saju.dayPillar,
    tenGodDominant: tenGodAnalysis.dominant,
    shareCode: generateShareCode(),
  }
}

export async function analyzeCompatibility(
  charA: {
    nickname: string
    dayMaster: string
    dayPillar: string
    stats: ElementStat
    classNameKr: string
    compatibilityData?: { dayStem: string; dayBranch: string; monthBranch: string }
  },
  charB: {
    nickname: string
    dayMaster: string
    dayPillar: string
    stats: ElementStat
    classNameKr: string
    compatibilityData?: { dayStem: string; dayBranch: string; monthBranch: string }
  }
) {
  // 천간합·지지합·충·형·삼합 계산
  let compatResult = null
  if (charA.compatibilityData && charB.compatibilityData) {
    compatResult = calculateCompatibility(charA.compatibilityData, charB.compatibilityData)
  }

  const compatSummary = compatResult
    ? `점수: ${compatResult.score}점\n분석: ${compatResult.details.join(', ')}\n오행관계: ${compatResult.elementRelation}`
    : '데이터 없음'

  const prompt = `한국 사주명리학으로 두 사람의 궁합을 분석해주세요.
반드시 JSON만 반환하세요. 백틱 없이.

캐릭터 A: ${charA.nickname} / ${charA.dayMaster} / 일주: ${charA.dayPillar || '?'} / ${charA.classNameKr}
캐릭터 B: ${charB.nickname} / ${charB.dayMaster} / 일주: ${charB.dayPillar || '?'} / ${charB.classNameKr}

명리학 계산 결과:
${compatSummary}

위 결과를 바탕으로 MZ 감성으로 재미있게 해설해주세요:
{
  "score": ${compatResult?.score ?? 50},
  "partyType": "소울메이트/최강전우/라이벌/동반자/천생연분 중 가장 적합한 것",
  "analysis": "궁합 해설 (3~4문장, 구체적이고 재미있게)",
  "elementSynergy": "오행 상생/상극 관계 설명 (1~2문장)",
  "tip": "이 파티가 더 잘 맞으려면? (1문장 조언)"
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    // 계산된 점수 우선 사용
    if (compatResult) parsed.score = compatResult.score
    parsed.grade = compatResult?.grade ?? 'C'
    parsed.label = compatResult?.label ?? '동반자'
    parsed.details = compatResult?.details ?? []
    return parsed
  } catch {
    return {
      score: compatResult?.score ?? 50,
      grade: compatResult?.grade ?? 'C',
      label: compatResult?.label ?? '동반자',
      partyType: '동반자',
      analysis: '궁합 분석 중 오류가 발생했어요',
      elementSynergy: '',
      tip: '',
      details: compatResult?.details ?? [],
    }
  }
}

export async function analyzeFortune(
  character: {
    nickname: string
    dayMaster: string
    classNameKr: string
    stats: ElementStat
    tenGodDominant?: string[]
  }
) {
  const prompt = `한국 사주명리학으로 2025~2026년 운세를 분석하고 JSON만 반환하세요. 백틱 없이.

캐릭터: ${character.nickname} / ${character.dayMaster} / ${character.classNameKr}
주요 십성: ${character.tenGodDominant?.join(', ') || ''}

{
  "year2025": "2025년 운세 (2문장)",
  "year2026": "2026년 운세 (2문장)",
  "luckyElement": "행운의 오행 (목/화/토/금/수 중 하나)",
  "luckyColor": "행운의 색상",
  "luckyNumber": "행운의 숫자",
  "advice": "MZ 감성 조언 한 문장"
}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    return {
      year2025: '분석 중 오류가 발생했어요',
      year2026: '분석 중 오류가 발생했어요',
      luckyElement: '목',
      luckyColor: '초록',
      luckyNumber: '3',
      advice: '오늘도 화이팅!',
    }
  }
}