import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { analyzeSaju } from '@/lib/ai'
import { SajuFormData } from '@/types'

// 캐릭터 생성
export async function POST(request: NextRequest) {
  try {
    const body: SajuFormData = await request.json()

    if (!body.birthYear || !body.birthMonth || !body.birthDay || !body.gender) {
      return NextResponse.json(
        { error: '생년월일과 성별을 입력해주세요' },
        { status: 400 }
      )
    }

    // 만세력 + 지장간 + 십성 + AI 분석
    const analysis = await analyzeSaju(body)

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('characters')
      .insert({
        nickname: body.nickname,
        birth_year: body.birthYear,
        birth_month: body.birthMonth,
        birth_day: body.birthDay,
        birth_hour: body.birthHour || null,
        gender: body.gender,
        day_master: analysis.dayMaster,
        character_class: analysis.characterClass,
        class_name_kr: analysis.classNameKr,
        personality: analysis.personality,
        career: analysis.career,
        love: analysis.love,
        stat_wood: analysis.stats.wood,
        stat_fire: analysis.stats.fire,
        stat_earth: analysis.stats.earth,
        stat_metal: analysis.stats.metal,
        stat_water: analysis.stats.water,
        share_code: analysis.shareCode,
        pillars: analysis.pillars,
        day_pillar: analysis.dayPillar,
        ten_god_dominant: analysis.tenGodDominant,
        compatibility_data: {
          dayStem: analysis.pillars.split(' ')[2]?.[0] ?? '',
          dayBranch: analysis.pillars.split(' ')[2]?.[1] ?? '',
          monthBranch: analysis.pillars.split(' ')[1]?.[1] ?? '',
        },
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, character: data })
  } catch (err) {
    console.error('캐릭터 생성 오류:', err)
    return NextResponse.json(
      { error: '캐릭터 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// share_code로 캐릭터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareCode = searchParams.get('code')

    if (!shareCode) {
      return NextResponse.json(
        { error: '공유 코드가 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('share_code', shareCode)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: '캐릭터를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, character: data })
  } catch (err) {
    console.error('캐릭터 조회 오류:', err)
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}