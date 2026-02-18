# 🔧 버그 수정 & 게임플레이 개선 명세서

> **문서 버전**: v1.0 | 2026.02.17  
> **작성자**: 시나리오 디렉터 (Claude)  
> **수신자**: 메인 개발자 (Codex)  
> **우선순위**: A (즉시 반영)

---

## 이슈 #1: HP 밸런스 — weak/critical 상태 노출 빈도 부족

### 현상

현재 게임 밸런스에서 HP가 60 이상(healthy)을 유지하는 비율이 지나치게 높아, weak(31~60)과 critical(0~30) 상태의 스프라이트가 거의 노출되지 않는다. 18종의 스프라이트 중 10종(weak 7 + critical 3)이 사실상 사장된 상태이며, HP 하락에 따른 시각적 피드백이 약해 게임의 긴장감이 떨어진다.

### 원인 분석

1. **초기 HP가 72로 너무 높다** — 60 이하로 떨어지려면 누적 -12 이상의 HP 손실이 필요한데, 대부분의 선택지가 HP +2~5 회복을 제공
2. **챕터 진행에 따른 자연 감소(passive decay)가 없다** — HP는 선택지의 delta에 의해서만 변동하고, 시간 경과에 따른 자연 하락이 없어 신부전 말기라는 설정과 괴리
3. **수액/약 아이템이 쿨다운 없이(blanket/brush는 0턴) 매 턴 사용 가능** — 이슈 #4에서 해결
4. **domino penalty의 HP 감소가 comfort <= 15일 때만 -2로, 트리거 조건이 너무 늦다**

### 수정 방안

#### A. 초기 HP를 65로 하향

```javascript
// state 초기값 변경
const state = {
  ...
  hp: 65,  // 기존 72 → 65
  ...
};
```

#### B. 챕터별 HP 자연 감소 (Daily Decay) 추가

매일 새벽(slot 0) 시작 시 챕터에 따라 HP가 자동 감소한다. 이것은 신부전 진행을 시뮬레이션한다.

```javascript
const CHAPTER_HP_DECAY = {
  1: -2,   // Chapter 1: 진단 직후, 느린 하락
  2: -4,   // Chapter 2: 사투, 눈에 띄는 악화
  3: -1,   // Chapter 3: 기적, 일시적 회복기 (감소 완화)
  4: -5,   // Chapter 4: 이별, 급격한 하락
};
```

`advanceTurn()` 함수 내 `state.timeSlot === 0` (새 하루 시작) 시점에 적용:

```javascript
// advanceTurn() 내부, 새 하루 시작 블록에 추가
if (state.timeSlot === 0 && state.day > 1) {
  const chapter = getCurrentChapter();
  const decay = CHAPTER_HP_DECAY[chapter] || -2;
  state.hp = clamp(state.hp + decay, 0, 100);
}
```

#### C. domino penalty HP 감소 강화

```javascript
function applyDominoPenalty() {
  const penalty = { hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0 };

  // comfort 기반 HP 감소 강화
  if (state.comfort <= PENALTY_THRESHOLDS.red) {       // <= 15
    penalty.hp -= 3;    // 기존 -2 → -3
    penalty.sanity -= 1;
  } else if (state.comfort <= PENALTY_THRESHOLDS.yellow) {  // <= 30
    penalty.hp -= 2;    // 기존 -1 → -2
  }

  // HP 기반 domino 유지
  if (state.hp <= 10) {
    penalty.comfort -= 2;
    penalty.bond -= 1;
  } else if (state.hp <= 25) {
    penalty.comfort -= 1;
  }

  // [신규] sanity 기반 HP 감소 — 멘탈 붕괴가 돌봄 품질에 영향
  if (state.sanity <= PENALTY_THRESHOLDS.red) {
    penalty.hp -= 1;
  }

  for (const key of RESOURCE_KEYS) {
    if (!penalty[key]) continue;
    state[key] += penalty[key];
  }
  applyResourceClamp();
}
```

#### D. 예상 밸런스 결과

이 변경으로 챕터별 대략적 HP 밴드 예측:

