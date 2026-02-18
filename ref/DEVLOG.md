# Dev Log
- 최신이 위

## 2026-02-15
### Summary
- 티켓 3개(숨겨진 엔딩, 오디오 토글/BGM, 진행 저장·복구)를 반영함.

### Changes
- `script.js`: `Hidden` 엔딩 분기 추가 (`hiddenPoint`, `bond` 조건).
- `script.js`: WebAudio 기반 챕터별 BGM 전환, 음소거 상태 제어 로직 추가.
- `index.html`: 소리 토글 버튼(`audioToggleBtn`) 추가.
- `style.css`: 액션 버튼 영역 줄바꿈(`flex-wrap`) 대응.
- `script.js`: `localStorage` 기반 저장/복구(`SAVE_KEY`) 및 재시작 시 저장 삭제 처리 추가.

### Next
- 브라우저 수동 QA: Hidden 엔딩 진입 조건 충족 경로 검증.
- 브라우저 수동 QA: 새로고침/재시작/엔딩 이후 저장 복구 시나리오 검증.
- 브라우저 수동 QA: 챕터 전환 시 BGM 변경, 음소거 토글 동작 검증.

### Blockers
- 없음.
