'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCharacterStore } from '@/store/characterStore'

const CLASS_LIST = [
  { icon: '⚔️', name: '전사',    element: '목', color: '#5cb85c', desc: '甲木 — 강인한 리더' },
  { icon: '🏹', name: '레인저',  element: '목', color: '#5cb85c', desc: '乙木 — 자유로운 영혼' },
  { icon: '🔮', name: '마법사',  element: '화', color: '#e85a4f', desc: '丙火 — 카리스마 폭발' },
  { icon: '💚', name: '힐러',    element: '화', color: '#f0c040', desc: '丁火 — 따뜻한 치유사' },
  { icon: '🛡️', name: '나이트',  element: '토', color: '#d4a843', desc: '戊土 — 묵직한 수호자' },
  { icon: '📜', name: '세이지',  element: '토', color: '#d4a843', desc: '己土 — 깊은 지혜자' },
  { icon: '🪓', name: '버서커',  element: '금', color: '#a0b8d0', desc: '庚金 — 폭발적 결단력' },
  { icon: '🗡️', name: '어쌔신',  element: '금', color: '#9b59b6', desc: '辛金 — 예리한 완벽주의' },
  { icon: '🌊', name: '소서러',  element: '수', color: '#2980b9', desc: '壬水 — 신비로운 직관' },
  { icon: '⚡', name: '위자드',  element: '수', color: '#16a085', desc: '癸水 — 섬세한 감수성' },
]

const STATS = [
  { icon: '🌿', label: 'AGI 민첩', element: '목(木)', color: '#5cb85c' },
  { icon: '🔥', label: 'ATK 공격력', element: '화(火)', color: '#e85a4f' },
  { icon: '🌍', label: 'DEF 방어력', element: '토(土)', color: '#d4a843' },
  { icon: '⚙️', label: 'INT 지능', element: '금(金)', color: '#a0b8d0' },
  { icon: '🌊', label: 'MP 마나', element: '수(水)', color: '#2980b9' },
]

const STEPS = [
  { step: '01', icon: '📅', title: '생년월일 입력', desc: '생년월일과 태어난 시간을 입력하면 만세력으로 정확한 사주팔자를 계산해요' },
  { step: '02', icon: '⚔️', title: 'RPG 캐릭터 생성', desc: '일간(日干)으로 직업 클래스가 결정되고 오행 비율이 5가지 스탯으로 변환돼요' },
  { step: '03', icon: '🔑', title: '친구에게 코드 공유', desc: '생성된 6자리 고유 코드를 친구에게 공유해서 파티를 맺어요' },
  { step: '04', icon: '💫', title: '궁합 분석', desc: '두 사람의 오행 상생·상극을 분석해서 파티 케미와 궁합 점수를 알려드려요' },
]

const FAQS = [
  {
    q: '사주 계산이 정확한가요?',
    a: '만세력(萬歲曆) 라이브러리를 사용해서 실제 천간지지를 계산해요. 태어난 시간을 입력하면 더 정확한 결과가 나와요.',
  },
  {
    q: '운명 클래스는 어떻게 결정되나요?',
    a: '사주팔자 중 일간(日干), 즉 태어난 날의 천간으로 결정돼요. 甲木이면 전사, 壬水면 소서러 등 10가지 천간이 10가지 클래스에 대응해요.',
  },
  {
    q: '오행 스탯은 어떻게 계산되나요?',
    a: '사주 8글자(년간·년지·월간·월지·일간·일지·시간·시지)에서 목·화·토·금·수 오행 개수를 카운트해서 비율로 환산해요.',
  },
  {
    q: '궁합 점수는 어떤 기준인가요?',
    a: '두 사람의 오행 상생(相生)·상극(相剋) 관계와 일간 케미를 AI가 사주명리학 기준으로 종합 분석해서 0~100점으로 산출해요.',
  },
  {
    q: '내 정보는 안전한가요?',
    a: '생년월일 정보는 캐릭터 생성에만 사용되며 개인 식별 정보와 연결되지 않아요. 닉네임과 공유 코드로만 활동할 수 있어요.',
  },
]