| 챕터 | 일수 | 누적 자연감소 | 예상 HP 범위 | 주 상태 |
|------|------|-------------|-------------|---------|
| Ch.1 (D1~7) | 7일 | -14 | 50~65 | healthy → **weak 진입** |
| Ch.2 (D8~14) | 7일 | -28 | 30~50 | **weak 중심** |
| Ch.3 (D15~21) | 7일 | -7 | 35~55 | weak (회복 가능) |
| Ch.4 (D22~28) | 7일 | -35 | 0~30 | **critical 중심** |

---

## 이슈 #2: 이모트/아이템 이미지 좌우 비율 일그러짐 버그

### 현상

이모트(emote_heart, emote_sparkle, emote_stress)와 아이템 아이콘(item_blanket, item_brush, item_iv, item_meds)이 화면에 표시될 때 좌우로 찌그러져 보인다.

### 원인 분석

**이모트 이펙트 (`.emote-effect`)**:

```css
/* 현재 — 문제 코드 */
.emote-effect {
  height: min(72px, 18%);
  width: auto;
  max-width: 72px;   /* ← width와 max-width가 충돌 */
  aspect-ratio: auto;
}
```

`height`가 고정되고 `width: auto`이지만, `max-width: 72px`가 이미지의 원본 비율을 무시하고 강제로 폭을 제한한다. 원본 이미지가 가로로 넓은 경우(emote_sparkle 등) 가로가 잘리며 찌그러진다.

**아이템 아이콘 (`.item-icon`)**:

```css
/* 현재 — 문제 코드 */
.item-icon {
  width: 42px;
  height: 42px;   /* ← 정사각형 강제 */
  image-rendering: pixelated;
}
```

`width`와 `height`를 동시에 고정하면 `object-fit`이 없을 때 이미지가 정사각형으로 강제 리사이즈된다. 원본 이미지가 정사각형이 아닌 경우 찌그러진다.

### 수정 (style.css)

#### 이모트 이펙트

```css
/* 수정 */
.emote-effect {
  position: absolute;
  top: 0;
  left: 0;
  height: min(72px, 18%);
  width: auto;            /* auto 유지 */
  max-width: none;        /* ← 제한 제거 */
  max-height: 72px;       /* 높이로만 제한 */
  aspect-ratio: auto;     /* 원본 비율 유지 */
  object-fit: contain;    /* ← 추가: 비율 보존 */
  transform: translate(-50%, -100%);
  image-rendering: pixelated;
  z-index: 6;
  pointer-events: none;
}
```

#### 아이템 아이콘

```css
/* 수정 */
.item-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;    /* ← 추가: 비율 보존하며 박스에 맞춤 */
  image-rendering: pixelated;
}
```

`object-fit: contain`을 추가하면 42×42 박스 안에서 원본 비율을 유지한 채 가장 크게 표시된다.

---

## 이슈 #3: 이벤트에 따른 UI 폰트 컬러 가독성 파괴 버그

### 현상

시간대 전환이나 특정 이벤트 시 CSS 커스텀 속성 `--text`가 변경되면서, 기본 UI 요소(버튼 텍스트, 로그 테이블, 상태 힌트 등)의 폰트 컬러가 배경과 동색이 되어 읽을 수 없게 되는 경우가 발생한다.

### 원인 분석

`updateVisualsByTime(slot)` 함수에서 `--text` 변수를 시간대별로 변경한다:

```javascript
const palette = [
  ["#2C3E50", "#1d2b3f", "#ECF0F1"],  // slot 0: 밝은 텍스트 ✓
  ["#FDFFE6", "#d9ddbf", "#333333"],  // slot 1: 어두운 텍스트 ← 문제
  ["#F5E6CA", "#c4a882", "#333333"],  // slot 2: 어두운 텍스트 ← 문제
  ["#D4A574", "#8b6a42", "#FFFFFF"],  // slot 3: 밝은 텍스트 ✓
  ["#1A1A2E", "#0f0f1d", "#BDC3C7"],  // slot 4: 밝은 텍스트 ✓
][slot];

root.style.setProperty("--text", palette[2]);
```

