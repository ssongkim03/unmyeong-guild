'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacterStore } from '@/store/characterStore'

const CLASS_INFO: Record<string, { icon: string; color: string }> = {
  Warrior:   { icon: '⚔️', color: '#e85a4f' },
  Ranger:    { icon: '🏹', color: '#5cb85c' },
  Mage:      { icon: '🔮', color: '#7b5ea7' },
  Healer:    { icon: '💚', color: '#f0c040' },
  Knight:    { icon: '🛡️', color: '#8b7355' },
  Sage:      { icon: '📜', color: '#d4a843' },
  Berserker: { icon: '🪓', color: '#c0392b' },
  Assassin:  { icon: '🗡️', color: '#9b59b6' },
  Sorcerer:  { icon: '🌊', color: '#2980b9' },
  Wizard:    { icon: '⚡', color: '#16a085' },
}

const STAT_INFO = [
  { key: 'stat_wood',  label: 'AGI', icon: '🌿', color: '#5cb85c' },
  { key: 'stat_fire',  label: 'ATK', icon: '🔥', color: '#e85a4f' },
  { key: 'stat_earth', label: 'DEF', icon: '🌍', color: '#d4a843' },
  { key: 'stat_metal', label: 'INT', icon: '⚙️', color: '#a0b8d0' },
  { key: 'stat_water', label: 'MP',  icon: '🌊', color: '#2980b9' },
]

