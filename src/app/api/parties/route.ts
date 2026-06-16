import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateShareCode } from '@/lib/utils'

// 파티 생성
export async function POST(request: NextRequest) {
  try {
    const { name, characterId } = await request.json()

    if (!name || !characterId) {
      return NextResponse.json(
        { error: '파티명과 캐릭터 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // 파티 생성
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .insert({
        name,
        created_by: characterId,
        invite_code: generateShareCode(),
      })
      .select()
      .single()

    if (partyError) throw partyError

    // 파티장 멤버로 추가
    const { error: memberError } = await supabase
      .from('party_members')
      .insert({
        party_id: party.id,
        character_id: characterId,
      })

    if (memberError) throw memberError

    return NextResponse.json({ success: true, party })
  } catch (err) {
    console.error('파티 생성 오류:', err)
    return NextResponse.json(
      { error: '파티 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 파티 조회 (invite_code로)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inviteCode = searchParams.get('code')
    const partyId = searchParams.get('id')

    const supabase = createServerSupabaseClient()

    if (inviteCode) {
      // 초대 코드로 파티 조회
      const { data: party, error } = await supabase
        .from('parties')
        .select('*')
        .eq('invite_code', inviteCode)
        .single()

      if (error || !party) {
        return NextResponse.json(
          { error: '파티를 찾을 수 없습니다' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, party })
    }

    if (partyId) {
      // 파티 ID로 멤버 전체 조회
      const { data: members, error } = await supabase
        .from('party_members')
        .select(`
          joined_at,
          characters (
            id,
            nickname,
            day_master,
            character_class,
            class_name_kr,
            personality,
            stat_wood,
            stat_fire,
            stat_earth,
            stat_metal,
            stat_water,
            share_code,
            birth_year,
            birth_month,
            birth_day,
            gender
          )
        `)
        .eq('party_id', partyId)

      if (error) throw error

      return NextResponse.json({ success: true, members })
    }

    return NextResponse.json(
      { error: '코드 또는 파티 ID가 필요합니다' },
      { status: 400 }
    )
  } catch (err) {
    console.error('파티 조회 오류:', err)
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 파티 참가
export async function PATCH(request: NextRequest) {
  try {
    const { inviteCode, characterId } = await request.json()

    if (!inviteCode || !characterId) {
      return NextResponse.json(
        { error: '초대 코드와 캐릭터 ID가 필요합니다' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // 초대 코드로 파티 찾기
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (partyError || !party) {
      return NextResponse.json(
        { error: '유효하지 않은 초대 코드입니다' },
        { status: 404 }
      )
    }

    // 파티 멤버 수 확인 (최대 6명)
    const { count } = await supabase
      .from('party_members')
      .select('*', { count: 'exact' })
      .eq('party_id', party.id)

    if (count && count >= 6) {
      return NextResponse.json(
        { error: '파티가 가득 찼습니다 (최대 6명)' },
        { status: 400 }
      )
    }

    // 멤버 추가
    const { error: joinError } = await supabase
      .from('party_members')
      .insert({
        party_id: party.id,
        character_id: characterId,
      })

    if (joinError) {
      if (joinError.code === '23505') {
        return NextResponse.json(
          { error: '이미 파티에 참가되어 있습니다' },
          { status: 400 }
        )
      }
      throw joinError
    }

    return NextResponse.json({ success: true, party })
  } catch (err) {
    console.error('파티 참가 오류:', err)
    return NextResponse.json(
      { error: '파티 참가 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}