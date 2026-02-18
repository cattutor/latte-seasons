# PENALTY_DESIGN.md vs script.js — 정합 체크 보고서 (재검증)

> 기준 문서: `ref/PENALTY_DESIGN.md`  
> 점검 대상: `script.js`  
> 판정: `✅ 반영됨 / ⚠️ 부분 반영 / ❌ 미반영`

---

## 수정 지시 요약(섹션 8) 재점검

1. 엔딩 교체 (`triggerEnding` Hidden/A/B/C/D)
- 상태: ✅ 반영됨
- 근거: `script.js:2384`, `script.js:2397`, `script.js:2403`, `script.js:2409`, `script.js:2415`, `script.js:2421`

2. state 필드 추가 (`usedPainkiller`, `bondHideTimer`, `sanityBlackoutDay`, `dayStartSnapshot`)
- 상태: ✅ 반영됨
- 근거: `script.js:475`, `script.js:476`, `script.js:477`, `script.js:478`
- save/restore 반영: `script.js:2575`, `script.js:2576`, `script.js:2577`, `script.js:2578`, `script.js:2637`, `script.js:2638`, `script.js:2639`, `script.js:2640`

3. Collapse 메커니즘
- Sanity Collapse: 하루 스킵 + sanity=10 회복 + "기록 없음" 일지
  - 상태: ✅ 반영됨
  - 근거: `script.js:1919`, `script.js:1924`, `script.js:2194`, `script.js:2196`
- Bond Collapse: `bondHideTimer=2` + 직접 간병 비활성
  - 상태: ✅ 반영됨
  - 근거: `script.js:1931`, `script.js:1935`, `script.js:657`
- Comfort Collapse: 진통제 선택 강제 이벤트
  - 상태: ✅ 반영됨
  - 근거: `script.js:1942`, `script.js:1946`, `script.js:702`, `script.js:707`

4. `renderChoices` sanity 패널티
- `sanity <= 30` 힌트 노이즈
  - 상태: ✅ 반영됨
  - 근거: `script.js:1867`, `script.js:2352`
- `sanity <= 15` 선택지 1개 제거
  - 상태: ✅ 반영됨
  - 근거: `script.js:2328`, `script.js:2338`

5. `applyDelta` bond 효율 감쇠 (0.7/0.4)
- 상태: ✅ 반영됨
- 근거: `script.js:1848`, `script.js:1850`, `script.js:2259`

6. `getEventForDay` bond/money 잠금 확장
- Money <= 0: 병원계열 잠금 + 출근 보상 +3
  - 상태: ✅ 반영됨
  - 근거: `script.js:599`, `script.js:644`, `script.js:646`
- Bond <= 15: 강제 급여 잠금
  - 상태: ✅ 반영됨
  - 근거: `script.js:654`, `script.js:655`

---

## 종합 판정 (수정 지시 요약 기준)

- 완료율: **100% (6/6)**
- 판정: **요약 지시 항목 기준 구현 완료**

---

## 참고 (요약 외 잔여 설계 항목)

- `Money Collapse`의 "도움 요청" 선택형 이벤트(문서 섹션 4 Collapse)는 현재 즉시 회복형 처리로 구현되어 있어, 설계 원문과는 일부 차이가 있음.
- `Sanity <= 15` 최초 진입 강제 이벤트(보호자 붕괴 씬) 및 텍스트 왜곡 연출은 부분 반영/비반영 구간이 남아 있음.

