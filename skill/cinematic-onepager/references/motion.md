# 모션 레시피 (휠다운 시네마틱)

전부 바닐라 JS + CSS. 라이브러리 없음. 필요한 것만 복붙해서 쓴다. 공통 토큰을 먼저 `:root`에 둔다:

```css
:root{
  --ease-expo:cubic-bezier(.16,1,.3,1);   /* 극적 리빌 */
  --ease-out:cubic-bezier(0,0,.2,1);      /* UI */
  --dur-reveal:900ms; --dur-ui:160ms;
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms!important;transition-duration:.01ms!important}
  html{scroll-behavior:auto}
}
```

## 목차
1. 스크롤 리빌 스태거 (필수 기본)
2. 스크롤 진행바
3. 핀 고정 스크롤리텔링 (휠다운의 핵심)
4. 진입 연출 A: 커튼 + 마스크드 라인 라이즈
5. 진입 연출 B: 밀랍인장 게이트
6. 커서 글로우 / 커스텀 커서
7. 이미지 다크룸 현상
8. 필름 그레인 오버레이
9. 마퀴 / 카운트업 (선택)

---

## 1. 스크롤 리빌 스태거 (필수)

```css
.rv{opacity:0;transform:translateY(26px);
  transition:opacity var(--dur-reveal) var(--ease-expo),transform var(--dur-reveal) var(--ease-expo);
  transition-delay:var(--d,0ms)}
.rv.lit{opacity:1;transform:none}
```
```html
<h2 class="rv">제목</h2>
<p class="rv" style="--d:120ms">첫 줄</p>
<p class="rv" style="--d:240ms">둘째 줄</p>
```
```js
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('lit'); io.unobserve(e.target); }});
},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
```
`--d`로 요소별 지연을 주면 계단식으로 떠오른다. `unobserve`로 한 번만.

---

## 2. 스크롤 진행바

```css
#progress{position:fixed;top:0;left:0;height:2px;width:0;z-index:200;transform-origin:left;
  background:linear-gradient(90deg,var(--amber),var(--amber-hi));box-shadow:0 0 12px var(--amber)}
```
```js
var bar=document.getElementById('progress'),tick=false;
addEventListener('scroll',function(){ if(!tick){ requestAnimationFrame(function(){
  var h=document.documentElement.scrollHeight-innerHeight;
  bar.style.width=(h>0?scrollY/h*100:0)+'%'; tick=false;
});tick=true; }},{passive:true});
```

---

## 3. 복합 저니 — 휠다운 + 가로 + 빨려들어감 (휠다운의 핵심)

**원리:** 키 큰 섹션(예: 600vh)을 `position:sticky`로 고정하고, **스크롤 진행도 p(0~1)**로 (a) 내부 rail을 **가로로 팬**하고 (b) 각 컷의 **깊이 레이어를 스케일**해 공간에 빨려들어가게 한다. 세 기법(휠다운·가로·깊이)이 한 섹션에 섞인다. 스크롤재킹 아님 — 네이티브라 안 답답하다. **컷은 5~6개**가 적당(너무 적으면 밋밋, 많으면 지루).

⚠️ **중요:** 컷은 `flex:0 0 100vw`로 화면폭만큼 벌어져 있어, **컷과 컷 사이 전환 구간엔 중앙이 빈다.** 각 컷의 `mid` 플레이트에 **실제 사진**을 넣어 채워라(빈 그라디언트로 두면 사이가 허전). 리듬을 위해 컷 폭을 80vw로 좁혀 겹쳐 흐르게 하는 것도 방법.