export default function Home() {
  const router = useRouter()
  const { myCharacter } = useCharacterStore()

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white overflow-x-hidden">

      {/* 별 배경 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.85 ? 3 : 2,
              height: Math.random() > 0.85 ? 3 : 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 bg-[#0d0d1a]/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏰</span>
          <span className="font-bold text-lg tracking-wider text-purple-300">운명길드</span>
        </div>
        <div className="flex items-center gap-3">
          {myCharacter && (
            <button
              onClick={() => router.push('/character')}
              className="text-sm text-purple-300 border border-purple-500/40 rounded-lg px-3 py-1.5 hover:bg-purple-500/20 transition-colors"
            >
              내 캐릭터
            </button>
          )}
          <button
            onClick={() => router.push('/create')}
            className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-4 py-1.5 font-medium"
          >
            시작하기
          </button>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-block text-xs tracking-[0.3em] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6 uppercase">
            ✦ 사주 × RPG × 궁합 ✦
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">당신의 팔자로</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              파티를 결성하라
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-4">
            사주팔자를 RPG 캐릭터로 변환하고 친구와 파티를 맺어 궁합을 분석해보세요.
          </p>
          <p className="text-white/30 text-sm max-w-lg mx-auto leading-relaxed mb-12">
            만세력(萬歲曆) 기반의 정확한 사주 계산으로 일간·오행을 분석하고,
            AI가 두 사람의 케미와 궁합을 RPG 스타일로 해설해드려요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/create')}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-900/50"
            >
              ⚔️ 내 클래스 알아보기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/party')}
              className="px-10 py-4 bg-white/8 border border-white/15 rounded-2xl font-bold text-lg backdrop-blur-sm"
            >
              🏰 파티 참가하기
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 이용 방법 */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.25em] text-purple-400 uppercase mb-3">How it works</p>
          <h2 className="text-center text-3xl font-bold text-white mb-16">이렇게 사용해요</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-2xl bg-white/3 border border-white/8"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <div className="text-xs text-purple-400 font-mono mb-2">STEP {s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 text-xl z-10">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 오행 스탯 설명 */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.25em] text-purple-400 uppercase mb-3">Stats System</p>
          <h2 className="text-center text-3xl font-bold text-white mb-4">오행이 스탯이 된다</h2>
          <p className="text-center text-white/40 text-sm mb-16 max-w-lg mx-auto">
            사주 8글자에서 목·화·토·금·수의 비율을 계산해 RPG 스탯으로 변환해요.
            어떤 오행이 강한지에 따라 나의 강점과 약점이 결정돼요.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="p-5 rounded-2xl text-center border"
                style={{ background: `${stat.color}10`, borderColor: `${stat.color}25` }}
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: stat.color }}>{stat.label}</div>
                <div className="text-xs text-white/30">{stat.element}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10가지 클래스 */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.25em] text-purple-400 uppercase mb-3">Classes</p>
          <h2 className="text-center text-3xl font-bold text-white mb-4">10가지 운명 클래스</h2>
          <p className="text-center text-white/40 text-sm mb-16 max-w-lg mx-auto">
            십천간(十天干)에서 비롯된 10가지 클래스. 당신의 일간이 무엇인지에 따라 클래스가 결정돼요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CLASS_LIST.map((cls, i) => (
              <motion.div
                key={cls.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="p-4 rounded-2xl border text-center cursor-default"
                style={{ background: `${cls.color}10`, borderColor: `${cls.color}25` }}
              >
                <div className="text-3xl mb-2">{cls.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: cls.color }}>{cls.name}</div>
                <div className="text-[11px] text-white/30 leading-relaxed">{cls.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 궁합 등급 */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-[0.25em] text-purple-400 uppercase mb-3">Compatibility</p>
          <h2 className="text-center text-3xl font-bold text-white mb-4">파티 궁합 등급</h2>
          <p className="text-center text-white/40 text-sm mb-16 max-w-lg mx-auto">
            두 사람의 오행 상생·상극 관계를 분석해 5가지 등급으로 파티 케미를 보여드려요.
          </p>
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
            {[
              { grade: 'S', label: '소울메이트', color: '#f0c040', score: '90~100' },
              { grade: 'A', label: '최강 파티', color: '#7b5ea7', score: '75~89' },
              { grade: 'B', label: '좋은 전우', color: '#5cb85c', score: '60~74' },
              { grade: 'C', label: '동반자', color: '#5bc0de', score: '40~59' },
              { grade: 'D', label: '라이벌', color: '#e85a4f', score: '0~39' },
            ].map((g, i) => (
              <motion.div
                key={g.grade}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-4 rounded-2xl border text-center"
                style={{ background: `${g.color}12`, borderColor: `${g.color}30` }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: g.color }}>{g.grade}</div>
                <div className="text-xs font-medium text-white/70 mb-1">{g.label}</div>
                <div className="text-[10px] text-white/30">{g.score}점</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs tracking-[0.25em] text-purple-400 uppercase mb-3">FAQ</p>
          <h2 className="text-center text-3xl font-bold text-white mb-16">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/3 border border-white/8"
              >
                <p className="font-semibold text-purple-300 mb-3">Q. {faq.q}</p>
                <p className="text-white/50 text-sm leading-relaxed">A. {faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 border-t border-white/5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            당신의 운명 클래스는<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              무엇인가요?
            </span>
          </h2>
          <p className="text-white/40 mb-10">지금 바로 사주를 분석하고 파티원을 찾아보세요</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/create')}
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl shadow-2xl shadow-purple-900/50"
          >
            ⚔️ 무료로 시작하기
          </motion.button>
        </motion.div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 border-t border-white/8 px-6 py-8 text-center">
        <p className="text-white/20 text-sm">🏰 운명길드 · 당신의 팔자로 파티를 결성하라</p>
        <p className="text-white/10 text-xs mt-2">사주 해석은 참고용이며 절대적인 운명을 의미하지 않아요</p>
      </footer>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </main>
  )
}