// 오행 스탯
export type ElementStat = {
    wood: number   // 목 → AGI
    fire: number   // 화 → ATK
    earth: number  // 토 → DEF
    metal: number  // 금 → INT
    water: number  // 수 → MP
  }
  
  // 일간별 클래스
  export type CharacterClass =
    | 'Warrior'    // 甲木
    | 'Ranger'     // 乙木
    | 'Mage'       // 丙火
    | 'Healer'     // 丁火
    | 'Knight'     // 戊土
    | 'Sage'       // 己土
    | 'Berserker'  // 庚金
    | 'Assassin'   // 辛金
    | 'Sorcerer'   // 壬水
    | 'Wizard'     // 癸水
  
  // 캐릭터
  export type Character = {
    id: string
    userId: string
    nickname: string
    birthYear: number
    birthMonth: number
    birthDay: number
    birthHour: string | null
    gender: 'male' | 'female'
    dayMaster: string        // 일간 한자 (甲木 등)
    characterClass: CharacterClass
    classNameKr: string      // 한국어 클래스명
    stats: ElementStat
    shareCode: string        // 6자리 친구 초대 코드
    createdAt: string
  }
  
  // 궁합 결과
  export type CompatibilityResult = {
    id: string
    characterA: Character
    characterB: Character
    score: number            // 0~100
    partyType: string        // "전우", "소울메이트" 등
    analysis: string         // AI 해설
    elementSynergy: string   // 오행 상생/상극 분석
    createdAt: string
  }
  
  // 파티
  export type Party = {
    id: string
    name: string
    createdBy: string
    members: Character[]
    createdAt: string
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