```css
#journey{position:relative;height:600vh}                 /* 높이 = 컷 개수에 비례 */
#journey .stick{position:sticky;top:0;height:100dvh;overflow:hidden}
#journey .rail{display:flex;height:100dvh;will-change:transform}
#journey .panel{flex:0 0 100vw;height:100dvh;position:relative;display:grid;place-items:center;overflow:hidden}
#journey .lyr{position:absolute;left:50%;top:50%;will-change:transform}   /* far/mid/near 깊이 레이어 */
@media (max-width:860px),(prefers-reduced-motion:reduce){                 /* 모바일/RM=가로팬 해제, 세로 스택 */
  #journey{height:auto} #journey .stick{position:static;height:auto}
  #journey .rail{flex-direction:column;height:auto} #journey .panel{flex:none;min-height:78vh}
}
```
```js
var jr=document.getElementById('journey'), rail=document.getElementById('rail');
var panels=[].slice.call(rail.children), N=panels.length;
var wide=matchMedia('(min-width:861px)').matches && !RM;
function render(){
  if(!wide) return;
  var r=jr.getBoundingClientRect(), total=jr.offsetHeight-innerHeight;
  var p=Math.min(1,Math.max(0,(-r.top)/total));   // 0→1 전체 진행도
  rail.style.transform='translateX('+(-p*(N-1)*100)+'vw)';   // 가로 팬
  var pos=p*(N-1);                                            // 현재 컷 위치
  panels.forEach(function(panel,i){
    var d=Math.min(1,Math.abs(pos-i)), c=1-d, dir=(pos<i?1:-1);   // c=중심도
    var far=panel.querySelector('.far'),mid=panel.querySelector('.mid'),near=panel.querySelector('.near');
    far.style.transform ='translate(-50%,-50%) translateX('+(d*40*dir)+'px) scale('+(1.05+c*.12)+')';
    mid.style.transform ='translate(-50%,-50%) translateX('+(d*120*dir)+'px) scale('+(.86+c*.18)+')';
    near.style.transform='translate(-50%,-50%) translateX('+(d*240*dir)+'px) scale('+(.9+c*.14)+')';
    near.style.opacity=String(Math.max(0,c*1.4-.15));          // 중심 컷만 텍스트 선명
  });
}
var t=false;
addEventListener('scroll',function(){ if(!t){requestAnimationFrame(function(){render();t=false;});t=true;} },{passive:true});
addEventListener('resize',function(){ wide=matchMedia('(min-width:861px)').matches && !RM; render(); });
render();
```
far는 느리게(40px)·약간 확대, near는 빠르게(240px)·반대 방향 — 이 속도차가 "공간 통과" 깊이감을 만든다. `assets/template.html`에 이 저니가 6컷으로 완성돼 있으니 거기서 시작하라.

**변형으로 섞을 수 있는 것들:**
- **가로 필름스트립만**: 깊이 레이어 빼고 rail 가로팬만. 갤러리·타임라인.
- **빨려들어감만(제자리 줌)**: rail 팬 없이 한 컷에서 near가 계속 `scale`업하며 다음 레이어가 뒤에서 드러남. Apple 제품페이지식.
- **세로 핀 씬 전환**: `Math.floor(p*N)`로 컷을 `.on` 토글(단, 딱딱 끊겨 밋밋할 수 있음 — 위 연속 팬이 대개 낫다).
- **스크롤 진행 터미널 타이핑**(박효균식): 라인 배열을 `Math.round(p*lines.length)`까지 `.on`, 마지막 라인 auto-scroll.

---

## 4. 진입 연출 A: 커튼 + 마스크드 라인 라이즈 (티어1~2)

가장 안전하고 빠른 진입. 게이트 클릭 없이 로드하면서 극적으로 등장.

```css
#intro{position:fixed;inset:0;z-index:100;background:var(--bg0);display:grid;place-items:center;
  pointer-events:none;animation:curtain 1s var(--ease-expo) 1.35s forwards}
#intro i{display:block;height:1px;width:0;background:var(--amber);animation:draw 1.15s var(--ease-expo) forwards}
@keyframes draw{to{width:min(62vw,760px)}}
@keyframes curtain{to{opacity:0;transform:translateY(-12%);visibility:hidden}}

.hero h1 .ln{overflow:hidden}
.hero h1 .ln i{display:block;transform:translateY(105%);animation:rise 1s var(--ease-expo) forwards}
.hero h1 .ln:nth-child(1) i{animation-delay:1.5s}
.hero h1 .ln:nth-child(2) i{animation-delay:1.62s}
.hero h1 .ln:nth-child(3) i{animation-delay:1.74s}
@keyframes rise{to{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){
  #intro{display:none}.hero h1 .ln i{transform:none;animation:none}
}
```
라인 지연을 커튼이 걷히는 시점(1.35s)에 맞춰 시작하는 게 포인트.

