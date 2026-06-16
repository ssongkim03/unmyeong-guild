'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacterStore } from '@/store/characterStore'

const HOURS = [
  { value: '', label: '모름' },
  { value: '자시(23~01시)', label: '🌑 자시 23~01시' },
  { value: '축시(01~03시)', label: '🌒 축시 01~03시' },
  { value: '인시(03~05시)', label: '🌓 인시 03~05시' },
  { value: '묘시(05~07시)', label: '🌔 묘시 05~07시' },
  { value: '진시(07~09시)', label: '🌕 진시 07~09시' },
  { value: '사시(09~11시)', label: '🌖 사시 09~11시' },
  { value: '오시(11~13시)', label: '🌗 오시 11~13시' },
  { value: '미시(13~15시)', label: '🌘 미시 13~15시' },
  { value: '신시(15~17시)', label: '⭐ 신시 15~17시' },
  { value: '유시(17~19시)', label: '🌙 유시 17~19시' },
  { value: '술시(19~21시)', label: '🌛 술시 19~21시' },
  { value: '해시(21~23시)', label: '🌜 해시 21~23시' },
]

const CLASS_INFO: Record<string, {
  icon: string; color: string; desc: string
  lore: string; role: string
  strength: string; weakness: string
  famousType: string; compatibility: string
  bgGradient: string
}> = {
  Warrior:   {
    icon: '⚔️', color: '#e85a4f',
    desc: '강인한 리더십의 전사',
    lore: '甲木(갑목)은 하늘을 향해 곧게 뻗는 큰 나무예요. 흔들리지 않는 의지와 타고난 리더십으로 어떤 역경도 뚫고 나가는 개척자 타입이에요.',
    role: '⚔️ 딜러 / 리더',
    strength: '강한 추진력으로 목표를 향해 직진해요. 사람들이 자연스럽게 따르는 카리스마가 있어요.',
    weakness: '고집이 세서 타협이 어렵고, 남의 말을 잘 안 듣는 편이에요.',
    famousType: '창업가, 운동선수, 정치인 타입',
    compatibility: '🌊 소서러(壬水)와 최상의 궁합 — 물이 나무를 키우듯',
    bgGradient: 'from-red-900/30 to-orange-900/20',
  },
  Ranger:    {
    icon: '🏹', color: '#5cb85c',
    desc: '자유로운 영혼의 레인저',
    lore: '乙木(을목)은 바람에 유연하게 휘어지는 풀과 덩굴이에요. 어떤 환경에서도 살아남는 강한 생존력과 뛰어난 눈치로 상황을 읽어요.',
    role: '🏹 서포터 / 탐색가',
    strength: '적응력과 눈치가 최고예요. 어떤 상황에서도 길을 찾아내요.',
    weakness: '우유부단하고 줏대 없어 보일 때가 있어요.',
    famousType: '외교관, 마케터, 예술가 타입',
    compatibility: '💧 위자드(癸水)와 최상의 궁합 — 이슬이 풀을 촉촉하게',
    bgGradient: 'from-green-900/30 to-emerald-900/20',
  },
  Mage:      {
    icon: '🔮', color: '#7b5ea7',
    desc: '강렬한 카리스마의 마법사',
    lore: '丙火(병화)는 온 세상을 밝히는 태양이에요. 어디서든 눈에 띄는 존재감과 폭발적인 에너지로 주변을 압도해요.',
    role: '🔮 메인 딜러 / 인플루언서',
    strength: '뜨거운 열정과 화려한 존재감. 사람들의 시선을 자연스럽게 끌어요.',
    weakness: '감정 기복이 크고 번아웃이 올 수 있어요.',
    famousType: '연예인, 강연가, CEO 타입',
    compatibility: '🌿 전사(甲木)와 최상의 궁합 — 나무가 불을 키우듯',
    bgGradient: 'from-purple-900/30 to-violet-900/20',
  },
  Healer:    {
    icon: '💚', color: '#f0c040',
    desc: '따뜻한 치유력의 힐러',
    lore: '丁火(정화)는 어둠 속에서 빛나는 촛불이에요. 조용하지만 포기하지 않는 불꽃처럼, 주변 사람들에게 따뜻한 위안을 줘요.',
    role: '💚 힐러 / 감성 리더',
    strength: '공감 능력과 섬세함이 탁월해요. 사람들의 마음을 치유해요.',
    weakness: '너무 감정 이입해서 본인이 지칠 수 있어요.',
    famousType: '상담사, 의료인, 교육자 타입',
    compatibility: '🌿 레인저(乙木)와 최상의 궁합 — 나무가 불을 살리듯',
    bgGradient: 'from-yellow-900/30 to-amber-900/20',
  },
  Knight:    {
    icon: '🛡️', color: '#8b7355',
    desc: '묵직한 안정감의 나이트',
    lore: '戊土(무토)는 높고 웅장한 산이에요. 움직이지 않는 것처럼 보이지만 모든 것을 품는 포용력으로 주변의 기둥 역할을 해요.',
    role: '🛡️ 탱커 / 수호자',
    strength: '믿음직하고 책임감이 강해요. 위기 상황에 가장 빛나는 타입이에요.',
    weakness: '변화에 느리고 새로운 것에 거부감이 있어요.',
    famousType: '공무원, 금융인, 건축가 타입',
    compatibility: '🔥 마법사(丙火)와 최상의 궁합 — 불이 땅을 따뜻하게',
    bgGradient: 'from-amber-900/30 to-stone-900/20',
  },
  Sage:      {
    icon: '📜', color: '#d4a843',
    desc: '깊은 지혜의 세이지',
    lore: '己土(기토)는 만물을 키우는 비옥한 논밭이에요. 겉은 온화하지만 속에는 깊은 통찰과 지혜를 품고 있는 조언자예요.',
    role: '📜 서포터 / 전략가',
    strength: '포용력과 통찰력이 뛰어나요. 복잡한 상황을 꿰뚫어보는 눈이 있어요.',
    weakness: '결단력이 부족하고 우유부단해 보일 수 있어요.',
    famousType: '컨설턴트, 작가, 철학자 타입',
    compatibility: '💚 힐러(丁火)와 최상의 궁합 — 불이 대지를 데우듯',
    bgGradient: 'from-yellow-900/30 to-lime-900/20',
  },
  Berserker: {
    icon: '🪓', color: '#c0392b',
    desc: '폭발적인 결단력의 버서커',
    lore: '庚金(경금)은 날카롭게 단련된 강철 도끼예요. 한번 결심하면 절대 물러서지 않는 강철 같은 의지와 폭발적인 실행력을 가졌어요.',
    role: '🪓 어그로 딜러 / 개혁가',
    strength: '강력한 실행력과 돌파력. 불가능해 보이는 것도 해내요.',
    weakness: '감정 조절이 어렵고 충동적일 수 있어요.',
    famousType: '군인, 운동선수, 혁명가 타입',
    compatibility: '🌍 나이트(戊土)와 최상의 궁합 — 땅에서 쇠가 나오듯',
    bgGradient: 'from-red-900/30 to-rose-900/20',
  },
  Assassin:  {
    icon: '🗡️', color: '#9b59b6',
    desc: '예리한 완벽주의 어쌔신',
    lore: '辛金(신금)은 정교하게 세공된 보석이에요. 날카로운 분석력과 완벽을 향한 집념으로 누구도 발견 못 한 것을 찾아내요.',
    role: '🗡️ 크리티컬 딜러 / 분석가',
    strength: '분석력과 집중력이 최고예요. 디테일에서 남들이 못 보는 것을 봐요.',
    weakness: '완벽주의로 인해 스트레스가 많고 결과물이 늦을 수 있어요.',
    famousType: '연구원, 의사, 프로그래머 타입',
    compatibility: '🌍 세이지(己土)와 최상의 궁합 — 땅에서 보석이 나오듯',
    bgGradient: 'from-purple-900/30 to-fuchsia-900/20',
  },
  Sorcerer:  {
    icon: '🌊', color: '#2980b9',
    desc: '신비로운 직관의 소서러',
    lore: '壬水(임수)는 모든 것을 담는 깊고 넓은 바다예요. 끝없는 호기심과 날카로운 직관으로 남들이 보지 못하는 본질을 꿰뚫어 봐요.',
    role: '🌊 마법 딜러 / 탐구자',
    strength: '직관력과 창의력이 탁월해요. 아이디어가 끊임없이 샘솟아요.',
    weakness: '현실 감각이 부족하고 실행력이 약할 수 있어요.',
    famousType: '예술가, 과학자, 철학자 타입',
    compatibility: '⚙️ 버서커(庚金)와 최상의 궁합 — 쇠가 물을 만들어내듯',
    bgGradient: 'from-blue-900/30 to-cyan-900/20',
  },
  Wizard:    {
    icon: '⚡', color: '#16a085',
    desc: '섬세한 감수성의 위자드',
    lore: '癸水(계수)는 새벽 이슬이나 촉촉한 빗물이에요. 예민한 감수성으로 남들이 느끼지 못하는 미묘한 것들을 포착하는 신비로운 존재예요.',
    role: '⚡ 서포트 마법사 / 예언가',
    strength: '감수성과 상상력이 풍부해요. 예술적 감각이 탁월해요.',
    weakness: '예민함으로 상처받기 쉽고 감정 소모가 많아요.',
    famousType: '예술가, 음악가, 작가 타입',
    compatibility: '⚙️ 어쌔신(辛金)과 최상의 궁합 — 쇠가 물을 만들어내듯',
    bgGradient: 'from-teal-900/30 to-emerald-900/20',
  },
}

