import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CharacterClass, ElementStat } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 일간 → 클래스 매핑
export const DAY_MASTER_CLASS: Record<string, CharacterClass> = {
  '甲木': 'Warrior',
  '乙木': 'Ranger',
  '丙火': 'Mage',
  '丁火': 'Healer',
  '戊土': 'Knight',
  '己土': 'Sage',
  '庚金': 'Berserker',
  '辛金': 'Assassin',
  '壬水': 'Sorcerer',
  '癸水': 'Wizard',
}

// 클래스 한국어명
export const CLASS_NAME_KR: Record<CharacterClass, string> = {
  Warrior:   '전사',
  Ranger:    '레인저',
  Mage:      '마법사',
  Healer:    '힐러',
  Knight:    '나이트',
  Sage:      '세이지',
  Berserker: '버서커',
  Assassin:  '어쌔신',
  Sorcerer:  '소서러',
  Wizard:    '위자드',
}

// 클래스별 컬러
export const CLASS_COLOR: Record<CharacterClass, string> = {
  Warrior:   '#e85a4f',
  Ranger:    '#5cb85c',
  Mage:      '#7b5ea7',
  Healer:    '#f0c040',
  Knight:    '#8b7355',
  Sage:      '#d4a843',
  Berserker: '#c0392b',
  Assassin:  '#9b59b6',
  Sorcerer:  '#2980b9',
  Wizard:    '#16a085',
}

// 스탯 레이블
export const STAT_LABEL: Record<keyof ElementStat, string> = {
  wood:  'AGI',
  fire:  'ATK',
  earth: 'DEF',
  metal: 'INT',
  water: 'MP',
}

// 오행 한자
export const ELEMENT_KR: Record<keyof ElementStat, string> = {
  wood:  '목 木',
  fire:  '화 火',
  earth: '토 土',
  metal: '금 金',
  water: '수 水',
}

// 궁합 점수 → 등급
export function getCompatibilityGrade(score: number) {
  if (score >= 90) return { grade: 'S', label: '소울메이트', color: '#f0c040' }
  if (score >= 75) return { grade: 'A', label: '최강 파티', color: '#7b5ea7' }
  if (score >= 60) return { grade: 'B', label: '좋은 전우', color: '#5cb85c' }
  if (score >= 40) return { grade: 'C', label: '평범한 동료', color: '#5bc0de' }
  return { grade: 'D', label: '라이벌', color: '#e85a4f' }
}

// 6자리 랜덤 코드 생성
export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}