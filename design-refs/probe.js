// 라이브 사이트 디자인 수치 추출. 대상 사이트 devtools 콘솔에 붙여넣기.
// 출력: 폰트 / 타입스케일 / 텍스트색 / 배경 / radius / max-width / gap / transition
(() => {
  const els = [...document.querySelectorAll('body *')]
    .filter(e => e.offsetParent !== null)
    .slice(0, 3000);

  const top = (fn, n) => {
    const m = {};
    els.forEach(e => { const v = fn(getComputedStyle(e)); if (v) m[v] = (m[v] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(x => x[0]);
  };

  // 실제 텍스트 노드를 가진 요소만 — 래퍼 div가 타입스케일 통계를 오염시키는 것 방지
  const textEls = els.filter(e =>
    [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));

  const topText = (fn, n) => {
    const m = {};
    textEls.forEach(e => { const v = fn(getComputedStyle(e)); if (v) m[v] = (m[v] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(x => `${x[0]}×${x[1]}`);
  };

  const out = {
    host: location.host,
    fonts: topText(s => s.fontFamily.split(',')[0].replace(/"/g, ''), 3),
    type: topText(s => `${parseFloat(s.fontSize)}/${s.lineHeight} w${s.fontWeight} ${s.letterSpacing}`, 10),
    textColor: topText(s => s.color, 5),
    bg: top(s => (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : null), 6),
    radius: top(s => (s.borderRadius !== '0px' ? s.borderRadius : null), 5),
    maxWidth: top(s => (s.maxWidth !== 'none' ? s.maxWidth : null), 4),
    gap: top(s => (s.gap && s.gap !== 'normal' ? s.gap : null), 5),
    transition: top(s => (s.transitionDuration !== '0s'
      ? `${s.transitionDuration} ${s.transitionTimingFunction}` : null), 4),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    sampled: els.length,
  };
  console.log(JSON.stringify(out, null, 2));
  return out;
})();
