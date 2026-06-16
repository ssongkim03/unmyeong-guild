'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCharacterStore } from '@/store/characterStore'

const CLASS_INFO: Record<string, { icon: string; color: string; desc: string; strength: string; weakness: string }> = {
  Warrior:   { icon: '⚔️', color: '#e85a4f', desc: '강인한 리더십의 전사', strength: '추진력과 결단력이 탁월해요', weakness: '때로 고집이 너무 셀 수 있어요' },
  Ranger:    { icon: '🏹', color: '#5cb85c', desc: '자유로운 영혼의 레인저', strength: '적응력과 유연성이 뛰어나요', weakness: '한 곳에 오래 집중하기 어려워요' },
  Mage:      { icon: '🔮', color: '#7b5ea7', desc: '강렬한 카리스마의 마법사', strength: '열정과 창의력이 넘쳐요', weakness: '감정 기복이 있을 수 있어요' },
  Healer:    { icon: '💚', color: '#f0c040', desc: '따뜻한 치유력의 힐러', strength: '섬세함과 공감 능력이 탁월해요', weakness: '자신보다 타인을 너무 챙겨요' },
  Knight:    { icon: '🛡️', color: '#8b7355', desc: '묵직한 안정감의 나이트', strength: '신뢰감과 책임감이 강해요', weakness: '변화에 적응하는 게 느릴 수 있어요' },
  Sage:      { icon: '📜', color: '#d4a843', desc: '깊은 지혜의 세이지', strength: '포용력과 통찰력이 뛰어나요', weakness: '결단을 내리기 어려워하는 편이에요' },
  Berserker: { icon: '🪓', color: '#c0392b', desc: '폭발적인 결단력의 버서커', strength: '강력한 실행력과 돌파력이 있어요', weakness: '감정 컨트롤이 필요해요' },
  Assassin:  { icon: '🗡️', color: '#9b59b6', desc: '예리한 완벽주의 어쌔신', strength: '분석력과 집중력이 최고예요', weakness: '완벽주의로 스트레스를 받아요' },
  Sorcerer:  { icon: '🌊', color: '#2980b9', desc: '신비로운 직관의 소서러', strength: '직관력과 창의력이 탁월해요', weakness: '현실적인 부분을 놓칠 수 있어요' },
  Wizard:    { icon: '⚡', color: '#16a085', desc: '섬세한 감수성의 위자드', strength: '감수성과 상상력이 풍부해요', weakness: '예민함으로 상처받기 쉬워요' },
}

const STAT_INFO = [
  { key: 'stat_wood',  label: 'AGI 민첩', element: '목(木)', icon: '🌿', color: '#5cb85c', desc: '성장·유연성·적응력' },
  { key: 'stat_fire',  label: 'ATK 공격력', element: '화(火)', icon: '🔥', color: '#e85a4f', desc: '열정·추진력·카리스마' },
  { key: 'stat_earth', label: 'DEF 방어력', element: '토(土)', icon: '🌍', color: '#d4a843', desc: '안정·포용력·신뢰감' },
  { key: 'stat_metal', label: 'INT 지능', element: '금(金)', icon: '⚙️', color: '#a0b8d0', desc: '결단·분석력·완벽주의' },
  { key: 'stat_water', label: 'MP 마나', element: '수(水)', icon: '🌊', color: '#2980b9', desc: '직관·창의력·감수성' },
]

function getStatComment(key: string, value: number): string {
  const high: Record<string, string> = {
    stat_wood:  '성장 욕구가 강하고 변화에 잘 적응해요',
    stat_fire:  '열정이 넘치고 주변을 이끄는 힘이 있어요',
    stat_earth: '안정적이고 믿음직스러운 존재예요',
    stat_metal: '분석적이고 완벽을 추구하는 타입이에요',
    stat_water: '직관이 뛰어나고 창의적인 아이디어가 많아요',
  }
  const low: Record<string, string> = {
    stat_wood:  '한 곳에 집중하는 끈기가 강점이에요',
    stat_fire:  '차분하고 신중하게 행동하는 편이에요',
    stat_earth: '변화와 도전을 즐기는 스타일이에요',
    stat_metal: '직관과 감성으로 결정하는 편이에요',
    stat_water: '현실적이고 실용적인 사고를 해요',
  }
  return value >= 30 ? (high[key] || '') : (low[key] || '')
}