slot 1, 2에서 `--text`가 `#333333`(어두운 색)으로 바뀌는데, UI 카드 배경(`--card: #161f2e`)이 매우 어둡기 때문에 어두운 텍스트가 어두운 배경 위에 놓여 읽을 수 없다.

또한 `body`에 `color: var(--fg)`를 쓰고 있지만, 많은 UI 요소가 `color: var(--text)`를 직접 참조하고 있어서 `--text` 변경의 영향을 받는다:

- `.bar-label { color: var(--text); }`
- `.bar-value { color: var(--text); }`
- `.choice-btn { color: var(--text); }`
- `.item-btn { color: var(--text); }`

### 수정 방안

**핵심 원칙**: `--text`는 배경(씬 뷰) 위의 텍스트에만 적용하고, UI 패널 안의 텍스트는 항상 밝은 색 고정.

#### A. UI 전용 변수 분리

```css
:root {
  /* 기존 변수 유지 */
  --text: #ecf0f1;

  /* [신규] UI 패널 전용 — 시간대 변경에 영향받지 않음 */
  --ui-text: #ecf0f1;
  --ui-text-dim: rgba(255, 255, 255, 0.78);
  --ui-text-muted: rgba(255, 255, 255, 0.65);
}
```

#### B. UI 요소들의 color를 `--ui-text`로 변경

```css
/* 기존 var(--text) → var(--ui-text) 로 변경할 요소들 */

.bar-label {
  color: var(--ui-text);      /* 기존: var(--text) */
  opacity: 0.7;
}

.bar-value {
  color: var(--ui-text);      /* 기존: var(--text) */
  opacity: 0.6;
}

.choice-btn,
button {
  color: var(--ui-text);      /* 기존: var(--text) */
}

.item-btn {
  color: var(--ui-text);      /* 기존: var(--text) */
}

.status-hint {
  color: var(--ui-text-muted);  /* 기존: var(--muted) — 가독성 개선 */
}

.scene-text {
  color: var(--ui-text);      /* 씬 텍스트도 UI 패널 안이므로 고정 */
}

.background-cue {
  color: var(--ui-text);      /* 배경 위이지만 반투명 배경 위이므로 밝은 색 */
}

.meta-row {
  color: var(--ui-text);
}
```

#### C. `--text` 변수의 역할 한정

`--text`는 오직 씬 뷰 위에 직접 올라가는 텍스트(배경 없는 오버레이 등)에만 사용한다. 현재 코드에서 `.reaction-text`는 이미 `color: #ecf0f1` 하드코딩이므로 영향 없음.

#### D. `updateVisualsByTime()`에서 `--ui-text`는 건드리지 않기

```javascript
function updateVisualsByTime(slot) {
  const palette = [
    ["#2C3E50", "#1d2b3f", "#ECF0F1"],
    ["#FDFFE6", "#d9ddbf", "#333333"],
    ["#F5E6CA", "#c4a882", "#333333"],
    ["#D4A574", "#8b6a42", "#FFFFFF"],
    ["#1A1A2E", "#0f0f1d", "#BDC3C7"],
  ][slot];

  const root = document.documentElement;
  root.style.setProperty("--bg", palette[0]);
  root.style.setProperty("--bg2", palette[1]);
  root.style.setProperty("--text", palette[2]);
  // --ui-text는 변경하지 않음 → 항상 #ecf0f1 유지
  
  el.stageScene.className = `stage-scene ${CHAPTER_META[getCurrentChapter()].stage}`;
  updateSceneBackground(slot);
}
```

---

## 이슈 #4: 아이템 시스템 게임 룰 개선 — 별 등급 + 자금 연동

### 현상

현재 아이템(담요, 빗, 수액, 약) 4종이 항시 활성화되어 있어 전략적 선택의 의미가 부족하다. 자금(money) 리소스와 연동된 비용 체계가 필요하다.

### 개선 설계

#### A. 별 등급(Star Rating) 시스템

