# 실전 제작 절차 — 사진 · 배포 · 모바일 · 병렬 (2026-09-15)

출처: 웹명함 가상 레퍼런스 5개 제작. 코드는 전부 `<작업폴더>/<폴더>/index.html` 단일 파일.

| 업종 | 폴더 | 스타일 | 진입 | 센터피스 | 명함 사물 | 라이브 |
|---|---|---|---|---|---|---|
| 카페 | woody-cafe | 다크 에디토리얼 | 자라는 나무(WebGL) | 가로 저니 5컷 | 나이테 코스터 | woody-cafe.vercel.app |
| 필라테스 | align-pilates | 라이트 미니멀 | 호흡 원 로더 | 핀: 선인형 5동작 보간 | 회원권 카드 | align-pilates.vercel.app |
| 세무사 | jeongdam-tax | 벤토 그리드 | 장부 대차 0 로더 | 핀: 영수증→신고서 조립 | 영수증 | jeongdam-tax.vercel.app |
| 인테리어 | studio-ondo | 라이트 에디토리얼 | 도면 그리기 | 핀: 평면도→완성사진 + B/A 슬라이더 | 마감재 샘플북 | studio-ondo-interior.vercel.app |
| 헤어 | haus-jun | 브루탈리즘 | 가위 컷 | 핀: 룩북 슬라이스 교체 | 찢는 예약 티켓 | haus-jun.vercel.app |
| 개발 프리랜서 | layer-dev | 글래스모피즘 | 터미널 타이핑 | 핀: 유리 레이어 분해도 | 홀로그램 NFC 카드 | layer-dev-card.vercel.app |
| 치과 | goreun-dental | 뉴모피즘(부분) | 스케일링 로더 | 핀: 치열 정렬 보간 | 검진 리콜 카드(.ics) | goreun-dental.vercel.app |
| 스냅 작가 | bluehour-snap | 다크모드 | 조리개 개방 | 핀: 같은 구도 4시간대 + EXIF | 문지르면 현상되는 폴라로이드 | bluehour-snap.vercel.app |
| 네일샵 | cherrybyte-nail | 레트로/Y2K | 매니큐어 병 로딩 | 핀: 손톱 5개 공정 | 벗기는 스티커 시트 | cherrybyte-nail.vercel.app |
| 플로리스트 | bomgyeol-flower | 그라디언트 메시 | 포장지 펼침 | 핀: 계절 메시 모핑 + 12개월 링 | 리본 태그 | bomgyeol-flower.vercel.app |
| 변호사 | danjeong-law | 미니멀(쿨 종이·인주) | 문짝 열림(사진 반분할) | 핀: 사건 5단계 사진 | 인감 도장 명함 | danjeong-law.vercel.app |
| 공인중개사 | saegil-realty | 벤토(웜그레이·그린) | 열쇠 돌려 문 열림 | 핀: 매물 4곳 방문 + 숫자 트윈 | 열쇠고리 태그 | saegil-realty.vercel.app |
| PT 트레이너 | forge-pt | 다크(라임) | 3-2-1 카운트다운 줌인 | 핀: 12주 4단계 사진 | 금속 도그태그 | forge-pt-card.vercel.app |
| 타투이스트 | inkhole-tattoo | 브루탈(뼈색·먹·라임) | 바늘이 워드마크 새김 | 핀: 도안→피부 4단계 사진 | 리노컷 판화(롤러) | inkhole-tattoo.vercel.app |
| 캔들 공방 | mugyeol-candle | 메시(앰버 다크) | 성냥 불꽃 → 메시 번짐 | 핀: 향 노트 4단계 사진 + 메시 색 변화 | 시향지 블로터 | mugyeol-candle.vercel.app |

모든 폴더는 로컬 작업 폴더(예: `~/Desktop/웹명함/`) 아래.

새 업종은 이 표와 **진입·센터피스·명함 사물이 전부 겹치지 않게** 고른다. 공통 부품(토큰, .rv 리빌, 진행바, onerror 폴백, vCard Blob 저장, 카드 뒤집기+틸트, RM 분기, 푸터 "가상 예시" 고지)은 기존 파일에서 가져다 쓴다.

## 1. 모바일 실기기 함정

- 핀(sticky 100svh) 섹션은 Safari 툴바만큼 높이가 줄어든다. 데스크톱 1440×900, 폰 390×844만 보면 못 잡는다.
- 검증 뷰포트: **320×568, 375×600, 390×664, 430×740, 1440×900** + **낮은 데스크톱 1280×560·1336×620·1024×640** (노트북 브라우저는 툴바·북마크바 때문에 세로가 600대인 경우가 흔하다). 핀 섹션은 진행도 0/.25/.5/.75/1에서 "현재 카피 요소 bottom ≤ innerHeight"와 "진행바와 교차 없음"을 스크립트로 판정.
- 고정 상단바가 있으면 `scripts/check-header-overlap.mjs`로 첫 화면·핀 안 요소가 헤더 bottom 위로 올라가는지 검사. 핀은 가운데 정렬 금지(넘치면 위로 새어 헤더 밑에 숨음), `flex-start + padding-top ≥ 헤더+16px`.
- 모바일: 진행 UI는 `top:`(내비 아래), 그림은 svh 기반 max-width, `@media (max-width:860px) and (max-height:620px)`에서 제목·여백 축소.

