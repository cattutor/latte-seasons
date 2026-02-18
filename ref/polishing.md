# 🎭 Phase 4: 최종 연출 및 엔딩 시스템 통합 (압축 버전)

> **목표**: 남은 용량을 고려하여 핵심 비주얼 피드백과 엔딩 시퀀스를 구현함. BGM 연동을 위한 코드 구조만 선제적으로 확보함.

## 1. ✨ 미니게임 타격감 (Visual Juice)
**[Action]** `script.js`의 미니게임 결과 처리 함수에 아래 연출을 즉시 주입하세요.

- **Perfect 판정 시**: 
  - `flash-screen` 효과: `#app` 배경을 0.1초간 흰색으로 번쩍이게 함.
  - 라떼 주변에 'Perfect!' 텍스트가 위로 솟아오르는 CSS 애니메이션 추가.
- **Fail 판정 시**: 
  - `shake-screen`: 화면 전체가 0.3초간 강하게 흔들림.
  - `pain-overlay`: 화면 테두리에 붉은색 비네팅(`--danger-alpha`)을 즉시 1.0으로 올렸다가 서서히 줄임.

## 📜 2. 타이프라이터 효과 (Typewriter Effect)
**[Action]** 지문이 출력될 때 텍스트가 한 번에 나오지 않고 한 글자씩 흐르도록 수정하세요.

- `el.sceneText.textContent` 업데이트 시, 기존 텍스트를 지우고 `setInterval`을 이용해 30ms 간격으로 글자를 하나씩 출력하는 함수를 적용할 것. (클릭 시 스킵 기능 포함)

## 🌅 3. 엔딩 시퀀스 (The Final Chapter)
**[Action]** D-Day(28일) 종료 시 작동할 엔딩 모듈을 구현하세요.

- **멀티 엔딩 조건**:
  - **기적 (Miracle)**: HP > 50, Bond > 80일 때.
  - **평온한 이별 (Peaceful)**: HP < 10, Comfort > 70일 때.
  - **회한 (Regret)**: Sanity < 20 또는 Bond < 40일 때.
- **연출**: 화면이 서서히 세피아 톤으로 변하며(`backdrop-filter: sepia(1)`), 그동안의 간호 일지가 하단에서 상단으로 스크롤되는 엔딩 크레딧 레이어 활성화.

## 🎵 4. 오디오 엔진 준비 (Audio Placeholder)
**[Action]** 나중에 BGM 파일을 넣을 수 있도록 구조만 생성하세요.

- `playBGM(fileName)` 함수를 만들고, 챕터 전환 시 호출되도록 배치. (현재는 `console.log`로만 출력하고 실제 경로는 비워둘 것)
- 위독 상태(`hp < 20`) 시 심박음(`heartbeat.mp3`)을 루프 재생할 수 있는 로직 미리 확보.

---

**[코덱스 전달 주의사항]**
- 데이터 배열(`chapterEvents` 등)은 수정하지 말고 **로직만 업데이트**할 것.
- 레이아웃 정렬(Grid)이 깨지지 않도록 `style.css`의 기존 규격을 절대 엄수할 것.