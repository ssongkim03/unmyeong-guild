import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { analyzeCompatibility } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { characterAId, characterBId } = await request.json()

    if (!characterAId || !characterBId) {
      return NextResponse.json(
        { error: '두 캐릭터 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // 두 캐릭터 조회
    const { data: characters, error: fetchError } = await supabase
      .from('characters')
      .select('*')
      .in('id', [characterAId, characterBId])

    if (fetchError || !characters || characters.length !== 2) {
      return NextResponse.json(
        { error: '캐릭터를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const charA = characters.find(c => c.id === characterAId)!
    const charB = characters.find(c => c.id === characterBId)!

    // 이미 분석된 궁합 있으면 캐시 반환
    const { data: cached } = await supabase
      .from('compatibility_results')
      .select('*')
      .or(
        `and(character_a.eq.${characterAId},character_b.eq.${characterBId}),` +
        `and(character_a.eq.${characterBId},character_b.eq.${characterAId})`
      )
      .single()

    if (cached) {
      return NextResponse.json({ success: true, result: cached, cached: true })
    }

    // AI로 궁합 분석
    const analysis = await analyzeCompatibility(
      {
        nickname: charA.nickname,
        dayMaster: charA.day_master,
        stats: {
          wood: charA.stat_wood,
          fire: charA.stat_fire,
          earth: charA.stat_earth,
          metal: charA.stat_metal,
          water: charA.stat_water,
        },
        classNameKr: charA.class_name_kr,
      },
      {
        nickname: charB.nickname,
        dayMaster: charB.day_master,
        stats: {
          wood: charB.stat_wood,
          fire: charB.stat_fire,
          earth: charB.stat_earth,
          metal: charB.stat_metal,
          water: charB.stat_water,
        },
        classNameKr: charB.class_name_kr,
      }
    )

    // 결과 저장
    const { data: result, error: insertError } = await supabase
      .from('compatibility_results')
      .insert({
        character_a: characterAId,
        character_b: characterBId,
        score: analysis.score,
        party_type: analysis.partyType,
        analysis: analysis.analysis,
        element_synergy: analysis.elementSynergy,
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ success: true, result, cached: false })
  } catch (err) {
    console.error('궁합 분석 오류:', err)
    return NextResponse.json(
      { error: '궁합 분석 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}