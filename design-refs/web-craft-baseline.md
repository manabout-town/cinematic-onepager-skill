# 웹 크래프트 베이스라인 (실측)

실제 라이브 사이트에서 `getComputedStyle`로 뽑은 수치. 감이 아니라 측정값.
측정일 2026-08-06. 소스 갤러리 = recent.design/websites (구 godly.website).

## 측정 대상 9개

| 사이트 | 성격 | 모드 |
|---|---|---|
| linear.app | SaaS 프로덕트 | 다크 |
| interfere.com | 프로덕트 앱 (P3 컬러) | 다크 |
| oriorai.com | AI 프로덕트 랜딩 | 다크 |
| avara.xyz | 프로덕트 랜딩 | 다크 |
| shopify.design | 디자인시스템 쇼케이스 | 라이트 |
| augen.pro | 프로덕트/스튜디오 | 라이트 |
| harryjatkins.com | 개발자 포트폴리오 | 라이트 |
| dirtverse.co | 크리에이티브 스튜디오 | 라이트 |
| becaneparis.com | 커머스/브랜드 | 라이트 |
| podium.global | 에이전시 브랜딩 | 다크 |

제외: displace.agency (전체 WebGL 캔버스, DOM 수치 무의미)

---

## 1. 본문은 14px. 16px 아님

전 사이트 본문 최빈값:

| 사이트 | 최빈 | 횟수 |
|---|---|---|
| harryjatkins.com | **14px** | ×81 |
| linear.app | **14px** | ×93 |
| augen.pro | **14px** | ×43 |
| shopify.design | **14.1px** | ×36 |
| oriorai.com | **14px** | ×13+7+5 |
| dirtverse.co | 13px | ×26 |
| interfere.com | 12px | ×207 |
| podium.global | 12px | ×34 |
| becaneparis.com | 8px | ×16 |

**9/9 사이트 전부 16px 미만.** 14px가 압도적 기본값. 10~12px는 라벨·메타.
16px는 블로그·문서형 얘기지 프로덕트/브랜드 UI 기본값 아님.

## 2. Line-height는 장르가 갈린다 ← 중요

두 계열이 명확히 분리됨:

**표현형 (에이전시·포트폴리오·브랜드) → 1.0 ~ 1.2**
```
dirtverse.co      13/13   = 1.00   40/40 = 1.00   15/15 = 1.00
augen.pro         14/16.8 = 1.20   (전 크기 1.2 고정)
harryjatkins.com  14/15.96= 1.14
podium.global     12/13.2 = 1.10
becaneparis.com    8/8.8  = 1.10
```

**프로덕트 UI (읽는 텍스트 많음) → 1.35 ~ 1.7**
```
linear.app        14/24   = 1.71
interfere.com     12/16   = 1.33   13/20 = 1.54
oriorai.com       14/20   = 1.43   18/28.8 = 1.60
```

**디스플레이는 양쪽 다 1보다 작게**
```
shopify.design   158/134 = 0.85    220/154 = 0.70
podium.global     61/55  = 0.90
oriorai.com       48/50  = 1.05    60/63 = 1.05
```

기본값 `1.5` 일괄 적용이 밋밋함의 원인. 장르 먼저 정하고 라인하이트 정할 것.

## 3. Letter-spacing — 두 학파, 둘 다 음수

**A. em 고정** (한 값을 전 크기에 균일 적용)
```
augen.pro        전 크기 정확히 -0.02em
                 14→-0.28  12→-0.24  16→-0.32  18→-0.36  25→-0.5  35→-0.7
harryjatkins.com 절대값 고정 -0.28px (14px, 12px 둘 다)
oriorai.com      본문 0, 디스플레이만 -0.035em (48→-1.68, 60→-2.1)
```

**B. 크기 비례 스케일**
```
shopify.design   16→-0.015em  20→-0.02em  28→-0.01em
                 56→-0.04em   158→-0.04em  1050→-0.04em  ← -0.04em에서 멈춤
```

**결론**
- 본문: `0` ~ `-0.02em`
- 디스플레이: `-0.02em` ~ `-0.04em`. **-0.04em을 넘기는 사이트 없음**
- 양수는 소형 대문자 라벨에만 (shopify 14px +0.05em, interfere 10px +0.05em, becane 8px +0.04em)

가장 게으르고 안전한 구현:
```css
:root { letter-spacing: -0.011em }        /* 전역 살짝 */
h1,h2,h3 { letter-spacing: -0.03em }
.label { font-size:11px; letter-spacing:0.05em; text-transform:uppercase }
```

## 4. 커스텀 폰트가 기본. 시스템 폰트 사이트 0개

