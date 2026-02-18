# 🚨 [긴급] 레이아웃 붕괴 복구 및 코드 동기화 지시서

> **문제 현상**: 현재 구현된 코드를 실행하면 HTML 요소들이 겹치고(Overlap), 게이지 바가 나타나지 않으며, 좌측의 데이터 텍스트가 게임 화면을 가리는 등 레이아웃이 완전히 무너진 상태임.

## 1. 🛠️ 구조적 해결 과제 (Structural Fix)
**[Action]** 아래 가이드라인에 맞춰 HTML, CSS, JS를 전면 재구조화 하세요.

### A. HTML 구조 확립 (`index.html`)
- 전체 화면을 `#app`으로 감싸고, 중앙 정렬된 `.game-shell` 컨테이너를 생성할 것.
- **좌측 영역 (`.main-area`)**: 고양이 캔버스, 상태 게이지(HP, Comfort 등), 현재 상황 텍스트를 배치.
- **우측 영역 (`.side-area`)**: 상단에는 간호 일지 표(`.log-panel`), 하단에는 선택지 버튼(`.control-panel`)을 배치.
- 모든 ID(`hpBar`, `sceneText`, `choiceContainer` 등)가 JS 코드와 100% 일치하는지 전수 검사할 것.

### B. CSS 레이아웃 고정 (`style.css`)
- **Grid 사용 필수**: `.game-shell`에 `display: grid; grid-template-columns: 1.2fr 1fr;`을 적용하여 구역을 강제로 나눌 것.
- **절대 좌표(`position: absolute`) 자제**: 연출용 오버레이를 제외한 모든 UI 요소는 `flex` 또는 `grid` 안에서 흐르도록 설정하여 요소 간 겹침 현상을 방지할 것.
- **게이지 시각화**: `.bar-outer`에 배경색을, `.bar-inner`에 `background-color: var(--safe)`와 높이(`height`)를 부여하여 눈에 보이게 할 것.

### C. 자바스크립트 로직 동기화 (`script.js`)
- **렌더링 루프**: `renderScene()` 함수가 호출될 때 `updateStatsUI()`가 함께 실행되어 UI와 데이터가 항상 일치하게 할 것.
- **인터랙션 복구**: '꾹 누르기(Hold)' 기능이 버튼 클릭 이벤트와 충돌하지 않도록 이벤트 리스너를 정밀하게 설계할 것.

---

## 2. 🎨 시각적 연출 가이드 (Visual Tension)
- **Pain Shake**: HP가 30% 이하일 때 `.main-area`만 미세하게 흔들리도록 애니메이션을 적용할 것.
- **Vignette Overlay**: 위독 상태일 때 화면 테두리가 어두워지는 효과가 레이아웃을 가리지 않고 최상단(`z-index: 100`) 오버레이로 작동하게 할 것.

---

## 3. 📝 코덱스 최종 체크리스트
- [ ] HTML의 ID와 JS의 `document.getElementById`가 모두 매칭되는가?
- [ ] 화면 크기를 줄여도 좌우 레이아웃이 겹치지 않고 유지되는가?
- [ ] 버튼 클릭 시 수치가 즉각적으로 게이지 바에 반영되는가?
- [ ] 텍스트 데이터가 화면 밖으로 넘치거나 이미