export default function CharacterPage() {
  const router = useRouter()
  const { myCharacter, clearCharacter } = useCharacterStore()

  if (!myCharacter) {
    return (
      <main className="min-h-screen bg-[#0d0d1a] text-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-5xl mb-6">🏰</p>
          <p className="text-white/60 mb-6">아직 캐릭터가 없어요</p>
          <button
            onClick={() => router.push('/create')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold"
          >캐릭터 만들기</button>
        </div>
      </main>
    )
  }

  const classInfo = CLASS_INFO[myCharacter.character_class]
  const topStat = STAT_INFO.reduce((a, b) =>
    (myCharacter[a.key] ?? 0) > (myCharacter[b.key] ?? 0) ? a : b
  )
  const bottomStat = STAT_INFO.reduce((a, b) =>
    (myCharacter[a.key] ?? 0) < (myCharacter[b.key] ?? 0) ? a : b
  )

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-white/40 hover:text-white transition-colors">←</button>
            <h1 className="text-xl font-bold text-purple-300">🧙 내 캐릭터</h1>
          </div>
          <button
            onClick={() => router.push('/party')}
            className="text-sm bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-lg px-3 py-1.5"
          >🏰 파티 보기</button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 text-center border mb-4 relative overflow-hidden"
          style={{ background: `${classInfo.color}12`, borderColor: `${classInfo.color}35` }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(circle at 50% 50%, ${classInfo.color}, transparent 70%)` }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-4 relative z-10"
          >{classInfo.icon}</motion.div>
          <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-2 relative z-10">{myCharacter.day_master}</p>
          <h2 className="text-4xl font-black mb-2 relative z-10" style={{ color: classInfo.color }}>
            {myCharacter.class_name_kr}
          </h2>
          <p className="text-white/50 text-sm mb-4 relative z-10">{classInfo.desc}</p>
          <div className="inline-block bg-white/10 rounded-full px-5 py-2 text-white font-semibold relative z-10">
            {myCharacter.nickname}
          </div>
          {myCharacter.pillars && (
            <p className="text-white/20 text-xs font-mono mt-3 tracking-widest relative z-10">{myCharacter.pillars}</p>
          )}
        </motion.div>

        {myCharacter.personality && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white/4 border border-white/8 mb-4 text-center"
          >
            <p className="text-white/60 text-sm">✨ {myCharacter.personality}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl bg-white/3 border border-white/8 mb-4"
        >
          <p className="text-xs text-white/30 tracking-widest uppercase mb-5">⚔️ 오행 스탯</p>
          <div className="space-y-4">
            {STAT_INFO.map((stat, i) => {
              const val = myCharacter[stat.key] ?? 0
              return (
                <div key={stat.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{stat.icon}</span>
                      <span className="text-sm text-white/70">{stat.label}</span>
                      <span className="text-[10px] text-white/30">{stat.element}</span>
                    </div>
                    <span className="text-sm font-mono font-bold" style={{ color: stat.color }}>{val}</span>
                  </div>
                  <div className="w-full bg-white/8 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                  <p className="text-[11px] text-white/25 mt-1">{stat.desc}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="p-4 rounded-2xl bg-green-900/15 border border-green-500/20">
            <p className="text-xs text-green-400 mb-2">💪 강점</p>
            <p className="text-white/60 text-xs leading-relaxed">{classInfo.strength}</p>
            <p className="text-[11px] text-green-400/60 mt-2">{topStat.icon} {topStat.element} 강함</p>
          </div>
          <div className="p-4 rounded-2xl bg-red-900/15 border border-red-500/20">
            <p className="text-xs text-red-400 mb-2">⚠️ 약점</p>
            <p className="text-white/60 text-xs leading-relaxed">{classInfo.weakness}</p>
            <p className="text-[11px] text-red-400/60 mt-2">{bottomStat.icon} {bottomStat.element} 약함</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl bg-white/3 border border-white/8 mb-4"
        >
          <p className="text-xs text-white/30 tracking-widest uppercase mb-4">🔍 오행 분석</p>
          <div className="space-y-3">
            {STAT_INFO.map(stat => {
              const val = myCharacter[stat.key] ?? 0
              return (
                <div key={stat.key} className="flex gap-3 items-start">
                  <span className="text-base mt-0.5">{stat.icon}</span>
                  <div>
                    <span className="text-xs font-medium" style={{ color: stat.color }}>{stat.label} {val} </span>
                    <span className="text-xs text-white/30">· {getStatComment(stat.key, val)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30 mb-4"
        >
          <p className="text-xs text-purple-400 tracking-widest uppercase mb-2">🔑 내 공유 코드</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-mono font-black text-purple-300 tracking-widest">{myCharacter.share_code}</p>
            <button
              onClick={() => navigator.clipboard.writeText(myCharacter.share_code)}
              className="px-4 py-2 bg-purple-600/30 border border-purple-500/40 rounded-lg text-purple-300 text-sm"
            >📋 복사</button>
          </div>
          <p className="text-white/30 text-xs mt-2">친구에게 이 코드를 공유해서 궁합을 확인해보세요</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/party')}
            className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-sm"
          >🏰 파티 결성하기</motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { clearCharacter(); router.push('/create') }}
            className="py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-sm text-white/60"
          >🔄 새 캐릭터 만들기</motion.button>
        </div>

      </div>
    </main>
  )
}