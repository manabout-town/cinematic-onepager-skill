#!/usr/bin/env bash
# cinematic-onepager 스킬 설치
#   스킬 → ~/.claude/skills/cinematic-onepager
#   디자인 기준 문서 → ~/.claude/design-refs/
#   (선택) APPEND_CLAUDE_MD=1 → UI 작업 규칙을 ~/.claude/CLAUDE.md 끝에 추가
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ~/.claude/skills ~/.claude/design-refs
cp -R skill/cinematic-onepager ~/.claude/skills/
cp design-refs/web-craft-baseline.md design-refs/ui-style-picker-ko.md design-refs/probe.js ~/.claude/design-refs/
if [ "${APPEND_CLAUDE_MD:-}" = "1" ]; then
  if grep -q "^# UI 작업 규칙" ~/.claude/CLAUDE.md 2>/dev/null; then echo "· CLAUDE.md에 이미 UI 규칙 있음 — 건너뜀"
  else printf '\n' >> ~/.claude/CLAUDE.md; cat design-refs/CLAUDE-ui-rules.md >> ~/.claude/CLAUDE.md; echo "· CLAUDE.md에 UI 규칙 추가"; fi
fi
echo "✓ 설치 끝. 선택 스킬(ui-ux-pro-max·impeccable·gsap)은 README 참고"