const STAT_INFO = [
  { key: 'stat_wood',  label: 'AGI 민첩', element: '목(木)', icon: '🌿', color: '#5cb85c', desc: '성장·유연성·적응력' },
  { key: 'stat_fire',  label: 'ATK 공격력', element: '화(火)', icon: '🔥', color: '#e85a4f', desc: '열정·추진력·카리스마' },
  { key: 'stat_earth', label: 'DEF 방어력', element: '토(土)', icon: '🌍', color: '#d4a843', desc: '안정·포용력·신뢰감' },
  { key: 'stat_metal', label: 'INT 지능', element: '금(金)', icon: '⚙️', color: '#a0b8d0', desc: '결단·분석력·완벽주의' },
  { key: 'stat_water', label: 'MP 마나', element: '수(水)', icon: '🌊', color: '#2980b9', desc: '직관·창의력·감수성' },
]

export default function CreatePage() {
  const router = useRouter()
  const { setMyCharacter } = useCharacterStore()

  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'stats' | 'story' | 'relation'>('story')

  const [form, setForm] = useState({
    nickname: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    gender: '' as 'male' | 'female' | '',
  })

  const loadingMessages = [
    '천간지지를 계산하는 중...',
    '오행의 균형을 분석하는 중...',
    '운명 클래스를 결정하는 중...',
    '스탯을 산출하는 중...',
    '당신의 이야기를 쓰는 중...',
  ]
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0])

  async function handleSubmit() {
    setError('')
    if (!form.nickname || !form.birthYear || !form.birthMonth || !form.birthDay || !form.gender) {
      setError('모든 항목을 입력해주세요')
      return
    }
    setStep('loading')
    let msgIdx = 0
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[msgIdx])
    }, 1200)

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: form.nickname,
          birthYear: parseInt(form.birthYear),
          birthMonth: parseInt(form.birthMonth),
          birthDay: parseInt(form.birthDay),
          birthHour: form.birthHour,
          gender: form.gender,
        }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (!res.ok) throw new Error(data.error)
      setResult(data.character)
      setMyCharacter(data.character)
      setStep('result')
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || '오류가 발생했습니다')
      setStep('form')
    }
  }

  const classInfo = result ? CLASS_INFO[result.character_class] : null

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push('/')} className="text-white/40 hover:text-white transition-colors">←</button>
          <h1 className="text-xl font-bold text-purple-300">🔮 캐릭터 생성</h1>
        </div>

        <AnimatePresence mode="wait">

          {/* 입력 폼 */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-2">닉네임</label>
                <input
                  type="text"
                  placeholder="운명길드에서 사용할 이름"
                  value={form.nickname}
                  onChange={e => setForm({ ...form, nickname: e.target.value })}
                  maxLength={10}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">생년월일</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number" placeholder="년도"
                    value={form.birthYear}
                    onChange={e => setForm({ ...form, birthYear: e.target.value })}
                    min={1900} max={2024}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={form.birthMonth}
                    onChange={e => setForm({ ...form, birthMonth: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="" className="bg-[#1a1528]">월</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={i+1} className="bg-[#1a1528]">{i+1}월</option>
                    ))}
                  </select>
                  <input
                    type="number" placeholder="일"
                    value={form.birthDay}
                    onChange={e => setForm({ ...form, birthDay: e.target.value })}
                    min={1} max={31}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">태어난 시간 (선택 — 입력할수록 더 정확해요)</label>
                <select
                  value={form.birthHour}
                  onChange={e => setForm({ ...form, birthHour: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {HOURS.map(h => (
                    <option key={h.value} value={h.value} className="bg-[#1a1528]">{h.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">성별</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setForm({ ...form, gender: g })}
                      className={`py-3 rounded-xl border font-medium transition-all ${
                        form.gender === g
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {g === 'male' ? '⚔️ 남성' : '🌸 여성'}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/40 mt-4"
              >
                ✨ 운명 분석 시작
              </motion.button>
            </motion.div>
          )}

          {/* 로딩 */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🔮</div>
              </div>
              <p className="text-purple-300 text-lg font-medium animate-pulse">{loadingMsg}</p>
              <p className="text-white/20 text-sm">만세력으로 사주팔자를 계산하고 있어요</p>
            </motion.div>
          )}

          {/* 결과 */}
          {step === 'result' && result && classInfo && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">

              {/* 메인 클래스 카드 */}
              <div
                className={`rounded-2xl p-7 text-center border relative overflow-hidden bg-gradient-to-br ${classInfo.bgGradient}`}
                style={{ borderColor: `${classInfo.color}40` }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${classInfo.color}, transparent 65%)` }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-6xl mb-3 relative z-10"
                >
                  {classInfo.icon}
                </motion.div>
                <p className="text-xs tracking-[0.25em] text-white/30 uppercase mb-1 relative z-10">{result.day_master}</p>
                <h2 className="text-3xl font-black mb-1 relative z-10" style={{ color: classInfo.color }}>
                  {result.class_name_kr}
                </h2>
                <p className="text-white/40 text-sm mb-1 relative z-10">{classInfo.role}</p>
                <p className="text-white/60 text-sm mb-4 relative z-10">{classInfo.desc}</p>
                <div className="inline-block bg-white/10 rounded-full px-5 py-2 text-white font-bold relative z-10">
                  {result.nickname}
                </div>
                {result.pillars && (
                  <p className="text-white/15 text-xs font-mono mt-3 tracking-[0.2em] relative z-10">{result.pillars}</p>
                )}
              </div>

              {/* 탭 */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'story', label: '📖 스토리' },
                  { key: 'stats', label: '⚔️ 스탯' },
                  { key: 'relation', label: '💞 관계' },
                ] as const).map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === t.key
                        ? 'bg-purple-600/40 border border-purple-500/50 text-purple-300'
                        : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* 스토리 탭 */}
                {activeTab === 'story' && (
                  <motion.div key="story" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/30 tracking-widest uppercase mb-3">✨ 기질</p>
                      <p className="text-white/60 text-sm leading-relaxed">{result.personality}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/30 tracking-widest uppercase mb-3">📖 클래스 설명</p>
                      <p className="text-white/70 text-sm leading-relaxed">{classInfo.lore}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-green-900/15 border border-green-500/20">
                        <p className="text-xs text-green-400 mb-2">💪 강점</p>
                        <p className="text-white/60 text-xs leading-relaxed">{classInfo.strength}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-red-900/15 border border-red-500/20">
                        <p className="text-xs text-red-400 mb-2">⚠️ 약점</p>
                        <p className="text-white/60 text-xs leading-relaxed">{classInfo.weakness}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/30 tracking-widest uppercase mb-2">🎯 실제 직업 타입</p>
                      <p className="text-white/60 text-sm">{classInfo.famousType}</p>
                    </div>
                  </motion.div>
                )}

                {/* 스탯 탭 */}
                {activeTab === 'stats' && (
                  <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
                      <p className="text-xs text-white/30 tracking-widest uppercase">⚔️ 오행 스탯</p>
                      {STAT_INFO.map((stat, i) => {
                        const val = result[`stat_${stat.key.replace('stat_', '')}`] ?? result[stat.key] ?? 0
                        return (
                          <div key={stat.key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span>{stat.icon}</span>
                                <span className="text-sm text-white/70">{stat.label}</span>
                                <span className="text-[10px] text-white/25">{stat.element}</span>
                              </div>
                              <span className="text-sm font-mono font-bold" style={{ color: stat.color }}>{val}</span>
                            </div>
                            <div className="w-full bg-white/8 rounded-full h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                                className="h-2.5 rounded-full"
                                style={{ backgroundColor: stat.color }}
                              />
                            </div>
                            <p className="text-[11px] text-white/20 mt-1">{stat.desc}</p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 관계 탭 */}
                {activeTab === 'relation' && (
                  <motion.div key="relation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/30 tracking-widest uppercase mb-3">💞 최고 궁합</p>
                      <p className="text-white/70 text-sm leading-relaxed">{classInfo.compatibility}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/20">
                      <p className="text-xs text-purple-400 tracking-widest uppercase mb-3">🏰 파티에서의 역할</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        당신은 <span style={{ color: classInfo.color }} className="font-bold">{classInfo.role}</span> 포지션이에요.
                        파티에서 {classInfo.strength.slice(0, 30)}... 같은 강점을 발휘해요.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
                      <p className="text-xs text-white/30 tracking-widest uppercase mb-3">⚠️ 함께하면 힘든 타입</p>
                      <p className="text-white/50 text-sm">오행 상극 관계에 있는 클래스와는 초반 마찰이 있을 수 있지만, 서로의 차이를 이해하면 강력한 파티가 될 수 있어요.</p>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* 공유 코드 */}
              <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30">
                <p className="text-xs text-purple-400 tracking-widest uppercase mb-2">🔑 내 공유 코드</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-mono font-black text-purple-300 tracking-widest">{result.share_code}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.share_code)}
                    className="px-4 py-2 bg-purple-600/30 border border-purple-500/40 rounded-lg text-purple-300 text-sm"
                  >
                    📋 복사
                  </button>
                </div>
                <p className="text-white/30 text-xs mt-2">친구에게 이 코드를 공유해서 궁합을 분석해보세요</p>
              </div>

              {/* 버튼 */}
              <div className="grid grid-cols-2 gap-3 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/party')}
                  className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold"
                >
                  🏰 파티 결성하기
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setStep('form'); setResult(null) }}
                  className="py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white/60"
                >
                  🔄 다시 만들기
                </motion.button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}