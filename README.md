---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| AI | Groq API (llama-3.3-70b) |
| 사주 계산 | lunar-javascript (만세력) |
| 상태관리 | Zustand |
| 배포 | Vercel |

---

## 🚀 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/ssongkim03/unmyeong-guild.git
cd unmyeong-guild

# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 키 입력

# 개발 서버 실행
npm run dev
```

---

## 🔑 환경변수

`.env.local` 파일을 생성하고 아래 값을 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

---

## 📁 프로젝트 구조

src/

├── app/

│   ├── page.tsx           # 랜딩페이지

│   ├── create/page.tsx    # 캐릭터 생성

│   ├── character/page.tsx # 내 캐릭터

│   ├── party/page.tsx     # 파티 시스템

│   └── api/

│       ├── characters/    # 캐릭터 API

│       ├── compatibility/ # 궁합 분석 API

│       └── parties/       # 파티 API

├── components/

├── lib/

│   ├── saju.ts           # 만세력 사주 계산

│   ├── ai.ts             # Groq AI 연동

│   └── supabase.ts       # DB 연동

├── store/

│   └── characterStore.ts # 캐릭터 상태관리

└── types/

└── index.ts          # TypeScript 타입

---

## 🗺️ 개발 로드맵

- [x] 캐릭터 생성 (만세력 기반)
- [x] 오행 스탯 시스템
- [x] 친구 코드 공유
- [x] 1:1 궁합 분석
- [x] 파티 결성 시스템
- [ ] 소셜 로그인 (카카오/구글)
- [ ] 파티 전체 궁합 분석
- [ ] 오늘의 운세
- [ ] 카카오톡 공유
- [ ] 모바일 앱

---

## 📜 라이선스

MIT License

---

<p align="center">
  🏰 <strong>운명길드</strong> — 당신의 팔자로 파티를 결성하라
</p>