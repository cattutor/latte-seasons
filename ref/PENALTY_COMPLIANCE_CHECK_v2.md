# PENALTY 정합 체크 v2 — 남은 작업 목록

> 전체 내용: outputs/PENALTY_COMPLIANCE_CHECK_v2.md

## 현재 완료율: ~70% (v1 40% → v2 70%)

## 완료된 것
- ✅ state 필드 8개 전부 추가 + save/restore 반영
- ✅ 엔딩 분기 Hidden/A/B/C/D 교체 완료 (hiddenPoint 참조, Collapse별 조건)
- ✅ 에필로그 Collapse 기반 추가 완료
- ✅ bondHideTimer 기반 직접 간병 잠금 완료
- ✅ SYSTEM_PENALTY_ORDER 도입, runPenaltySystems 구조화

## 남은 작업 (A등급 — 즉시)
1. renderChoices(): Sanity≤30 → delta 노이즈, Sanity≤15 → 선택지 축소
2. applyDelta(): Bond≤30 → 0.7배, Bond≤15 → 0.4배 효율 감쇠
3. getEventForDay(): Money≤0 → 병원/약 잠금 확장 + 출근 money+3

## 남은 작업 (B등급)
4. updateCondition(): Comfort≤30 → sick 강제
5. 씬 텍스트 프리픽스: 자원 저구간 시 내면 묘사 1줄 자동 삽입

## 참조 문서
- D:\text\ref\PENALTY_DESIGN.md (전체 사양 원문)
