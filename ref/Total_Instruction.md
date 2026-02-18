Markdown
# 🚀 [긴급] 라떼의 계절: 통합 개발 지시서 (Total Instruction)

> **작성자**: 총괄 디렉터 (Gemini)
> **수신자**: 메인 개발자 (Claude/Codex)
> **목표**: 현재 중단된 작업을 재개하고, GDD v1.0의 핵심 경험(5턴 일과, 챕터 진행)을 완벽히 구현할 것.

---

## 1. 📁 누락되었던 파일: `outputs/CODEX_TASKS.md`
**[Action]** 아래 내용을 `outputs/CODEX_TASKS.md` 파일로 생성하고, 이를 기준으로 개발 로드맵을 확정하세요.

# CODEX_TASKS: 라떼의 계절 (Season of Latte) 개발 로드맵

> **Target Goal**: GDD v1.0의 "감정적 시뮬레이션" 경험을 100% 구현하는 것.

## ✅ Phase 1: 핵심 구조 및 서사 재구축 (우선순위: 최상)
**목표:** 단순 루프물을 "서사가 있는 28일의 여정"으로 변경

- [ ] **1-1. 챕터별 시나리오 분리 (Scenario Structure)**
    - [ ] `const scenes` 배열을 `chapter1Events` ~ `chapter4Events`로 분리.
    - [ ] `state.day` 범위(D-28~21, ~14, ~7, ~D-Day)에 따라 이벤트 풀 교체 로직(`getEventForDay`) 구현.
- [ ] **1-2. 5턴 일과 시스템 (Daily Routine)**
    - [ ] `state`에 `timeSlot` (0:새벽, 1:오전, 2:오후, 3:저녁, 4:심야) 추가.
    - [ ] `advanceTurn()`: `timeSlot` 증가 -> 4초과 시 `day` 증가 로직 구현.
    - [ ] 시간대별 배경 색상(Palette) 자동 전환 연결.
- [ ] **1-3. 시간대별 고유 행동 (Action Logic)**
    - [ ] 범용 선택지 제거 후 시간대별(새벽:수액, 저녁:급여 등) 전용 선택지 UI 표시.
- [ ] **1-4. Prologue 컷씬 구현**
    - [ ] `showPrologue()` 함수 작성 (Sepia 필터, 과거 회상 텍스트).

## 🚧 Phase 2: 비주얼 및 데이터 시각화 (1~2주차)
- [ ] **2-1. 라떼 스프라이트 구현**: 4단계 상태(Normal, Sick, Critical, Comfort) 픽셀 아트 렌더링.
- [ ] **2-2. 엑셀 스타일 일지 UI**: `<table>` 기반 그리드 변경, 데이터 갱신 깜빡임 효과.
- [ ] **2-3. 선택지 힌트 시스템**: 결과 예측 아이콘(♥+5 등) 표시.

## 🎮 Phase 3: 미니게임 및 인터랙션 (2~4주차)
- [ ] **3-1. 수액 놓기 (새벽)**: Canvas 오버레이, 타이밍 맞추기.
- [ ] **3-2. 강제 급여 (저녁)**: 리듬 게임 스타일, 19스푼 달성 목표.
- [ ] **3-3. CCTV 관찰 (오후)**: 블러 필터 화면, 상태 맞추기 퀴즈.

## 🎵 Phase 4: 사운드 및 폴리싱 (4주차~)
- [ ] **4-1. 칩튠 BGM**: Tone.js 연동, 상황별 4곡 루프.
- [ ] **4-2. 심장박동 SFX**: HP 연동 BPM 재생.
- [ ] **4-3. 엔딩 및 2회차**: 엔딩 저장, 2회차 전용 텍스트.

---

## 2. 💻 핵심 로직 구현 가이드 (Implementation Guide)
**[Action]** Phase 1 구현 시 아래 코드 패턴을 반드시 준수하세요.

**A. 5턴 일과 시스템 (`advanceTurn` logic)**
```javascript
// 상태 관리에 timeSlot 추가
let state = {
    day: 1,
    timeSlot: 0, // 0:Dawn, 1:Morning, 2:Afternoon, 3:Evening, 4:Night
    // ... 기존 상태
};

const TIME_NAMES = ["새벽 05:00", "오전 09:00", "오후 14:00", "저녁 19:00", "심야 23:00"];

function advanceTurn() {
    state.timeSlot++;
    
    // 하루가 끝남 (심야 이후)
    if (state.timeSlot > 4) {
        state.timeSlot = 0;
        state.day++;
        updateDailyLog(); // 하루 요약 기록
    }
    
    // 시간대별 팔레트 및 배경 변경
    updateVisualsByTime(state.timeSlot);
    
    // 엔딩 체크
    if (state.day > 28) {
        triggerEnding();
        return;
    }
    renderScene();
}
B. 챕터별 이벤트 풀 분리 (getEvent logic)

JavaScript
function getCurrentChapter() {
    if (state.day <= 7) return 1; // Ch.1 붕괴
    if (state.day <= 14) return 2; // Ch.2 사투
    if (state.day <= 21) return 3; // Ch.3 기적
    if (state.day <= 28) return 4; // Ch.4 이별
    return 0; // Prologue or End
}

function getNextEvent() {
    const chapter = getCurrentChapter();
    // 챕터별 이벤트 풀에서 시간대(timeSlot)에 맞는 이벤트만 필터링하여 반환
    // ... (구현 필요)
}
3. 📝 최종 보고 양식 (Checklist)
[Action] 작업 완료 후 아래 양식에 맞춰 결과를 보고하세요.

[ ] Phase 1 구현 리포트

[ ] 챕터 1~4 시나리오 데이터 분리 완료

[ ] 하루 5턴(새벽~심야) 루프 정상 작동 확인

[ ] Prologue (세피아 톤) 컷씬 진입 및 종료 확인

[ ] Blocking Issue: (없음 / 발생 시 기재)