# 타이포그래피

## 시그니처 (셋 다 공유 — 이게 "에디토리얼 럭셔리"의 정체)
- **display = 좁은 자간**(`-.02em`~`-.055em`), 굵기는 **얇게(200~400)** 또는 극대비. 우아함은 크기로 내지 굵기로 내지 않는다.
- **라벨 = 넓은 대문자 mono**(`letter-spacing:.14em`~`.34em`, `text-transform:uppercase`, 10~11px). 섹션번호·아이브로·캡션·숫자 전부 mono.
- 이 **좁은 display ↔ 넓은 mono-caps** 대비가 핵심.
- 크기는 전부 `clamp()` 유동. 숫자 `font-variant-numeric:tabular-nums`. 제목 `text-wrap:balance`.

## 한글 처리 (반드시)
- `body{word-break:keep-all}` — 한글 단어 중간 줄바꿈 방지.
- KR 본문/제목은 세리프면 Noto Serif KR, 산세리프면 Apple SD Gothic Neo / Noto Sans KR.
- **KR 본문 + 인라인 EN을 Cormorant 이탤릭으로** 섞는 게 초대장 톤의 관용구(`.course h3 .en` 같이). 편집 카탈로그 느낌.

## 3가지 역할 (CSS 변수로)
display / body / mono(label) 세 역할을 변수로 두고 일관되게 쓴다.

### 옵션 1 — Google Fonts (초대장 톤, TÀMH 초대장)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+KR:wght@200;300;400;600&display=swap" rel="stylesheet">
```
```css
:root{
  --serif-en:'Cormorant Garamond',Georgia,serif;   /* display·이탤릭·가격·EN */
  --serif-kr:'Noto Serif KR','Cormorant Garamond',serif; /* 본문 기본·KR 제목 */
  --mono:'IBM Plex Mono',monospace;                 /* 라벨·번호·캡션 */
}
body{font-family:var(--serif-kr);font-size:14px;line-height:1.7;font-weight:300;
  letter-spacing:-.011em;word-break:keep-all}
```

### 옵션 2 — 로컬 시스템 (의존성 0, 위스키클래스·박효균)
네트워크 요청 없이 빠르게. 자족성이 최우선일 때.
```css
@font-face{font-family:'Display';src:local('Georgia'),local('Palatino'),local('Times New Roman');font-display:swap}
:root{
  --serif:'Display',Georgia,'Palatino Linotype',serif;  /* display·EN·KR제목 */
  --sans:-apple-system,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif; /* KR 본문 */
  --mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,monospace;
}
```
박효균 포폴은 세리프 없이 sans+mono만 쓰되 display를 굵게(740~800), 자간을 더 좁게(`-.035em`~`-.055em`)로 "관제탑" 톤을 냈다. 톤에 따라 굵기·자간을 조절.

## 스케일 (clamp 유동, 참고값)
```css
/* 히어로 워드마크 */ font-size:clamp(84px,17vw,236px); line-height:.92;
/* 섹션 h2       */ font-size:clamp(38px,6.4vw,74px);
/* 리드/매니페스토 */ font-size:clamp(21px,3.4vw,37px); font-weight:200;
/* 본문          */ font-size:clamp(13.5px,1.15vw,16px); line-height:1.7~1.85;
/* 라벨          */ font-size:10~11px; letter-spacing:.22em; text-transform:uppercase;
```
