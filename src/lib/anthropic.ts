import Anthropic from '@anthropic-ai/sdk'
import { SajuFormData, ElementStat, CharacterClass } from '@/types'
import { DAY_MASTER_CLASS, CLASS_NAME_KR, generateShareCode } from '@/lib/utils'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

type SajuAnalysisResult = {
  dayMaster: string
  characterClass: CharacterClass
  classNameKr: string
  stats: ElementStat
  personality: string
  shareCode: string
}

export async function analyzeSaju(form: SajuFormData): Promise<SajuAnalysisResult> {
  const prompt = `당신은 한국 사주명리학 전문가입니다.
아래 생년월일로 사주를 분석하고 반드시 JSON만 반환하세요.

생년월일: ${form.birthYear}년 ${form.birthMonth}월 ${form.birthDay}일
태어난 시간: ${form.birthHour || '모름'}
성별: ${form.gender === 'male' ? '남성' : '여성'}

JSON 형식 (백틱 없이 순수 JSON만):
{
  "dayMaster": "일간 한자 (예: 甲木, 乙木, 丙火, 丁火, 戊土, 己土, 庚金, 辛金, 壬水, 癸水 중 하나)",
  "stats": {
    "wood": 목 기운 0~100 숫자,
    "fire": 화 기운 0~100 숫자,
    "earth": 토 기운 0~100 숫자,
    "metal": 금 기운 0~100 숫자,
    "water": 수 기운 0~100 숫자
  },
  "personality": "성격 한 줄 요약 (20자 이내, RPG 캐릭터 설명처럼)"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  const data = JSON.parse(clean)

  const characterClass = DAY_MASTER_CLASS[data.dayMaster] ?? 'Warrior'

  return {
    dayMaster: data.dayMaster,
    characterClass,
    classNameKr: CLASS_NAME_KR[characterClass],
    stats: data.stats,
    personality: data.personality,
    shareCode: generateShareCode(),
  }
}

export async function analyzeCompatibility(
  charA: { nickname: string; dayMaster: string; stats: ElementStat; classNameKr: string },
  charB: { nickname: string; dayMaster: string; stats: ElementStat; classNameKr: string }
) {
  const prompt = `한국 사주명리학으로 두 캐릭터의 궁합을 분석하고 JSON만 반환하세요.

캐릭터 A: ${charA.nickname} / ${charA.dayMaster} / ${charA.classNameKr}
캐릭터 B: ${charB.nickname} / ${charB.dayMaster} / ${charB.classNameKr}

JSON 형식:
{
  "score": 0~100 궁합 점수 숫자,
  "partyType": "파티 유형 (소울메이트/최강전우/라이벌/동반자 중 하나)",
  "analysis": "궁합 해설 150자 이내 MZ 감성으로",
  "elementSynergy": "오행 상생/상극 한 줄 설명"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text || ''
  const clean = text.replace(/```json\n?|```\n?/g, '').trim()
  return JSON.parse(clean)
}