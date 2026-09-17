// 고정(fixed/sticky) 상단바 밑으로 콘텐츠가 파고드는지 검사한다.
// 대상: ① 스크롤 0의 첫 화면 ② 화면 높이 60% 이상인 sticky 핀 내부(진행도 2%·50%·98%).
// 평범한 본문이 스크롤되며 상단바 밑을 지나가는 것은 정상이라 검사하지 않는다.
// usage: node check-header-overlap.mjs <url> [<url> ...]
//   예) cd 사이트폴더 && python3 -m http.server 8792 &  →  node check-header-overlap.mjs http://localhost:8792/
// playwright 경로: PLAYWRIGHT 환경변수(예: /path/node_modules/playwright/index.mjs) > 스크립트 옆 node_modules의 playwright
const PW = process.env.PLAYWRIGHT || 'playwright';
const { chromium } = await import(PW);
const sizes = [[1280,560],[1336,620],[1336,700],[1440,768],[1440,900],[1920,1000],[1024,640],[768,1024],[430,932],[390,664],[320,568]];
const b = await chromium.launch();
let failed = 0;
// 인자가 공백으로 붙어 들어와도 주소별로 나눔 (zsh는 따옴표 없는 변수를 쪼개지 않음)
const urls = process.argv.slice(2).flatMap(a => a.split(/\s+/)).filter(Boolean);
for (const url of urls) {
  const res = await (await b.newPage()).goto(url).catch(e => null);
  if (!res || !res.ok()) { console.log(`== ${url}: LOAD FAIL ${res ? res.status() : 'no response'}`); failed++; continue; }
  const bad = [];
  for (const [w,h] of sizes) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    await p.goto(url, {waitUntil:'networkidle'}); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => document.querySelectorAll('#loader,#noren,#issue').forEach(e => e.remove()));
    await p.evaluate(() => document.body.classList.remove('loading','closed','issuing','sealed'));
    await p.waitForTimeout(1200);
    const r = await p.evaluate(async () => {
      const hdrs = [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); return (s.position === 'fixed' || s.position === 'sticky') && e.getBoundingClientRect().top <= 1 && e.getBoundingClientRect().height < innerHeight * .3 && e.getBoundingClientRect().width > innerWidth * .6; });
      const pins = [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height > innerHeight * .6);
      const out = [];
      const check = (root, tag) => {
        const hb = Math.max(0, ...hdrs.filter(x => !root.contains(x) && !x.contains(root)).map(x => x.getBoundingClientRect().bottom));
        // 제목이 버튼·탭을 덮는지 (세로 가운데 정렬 넘침의 다른 증상)
        const heads = [...root.querySelectorAll('h1, h2, h3')].filter(e => e.checkVisibility({opacityProperty:true}));
        const ctrls = [...root.querySelectorAll('button, [role=tab], a.btn')].filter(e => e.checkVisibility({opacityProperty:true}) && !heads.some(h => h.contains(e) || e.contains(h)));
        for (const h of heads) { const a = h.getBoundingClientRect(); if (a.height > innerHeight * .5) continue;
          for (const c of ctrls) { const r = c.getBoundingClientRect(); const ix = Math.min(a.right, r.right) - Math.max(a.left, r.left), iy = Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top);
            if (ix > 4 && iy > 4) { out.push(`${tag} 제목"${h.innerText.trim().slice(0,10)}"이 버튼"${(c.innerText||'').trim().slice(0,8)}"을 덮음`); break; } } }
        if (!hb) return;
        // overflow로 잘려 보이지 않는 부분은 빼고, 실제로 보이는 영역만 본다
        const visRect = e => { let r = e.getBoundingClientRect(); let t = r.top, bt = r.bottom; for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a); if (o.overflow !== 'visible' || o.clipPath !== 'none') { const ar = a.getBoundingClientRect(); t = Math.max(t, ar.top); bt = Math.min(bt, ar.bottom); } } return {top: t, bottom: bt, width: r.width, height: Math.max(0, bt - t)}; };
        for (const e of root.querySelectorAll('button, a, h1, h2, h3, p, img, b')) {
          const rr = visRect(e), s = getComputedStyle(e);
          if (!rr.height || !e.checkVisibility({opacityProperty:true, visibilityProperty:true})) continue;
          let a = e, op = 1; while (a) { op *= +getComputedStyle(a).opacity; a = a.parentElement; } if (op < .05) continue;
          // 화면 폭 90% 이상 사진은 헤더 뒤에 깔리는 배경으로 보고 제외
          if (e.tagName === 'IMG' && rr.width >= innerWidth * .9) continue;
          if (rr.top < hb - 1 && rr.bottom > hb + 1) out.push(`${tag} ${e.tagName}"${(e.innerText||e.alt||'').trim().slice(0,12)}" top${Math.round(rr.top)}<hdr${Math.round(hb)}`);
        }
      };
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
      check(document.querySelector('main') || document.body, 's0');
      for (const pin of pins) {
        const host = pin.parentElement, len = host.offsetHeight - innerHeight;
        for (const f of [.02, .5, .98]) {
          scrollTo(0, host.getBoundingClientRect().top + scrollY + len * f); await new Promise(r => setTimeout(r, 1200));
          // 스크롤 끝에서 고정이 풀려 올라가는 중이면 정상 동작이라 건너뜀
          if (pin.getBoundingClientRect().top < (parseFloat(getComputedStyle(pin).top) || 0) - 1) continue;
          check(pin, `pin${f}`);
        }
      }
      return [...new Set(out)].slice(0, 3);
    });
    if (r.length) bad.push(`${w}x${h}: ${r.join(' | ')}`);
    await p.close();
  }
  if (bad.length) failed++;
  console.log(`== ${url}: ${bad.length ? '\n' + bad.join('\n') : 'OK'}`);
}
await b.close();
process.exit(failed ? 1 : 0);