| 사이트 | 프라이머리 | 세컨더리 |
|---|---|---|
| augen.pro | PP Neue Montreal | — |
| harryjatkins.com | Söhne Buch | — |
| dirtverse.co | Inter Tight | **Chivo Mono** |
| shopify.design | Antique Legacy (세리프) | **Fragment Mono** |
| linear.app | Inter Variable | **Berkeley Mono** |
| interfere.com | Inter Variable | **Berkeley Mono** + Heldane Text |
| oriorai.com | Geist | — |
| becaneparis.com | Eurostile Becane (커스텀) | — |
| podium.global | Futura | Univers Condensed |

**9/9 커스텀 폰트.** `-apple-system` 폴백으로 끝내는 사이트 하나도 없음.
**4/9가 모노를 세컨더리 보이스로** — 코드가 아니라 숫자·라벨·메타데이터용.

무료 대체: Inter Tight, Geist, Chivo Mono, JetBrains Mono, IBM Plex Mono, Space Grotesk.
Variable weight 350/510 같은 어중간한 값 쓰는 게 흔함 (augen w350, linear w510) — 400/700만 있는 게 아님.

## 5. 배경은 순백도 순검정도 아니다 ← 실측에서 가장 확실

**라이트 모드 body 배경 — 순백 0개**
```
augen.pro         rgb(239,239,239)   #EFEFEF
becaneparis.com   rgb(246,246,246)   #F6F6F6
harryjatkins.com  rgb(247,247,247)   #F7F7F7  (표면)
dirtverse.co      rgb(242,242,239)   #F2F2EF  ← 미세 웜톤
oriorai.com       rgb(247,246,243)   #F7F6F3  ← 미세 웜톤
```

**다크 모드**
```
linear.app        rgb(8,9,10)        ← R<G<B 미세 쿨톤
interfere.com     oklch(0.15 0 0)    ≈ #1F1F1F
podium.global     rgb(0,0,0)         ← 순검정은 에이전시/표현형만
avara.xyz         rgb(0,0,0)
```

**규칙**: `#FFF`/`#000` 직접 쓰지 말 것. 라이트 `#F2~#F7`대, 다크 `#08~#1F`대.
웜/쿨 편향 1~4 정도 주면 "화면"이 아니라 "종이/재질" 느낌.

## 6. 텍스트 색은 3~4단 계층

interfere.com (흰색 알파):
```
0.929  주 텍스트
0.685  본문
0.391  보조
0.332  비활성
```
linear.app:
```
rgb(247,248,248)  주      rgb(208,214,224)  본문
rgb(138,143,152)  보조    rgb(98,102,109)   비활성
```
harryjatkins.com (라이트):
```
rgb(41,41,41)     주      rgb(153,153,153)  보조    rgb(196,196,196)  비활성
```

**규칙**: 회색 하드코딩 대신 **알파 4단**. 배경 바뀌어도 자동으로 맞음.
표면(surface)도 동일 — interfere: `rgba(255,255,255, .034 / .071 / .105 / .172)`.

## 7. Radius — 두 계열. "12px 금지"는 틀림

| 계열 | 사이트 | 값 |
|---|---|---|
| **타이트 (프로덕트/에디토리얼)** | interfere | 2, 3, 6px |
| | linear | 2, 4, 6px, 50% |
| | harryjatkins | 6px |
| | becaneparis | 1, 3px |
| | dirtverse | 3, 5, 8px |
| **소프트 (컨슈머/마케팅)** | oriorai | 14, 32px |
| | avara | 32px |
| | augen | 10, 54, 94px |
| **pill만** | podium | 9999px |

한 프로젝트 안에서 **한 계열만** 고를 것. 2px와 32px를 섞는 사이트는 없음.
(초안에서 "12px radius 금지"라고 썼는데 실측 확대 후 반박됨 — oriorai 14px, avara/oriorai 32px 존재. 문제는 값 자체가 아니라 계열 혼용.)

## 8. 간격 — 4~5px 그리드, 컴포넌트 내부는 작다

```
linear.app        3, 4, 8, 12px
interfere.com     4, 6, 8, 12px
oriorai.com       6, 8, 32px
dirtverse.co      10, 15, 30px      ← 5px 그리드
harryjatkins.com  8, 16, 40px
becaneparis.com   8, 10, 20px
podium.global     24px
augen.pro         21, 34px          ← 피보나치틱
```

프로덕트 UI 컴포넌트 내부 gap = **4~12px**. 24px 이상은 섹션 간격.
`gap: 16px` 전역 남발이 AI슬롭 냄새의 주범.

## 9. 모션 — duration 2단, easing은 절대 `ease` 기본값이 아님