| 아이템 | 별 등급 | 비용(money) | 시각 표시 |
|--------|---------|------------|-----------|
| 담요 (blanket) | ★☆☆☆ | -2 | ★ |
| 빗 (brush) | ★★☆☆ | -4 | ★★ |
| 수액 세트 (iv) | ★★★☆ | -6 | ★★★ |
| 약 (meds) | ★★★★ | -8 | ★★★★ |

별 등급 = 비용 가중치. 별 1개당 money -2.

#### B. ITEM_DATA 수정

```javascript
const ITEM_DATA = {
  blanket: {
    id: "blanket",
    name: "담요",
    icon: "item_blanket.png",
    description: "따뜻한 담요로 라떼를 감싸준다.",
    stars: 1,                        // ★
    cost: 2,                         // money -2
    effect: { comfort: 3, bond: 1 }, // money 제거 (cost로 분리)
    latteContext: "blanket",
    emote: "heart",
    usableStates: ["healthy", "weak", "critical"],
    cooldownTurns: 0,
  },
  brush: {
    id: "brush",
    name: "빗",
    icon: "item_brush.png",
    description: "부드럽게 빗질해준다.",
    stars: 2,                        // ★★
    cost: 4,                         // money -4
    effect: { bond: 3, comfort: 1 },
    latteContext: "grooming",
    emote: "heart",
    usableStates: ["healthy", "weak"],
    cooldownTurns: 0,
  },
  iv: {
    id: "iv",
    name: "수액 세트",
    icon: "item_iv.png",
    description: "따뜻하게 데운 피하수액을 놓는다.",
    stars: 3,                        // ★★★
    cost: 6,                         // money -6
    effect: { hp: 5, comfort: -1, sanity: -2 },  // money 제거
    latteContext: "iv_therapy",
    emote: null,
    usableStates: ["weak", "critical"],
    cooldownTurns: 1,
  },
  meds: {
    id: "meds",
    name: "약",
    icon: "item_meds.png",
    description: "처방 약을 먹인다.",
    stars: 4,                        // ★★★★
    cost: 8,                         // money -8
    effect: { hp: 3, comfort: -2, bond: -1 },  // money 제거
    latteContext: "feeding",
    emote: "stress",
    usableStates: ["healthy", "weak", "critical"],
    cooldownTurns: 1,
  },
};
```

#### C. 자금 임계값에 의한 비활성화

```javascript
const ITEM_MONEY_THRESHOLD = 5;  // money가 이 값 이하면 모든 아이템 비활성화
```

#### D. `getItemUsable()` 수정

```javascript
function getItemUsable(itemId) {
  const item = ITEM_DATA[itemId];
  if (!item) return false;
  const latteState = getLatteState(state.hp);
  if (!item.usableStates.includes(latteState)) return false;
  if ((state.itemCooldowns[itemId] || 0) > 0) return false;

  // [신규] 자금 체크
  if (state.money <= ITEM_MONEY_THRESHOLD) return false;  // 전체 비활성화
  if (state.money < item.cost) return false;               // 개별 비용 부족

  return true;
}
```

#### E. `useItem()` 수정 — 비용 차감

```javascript
function useItem(itemId) {
  if (state.ended || state.minigame.active || state.reactionPending) return;
  const item = ITEM_DATA[itemId];
  if (!item || !getItemUsable(itemId)) return;

  // [신규] 비용 먼저 차감
  state.money -= item.cost;
  applyResourceClamp();

  // 기존 effect 적용 (money는 effect에서 제거했으므로 중복 없음)
  const delta = { hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0, ...item.effect };
  applyDelta(delta);

  state.lastActionContext = item.latteContext;
  setSpriteContext(item.latteContext, 1);
  if (item.emote) triggerEmoteByKey(item.emote);
  state.itemCooldowns[itemId] = Math.max(0, item.cooldownTurns || 0);

  // [수정] 로그에 비용 표시
  addLogRow({
    date: dayText(state.day),
    time: TIME_NAMES[state.timeSlot],
    hp: state.hp,
    comfort: state.comfort,
    intake: state.intake,
    note: `[아이템] ${item.name} (${"★".repeat(item.stars)} / -${item.cost}💰)`,
  });

  const reaction = `${item.name} 사용 (${"★".repeat(item.stars)}): ${item.description}`;
  showReaction(reaction, () => advanceTurn());
}
```

