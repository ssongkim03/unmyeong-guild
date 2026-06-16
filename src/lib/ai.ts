import Groq from 'groq-sdk'
import { SajuFormData, ElementStat, CharacterClass } from '@/types'
import { DAY_MASTER_CLASS, CLASS_NAME_KR, generateShareCode } from '@/lib/utils'
import { calculateSaju } from '@/lib/saju'

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
  pillars: string
  shareCode: string
}

export async function analyzeSaju(form: SajuFormData): Promise<SajuAnalysisResult> {
  // ✅ 만세력으로 정확하게 계산
  const saju = calculateSaju(
    form.birthYear,
    form.birthMonth,
    form.birthDay,
    form.birthHour || undefined
  )

  // AI는 성격 한 줄만 생성 (스탯은 만세력 결과 사용)
  const prompt = `한국 사주명리학 전문가입니다.
아래 사주 정보로 성격을 한 줄로 설명해주세요. JSON만 반환, 백틱 없이.

사주: ${saju.pillars}
일간: ${saju.dayMaster}
오행: 목${saju.elementCount.wood} 화${saju.elementCount.fire} 토${saju.elementCount.earth} 금${saju.elementCount.metal} 수${saju.elementCount.water}
성별: ${form.gender === 'male' ? '남성' : '여성'}

{"personality": "RPG 캐릭터 설명처럼 20자 이내 성격 한 줄"}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  let personality = '신비로운 운명의 소유자'
  try {
    const parsed = JSON.parse(clean)
    personality = parsed.personality || personality
  } catch {}

  const characterClass = DAY_MASTER_CLASS[saju.dayMaster] ?? 'Warrior'

  return {
    dayMaster: saju.dayMaster,
    characterClass,
    classNameKr: CLASS_NAME_KR[characterClass],
    stats: saju.stats,
    personality,
    pillars: saju.pillars,
    shareCode: generateShareCode(),
  }
}

export async function analyzeCompatibility(
  charA: { nickname: string; dayMaster: string; stats: ElementStat; classNameKr: string },
  charB: { nickname: string; dayMaster: string; stats: ElementStat; classNameKr: string }
) {
  const prompt = `한국 사주명리학으로 두 캐릭터의 궁합을 분석하고 JSON만 반환하세요. 백틱 없이.

캐릭터 A: ${charA.nickname} / ${charA.dayMaster} / ${charA.classNameKr}
캐릭터 B: ${charB.nickname} / ${charB.dayMaster} / ${charB.classNameKr}

{"score": 0~100, "partyType": "소울메이트/최강전우/라이벌/동반자 중 하나", "analysis": "150자 이내 MZ 감성 궁합 해설", "elementSynergy": "오행 상생/상극 한 줄"}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  return JSON.parse(clean)
}

export async function analyzeFortune(
  character: { nickname: string; dayMaster: string; classNameKr: string; stats: ElementStat }
) {
  const prompt = `한국 사주명리학으로 2025~2026년 운세를 분석하고 JSON만 반환하세요. 백틱 없이.

캐릭터: ${character.nickname} / ${character.dayMaster} / ${character.classNameKr}

{"year2025": "2025년 운세 한 줄", "year2026": "2026년 운세 한 줄", "luckyElement": "목/화/토/금/수 중 하나", "advice": "MZ 감성 조언 한 문장"}`

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.7,
  })

  const text = response.choices[0]?.message?.content || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  return JSON.parse(clean)
}