| 용도 | duration | easing |
|---|---|---|
| UI 상태(hover/focus) | **0.1 ~ 0.2s** | `cubic-bezier(0,0,.2,1)` decelerate |
| 레이아웃/패널 | 0.3 ~ 0.4s | 동일 |
| 스크롤 리빌·히어로 | **0.4 ~ 0.8s** | `cubic-bezier(.16,1,.3,1)` expo-out |
| 페이지 전환 | 0.8s | `cubic-bezier(.83,0,.17,1)` expo-in-out |
| 바운스/팝 | 0.2 ~ 0.4s | `cubic-bezier(.175,.885,.32,1.1)` back-out |

실측:
- linear.app `0.16s cubic-bezier(.25,.46,.45,.94)`
- interfere.com `0.2s / 0.3s cubic-bezier(0,0,.2,1)`
- harryjatkins.com `0.2s / 0.4s cubic-bezier(.16,1,.3,1)`, `0.8s cubic-bezier(.83,0,.17,1)`
- podium.global `0.48s / 0.58s / 1.05s cubic-bezier(.16,1,.3,1)`
- avara.xyz `0.2s / 0.4s cubic-bezier(.175,.885,.32,1.1)`

`cubic-bezier(.16,1,.3,1)`이 3개 사이트에서 겹침 = 사실상 업계 표준 expo-out.

토큰 4개면 끝:
```css
--ease-out:  cubic-bezier(0, 0, 0.2, 1);
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
--dur-ui:     160ms;
--dur-reveal: 480ms;
```

## 10. 컨테이너 폭

```
linear.app        1436px
interfere.com     1244px   (읽기 컬럼 480px)
oriorai.com        960px   (읽기 컬럼 672px)
dirtverse.co       600px
becaneparis.com    441px
```

`max-width: 1200~1440px`. 1280px 관성보다 실제 값은 1244/1436.
읽기 컬럼은 **별도로** 440~680px.

---

## 체크리스트

- [ ] 본문 14px (12~15px), 캡션 10~12px +0.05em uppercase
- [ ] 장르 정하고 line-height: 표현형 1.0~1.2 / 프로덕트 1.4~1.7 / 디스플레이 0.85~1.0
- [ ] letter-spacing 본문 0~-0.02em, 디스플레이 -0.02~-0.04em (넘기지 말 것)
- [ ] 커스텀 폰트 필수. 모노 세컨더리 고려 (숫자·라벨)
- [ ] 배경 순백/순검정 금지 → 라이트 #F2~#F7 / 다크 #08~#1F, 웜·쿨 편향 1~4
- [ ] 텍스트·표면 모두 알파 4단 계층
- [ ] radius 계열 하나만 (타이트 2~8px **또는** 소프트 14~32px **또는** pill)
- [ ] 컴포넌트 내부 gap 4~12px, 섹션 24px+
- [ ] transition 160ms ease-out / 480ms expo-out, 기본 `ease` 금지
- [ ] container 1244~1436px, 읽기 컬럼 440~680px

## 안티패턴 (측정으로 반박된 것)

| 흔한 습관 | 실측 반박 |
|---|---|
| 본문 16px | 9/9 사이트가 16px 미만. 14px 최빈 |
| `line-height: 1.5` 전역 | 표현형은 1.0~1.2, 디스플레이는 0.85 |
| letter-spacing 안 건드림 | 9/9이 음수 트래킹 씀 |
| `bg-white` / `bg-black` | 라이트 순백 0개, 다크 순검정은 표현형만 |
| 회색 `#888` 하드코딩 | 알파 4단 계층 |
| radius 계열 혼용 | 한 사이트 안에서 2px와 32px 섞는 곳 없음 |
| `gap: 16px` 전역 | 컴포넌트 내부는 4~12px |
| `transition: all .3s ease` | 160ms decelerate 또는 480ms expo-out |
| 시스템 폰트 스택 | 9/9 커스텀 폰트 |
| weight 400/700만 | 350·510 같은 variable 중간값 흔함 |

---

## 재측정

`~/.claude/design-refs/probe.js` 를 대상 사이트 devtools 콘솔에 붙여넣기.

Claude가 브라우저로 자동 수집할 때 주의: **`browser_batch` 하나에 도메인 1개만.**
배치 내 각 항목의 권한 체크는 배치 시작 시점 탭 도메인 기준이라, 배치 중간에
다른 도메인으로 navigate하면 다음 항목이 "Navigation to this domain is not allowed"로 실패함.
확장 프로그램 설정 문제 아님. 사이트당 배치 1개(navigate + probe)로 돌릴 것.

로그인 벽이라 접근 불가: Mobbin, Cosmos.
