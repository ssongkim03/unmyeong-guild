// 오행 스탯
export type ElementStat = {
    wood: number
    fire: number
    earth: number
    metal: number
    water: number
  }
  
  // 일간별 클래스
  export type CharacterClass =
    | 'Warrior'
    | 'Ranger'
    | 'Mage'
    | 'Healer'
    | 'Knight'
    | 'Sage'
    | 'Berserker'
    | 'Assassin'
    | 'Sorcerer'
    | 'Wizard'
  
  // 캐릭터 (DB 컬럼명 기준 snake_case)
  export type Character = {
    id: string
    user_id?: string
    nickname: string
    birth_year: number
    birth_month: number
    birth_day: number
    birth_hour?: string | null
    gender: 'male' | 'female'
    day_master: string
    character_class: CharacterClass
    class_name_kr: string
    personality?: string | null
    career?: string | null
    love?: string | null
    stat_wood: number
    stat_fire: number
    stat_earth: number
    stat_metal: number
    stat_water: number
    share_code: string
    pillars?: string | null
    day_pillar?: string | null
    ten_god_dominant?: string[] | null
    compatibility_data?: any
    created_at?: string
    [key: string]: any
  }
  
  // 궁합 결과
  export type CompatibilityResult = {
    id: string
    character_a: string
    character_b: string
    score: number
    party_type: string
    analysis: string
    element_synergy?: string | null
    grade?: string
    label?: string
    details?: string[]
    tip?: string
    created_at?: string
  }
  
  // 파티
  export type Party = {
    id: string
    name: string
    created_by: string
    invite_code: string
    created_at?: string
  }
  
  // 파티 멤버
  export type PartyMember = {
    party_id: string
    character_id: string
    joined_at?: string
    characters?: Character
  }
  
  // 사주 입력 폼
  export type SajuFormData = {
    nickname: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: string
    gender: 'male' | 'female'
  }