#### F. `renderItemPanel()` 수정 — 별 등급 표시 + 비용 + 비활성 사유

```javascript
function renderItemPanel() {
  if (!el.itemPanel) return;
  el.itemPanel.innerHTML = "";
  const latteState = getLatteState(state.hp);

  for (const itemId of Object.keys(ITEM_DATA)) {
    const item = ITEM_DATA[itemId];
    const btn = document.createElement("button");
    btn.className = "item-btn";

    const usable = getItemUsable(itemId) && !state.ended && !state.minigame.active && !state.reactionPending;
    if (!usable) btn.classList.add("disabled");

    // 아이콘
    const icon = document.createElement("img");
    icon.src = `assets/images/${item.icon}`;
    icon.alt = item.name;
    icon.className = "item-icon";

    // 이름 + 별 등급
    const label = document.createElement("span");
    label.className = "item-label";
    label.textContent = item.name;

    // [신규] 별 등급 표시
    const stars = document.createElement("span");
    stars.className = "item-stars";
    stars.textContent = "★".repeat(item.stars) + "☆".repeat(4 - item.stars);

    // [신규] 비용 표시
    const cost = document.createElement("span");
    cost.className = "item-cost";
    cost.textContent = `-${item.cost}💰`;

    btn.appendChild(icon);
    btn.appendChild(label);
    btn.appendChild(stars);
    btn.appendChild(cost);

    // 비활성 사유 툴팁
    const cd = state.itemCooldowns[itemId] || 0;
    let reason = item.description;
    if (!item.usableStates.includes(latteState)) {
      reason = `상태 제한 (${latteState})`;
    } else if (cd > 0) {
      reason = `쿨다운 ${cd}턴`;
    } else if (state.money <= ITEM_MONEY_THRESHOLD) {
      reason = `자금 부족 (${state.money} ≤ ${ITEM_MONEY_THRESHOLD})`;
    } else if (state.money < item.cost) {
      reason = `비용 부족 (필요: ${item.cost}, 보유: ${state.money})`;
    }
    btn.title = reason;
    btn.disabled = !usable;
    btn.onclick = () => useItem(itemId);

    el.itemPanel.appendChild(btn);
  }

  // 자금 부족 시 패널 경고
  if (state.money <= ITEM_MONEY_THRESHOLD) {
    el.itemPanel.classList.add("money-warning");
  } else {
    el.itemPanel.classList.remove("money-warning");
  }
}
```

#### G. CSS 추가 — 별 등급 스타일

```css
.item-stars {
  display: block;
  font-size: 10px;
  color: #f1c453;
  letter-spacing: 1px;
  line-height: 1;
}

.item-cost {
  display: block;
  font-size: 10px;
  color: #2ecc71;
  line-height: 1;
}

.item-btn.disabled .item-stars {
  color: #666;
}

.item-btn.disabled .item-cost {
  color: #666;
}

/* 자금 부족 시 전체 아이템 패널에 경고 표시 */
.item-panel.money-warning {
  border: 1px solid rgba(211, 91, 84, 0.4);
}
```

---

## 적용 순서 권장

1. **이슈 #2** (이미지 비율) — CSS만 수정, 리스크 최소
2. **이슈 #3** (폰트 컬러) — CSS 변수 분리, 리스크 낮음
3. **이슈 #4** (아이템 시스템) — JS + CSS 수정, 중간 규모
4. **이슈 #1** (HP 밸런스) — 게임 밸런스 핵심, 테스트 필요

---

## 변경 파일 요약

| 파일 | 이슈 #1 | 이슈 #2 | 이슈 #3 | 이슈 #4 |
|------|---------|---------|---------|---------|
| `script.js` | ✅ | — | ✅ (미변경, JS는 건드리지 않음) | ✅ |
| `style.css` | — | ✅ | ✅ | ✅ |