---

## 5. 진입 연출 B: 밀랍인장 게이트 (티어2, 초대장 시그니처)

클릭으로 개봉하는 게이트. `sealed → open → done` 3상태 클래스 머신. CSS가 애니메이션을 소유, JS는 클래스만.

```css
body.sealed{overflow:hidden;height:100dvh}
#overlay{position:fixed;inset:0;z-index:100}
#overlay .panel{position:absolute;left:0;right:0;height:50.5%;background:var(--bg0);
  transition:transform 1.6s var(--ease-expo);transition-delay:.45s}
#overlay .panel.top{top:0}#overlay .panel.bottom{bottom:0}
body.open #overlay .panel.top{transform:translateY(-101%)}
body.open #overlay .panel.bottom{transform:translateY(101%)}
#seam{position:absolute;top:50%;left:0;right:0;height:2px;transform:scaleX(0);
  background:linear-gradient(90deg,transparent,#e5c07b,#f4dfae,#e5c07b,transparent)}
body.open #seam{animation:seam 1.7s var(--ease-expo) .25s forwards}
@keyframes seam{40%{transform:scaleX(1);opacity:1}100%{opacity:0}}
body.open #seal-wrap{opacity:0;transform:scale(.92);transition:.6s}
body.done #overlay{visibility:hidden}
```
```html
<body class="sealed">
<div id="overlay">
  <div class="panel top"></div><div class="panel bottom"></div>
  <div id="seam"></div>
  <div id="seal-wrap">
    <p class="inv-no">Private Invitation · <b>N° 001</b></p>
    <button id="seal-btn" aria-label="인장을 눌러 개봉">…인장(SVG 또는 이미지)…</button>
    <p class="hint">인장을 눌러 개봉하십시오</p>
  </div>
</div>
```
```js
var body=document.body,opened=false;
function open(){ if(opened)return; opened=true;
  body.classList.remove('sealed'); body.classList.add('open');
  setTimeout(function(){ body.classList.add('done'); },1600);
}
document.getElementById('seal-btn').addEventListener('click',open);
addEventListener('wheel',open,{passive:true,once:true});
addEventListener('touchmove',open,{passive:true,once:true});
addEventListener('keydown',function(e){ if(['Enter',' ','ArrowDown'].includes(e.key))open(); },{once:true});
if(matchMedia('(prefers-reduced-motion:reduce)').matches)open();
```
**밀랍 질감**은 래스터 없이 SVG 필터로: `feTurbulence`+`feDisplacementMap`(거친 가장자리) → `feSpecularLighting`(광택) → fractal-noise multiply(질감). 인장을 반으로 쪼개려면 하나의 `<g id="sealArt">`를 `<use>`로 두 번 참조하고 각각 좌/우 clipPath로 자른다. 실사진이 있으면 `new Image()` 프로브로 로드 성공 시 SVG를 사진으로 스왑.

---

## 6. 커서 글로우 / 커스텀 커서 (티어2~3, 데스크톱만)

```css
#glow{position:fixed;width:640px;height:640px;border-radius:50%;pointer-events:none;z-index:1;
  mix-blend-mode:screen;background:radial-gradient(circle,rgba(201,151,63,.14),transparent 60%);
  transform:translate(-50%,-50%)}
@media (hover:none){#glow{display:none}}
```
```js
if(matchMedia('(hover:hover)').matches){
  var gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy,g=document.getElementById('glow');
  addEventListener('mousemove',function(e){ tx=e.clientX; ty=e.clientY; });
  (function loop(){ gx+=(tx-gx)*.07; gy+=(ty-gy)*.07;
    g.style.left=gx+'px'; g.style.top=gy+'px'; requestAnimationFrame(loop); })();
}
```
커스텀 커서(점+링)는 점은 즉시, 링은 lerp `.16`로 뒤따르게. `a,button` hover 시 `body.hot`으로 링 확대.