export default function PartyPage() {
  const router = useRouter()
  const { myCharacter } = useCharacterStore()

  const [tab, setTab] = useState<'find' | 'create' | 'join'>('find')

  // 궁합 보기
  const [shareCode, setShareCode] = useState('')
  const [foundChar, setFoundChar] = useState<any>(null)
  const [compatibility, setCompatibility] = useState<any>(null)

  // 파티 만들기
  const [partyName, setPartyName] = useState('')
  const [createdParty, setCreatedParty] = useState<any>(null)

  // 파티 참가
  const [inviteCode, setInviteCode] = useState('')
  const [joinedParty, setJoinedParty] = useState<any>(null)
  const [partyMembers, setPartyMembers] = useState<any[]>([])
  const [partyCompatibilities, setPartyCompatibilities] = useState<any[]>([])

  // 공통
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')

  // 친구 캐릭터 검색
  async function searchCharacter() {
    if (!shareCode.trim()) { setError('공유 코드를 입력해주세요'); return }
    if (!myCharacter) { setError('먼저 내 캐릭터를 만들어주세요'); return }
    setError('')
    setLoading(true)
    setLoadingMsg('캐릭터 검색 중...')
    try {
      const res = await fetch(`/api/characters?code=${shareCode.toUpperCase().trim()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFoundChar(data.character)
    } catch (err: any) {
      setError(err.message || '캐릭터를 찾을 수 없어요')
    } finally {
      setLoading(false)
    }
  }

  // 1:1 궁합 분석
  async function analyzeCompatibility() {
    if (!myCharacter || !foundChar) return
    setLoading(true)
    const msgs = ['천간합·지지합 분석 중...', '오행 상생·상극 계산 중...', '충·형·삼합 확인 중...', '궁합 점수 산출 중...']
    let idx = 0
    setLoadingMsg(msgs[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % msgs.length
      setLoadingMsg(msgs[idx])
    }, 1200)
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterAId: myCharacter.id, characterBId: foundChar.id }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok) throw new Error(data.error)
      setCompatibility(data.result)
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || '궁합 분석 중 오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  // 파티 생성
  async function createParty() {
    if (!partyName.trim()) { setError('파티명을 입력해주세요'); return }
    if (!myCharacter) { setError('먼저 내 캐릭터를 만들어주세요'); return }
    setError('')
    setLoading(true)
    setLoadingMsg('파티 생성 중...')
    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: partyName, characterId: myCharacter.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCreatedParty(data.party)
    } catch (err: any) {
      setError(err.message || '파티 생성 중 오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  // 파티 참가
  async function joinParty() {
    if (!inviteCode.trim()) { setError('초대 코드를 입력해주세요'); return }
    if (!myCharacter) { setError('먼저 내 캐릭터를 만들어주세요'); return }
    setError('')
    setLoading(true)

    const msgs = ['파티 참가 중...', '파티원 궁합 분석 중...', '오행 상성 계산 중...', '천간합·지지합 확인 중...']
    let idx = 0
    setLoadingMsg(msgs[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % msgs.length
      setLoadingMsg(msgs[idx])
    }, 1500)

    try {
      const res = await fetch('/api/parties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode: inviteCode.toUpperCase().trim(),
          characterId: myCharacter.id,
        }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok) throw new Error(data.error)
      setJoinedParty(data.party)
      setPartyMembers(data.members || [])
      setPartyCompatibilities(data.compatibilities || [])
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || '파티 참가 중 오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  function getGradeColor(grade: string) {
    const colors: Record<string, string> = {
      S: '#f0c040', A: '#7b5ea7', B: '#5cb85c', C: '#5bc0de', D: '#e85a4f'
    }
    return colors[grade] || '#888'
  }

  function getGrade(score: number) {
    if (score >= 90) return { grade: 'S', label: '소울메이트', color: '#f0c040' }
    if (score >= 75) return { grade: 'A', label: '최강 파티', color: '#7b5ea7' }
    if (score >= 60) return { grade: 'B', label: '좋은 전우', color: '#5cb85c' }
    if (score >= 40) return { grade: 'C', label: '동반자', color: '#5bc0de' }
    return { grade: 'D', label: '라이벌', color: '#e85a4f' }
  }

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push('/')} className="text-white/40 hover:text-white transition-colors">←</button>
          <h1 className="text-xl font-bold text-purple-300">🏰 파티 시스템</h1>
        </div>

        {/* 캐릭터 없을 때 */}
        {!myCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-yellow-900/20 border border-yellow-500/30 mb-6 text-center"
          >
            <p className="text-yellow-300 font-semibold mb-2">⚠️ 캐릭터가 없어요</p>
            <p className="text-white/50 text-sm mb-4">파티 기능을 사용하려면 먼저 캐릭터를 만들어주세요</p>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-sm"
            >캐릭터 만들기</button>
          </motion.div>
        )}

        {/* 내 캐릭터 미니 카드 */}
        {myCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center gap-4"
          >
            <div className="text-3xl">{CLASS_INFO[myCharacter.character_class]?.icon}</div>
            <div className="flex-1">
              <p className="text-xs text-white/40 mb-0.5">{myCharacter.day_master} · {myCharacter.class_name_kr}</p>
              <p className="font-bold text-white">{myCharacter.nickname}</p>
              {myCharacter.pillars && (
                <p className="text-[10px] text-white/20 font-mono mt-0.5">{myCharacter.pillars}</p>
              )}
            </div>
            <div className="text-xs font-mono text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-lg px-3 py-1.5">
              {myCharacter.share_code}
            </div>
          </motion.div>
        )}

        {/* 탭 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {([
            { key: 'find',   label: '🔍 궁합 보기' },
            { key: 'create', label: '✨ 파티 만들기' },
            { key: 'join',   label: '🚪 파티 참가' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setError(''); setFoundChar(null); setCompatibility(null) }}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-purple-600/40 border border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/80'
              }`}
            >{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── 궁합 보기 탭 ── */}
          {tab === 'find' && (
            <motion.div key="find" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {!foundChar && !compatibility && (
                <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                  <p className="text-sm text-white/60 mb-2">친구의 공유 코드를 입력해서 궁합을 확인해보세요</p>
                  <p className="text-xs text-white/25 mb-4">천간합·지지합·충·형·삼합·오행 상생/상극을 종합 분석해요</p>
                  <div className="flex gap-2">
                    <input
                      value={shareCode}
                      onChange={e => setShareCode(e.target.value.toUpperCase())}
                      placeholder="예: RBD4AB"
                      maxLength={6}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 font-mono tracking-widest focus:outline-none focus:border-purple-500 uppercase"
                    />
                    <button
                      onClick={searchCharacter}
                      disabled={loading}
                      className="px-5 py-3 bg-purple-600 rounded-xl font-medium disabled:opacity-50"
                    >검색</button>
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>}

              {loading && (
                <div className="text-center py-10">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">☯️</div>
                  </div>
                  <p className="text-purple-300 text-sm animate-pulse">{loadingMsg}</p>
                </div>
              )}

              {/* 찾은 캐릭터 */}
              {foundChar && !compatibility && !loading && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <div
                    className="p-5 rounded-2xl border text-center"
                    style={{
                      background: `${CLASS_INFO[foundChar.character_class]?.color}12`,
                      borderColor: `${CLASS_INFO[foundChar.character_class]?.color}30`,
                    }}
                  >
                    <div className="text-4xl mb-2">{CLASS_INFO[foundChar.character_class]?.icon}</div>
                    <p className="text-xs text-white/40 mb-1">{foundChar.day_master} · {foundChar.class_name_kr}</p>
                    <p className="font-bold text-lg text-white mb-1">{foundChar.nickname}</p>
                    <p className="text-xs text-white/30 mb-1">{foundChar.birth_year}년 {foundChar.birth_month}월 {foundChar.birth_day}일생</p>
                    {foundChar.pillars && <p className="text-[10px] text-white/20 font-mono">{foundChar.pillars}</p>}
                  </div>

                  {myCharacter && (
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-3">
                      <p className="text-xs text-white/40 tracking-widest uppercase mb-3">⚔️ 스탯 비교</p>
                      {STAT_INFO.map(stat => {
                        const myVal = myCharacter[stat.key] ?? 0
                        const friendVal = foundChar[stat.key] ?? 0
                        return (
                          <div key={stat.key} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">{stat.icon} {stat.label}</span>
                              <span style={{ color: stat.color }}>{myVal}</span>
                              <span className="text-white/20">vs</span>
                              <span style={{ color: stat.color, opacity: 0.5 }}>{friendVal}</span>
                            </div>
                            <div className="flex gap-1 h-1.5">
                              <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${myVal}%`, backgroundColor: stat.color }} />
                              </div>
                              <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full opacity-40" style={{ width: `${friendVal}%`, backgroundColor: stat.color }} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <p className="text-[10px] text-white/20 text-right">왼쪽: 나 · 오른쪽: 상대방</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={analyzeCompatibility}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg"
                  >💫 궁합 분석하기</motion.button>
                </motion.div>
              )}

              {/* 궁합 결과 */}
              {compatibility && !loading && (() => {
                const grade = getGrade(compatibility.score)
                return (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className="p-6 rounded-2xl border text-center" style={{ background: `${grade.color}12`, borderColor: `${grade.color}30` }}>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-3xl">{CLASS_INFO[myCharacter?.character_class ?? '']?.icon}</span>
                        <div className="text-4xl font-black" style={{ color: grade.color }}>{grade.grade}</div>
                        <span className="text-3xl">{CLASS_INFO[foundChar?.character_class ?? '']?.icon}</span>
                      </div>
                      <div className="text-xl font-bold text-white mb-1">{grade.label}</div>
                      <div className="text-4xl font-black mb-2" style={{ color: grade.color }}>{compatibility.score}점</div>
                      <div className="inline-block text-xs bg-white/10 rounded-full px-4 py-1.5 text-white/60">{compatibility.party_type}</div>
                    </div>

                    {compatibility.details?.length > 0 && (
                      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                        <p className="text-xs text-white/40 tracking-widest uppercase mb-3">☯️ 명리학 분석</p>
                        <div className="space-y-2">
                          {compatibility.details.map((d: string, i: number) => (
                            <p key={i} className="text-sm text-white/70 leading-relaxed">{d}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/40 tracking-widest uppercase mb-3">💬 궁합 해설</p>
                      <p className="text-white/70 text-sm leading-relaxed">{compatibility.analysis}</p>
                    </div>

                    {compatibility.element_synergy && (
                      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                        <p className="text-xs text-white/40 tracking-widest uppercase mb-3">🌿 오행 상성</p>
                        <p className="text-white/70 text-sm leading-relaxed">{compatibility.element_synergy}</p>
                      </div>
                    )}

                    {compatibility.tip && (
                      <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20">
                        <p className="text-xs text-purple-400 tracking-widest uppercase mb-2">💡 파티 팁</p>
                        <p className="text-white/70 text-sm leading-relaxed">{compatibility.tip}</p>
                      </div>
                    )}

                    <button
                      onClick={() => { setFoundChar(null); setCompatibility(null); setShareCode('') }}
                      className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm"
                    >🔄 다른 친구 검색</button>
                  </motion.div>
                )
              })()}
            </motion.div>
          )}

          {/* ── 파티 만들기 탭 ── */}
          {tab === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {!createdParty ? (
                <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
                  <p className="text-sm text-white/60">파티를 만들고 친구에게 초대 코드를 공유하세요. 최대 6명까지 참가할 수 있어요.</p>
                  <input
                    value={partyName}
                    onChange={e => setPartyName(e.target.value)}
                    placeholder="파티 이름 (예: 무적의 오행단)"
                    maxLength={20}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={createParty}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold disabled:opacity-50"
                  >{loading ? '생성 중...' : '✨ 파티 만들기'}</motion.button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <div className="p-6 rounded-2xl bg-purple-900/20 border border-purple-500/30 text-center">
                    <p className="text-purple-300 font-bold text-lg mb-1">🏰 {createdParty.name}</p>
                    <p className="text-white/40 text-sm mb-6">파티가 생성됐어요! 친구에게 초대 코드를 공유하세요</p>
                    <p className="text-xs text-white/40 mb-2">초대 코드</p>
                    <p className="text-4xl font-mono font-black text-purple-300 tracking-widest mb-6">{createdParty.invite_code}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(createdParty.invite_code)}
                      className="px-6 py-2.5 bg-purple-600/30 border border-purple-500/40 rounded-xl text-purple-300 text-sm"
                    >📋 코드 복사</button>
                  </div>
                  <button
                    onClick={() => setCreatedParty(null)}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm"
                  >🔄 새 파티 만들기</button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── 파티 참가 탭 ── */}
          {tab === 'join' && (
            <motion.div key="join" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {!joinedParty ? (
                <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
                  <p className="text-sm text-white/60">친구에게 받은 초대 코드를 입력해서 파티에 참가하세요</p>
                  <input
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="초대 코드 입력"
                    maxLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 font-mono tracking-widest focus:outline-none focus:border-purple-500 uppercase"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={joinParty}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold disabled:opacity-50"
                  >{loading ? loadingMsg : '🚪 파티 참가하기'}</motion.button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">

                  {/* 참가 완료 */}
                  <div className="p-5 rounded-2xl bg-green-900/20 border border-green-500/30 text-center">
                    <p className="text-green-300 font-bold text-lg mb-1">🎉 {joinedParty.name} 참가 완료!</p>
                    <p className="text-white/40 text-sm">파티에 합류했어요</p>
                  </div>

                  {/* 파티원 목록 */}
                  {partyMembers.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-3">
                      <p className="text-xs text-white/40 tracking-widest uppercase mb-2">👥 파티원 ({partyMembers.length}명)</p>
                      {partyMembers.map((member: any, i: number) => {
                        const char = member.characters
                        if (!char) return null
                        const info = CLASS_INFO[char.character_class]
                        return (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                            <div className="text-2xl">{info?.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium text-white text-sm">{char.nickname}</p>
                              <p className="text-xs text-white/30">{char.day_master} · {char.class_name_kr}</p>
                              {char.pillars && <p className="text-[10px] text-white/15 font-mono">{char.pillars}</p>}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {STAT_INFO.map(stat => (
                                <div key={stat.key} className="flex items-center gap-1">
                                  <span className="text-[10px] text-white/20">{stat.label}</span>
                                  <span className="text-[10px] font-mono" style={{ color: stat.color }}>{char[stat.key]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* 파티원 궁합 분석 */}
                  {partyCompatibilities.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
                      <p className="text-xs text-white/40 tracking-widest uppercase">💫 파티원 궁합 분석</p>
                      {partyCompatibilities.map((compat: any, i: number) => {
                        const charA = partyMembers.find((m: any) => m.characters?.id === compat.character_a)?.characters
                        const charB = partyMembers.find((m: any) => m.characters?.id === compat.character_b)?.characters
                        if (!charA || !charB) return null
                        const gradeColor = getGradeColor(compat.grade)
                        return (
                          <div key={i} className="p-4 rounded-xl border" style={{ borderColor: `${gradeColor}30`, background: `${gradeColor}08` }}>
                            {/* 두 캐릭터 + 점수 */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">{CLASS_INFO[charA.character_class]?.icon}</span>
                              <span className="text-sm text-white/70 font-medium">{charA.nickname}</span>
                              <span className="text-white/20 text-xs mx-1">vs</span>
                              <span className="text-xl">{CLASS_INFO[charB.character_class]?.icon}</span>
                              <span className="text-sm text-white/70 font-medium">{charB.nickname}</span>
                              <div className="ml-auto flex items-center gap-2">
                                <span className="font-black text-xl" style={{ color: gradeColor }}>{compat.grade}</span>
                                <span className="text-sm font-bold" style={{ color: gradeColor }}>{compat.score}점</span>
                              </div>
                            </div>

                            {/* 등급 라벨 */}
                            <div className="inline-block text-xs rounded-full px-3 py-0.5 mb-3 font-medium"
                              style={{ background: `${gradeColor}20`, color: gradeColor }}>
                              {compat.label}
                            </div>

                            {/* 명리학 분석 */}
                            {compat.details?.length > 0 && (
                              <div className="space-y-1 mb-3">
                                {compat.details.map((d: string, j: number) => (
                                  <p key={j} className="text-xs text-white/50 leading-relaxed">{d}</p>
                                ))}
                              </div>
                            )}

                            {/* AI 해설 */}
                            {compat.analysis && (
                              <p className="text-xs text-white/60 leading-relaxed border-t border-white/5 pt-2">
                                {compat.analysis}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => { setJoinedParty(null); setPartyMembers([]); setPartyCompatibilities([]); setInviteCode('') }}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm"
                  >🔄 다른 파티 참가</button>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}