## 2. 사진: Gemini 웹 (무료)

`gemini.google.com/image`를 Chrome 자동화로. 핵심 함정: 이미지 위에 마우스를 올린 뒤 실제 좌표로 다운로드 버튼을 누르고, 다운로드 성공은 파일 mtime으로 확인한다.

- **공통 스타일 문구**를 업종별 1개 정해 모든 프롬프트 끝에 붙인다(톤 통일). 텍스트·로고 금지 명시.
- **Before/After 같은 구도:** 완성컷 생성 → 같은 채팅에서 `Edit the last image: the exact same room from the exact same camera angle and framing, but BEFORE renovation…` → 창 위치까지 일치.
- **같은 모델 여러 스타일(헤어·의상):** 첫 컷 후 `Edit the last image: the exact same woman, same face, same top, same backdrop… but her hair is now …` 반복 → 얼굴 유지.
- 서로 무관한 이미지는 `/image` 새로 진입(같은 채팅에 이어 쓰면 이전 이미지 재출력 위험). 긴 채팅은 전송이 먹통 → 새로 진입.
- 입력은 좌표 타이핑보다 JS가 안정: `ed.focus(); document.execCommand('insertText',false,t)` 후 `button[aria-label*="보내기"]` click.
- **한 탭에서 약 7장 다운로드 후 Chrome이 조용히 차단** → ① 새 탭 ② 이미지 툴바 **복사 버튼 → `osascript -e 'write (the clipboard as «class PNGf») to f'`**(1024px, 웹용 충분).
- 다운로드 판정은 반드시 마커 파일 이후 mtime(`find -newer`). "최신 파일 복사" 금지.
- 워터마크 ✦: `ffmpeg -vf "delogo=x=$((W-154)):y=$((H-154)):w=68:h=68"` (W,H는 픽셀값 직접. `iw-154` 표현식은 에러).
- 원본은 `img/raw/`(gitignore + vercelignore), 웹용 JPG 긴 변 1100~1600 q4.
- 인물 사진은 가상 인물이므로 푸터 고지 필수.

## 3. 배포 (Vercel 정적)

- `.vercelignore`: `img/raw`, `img/PROMPTS.md`. 배포 후 둘 다 404인지 curl 확인.
- **`<이름>.vercel.app`은 남이 선점했을 수 있다** → 배포 후 `curl -s URL | grep -o '<title>[^<]*'`로 내 페이지인지 확인(studio-ondo.vercel.app은 타인 사이트였음).
- 충돌 시 `vercel alias set`은 SSO 보호(302)에 걸린다 → `vercel domains add <새이름>.vercel.app <project>`로 프로덕션 도메인 등록 → 200.
- Vercel Hobby 플랜 + private 레포면 **커밋 author 이메일이 Vercel 계정에 연결된 이메일**이어야 배포가 BLOCKED되지 않는다. 신규 폴더는 첫날 `gh repo create <내계정>/<폴더> --private --source . --push`(로컬에만 두면 소실 위험).

## 4. 병렬 제작 (에이전트)

- 사이트당 에이전트 1명, 서로 다른 폴더·포트(877x). 브리프에 반드시: 가상 정보 범위, 폴더, 읽을 파일(CLAUDE.md·baseline·이 스킬·기존 레퍼런스 2개), **스타일 1개 확정 + 매크로 4결정**, 사진 파일명·비율 고정, 사진 없이도 완성돼 보일 것, playwright 폭별 검증(설치된 node_modules/playwright 사용 후 임시 스크립트 삭제), git commit까지만(push·배포 금지), **Chrome 도구 금지**(메인이 사진 생성에 사용).
- 메인은 에이전트가 코드 짜는 동안 브리프에 적은 파일명대로 사진을 미리 생성 → 완료 보고 오면 배치·재검증·push·배포.
- 3개 사이트 코드 약 30~40분, 사진 16장 약 60분(대기 시간 포함).

## 5. 3차(2026-09-17) 추가 교훈 — 이미지는 실사, Flow로 생성

- 유저 피드백: 사람·사물·공정 자리를 선/도형 일러스트로 채우지 말 것. 센터피스도 실사 사진 크로스페이드(cherrybyte-nail 방식). SVG는 아이콘·진행바·지도만.
- 사진은 Google Flow(flow.google.com)로 비율별 묶음 생성 → 프로젝트 하나에서 에이전트 창에 `Generate this image exactly: …`로 한 장씩, 결과 img는 fetch→blob→a.download로 이름 지정 저장. Flow 비율은 16:9/4:3/1:1/3:4/9:16뿐 → 4:5는 3:4로 만들고 크롭.
- Flow 안전 필터: 여성 운동 장면(런지·스트레칭 등)은 반복 차단 → 남성 회원으로 교체하면 통과. 트레이너-회원 신체 접촉 묘사도 차단.
- 같은 인물·같은 팔 연속 컷은 첫 장을 타일 메뉴 "프롬프트에 추가"로 참조 첨부(업로드 불필요).
- vercel.app 이름 선점(forge-pt): `vercel project add <새이름>` → `vercel link --project <새이름> --yes` → deploy. link가 만든 .env.local(OIDC 토큰)은 지우고 .vercelignore에 `.env*`.
