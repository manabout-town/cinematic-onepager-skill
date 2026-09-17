# cinematic-onepager — 시네마틱 원페이지 웹사이트 Claude Code 스킬

한 사람·한 브랜드·한 행사를 **휠을 내리면 장면이 살아 움직이는 한 페이지**로 만드는 [Claude Code](https://claude.com/claude-code) 스킬입니다.
포트폴리오, 디지털(웹) 명함, 프리미엄 초대장, 브랜드 랜딩, 행사·제품 소개에 씁니다.

결과물은 항상 **HTML 파일 하나 + 바닐라 JS**(프레임워크·빌드 없음)입니다. 직접 손으로 만든 레퍼런스 3개(위스키바 초대장·위스키 클래스·개발자 포트폴리오)와, 이 스킬로 만든 업종별 웹명함 5개(카페·필라테스·세무사·인테리어·헤어)에서 뽑은 규칙·코드가 들어 있습니다.

> 🤖 **다른 Claude가 이 레포를 받았다면** → [「Claude용 설치 절차」](#claude용-설치-절차)를 실행하세요.

---

## 구성

```
cinematic-onepager-skill/
├── skill/cinematic-onepager/           → ~/.claude/skills/cinematic-onepager
│   ├── SKILL.md                        절대 규칙 6개 · 작업 순서 · 아키타입 A/B/C · 매크로 4결정 · 커널 · 흔한 실수
│   ├── assets/template.html            작동하는 단일파일 스타터(토큰·리빌·진행바·핀 스크롤리텔링·그레인·reduced-motion)
│   ├── references/
│   │   ├── motion.md                   모션 레시피 (게이트/커튼, 리빌 스태거, 진행바, 핀, 커서글로우, 이미지 현상, 마퀴, % 로더…)
│   │   ├── palettes.md                 검증된 팔레트 3종 + 색 규칙
│   │   ├── typography.md               폰트 페어링, 한글/영문 처리, 스케일
│   │   └── production.md               실사진(Gemini·Flow)·Vercel 배포·모바일 실기기 함정·에이전트 병렬 제작
│   └── scripts/check-header-overlap.mjs  고정 상단바↔첫 화면·핀 콘텐츠 겹침 검사 (11개 화면, PLAYWRIGHT 환경변수로 경로 지정)
├── design-refs/                        → ~/.claude/design-refs
│   ├── web-craft-baseline.md           하이엔드 사이트 9~10곳 getComputedStyle 실측 수치 (타이포·색·radius·모션)
│   ├── ui-style-picker-ko.md           UI 스타일 10종 × 한국 업종 매핑 + "AI 주문 번역표"
│   ├── probe.js                        아무 사이트 콘솔에 붙여 수치를 다시 재는 스크립트
│   ├── korean-agency-baseline.md       한국 제작사 실측 — "AI 티" 원인 12가지와 대처
│   └── CLAUDE-ui-rules.md              ~/.claude/CLAUDE.md 에 넣어 쓰는 "UI 작업 규칙" (스타일 먼저 → 수치 → 코드 → 폰 폭 검증)
└── install.sh
```

## 사용 언어·기술

| 구분 | 내용 |
|---|---|
| 결과물 언어 | **HTML5 + CSS(커스텀 프로퍼티 토큰, `clamp()`, `svh/dvh`, sticky) + 바닐라 JavaScript** — 단일 파일, CSS·JS 100% 인라인 |
| 핵심 브라우저 API | `IntersectionObserver`(스크롤 리빌), `requestAnimationFrame` + lerp(커서·패럴랙스), 스크롤 진행도 계산(핀 섹션), `matchMedia('(prefers-reduced-motion)')`, SVG 필터(그레인), 선택적으로 WebGL/Three.js |
| 폰트 | Google Fonts 링크 하나(Cormorant Garamond, Noto Serif KR, Anton 등) 또는 시스템 스택 |
| 검증 | 로컬 서버 `python3 -m http.server` + Playwright 스크린샷(320·375·390·430·1440 폭) |
| 배포 | Vercel 정적 배포(`vercel --prod`) — 선택 |
| 사진 | Gemini 웹(`gemini.google.com/image`)을 Claude in Chrome으로 조작 — 선택. 사진 없이도 완성돼 보이는 폴백이 규칙 |
| 스킬 언어 | Markdown |

### 같이 쓰면 좋은 스킬 (선택 — 없어도 동작)

SKILL.md와 CLAUDE-ui-rules.md가 이름으로 언급하는 스킬들입니다. 없으면 해당 단계만 건너뜁니다.

| 스킬 | 용도 | 출처 |
|---|---|---|
| `ui-ux-pro-max` | 스타일 79종 `styles.csv`(Best For / **Do Not Use For** 컬럼), 팔레트·폰트 페어링 검색 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) |
| `impeccable` | 완성 후 다듬기·비평·접근성·반응형 점검 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) |
| `gsap-scrolltrigger` 등 GSAP 스킬 | GSAP로 스크롤 모션을 짤 때(이 스킬 기본은 바닐라) | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) (MIT) |
| `frontend-design` | 범용 프런트엔드 디자인 가이드 | [anthropics/skills](https://github.com/anthropics/skills) |
| Claude in Chrome | 사진 생성·실사이트 확인 | Claude Code 공식 크롬 확장 |

설치 방법은 각 레포 README를 따르세요(보통 `~/.claude/skills/<이름>/`에 폴더를 두면 됩니다).

## 작동 방식 요약

1. **스타일 1개 확정** — `ui-style-picker-ko.md`에서 업종에 맞는 스타일(미니멀리즘·에디토리얼·벤토·글래스·그라디언트 메시·다크·뉴모피즘·브루탈·레트로·3D) 중 하나. 섞지 않음.
2. **수치** — `web-craft-baseline.md`: 배경 순백/순검정 금지(라이트 #F2~#F7, 다크 #08~#1F), 본문 14~15px, radius 계열 하나, transition 160ms / 480ms `cubic-bezier(.16,1,.3,1)`.
3. **아키타입** — A 초대장형(진입 게이트 + 세리프) / B 스튜디오형(% 로더 + 헤비 타이포 + 로고 마퀴) / C 포트폴리오형(커튼 + 핀 스크롤리텔링/WebGL).
4. **매크로 4결정** — 진입 방식 · 핵심 모션 1개 · 타이포 무게 · 섹션 순서. 같은 뼈대에 색만 바꾸는 재탕 금지.
5. **template.html 복사 → 내용·토큰·진입 교체 → motion.md 레시피 추가**
6. **검증** — 로컬 서버 + 폰 폭(320·390·430) 스크린샷, 핀 섹션은 진행도별로 겹침 검사. `<meta charset="utf-8">` 필수.

Claude Code에서는 이렇게 말하면 스킬이 자동으로 붙습니다:

```
필라테스 스튜디오 웹 명함 원페이지 만들어줘. 이름: …, 위치: …
내 포트폴리오를 스크롤하면 움직이는 한 페이지로
결혼식 초대장 사이트, 고급스럽게
```

## Claude용 설치 절차

1. **clone + 설치**
   ```bash
   git clone https://github.com/manabout-town/cinematic-onepager-skill.git ~/cinematic-onepager-skill
   bash ~/cinematic-onepager-skill/install.sh
   ```
   UI 작업 규칙까지 전역으로 적용하려면(권장, 사용자에게 먼저 확인):
   ```bash
   APPEND_CLAUDE_MD=1 bash ~/cinematic-onepager-skill/install.sh
   ```
2. **검증 도구** (페이지 스크린샷용, 없으면 설치)
   ```bash
   python3 --version
   npm i -D playwright && npx playwright install chromium   # 작업 폴더에서
   ```
3. **동작 확인**
   ```bash
   cd ~/.claude/skills/cinematic-onepager/assets && python3 -m http.server 8777
   # http://localhost:8777/template.html — 폰 폭 390에서 {{NAME}} 히어로가 보이면 정상
   ```
4. (선택) 위 표의 보조 스킬 설치, Vercel CLI(`npm i -g vercel`) 설치.
5. Claude Code 재시작.

## 절대 규칙 (요약)

1. 순검정·순백 금지, 액센트는 1색
2. 모든 색·폰트·이징·폭은 `:root` 토큰
3. 휠다운 모션 필수: 진입 연출 + 스크롤 리빌 + 진행바 + 센터피스 1개
4. 덜어냄 — 폰트 2~3종, 문장 최소
5. `prefers-reduced-motion` 에서는 즉시 최종 상태
6. 한글: `word-break: keep-all`, 라벨·숫자는 mono

## 라이선스

MIT. `ui-style-picker-ko.md`의 스타일 10종 분류는 에이원 스튜디오(aewonstudio.com) 글을 요약·재구성한 것이며 출처를 문서에 표기했습니다.