---

## 7. 이미지 다크룸 현상

```css
.frame img{transform:scale(1.07);filter:brightness(.62) sepia(.14);
  transition:transform 1.6s var(--ease-expo),filter 1.6s var(--ease-expo)}
.frame.lit img{transform:scale(1);filter:brightness(.86)}
```
`.frame`에 리빌 IntersectionObserver를 같이 걸면 스크롤 진입 시 어둡고 확대된 사진이 "현상"된다.

---

## 8. 필름 그레인 오버레이 (셋 다 씀 — 가장 값싸고 고급진 트릭)

```css
body::after{content:"";position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:grain 900ms steps(3) infinite}
@keyframes grain{0%{transform:translate(0,0)}33%{transform:translate(-2%,1%)}66%{transform:translate(1%,-2%)}}
```

---

## 9. 마퀴 / 카운트업 (선택)

**마퀴**(로고/프로젝트명 벽): 콘텐츠를 2배로 복제하고 `@keyframes marq{to{transform:translateX(-50%)}}`. 가장자리는 `mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)`.

**카운트업**: IntersectionObserver `threshold:.6`로 진입 시 rAF로 0→target, `1-Math.pow(1-p,3)` 이징. `tabular-nums` 필수. (주의: TÀMH 초대장은 카운트업 없이 정적 숫자 — 과하면 뺀다.)

---

## 10. % 로더 인트로 (스튜디오형 아키타입의 진입 — instudio.kr식)

게이트 대신 쓰는 진입. 깜깜 → 큰 워드마크 + 0→100% 카운터 + 진행 라인 → 커튼처럼 위로 걷힘. B2B·스튜디오·실적형에 어울린다.

```css
#loader{position:fixed;inset:0;z-index:1000;background:var(--bg0);
  display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;
  transition:transform 1.05s cubic-bezier(.76,0,.24,1)}
body.loaded #loader{transform:translateY(-101%)}
#loader .lname{font-family:"Anton",sans-serif;font-size:clamp(40px,10vw,120px);letter-spacing:.02em;color:var(--ink)}
#loader .track{width:min(320px,70vw);height:2px;background:var(--line);overflow:hidden}
#loader .track i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--amber),var(--amber-hi))}
#loader .pct{font-family:var(--mono);font-size:12px;letter-spacing:.2em;color:var(--ink-2)}
```
```js
var body=document.body,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var bar=document.querySelector('#loader .track i'),pctEl=document.querySelector('#loader .pct b'),pct=0;
function reveal(){ if(body.classList.contains('loaded'))return; body.classList.add('loaded'); }
if(RM){ bar.style.width='100%'; if(pctEl)pctEl.textContent='100'; reveal(); }
else{
  var t=setInterval(function(){
    pct+=Math.max(1,Math.round((100-pct)*0.12));
    if(pct>=100){pct=100;clearInterval(t);setTimeout(reveal,320);}
    bar.style.width=pct+'%'; if(pctEl)pctEl.textContent=pct;
  },70);
  setTimeout(reveal,4000); // 안전 폴백 — 어떤 경우에도 열리게
}
```
`<div id="loader"><div class="lname">NAME</div><div class="track"><i></i></div><div class="pct"><b>0</b>% — LOADING</div></div>`.
포인트: **안전 폴백 타이머 필수**(카운터가 멈춰도 페이지가 잠기면 안 됨). 컨덴스드 헤비 폰트(Anton/Black Han Sans)와 짝지어야 스튜디오 톤이 산다.

## 11. 컨덴스드 헤비 타이포 (스튜디오형)
초대장형의 얇은 세리프와 정반대. 영문 `Anton`(올캡스 컨덴스드), 한글 `Black Han Sans`(헤비), 본문 `Archivo`/`Instrument Sans`, 라벨 mono. 헤드라인은 굵고 자간 좁게, 사진이 주인공·텍스트는 조연. `references/typography.md` 옵션에 추가로 쓴다.
