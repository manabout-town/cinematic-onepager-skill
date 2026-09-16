# 팔레트 (검증된 3종 + 규칙)

## 색 규칙
- **순검정·순백 절대 금지.** 배경은 near-black에 푸른/따뜻한 기를 섞고, 텍스트는 off-white. (레퍼런스 코드 주석: "순검정 아님")
- **액센트는 금속색 하나가 주역**(골드/플래티넘). 보조는 최대 하나(와인/버밀리언). 그 이상 색은 넣지 않는다.
- **ink는 색 하나를 투명도 4단계로.** 위계를 색상 수가 아니라 알파로 만든다. 라인도 동일.
- 액센트는 매우 낮은 알파로 테두리/구분선에 쓴다(`rgba(gold,.08~.2)`).
- `::selection` 배경도 액센트로.

각 팔레트는 `:root`에 그대로 복붙. 진입 감정에 맞춰 고른다.

---

## A. 오크 + 골드 + 버밀리언 (은밀함·초대장 — TÀMH 초대장)
따뜻한 위스키/밀랍 톤. 프리미엄 초대장·바·행사.
```css
:root{
  --bg0:#0d0a07; --bg1:#141009; --bg2:#1b1610;      /* 딥 오크 */
  --amber:#c9973f; --amber-hi:#e5c07b; --amber-dim:rgba(201,151,63,.34);
  --wax:#6f1d1d; --wax-hi:#8a2a26;                   /* 버밀리언 보조 */
  --ink-1:rgba(238,229,212,.93); --ink-2:rgba(238,229,212,.66);
  --ink-3:rgba(238,229,212,.40); --ink-4:rgba(238,229,212,.24);
  --line:rgba(238,229,212,.12); --line-soft:rgba(238,229,212,.07);
}
/* 워드마크 금속 텍스트: linear-gradient(160deg,#f2e7cf 20%,#cfa860 58%,#8a6a2e 100%) */
```

## B. 니어블랙 + 골드 (신뢰·정제 — TÀMH 위스키클래스)
차분한 다크 럭셔리. 랜딩·행사소개·기업 초대. 가장 안전한 기본값.
```css
:root{
  --bg:#080604; --surface:#110d08; --card:#1a140e; --card-hover:#241a10;
  --gold:#c89b3c; --gold-soft:#b8882e; --gold-light:#e8c56d; --amber:#d4a84b;
  --cream:#f2ebd9; --cream-dim:#d4cbba;
  --text:#e8e0d0; --text-dim:#9a8e7e; --text-muted:#6b6058;
  --line:rgba(200,155,60,.12);
}
```

## C. 네이비 보이드 + 와인 + 플래티넘 (압도·기술 — 박효균 포폴)
심우주 "관제탑" 톤. 개발자·기술 포트폴리오. 티어3에 어울림.
```css
:root{
  --ink:#06070f; --ink2:#0c0e1c;                    /* 블루블랙 (순검정 회피) */
  --steel:#8c93b0; --steel-d:#3a4060;
  --wine:#8c1e52; --wine-d:#2c0e33;                 /* 버건디 보조 */
  --gold:#d8cfa6; --gold-hi:#f3efdd;                /* 플래티넘 골드 */
  --white:#eef1f8;                                  /* off-white (순백 회피) */
  --line:#1b2038;
}
/* 헤드라인 금속 클립: linear-gradient(96deg,#7c8099 4%,var(--gold) 34%,var(--gold-hi) 68%,#fbf9f0 98%)
   em 아웃라인: color:transparent; -webkit-text-stroke:1.6px var(--wine)
   WebGL 씬을 쓰면 같은 hex를 셰이더 THREE.Color로 넘겨 DOM과 한 재질로 보이게 한다 */
```

---

## 그라디언트 관용구 (공통)
- **워드마크 금속 텍스트**: 골드 계열 `linear-gradient` + `-webkit-background-clip:text;color:transparent`. 선택적으로 `background-position` 무한 sweep.
- **히어로 이미지 스크림**: `linear-gradient(90deg, bg .92, bg*.7 40%, bg*.4 100%)` — 좌측 텍스트 가독성.
- **CTA 비네트**: `radial-gradient(ellipse 60% 60% at 50% 50%, bg*.5, bg*.95)`.
- **진행바**: `linear-gradient(90deg, 보조색, 골드 70%, 골드-hi)`.
