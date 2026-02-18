# 라떼의 계절 — 엔딩 에필로그 연출 사양서

> **목표**: 엔딩을 "텍스트 한 덩어리" → "3단계 감정 여정"으로 바꾼다.  
> 플레이어가 28일간의 이별을 되돌아보는 시간을 만든다.

---

## 1. 엔딩 연출 3단계 구조

현재: `triggerEnding → 텍스트 출력 → 크레딧(로그 스크롤)`  
변경: `triggerEnding → Stage1 엔딩 씬 → Stage2 에필로그 → Stage3 크레딧`

### Stage 1 — 엔딩 씬 (3~5초)
- 화면이 서서히 어두워진다 (fade to black, 1초)
- 엔딩 코드와 제목 표시: `[엔딩 Hidden] 무지개 다리`
- `state.ending.text`의 첫 부분만 타이핑 (본문, epilogue 제외)
- BGM이 엔딩 트랙으로 크로스페이드
- 하단에 "계속" 버튼 또는 3초 후 자동 진행

### Stage 2 — 에필로그 (핵심 신규 구현)
- 검은 배경 위에 에필로그 텍스트가 한 줄씩 등장
- 각 줄은 fade-in (0.8초) → 유지 (2초) → 다음 줄
- 빈 문자열("")은 1.5초 pause로 처리 (호흡)
- 모든 줄이 끝나면 2초 pause 후 Stage 3으로 전환
- 클릭/탭으로 현재 줄 즉시 완성 + 다음 줄 진행 가능

### Stage 3 — 크레딧
- 기존 startEndingCredits 로직 유지 (로그 스크롤)
- 크레딧 끝에 "다시 시작" 버튼

---

## 2. triggerEnding 수정 사항

### state.ending 구조 변경

현재 (Codex 구현):
```javascript
state.ending = {
  code: "Hidden",
  title: "무지개 다리",
  text: "라떼가 마지막 순간...\n\n기억이 빈 날들이...\n빚이 남았다...",
  // epilogue가 text에 이어붙여짐
};
```

변경 후:
```javascript
state.ending = {
  code: "Hidden",
  title: "무지개 다리",
  text: "라떼가 당신의 손 위에서 마지막 숨을 내쉬었다.\n창밖으로 무지개가 걸렸다.",
  epilogue: [
    "봄이 왔다.",
    "라떼가 좋아하던 창가에 햇살이 든다.",
    "빈 밥그릇 앞을 지나칠 때마다 발걸음이 멈춘다.",
    "하지만 이제 안다.",
    "28일 동안 매일 새벽에 일어났던 것이,",
    "전부 사랑이었다는 것을.",
    "",
    "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
  ],
};
```

### 핵심 변경: epilogue를 text에 이어붙이지 말고 배열로 분리 유지

triggerEnding 내에서 Collapse 기반 에필로그 추가 방식:

```javascript
// 기본 에필로그를 엔딩별로 설정 (PENALTY_DESIGN.md 원문 그대로)
// 그 후 Collapse 기록에 따라 push

if (sc >= 1) state.ending.epilogue.push("기억에 빈 날들이 있다. 그 시간을 라떼는 혼자 보냈다.");
if (bc >= 1) state.ending.epilogue.push("내 손을 피하던 날들이 있었다.");
if (cc >= 2) state.ending.epilogue.push("고통을 덜어주지 못한 밤들이 떠오른다.");
if (mc >= 1) state.ending.epilogue.push("빚이 남았다. 하지만 후회는 없다.");
if (state.money < 0) state.ending.epilogue.push("생활이 무너졌다. 하지만 라떼와의 시간은 돈으로 살 수 없었다.");
if (state.usedPainkiller) state.ending.epilogue.push("마지막 며칠, 라떼는 고통 없이 지냈다. 하지만 눈빛은 이전과 달랐다.");
```

---

## 3. 엔딩별 epilogue 배열 전문

### Hidden — 무지개 다리
```javascript
epilogue: [
  "봄이 왔다.",
  "라떼가 좋아하던 창가에 햇살이 든다.",
  "빈 밥그릇 앞을 지나칠 때마다 발걸음이 멈춘다.",
  "하지만 이제 안다.",
  "28일 동안 매일 새벽에 일어났던 것이,",
  "전부 사랑이었다는 것을.",
  "",
  "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
]
```

### A — 나의 라떼
```javascript
epilogue: [
  "마지막 체온이 손끝에서 사라졌다.",
  "울음이 멈추지 않았다.",
  "하지만 라떼의 마지막 표정은 편안했다.",
  "그것만으로 충분했다고, 언젠가 믿을 수 있을 것이다.",
]
```

### B — 병원에서의 사투
```javascript
epilogue: [
  "할 수 있는 것은 다 했다.",
  "그래도 남는 건 '더 할 수 있지 않았을까'라는 물음이다.",
  "시간이 지나면 답이 바뀔 수도 있다.",
]
```

### C — 자연의 섭리
```javascript
epilogue: [
  "아프지 않았으면 좋겠다고 빌었다.",
  "마지막 숨이 고요했으니, 들어준 걸지도 모른다.",
  "꽃을 한 송이 놓았다. 라떼가 좋아하던 색으로.",
]
```

