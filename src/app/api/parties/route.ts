import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { analyzeCompatibility } from '@/lib/ai'
import { generateShareCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { name, characterId } = await request.json()
    if (!name || !characterId) {
      return NextResponse.json({ error: '파티명과 캐릭터 ID가 필요합니다' }, { status: 400 })
    }
    const supabase = createServerSupabaseClient()
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .insert({ name, created_by: characterId, invite_code: generateShareCode() })
      .select()
      .single()
    if (partyError) throw partyError
    const { error: memberError } = await supabase
      .from('party_members')
      .insert({ party_id: party.id, character_id: characterId })
    if (memberError) throw memberError
    return NextResponse.json({ success: true, party })
  } catch (err) {
    console.error('파티 생성 오류:', err)
    return NextResponse.json({ error: '파티 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inviteCode = searchParams.get('code')
    const partyId = searchParams.get('id')
    const supabase = createServerSupabaseClient()

    if (inviteCode) {
      const { data: party, error } = await supabase
        .from('parties')
        .select('*')
        .eq('invite_code', inviteCode)
        .single()
      if (error || !party) {
        return NextResponse.json({ error: '파티를 찾을 수 없습니다' }, { status: 404 })
      }
      return NextResponse.json({ success: true, party })
    }

    if (partyId) {
      // 파티원 조회
      const { data: members, error } = await supabase
        .from('party_members')
        .select(`
          joined_at,
          characters (
            id, nickname, day_master, character_class, class_name_kr,
            personality, pillars, day_pillar, compatibility_data,
            stat_wood, stat_fire, stat_earth, stat_metal, stat_water,
            share_code, birth_year, birth_month, birth_day, gender
          )
        `)
        .eq('party_id', partyId)
      if (error) throw error

      // 파티 궁합 조회
      const { data: compatibilities } = await supabase
        .from('party_compatibility')
        .select('*')
        .eq('party_id', partyId)

      return NextResponse.json({ success: true, members, compatibilities: compatibilities || [] })
    }

    return NextResponse.json({ error: '코드 또는 파티 ID가 필요합니다' }, { status: 400 })
  } catch (err) {
    console.error('파티 조회 오류:', err)
    return NextResponse.json({ error: '조회 중 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { inviteCode, characterId } = await request.json()
    if (!inviteCode || !characterId) {
      return NextResponse.json({ error: '초대 코드와 캐릭터 ID가 필요합니다' }, { status: 400 })
    }
    const supabase = createServerSupabaseClient()

    // 파티 찾기
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()
    if (partyError || !party) {
      return NextResponse.json({ error: '유효하지 않은 초대 코드입니다' }, { status: 404 })
    }

    // 파티 인원 확인
    const { count } = await supabase
      .from('party_members')
      .select('*', { count: 'exact' })
      .eq('party_id', party.id)
    if (count && count >= 6) {
      return NextResponse.json({ error: '파티가 가득 찼습니다 (최대 6명)' }, { status: 400 })
    }

    // 파티 참가
    const { error: joinError } = await supabase
      .from('party_members')
      .insert({ party_id: party.id, character_id: characterId })
    if (joinError) {
      if (joinError.code === '23505') {
        return NextResponse.json({ error: '이미 파티에 참가되어 있습니다' }, { status: 400 })
      }
      throw joinError
    }

    // 기존 파티원 조회
    const { data: members } = await supabase
      .from('party_members')
      .select(`
        characters (
          id, nickname, day_master, character_class, class_name_kr,
          pillars, day_pillar, compatibility_data,
          stat_wood, stat_fire, stat_earth, stat_metal, stat_water
        )
      `)
      .eq('party_id', party.id)

    // 새로 참가한 캐릭터 조회
    const { data: newChar } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single()

    // 기존 파티원들과 새 멤버 궁합 분석
    if (members && newChar) {
      const existingMembers = members
        .map((m: any) => m.characters)
        .filter((c: any) => c && c.id !== characterId)

      for (const existingChar of existingMembers) {
        try {
          // 이미 분석된 궁합인지 확인
          const { data: existing } = await supabase
            .from('party_compatibility')
            .select('id')
            .eq('party_id', party.id)
            .or(`and(character_a.eq.${existingChar.id},character_b.eq.${characterId}),and(character_a.eq.${characterId},character_b.eq.${existingChar.id})`)
            .single()

          if (existing) continue

          // 궁합 분석
          const result = await analyzeCompatibility(
            {
              nickname: existingChar.nickname,
              dayMaster: existingChar.day_master,
              dayPillar: existingChar.day_pillar ?? '',
              stats: {
                wood: existingChar.stat_wood,
                fire: existingChar.stat_fire,
                earth: existingChar.stat_earth,
                metal: existingChar.stat_metal,
                water: existingChar.stat_water,
              },
              classNameKr: existingChar.class_name_kr,
              compatibilityData: existingChar.compatibility_data ?? undefined,
            },
            {
              nickname: newChar.nickname,
              dayMaster: newChar.day_master,
              dayPillar: newChar.day_pillar ?? '',
              stats: {
                wood: newChar.stat_wood,
                fire: newChar.stat_fire,
                earth: newChar.stat_earth,
                metal: newChar.stat_metal,
                water: newChar.stat_water,
              },
              classNameKr: newChar.class_name_kr,
              compatibilityData: newChar.compatibility_data ?? undefined,
            }
          )

          // 궁합 저장
          await supabase
            .from('party_compatibility')
            .insert({
              party_id: party.id,
              character_a: existingChar.id,
              character_b: characterId,
              score: result.score,
              grade: result.grade,
              label: result.label,
              analysis: result.analysis,
              details: result.details ?? [],
            })
        } catch (e) {
          console.error('궁합 분석 오류:', e)
        }
      }
    }

    // 최종 파티원 + 궁합 반환
    const { data: finalMembers } = await supabase
      .from('party_members')
      .select(`
        joined_at,
        characters (
          id, nickname, day_master, character_class, class_name_kr,
          personality, pillars, day_pillar,
          stat_wood, stat_fire, stat_earth, stat_metal, stat_water,
          share_code, birth_year, birth_month, birth_day, gender
        )
      `)
      .eq('party_id', party.id)

    const { data: compatibilities } = await supabase
      .from('party_compatibility')
      .select('*')
      .eq('party_id', party.id)

    return NextResponse.json({
      success: true,
      party,
      members: finalMembers || [],
      compatibilities: compatibilities || [],
    })
  } catch (err) {
    console.error('파티 참가 오류:', err)
    return NextResponse.json({ error: '파티 참가 중 오류가 발생했습니다' }, { status: 500 })
  }
}