### D — 회한
```javascript
epilogue: [
  "잘한 건지 모르겠다.",
  "더 잘할 수 있었는데, 라는 말이 맴돈다.",
  "그래도 끝까지 곁에 있었다.",
  "그것만은 사실이다.",
]
```

---

## 4. Stage 2 에필로그 렌더링 함수 구현 명세

```javascript
function showEpilogue(epilogueLines, callback) {
  // 엔딩 오버레이 내부에 에필로그 전용 컨테이너 생성
  const container = document.createElement("div");
  container.className = "epilogue-container";
  
  // endingOverlay 내부, creditsRoll 앞에 삽입
  el.creditsRoll.before(container);
  
  let lineIndex = 0;
  
  function showNextLine() {
    if (lineIndex >= epilogueLines.length) {
      // 모든 줄 완료, 2초 후 콜백 (Stage 3 진입)
      setTimeout(() => {
        container.classList.add("fade-out");
        setTimeout(() => {
          container.remove();
          if (callback) callback();
        }, 800);
      }, 2000);
      return;
    }
    
    const line = epilogueLines[lineIndex];
    lineIndex++;
    
    // 빈 줄은 pause로 처리
    if (line === "") {
      setTimeout(showNextLine, 1500);
      return;
    }
    
    const lineEl = document.createElement("p");
    lineEl.className = "epilogue-line";
    lineEl.textContent = line;
    container.appendChild(lineEl);
    
    // fade-in 애니메이션
    requestAnimationFrame(() => {
      lineEl.classList.add("visible");
    });
    
    // 이전 줄들은 서서히 투명해짐
    const prevLines = container.querySelectorAll(".epilogue-line.visible");
    prevLines.forEach((prev, i) => {
      if (i < prevLines.length - 2) {
        prev.classList.add("fading");
      }
    });
    
    // 2.8초 후 다음 줄
    setTimeout(showNextLine, 2800);
  }
  
  // 클릭으로 진행 가속
  const skipHandler = () => {
    // 현재 줄 즉시 표시 완료 → 다음 줄 표시
    const current = container.querySelector(".epilogue-line:last-child");
    if (current) current.classList.add("visible");
  };
  container.addEventListener("click", skipHandler);
  
  showNextLine();
}
```

---

## 5. CSS 추가 (style.css)

```css
.epilogue-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  z-index: 1001;
  padding: 20px;
  transition: opacity 0.8s;
}

.epilogue-container.fade-out {
  opacity: 0;
}

.epilogue-line {
  font-family: "DungGeunMo", monospace;
  font-size: 14px;
  color: #ECF0F1;
  text-align: center;
  margin: 8px 0;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  max-width: 320px;
  line-height: 1.6;
}

.epilogue-line.visible {
  opacity: 1;
  transform: translateY(0);
}

.epilogue-line.fading {
  opacity: 0.3;
  transition: opacity 1.2s;
}
```

---

## 6. triggerEnding → showEpilogue → startEndingCredits 연결

```javascript
function triggerEnding() {
  if (state.ended) return;
  state.ended = true;

  // ... (엔딩 분기 로직은 PENALTY_DESIGN.md 그대로) ...
  // epilogue를 text에 이어붙이지 않고 배열로 유지

  state.condition = "Comfort";
  const e = state.ending;
  
  // Stage 1: 엔딩 씬
  document.body.classList.add("finale-mode");
  playBGM("ending");
  typeText(el.sceneText, `[엔딩 ${e.code}] ${e.title}\n${e.text}`);
  el.choiceContainer.innerHTML = "";
  
  addLogRow({
    date: "END", time: "-", 
    hp: state.hp, comfort: state.comfort, intake: state.intake,
    note: `${e.code} ${e.title}`
  });
  
  // Stage 1 → Stage 2 전환 (3초 후)
  setTimeout(() => {
    document.body.classList.add("ending-sepia");
    el.endingTitle.textContent = `ENDING: ${e.title}`;
    el.endingText.textContent = e.text;
    el.endingOverlay.hidden = false;
    el.endingOverlay.classList.add("active");
    
    // Stage 2: 에필로그
    if (e.epilogue && e.epilogue.length > 0) {
      showEpilogue(e.epilogue, () => {
        // Stage 3: 크레딧
        startEndingCredits(e);
      });
    } else {
      startEndingCredits(e);
    }
  }, 3000);
  
  saveProgress();
}
```

---

## 7. 구현 체크리스트

- [ ] state.ending.epilogue를 배열로 분리 (text에 이어붙이지 않음)
- [ ] 5개 엔딩별 기본 epilogue 배열 삽입
- [ ] Collapse 기반 동적 epilogue.push 로직
- [ ] showEpilogue() 함수 구현
- [ ] CSS (.epilogue-container, .epilogue-line, .visible, .fading) 추가
- [ ] triggerEnding 내 3단계 전환 로직 (Stage1 → Stage2 → Stage3)
- [ ] 클릭 가속 처리
- [ ] save/restore에서 epilogue 배열 보존
