# 라떼의 계절 — 3차 수정 지시서 (REVISION v3)

> **작성일**: 2026.02.16  
> **작성자**: 시나리오 디렉터 (Claude)  
> **수신자**: 메인 개발자 (Codex)  
> **성격**: 버그 수정 + 이펙트 개선 + UI 아이콘 + 근본적 재미 설계  
> **우선순위**: A(즉시) → B(핵심) → C(추가)

---

## A. 버그 수정 — BGM 미재생 (우선순위: 즉시)

### A-1. 파일명 오류

`assets/audio/bgm_ending.mp3.mp3` — 확장자가 이중으로 붙어 있다.

**수정**: 파일명을 `bgm_ending.mp3`로 변경하거나, `AUDIO_PATHS.bgm.ending` 경로를 실제 파일명과 일치시킨다.

```
현재 코드:  ending: "assets/audio/bgm_ending.mp3"
실제 파일:  assets/audio/bgm_ending.mp3.mp3
→ 파일명을 bgm_ending.mp3 로 rename 하는 것을 권장.
```

### A-2. Ch.2 BGM 누락

`AUDIO_PATHS.bgm`에 `ch2` 키가 없다. `updateAudioState()`에서 chapter 1~2를 모두 `ch1`으로 매핑하고 있으므로 의도적이라면 문제 없지만, GDD 사운드 설계에서는 Ch.2에 별도 BGM("로파이 칩튠 / 사투")을 지정하고 있다.

**권장**: `assets/audio/bgm_ch2.mp3` 파일 추가 후 분리. 당장 제작이 어렵다면, `ch1`과 `ch2` 매핑을 유지하되 TODO 주석을 남겨둘 것.

### A-3. 브라우저 Autoplay 정책 대응

현재 `switchBGM()`이 `state.audio.startedByUser` 플래그에 의존하는데, 프롤로그에서 첫 클릭 시 `nextPrologue()`가 이 플래그를 설정한다. 문제는 `AudioContext`가 `ensureAudioGraph()` 안에서 생성되는데, 이 함수가 `switchBGM()` 내부에서만 호출되므로 **첫 BGM 재생 시점에 `AudioContext`가 `suspended` 상태일 수 있다**.

**수정**:

```javascript
// nextPrologue() 안에서, initAudioEngine() 직후에 추가:
function nextPrologue() {
  state.audio.startedByUser = true;
  initAudioEngine();
  ensureAudioGraph();                    // ← 추가
  if (state.audio.context?.state === "suspended") {
    state.audio.context.resume();        // ← 추가
  }
  updateAudioState();
  // ... 이하 기존 코드
}
```

### A-4. 볼륨 페이드 안정화

`switchBGM()`의 크로스페이드 인터벌에서 `prev.volume`을 0으로 내리지만, `prev`가 이미 `pause()`된 상태에서 volume 조작이 무시될 수 있다. `pause()` 호출을 인터벌 완료 후로 이동시키는 현재 구조는 맞으나, `prev`가 `null`일 때의 가드가 필요하다.

**수정**: `switchBGM()` 안의 `if (prev)` 가드를 인터벌 내부에도 적용.

---

## B. 이펙트 개선 — 사각형 노출 문제 (우선순위: 즉시)

### B-1. 문제 진단

`triggerPerfectFX()`에서 생성하는 `.spark` 요소와 `.perfect-text`가 CSS에서 투명 배경 없이 기본 `div` 스타일로 렌더링되어 **사각형 박스가 그대로 노출**된다.

### B-2. 스파크 이펙트 수정

```css
/* style.css — 기존 .spark 규칙 교체 */
.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #FFD700;
  border-radius: 50%;
  pointer-events: none;
  z-index: 50;
  animation: spark-burst 0.8s ease-out forwards;
  box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.6);
}

@keyframes spark-burst {
  0% {
    transform: scale(1) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: scale(0.3) translate(
      calc((var(--dx, 0) * 1px)),
      calc((var(--dy, 0) * 1px))
    );
    opacity: 0;
  }
}
```

**JS 수정** — 각 스파크에 랜덤 방향 부여:

```javascript
// triggerPerfectFX() 안의 spark 생성 루프 교체
for (let i = 0; i < 12; i++) {
  const spark = document.createElement("div");
  spark.className = "spark";
  const angle = (Math.PI * 2 * i) / 12;
  const dist = 20 + Math.random() * 30;
  spark.style.setProperty("--dx", Math.cos(angle) * dist);
  spark.style.setProperty("--dy", Math.sin(angle) * dist);
  spark.style.left = "50%";
  spark.style.top = "50%";
  el.latteCard.appendChild(spark);
  setTimeout(() => spark.remove(), 820);
}
```

### B-3. Perfect 텍스트 수정

```css
.perfect-text {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-family: "DungGeunMo", "Consolas", monospace;
  font-size: 28px;
  color: #FFD700;
  text-shadow: 2px 2px 0 #8B6914, 0 0 8px rgba(255, 215, 0, 0.5);
  pointer-events: none;
  z-index: 51;
  background: transparent;
  border: none;
  padding: 0;
  animation: perfect-float 0.9s ease-out forwards;
}

@keyframes perfect-float {
  0% { transform: translateX(-50%) translateY(0) scale(0.5); opacity: 0; }
  30% { transform: translateX(-50%) translateY(-8px) scale(1.2); opacity: 1; }
  100% { transform: translateX(-50%) translateY(-30px) scale(1); opacity: 0; }
}
```

### B-4. 실패 이펙트 수정

`triggerMinigameFailFX()`에서 추가하는 `fail-flash`, `fail-shake` 클래스도 사각형 오버레이가 노출될 수 있다.

```css
.fail-flash {
  animation: fail-flash-anim 0.12s ease-out;
}
@keyframes fail-flash-anim {
  0% { box-shadow: inset 0 0 60px rgba(220, 50, 50, 0.5); }
  100% { box-shadow: inset 0 0 0 transparent; }
}
```

### B-5. 비네팅 이펙트 개선

현재 `--vignette-alpha`로 제어되는 비네팅이 사각 `box-shadow`로 구현되어 있을 수 있다. 원형 그래디언트로 교체:

```css
.main-area::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(139, 0, 0, var(--vignette-alpha, 0)) 100%
  );
  z-index: 40;
  border-radius: inherit;
}
```

---

## C. 리소스 아이콘 시스템 (우선순위: 핵심)

### C-1. 현재 문제

스탯 바가 텍스트 레이블(HP, Comfort, Sanity, Money, Bond)만으로 표시되어 8비트 감성이 전혀 살아나지 않는다. GDD에서 설계한 "하트, 구름, 별, 코인, 리본" 아이콘이 필요하다.

### C-2. HTML 수정

`index.html`의 `.stats-container` 영역을 아래로 교체:

```html
<div class="stats-container">
  <div class="bar-wrap">
    <span class="bar-icon" aria-label="체력">❤️</span>
    <span class="bar-label">체력</span>
    <div class="bar-outer"><div id="hpBar" class="bar-inner bar-hp"></div></div>
    <span class="bar-value" id="hpValue">72</span>
  </div>
  <div class="bar-wrap">
    <span class="bar-icon" aria-label="편안함">☁️</span>
    <span class="bar-label">편안함</span>
    <div class="bar-outer"><div id="comfortBar" class="bar-inner bar-comfort"></div></div>
    <span class="bar-value" id="comfortValue">50</span>
  </div>
  <div class="bar-wrap">
    <span class="bar-icon" aria-label="멘탈">⭐</span>
    <span class="bar-label">멘탈</span>
    <div class="bar-outer"><div id="sanityBar" class="bar-inner bar-sanity"></div></div>
    <span class="bar-value" id="sanityValue">70</span>
  </div>
  <div class="bar-wrap">
    <span class="bar-icon" aria-label="자금">🪙</span>
    <span class="bar-label">자금</span>
    <div class="bar-outer"><div id="moneyBar" class="bar-inner bar-money"></div></div>
    <span class="bar-value" id="moneyValue">40</span>
  </div>
  <div class="bar-wrap">
    <span class="bar-icon" aria-label="유대감">🎀</span>
    <span class="bar-label">유대</span>
    <div class="bar-outer"><div id="bondBar" class="bar-inner bar-bond"></div></div>
    <span class="bar-value" id="bondValue">45</span>
  </div>
</div>
```

### C-3. CSS — 아이콘 + 컬러 바

```css
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 12px;
}

.bar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "DungGeunMo", "Consolas", monospace;
  font-size: 13px;
  position: relative;
}

.bar-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  filter: saturate(0.8);
  image-rendering: pixelated;
}

.bar-label {
  width: 40px;
  font-size: 11px;
  color: var(--text);
  opacity: 0.7;
}

.bar-outer {
  flex: 1;
  height: 10px;
  background: rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 0;
  image-rendering: pixelated;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  transition: width 0.4s ease;
}

.bar-hp     { background: #E74C3C; }
.bar-comfort { background: #3498DB; }
.bar-sanity  { background: #F39C12; }
.bar-money   { background: #2ECC71; }
.bar-bond    { background: #E91E63; }

.bar-inner.warn   { filter: brightness(0.8); }
.bar-inner.danger { animation: bar-danger-pulse 0.8s ease-in-out infinite alternate; }

@keyframes bar-danger-pulse {
  from { opacity: 1; }
  to   { opacity: 0.5; }
}

.bar-value {
  width: 28px;
  text-align: right;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--text);
  opacity: 0.6;
}
```

### C-4. JS — 수치 표시 연동

`updateStatsUI()` 함수에 수치 표시 추가:

```javascript
function updateStatsUI() {
  // ... 기존 바 업데이트 유지 ...

  // 수치 텍스트 추가
  const hpVal = document.getElementById("hpValue");
  const comfortVal = document.getElementById("comfortValue");
  const sanityVal = document.getElementById("sanityValue");
  const moneyVal = document.getElementById("moneyValue");
  const bondVal = document.getElementById("bondValue");
  if (hpVal) hpVal.textContent = Math.round(state.hp);
  if (comfortVal) comfortVal.textContent = Math.round(state.comfort);
  if (sanityVal) sanityVal.textContent = Math.round(state.sanity);
  if (moneyVal) moneyVal.textContent = Math.round(state.money);
  if (bondVal) bondVal.textContent = Math.round(state.bond);
}
```

### C-5. 자원 변동 팝업 (Delta Indicator)

선택 후 변동값을 바 옆에 잠깐 표시하여 피드백을 강화한다.

```javascript
function showDeltaIndicator(barId, delta) {
  if (delta === 0) return;
  const bar = document.getElementById(barId);
  if (!bar) return;
  const wrap = bar.closest(".bar-wrap");
  if (!wrap) return;

  const indicator = document.createElement("span");
  indicator.className = "delta-indicator " + (delta > 0 ? "positive" : "negative");
  indicator.textContent = (delta > 0 ? "+" : "") + delta;
  wrap.appendChild(indicator);
  setTimeout(() => indicator.remove(), 1200);
}
```

```css
.delta-indicator {
  position: absolute;
  right: -8px;
  top: -4px;
  font-family: "DungGeunMo", monospace;
  font-size: 14px;
  font-weight: bold;
  pointer-events: none;
  animation: delta-float 1.2s ease-out forwards;
  z-index: 30;
}
.delta-indicator.positive { color: #2ECC71; }
.delta-indicator.negative { color: #E74C3C; }

@keyframes delta-float {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-18px); opacity: 0; }
}
```

`applyDelta()` 호출 직후에 각 자원별 `showDeltaIndicator()`를 호출.

---

## D. 근본적 재미 개선 (우선순위: 핵심)

> 현재 게임이 지루한 근본 원인:
> 1. **이벤트 반복** — 챕터당 5개 이벤트가 7일간 반복
> 2. **피드백 부재** — 선택 후 숫자만 바뀌고 즉시 다음 턴
> 3. **긴장감 부재** — 리스크 없는 일정한 리듬의 140턴
> 4. **서사 희박** — 씬 텍스트 1~2줄로 감정 밀도 부족

### D-1. 반응 텍스트 시스템 (Reaction Line)

**핵심 변경**: 선택 후 바로 다음 턴으로 넘어가지 않고, 1~2초간 "반응 텍스트"를 표시한 뒤 넘어간다. 이 짧은 문장이 선택에 무게를 부여한다.

`chooseAction()` 수정:

```javascript
function chooseAction(choice, scene) {
  if (state.ended || choice.locked) return;
  if (state.minigame.active) return;
  applyDelta(choice.delta);
  // ... 기존 hiddenPoint, spoon, intake 처리 유지 ...

  const reaction = getReactionText(choice, scene);
  if (reaction) {
    showReaction(reaction, () => {
      addLogRow({ ... });
      advanceTurn();
    });
    return;
  }
  addLogRow({ ... });
  advanceTurn();
}
```

**반응 텍스트 결정 함수**:

```javascript
function getReactionText(choice, scene) {
  // 극적 변화 반응
  if (choice.delta.hp >= 5)
    return "라떼의 눈빛이 조금 또렷해졌다.";
  if (choice.delta.hp <= -2)
    return "...괜찮을까. 불안을 애써 누른다.";
  if (choice.delta.comfort >= 4)
    return "라떼가 눈을 반쯤 감았다. 편안해 보인다.";
  if (choice.delta.comfort <= -3)
    return "라떼가 고개를 돌렸다. 미안해.";
  if (choice.delta.bond >= 3)
    return "가르릉, 가르릉. 이 소리만은 변하지 않았다.";
  if (choice.delta.sanity <= -3)
    return "머리가 무거워진다. 일찍 자야 할 것 같다.";

  // 특수 상황
  if (choice.key === "commute")
    return "라떼를 두고 나서는 발걸음이 무겁다.";
  if (choice.key === "forceFeed" && (choice.intake || 0) >= 5)
    return "전부 삼켰다. 힘들었겠지만, 오늘은 이게 최선이다.";
  if (choice.hiddenPoint)
    return "...조용히, 체온이 전해진다.";

  // 자원 위험 경고 (1회만 표시)
  if (state.hp <= 25 && !state._hpWarnShown) {
    state._hpWarnShown = true;
    return "체력이 위험하다. 시간이 얼마 남지 않았을 수도 있다.";
  }
  if (state.money <= 5 && !state._moneyWarnShown) {
    state._moneyWarnShown = true;
    return "통장이 바닥이다. 일부 선택이 닫힌다.";
  }
  if (state.sanity <= 25 && !state._sanityWarnShown) {
    state._sanityWarnShown = true;
    return "눈앞이 흐려진다. 판단력이 흔들리고 있다.";
  }

  // 20% 확률로 분위기 반응
  if (Math.random() < 0.2) {
    const ambient = [
      "창밖에서 새 소리가 들린다.",
      "라떼가 꼬리를 살짝 움직였다.",
      "멀리서 구급차 사이렌이 울린다.",
      "시계가 째깍거린다. 시간은 멈추지 않는다.",
      "커피가 식었다. 언제 내렸는지 기억이 안 난다.",
    ];
    return ambient[Math.floor(Math.random() * ambient.length)];
  }

  return null;
}
```

**반응 표시 UI**:

```javascript
function showReaction(text, callback) {
  const overlay = document.createElement("div");
  overlay.className = "reaction-overlay";
  overlay.innerHTML = `<p class="reaction-text">${text}</p>`;
  el.mainArea.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 400);
  }, 1600);
}
```

```css
.reaction-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  z-index: 35;
  animation: reaction-in 0.3s ease-out;
}

.reaction-overlay.fade-out {
  animation: reaction-out 0.4s ease-in forwards;
}

.reaction-text {
  font-family: "DungGeunMo", monospace;
  font-size: 15px;
  color: #ECF0F1;
  text-shadow: 1px 1px 0 #000;
  text-align: center;
  margin: 0;
}

@keyframes reaction-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes reaction-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

### D-2. 랜덤 이벤트 변주 시스템

같은 챕터의 같은 슬롯이라도 날마다 다른 텍스트가 나오도록 **변주 풀(Variant Pool)**을 추가한다.

```javascript
const SLOT_VARIANTS = {
  "1-0": [
    "새벽 수액 준비. 뜨거운 물에 링거백을 담그고, 떨리는 손으로 등의 피부를 잡아 올린다.",
    "어제보다 손이 덜 떨린다. 하지만 라떼의 등은 어제보다 더 마르고 얇다.",
    "수액 가방을 꺼내자 라떼가 몸을 움츠린다. 알고 있는 거다.",
    "등의 텐트가 잘 잡히지 않아 세 번째 시도에야 바늘이 들어갔다.",
    "오늘은 왼쪽 어깨. 오른쪽엔 더 이상 놓을 자리가 없다.",
    "새벽 4시. 알람보다 먼저 눈이 떠진다. 몸이 이 시간을 기억하기 시작했다.",
    "물을 데우는 3분이 하루 중 가장 길다.",
  ],
  "1-1": [
    "출근할지, 곁에 남을지. 생계와 죄책감이 동시에 밀려온다.",
    "지하철에서 '고양이 말기 신부전'을 검색한다. 읽을수록 마음이 무거워진다.",
    "팀장이 전화를 건다. 업무 마감이 내일이라는 걸 이제야 기억했다.",
    "현관문을 여는 순간 뒤에서 라떼가 운다. 발걸음이 멈춘다.",
    "화장실 거울에 비친 얼굴이 낯설다. 며칠째 제대로 씻지 못했다.",
    "출근 준비를 하다가 라떼 약 시간을 깜빡할 뻔했다.",
    "사무실에 앉아도 머릿속은 집에 있다.",
  ],
  "1-2": [
    "오후는 관찰과 기록의 시간. 작은 변화도 숫자로 남긴다.",
    "CCTV 화면 속 라떼가 물그릇 쪽으로 고개를 돌렸다. 마셨을까?",
    "체온을 재니 38.2도. 어제보다 0.3도 올랐다.",
    "병원에서 혈액검사 결과가 왔다. BUN 수치가 또 올랐다.",
    "라떼가 창가로 이동했다. 햇살을 쬐는 모습이 평화로워 보인다.",
    "약을 갈아서 츄르에 섞었다. 반만 핥고 고개를 돌린다.",
    "수의사에게 영상 통화로 라떼의 잇몸 색을 보여줬다. 말이 없다.",
  ],
  "1-3": [
    "저녁 급여는 매일의 분기점이다.",
    "접시 앞에 앉혀놓으면 냄새만 맡고 돌아선다. 오늘도 그런 날인가.",
    "스푼에 얹은 브로스를 입가에 대니 혀가 살짝 나왔다. 한 스푼.",
    "강제 급여 중 라떼가 발버둥을 쳤다. 손등에 할퀸 자국이 남았다.",
    "하루 섭취량 3ml. 일지에 숫자를 적는 손이 멈춘다.",
    "참치캔을 열자 라떼의 귀가 움직였다. 오랜만의 반응이다.",
    "두 스푼 먹고 고개를 돌렸다. 충분하다고 말하는 것 같다.",
  ],
  "1-4": [
    "심야. 숫자 뒤에 감정을 붙여 일지를 마무리한다.",
    "오늘의 기록을 다시 읽는다. 숫자 사이에서 하루의 무게가 느껴진다.",
    "라떼가 이불 위로 올라왔다. 무겁지 않을 만큼 가벼워진 몸무게.",
    "일지 옆에 내일의 약 알람을 맞춘다. 내일도 같은 새벽이 온다.",
    "가르릉 소리가 들린다. 아직 이 소리를 내줄 수 있다는 게 고맙다.",
    "핸드폰에 저장된 라떼의 옛 사진을 본다. 통통하던 시절.",
    "불을 끄고 누웠는데 옆에서 라떼의 숨소리가 들린다. 오늘도 함께 있다.",
  ],
  "2-0": [
    "피부 탄력이 더 떨어졌다. 텐트를 만드는 일부터 어제보다 어렵다.",
    "바늘을 꺼내자 라떼가 화장실로 숨었다. 쫓아가야 하는 마음이 무겁다.",
    "수액이 들어가는 속도가 느려졌다. 흡수력이 떨어지고 있다.",
    "등의 수액 혹이 어제보다 오래 남아있다. 몸이 받아들이지 못하고 있다.",
    "어제 바늘 자국 옆에 오늘의 바늘을 놓는다. 자리가 점점 좁아진다.",
    "링거백 재고가 3일치. 병원에 추가 주문을 넣어야 한다.",
    "라떼가 수액 중에 잠들었다. 아프지 않다는 뜻이기를.",
  ],
  "2-1": [
    "몸과 마음이 동시에 소진된다.",
    "동료가 안색이 안 좋다고 한다. 웃어 보이지만 웃음이 어색하다.",
    "점심시간에 CCTV를 확인한다. 라떼가 같은 자리에 있다.",
    "업무 메일에 답장을 쓰다가 '라떼 약 시간'이라는 알람이 울렸다.",
    "퇴근 시간이 세상에서 가장 느리게 흘러간다.",
    "회사 화장실에서 1분만 울고 자리로 돌아간다.",
    "재택이라 라떼 옆에서 일한다. 집중은 안 되지만 마음은 편하다.",
  ],
  "2-2": [
    "모니터 속 작은 움직임을 읽어야 한다.",
    "CCTV 화면이 멈춘 것 같다. 심장이 덜컥 내려앉았는데, 와이파이 문제였다.",
    "라떼가 화면에서 사라졌다. 2분 후 물그릇 앞에 나타났다. 마신 건 아니다.",
    "화면 속 라떼가 갑자기 일어났다가 다시 눕는다. 구토 전조일까.",
    "CCTV 녹화를 돌려본다. 내가 없는 동안 계속 현관을 바라보고 있었다.",
    "저화질 화면에서 호흡을 세어본다. 분당 32회. 평소보다 빠르다.",
    "화면에 라떼가 나를 올려다보는 것 같다. 카메라가 있는 걸 아는 걸까.",
  ],
  "2-3": [
    "일지의 섭취량 칸이 다시 0이다.",
    "3일째 아무것도 먹지 않는다. 입을 꾹 다문 채 고개를 돌린다.",
    "주사기에 유동식을 담았다. 2ml가 들어갔다. 나머지는 턱 아래로 흘렀다.",
    "강제 급여 중 눈이 마주쳤다. 원망하는 눈빛 같아서 손이 멈춘다.",
    "5일째 절식. 수의사가 더 이상 강제 급여를 권하지 않는다.",
    "라떼 앞에 접시 네 종류를 놓았다. 전부 외면했다.",
    "유일하게 조금 핥은 건 참치 국물. 한 티스푼도 안 된다.",
  ],
  "2-4": [
    "심야 기록이 무너지면 내일 선택지도 무너진다.",
    "일지를 쓰다가 잠들었다. 펜을 쥔 채로.",
    "오늘의 기록: 섭취 0ml, 배뇨 1회, 체중 2.8kg. 숫자가 잔인하다.",
    "SNS에 비슷한 상황의 글을 찾는다. 위로가 될 줄 알았는데 더 무섭다.",
    "새벽 2시. 라떼 옆에 누워서 천장을 본다. 내일이 무섭다.",
    "반려동물 호스피스 블로그를 읽는다. 눈물이 멈추지 않는다.",
    "일지 대신 라떼에게 편지를 쓴다. 보낼 수 없는 편지.",
  ],
  "3-0": [
    "같은 수액인데 손끝의 감각이 조금 가벼워졌다.",
    "오늘은 바늘이 한 번에 들어갔다. 이런 날도 있다.",
    "라떼가 수액 중에 가르릉거린다. 며칠 만에 처음 듣는 소리다.",
    "수액이 끝난 뒤 라떼가 스스로 그루밍을 했다. 작은 기적.",
    "바늘을 꽂아도 움찔하지 않는다. 체념인지 신뢰인지.",
    "수액 후 라떼가 밥그릇 쪽으로 걸어갔다. 심장이 뛴다.",
    "오늘의 수액 양을 줄여도 될 것 같다. 좋은 징조일까.",
  ],
  "3-1": [
    "오전의 선택이 오늘 기적의 크기를 바꾼다.",
    "출근길이 가볍다. 라떼가 아침에 물을 마셨다.",
    "반차를 쓰고 라떼를 데리고 산책을 나왔다. 바람이 좋다.",
    "재택 중 라떼가 무릎 위로 올라왔다. 오래간만이다.",
    "동료에게 라떼 이야기를 한다. 좋은 소식이라 목소리에 힘이 들어간다.",
    "병원에서 수치가 소폭 개선됐다는 연락이 왔다.",
    "사무실에서도 웃을 수 있는 하루. 오래간만이다.",
  ],
  "3-2": [
    "브로스 냄새에 반응할지 확인한다.",
    "CCTV 속 라떼가 장난감 쪽으로 발을 뻗었다. 관심이 돌아오고 있다.",
    "체온 37.8도. 정상 범위. 몇 주 만의 정상 체온.",
    "라떼가 캣타워 1단에 올라갔다. 2주 만에 처음이다.",
    "물그릇의 수위가 내려갔다. 스스로 마시고 있다.",
    "오후 햇살에 라떼가 앞발을 뻗고 눕는다. 평화로운 오후.",
    "수의사가 '기적이라고 할 수 있다'고 했다. 아직 조심해야 하지만.",
  ],
  "3-3": [
    "오늘 몇 스푼까지 갈 수 있을까.",
    "라떼가 접시에 코를 대고 냄새를 맡는다. 관심을 보이고 있다.",
    "세 스푼, 네 스푼. 멈추지 않는다. 세는 손이 떨린다.",
    "다 먹고 접시를 핥는다. 이런 날이 올 줄 몰랐다.",
    "강제 급여가 아닌 자발적 급여. 이 차이가 얼마나 큰지.",
    "먹는 모습을 영상으로 찍었다. 나중에 이 순간을 기억하고 싶어서.",
    "다 먹은 뒤 라떼가 그루밍을 한다. 건강했을 때의 습관이 돌아왔다.",
  ],
  "3-4": [
    "기쁨 뒤에는 다시 두려움이 온다. 오늘을 기록해 고정한다.",
    "일지에 '좋은 날'이라고 적는다. 이 세 글자가 이렇게 무거울 줄.",
    "기적은 오래가지 않을 수 있다. 하지만 오늘은 오늘이다.",
    "라떼 옆에서 잠든다. 오늘 밤은 따뜻하다.",
    "SNS에 좋은 소식을 적을까 말까 망설인다. 기쁨도 조심해야 하는 시간.",
    "내일도 이런 날이면 좋겠다. 소박한 소원.",
    "가르릉 소리를 녹음했다. 이 소리를 영원히 간직하고 싶다.",
  ],
  "4-0": [
    "숨이 더 얕다. 오늘의 수액은 치료보다 편안함에 가깝다.",
    "수액을 놓는 손이 떨리지 않는다. 익숙해진 건지, 체념인지.",
    "수의사가 수액을 줄여도 된다고 했다. 의미를 묻지 못했다.",
    "라떼가 바늘에 반응하지 않는다. 아프지 않은 건가, 기력이 없는 건가.",
    "마지막 링거백을 꺼낸다. 추가 주문은 하지 않았다.",
    "수액 후 라떼의 등을 쓰다듬는다. 뼈가 만져진다.",
    "오늘은 수액 대신 따뜻한 수건을 올려주었다.",
  ],
  "4-1": [
    "현실은 계속된다. 곁을 지키고 싶어도 선택은 무겁다.",
    "직장에 사정을 말했다. 이번 주는 재택으로 하겠다고.",
    "출근하지 않아도 된다. 하지만 집에 있어도 할 수 있는 일이 없다.",
    "라떼가 하루 종일 잠만 잔다. 깨우지 않기로 한다.",
    "지인이 '어떻게 지내?'라고 묻는다. 대답을 고르기가 어렵다.",
    "일을 하는 척하면서 계속 라떼를 본다.",
    "라떼가 내 눈을 바라봤다. 무슨 말을 하고 싶은 걸까.",
  ],
  "4-2": [
    "오후 내내 알림이 깜빡인다. 마음이 먼저 집으로 달린다.",
    "CCTV에서 라떼가 움직이지 않는다. 숨소리를 확인하려 화면을 확대한다.",
    "라떼가 내 옷 위에 누워있다. 냄새가 그리운 건가.",
    "병원에서 전화가 왔다. 더 이상의 치료는 의미가 없다는 이야기.",
    "라떼 옆에 좋아하던 장난감을 놓아둔다. 쳐다보지 않는다.",
    "오후 햇살이 라떼 위에 내려앉는다. 따뜻해 보여서 다행이다.",
    "라떼의 발바닥을 만진다. 차갑다.",
  ],
  "4-3": [
    "강제 급여가 맞는지, 그냥 안아주는 게 맞는지. 정답은 없다.",
    "접시를 가져갔지만 라떼가 고개를 돌렸다. 억지로 먹이지 않기로 한다.",
    "물을 적신 거즈로 입술을 닦아준다. 그것만으로도 충분하다고 믿는다.",
    "라떼가 손가락 끝을 핥았다. 마지막 인사인 걸까.",
    "좋아하던 간식을 꺼냈다. 냄새만 맡고 눈을 감는다.",
    "라떼를 안고 창가에 앉았다. 바깥을 보여주고 싶었다.",
    "저녁 하늘이 빨갛다. 라떼의 마지막 석양.",
  ],
  "4-4": [
    "마지막 줄을 쓰는 시간. 오늘의 로그가 에필로그가 된다.",
    "일지를 덮는다. 더 이상 적을 숫자가 없다.",
    "라떼 옆에 누워서 숨소리를 듣는다. 조금씩 길어지는 간격.",
    "불을 끄지 않는다. 어둠이 무서운 게 아니라, 새벽이 무섭다.",
    "라떼의 이마에 입을 맞춘다. '사랑해' 대신 '고마워'라고 말한다.",
    "시계를 꺼놓는다. 오늘 밤만큼은 시간을 세지 않기로 한다.",
    "가르릉 소리가 아주 작게 들린다. 아직, 아직 여기 있다.",
  ],
};
```

**`getEventForDay()` 수정**:

```javascript
function getEventForDay(day, slot) {
  const chapter = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4;
  const base = EVENTS[chapter].find((e) => e.slot === slot) || EVENTS[chapter][0];
  const dayKey = `${day}-${slot}`;
  const override = DAY_TEXTS[dayKey];

  // 변주 텍스트 결정
  const variantKey = `${chapter}-${slot}`;
  const variants = SLOT_VARIANTS[variantKey];
  let variantText = null;
  if (variants && !override) {
    const chapterStartDay = (chapter - 1) * 7 + 1;
    const dayInChapter = day - chapterStartDay;
    variantText = variants[dayInChapter % variants.length];
  }

  const scene = {
    cue: override?.cue || base.cue,
    text: override?.text || variantText || base.text,
    choices: base.choices.map((c) => ({ ...c, delta: { ...c.delta } })),
    accessories: { /* 기존 유지 */ },
  };
  // ... 이하 기존 로직 유지
}
```

### D-3. 긴장 이벤트 — 돌발 상황

3~5일에 한 번, 턴 시작 시 랜덤으로 "돌발 이벤트"가 발생한다. 일반 선택지를 대체하여 긴장감을 부여한다.

```javascript
const CRISIS_EVENTS = [
  {
    day: [3, 4, 5],
    slot: 0,
    text: "새벽 3시. 라떼가 갑자기 구토를 했다. 토사물에 피가 섞여 있다.",
    choices: [
      { label: "즉시 응급 병원으로", delta: { hp: 5, comfort: -3, sanity: -4, money: -15, bond: 1 } },
      { label: "상태를 관찰하며 기다린다", delta: { hp: -3, comfort: 1, sanity: -2, money: 0, bond: 0 } },
      { label: "수의사에게 영상 전송", delta: { hp: 2, comfort: 0, sanity: -1, money: -5, bond: 1 } },
    ],
  },
  {
    day: [8, 9, 10],
    slot: 2,
    text: "CCTV 화면이 검게 변했다. 정전인지, 카메라 고장인지 알 수 없다.",
    choices: [
      { label: "즉시 귀가", delta: { hp: 0, comfort: 2, sanity: -3, money: -3, bond: 2 } },
      { label: "이웃에게 확인 부탁", delta: { hp: 0, comfort: 1, sanity: -1, money: 0, bond: 0 } },
      { label: "30분 뒤 다시 확인", delta: { hp: -1, comfort: -1, sanity: -4, money: 0, bond: -1 } },
    ],
  },
  {
    day: [12, 13, 14],
    slot: 3,
    text: "강제 급여 중 라떼가 격하게 발버둥쳤다. 주사기가 빠지면서 유동식이 쏟아졌다.",
    choices: [
      { label: "잠시 쉬고 다시 시도", delta: { hp: 2, comfort: -2, sanity: -3, money: -1, bond: -1 } },
      { label: "오늘은 포기한다", delta: { hp: -2, comfort: 3, sanity: 1, money: 0, bond: 1 } },
      { label: "다른 방법을 찾아본다", delta: { hp: 1, comfort: 1, sanity: -1, money: -2, bond: 1 } },
    ],
  },
  {
    day: [17, 18],
    slot: 1,
    text: "직장에서 프로젝트 마감이 겹쳤다. 오늘 출근하지 않으면 경고를 받는다.",
    choices: [
      { label: "출근한다 (경고 회피)", delta: { hp: -2, comfort: -2, sanity: -2, money: 12, bond: -2 } },
      { label: "사직서를 쓴다", delta: { hp: 0, comfort: 1, sanity: -5, money: -20, bond: 3 } },
      { label: "상황을 설명하고 원격으로 처리", delta: { hp: -1, comfort: 0, sanity: -3, money: 5, bond: 1 } },
    ],
  },
  {
    day: [22, 23],
    slot: 4,
    text: "한밤중에 라떼의 호흡이 불규칙해졌다. 10초간 숨을 멈추는 순간이 있었다.",
    choices: [
      { label: "밤새 깨어 호흡을 지켜본다", delta: { hp: 1, comfort: 2, sanity: -5, money: 0, bond: 3 } },
      { label: "응급 병원에 전화한다", delta: { hp: 2, comfort: 0, sanity: -2, money: -8, bond: 1 } },
      { label: "곁에서 손을 잡고 눕는다", hiddenPoint: 1, delta: { hp: 0, comfort: 3, sanity: -1, money: 0, bond: 4 } },
    ],
  },
  {
    day: [25, 26],
    slot: 0,
    text: "수액 도중 바늘이 빠졌다. 피부가 너무 얇아져서 다시 놓을 자리가 보이지 않는다.",
    choices: [
      { label: "다리 쪽에서 시도한다", delta: { hp: 3, comfort: -3, sanity: -3, money: -2, bond: 0 } },
      { label: "오늘 수액은 포기한다", delta: { hp: -3, comfort: 2, sanity: 0, money: 0, bond: 1 } },
      { label: "병원에 가서 맡긴다", delta: { hp: 4, comfort: -1, sanity: -1, money: -10, bond: -1 } },
    ],
  },
];

function checkCrisisEvent(day, slot) {
  const crisis = CRISIS_EVENTS.find(
    (e) => e.day.includes(day) && e.slot === slot
  );
  if (!crisis) return null;
  // 50% 확률로 발생 (매번 같은 이벤트 방지)
  if (Math.random() > 0.5) return null;
  return crisis;
}
```

`renderScene()` 또는 `advanceTurn()` 시작 부분에서 `checkCrisisEvent()`를 호출해, 반환값이 있으면 일반 이벤트 대신 위기 이벤트를 표시한다.

### D-4. 하루 마감 요약

`advanceTurn()`에서 `timeSlot > 4`로 하루가 끝날 때, 다음 날로 넘어가기 전에 **하루 요약 화면**을 잠시 보여준다.

```javascript
function showDaySummary(day, callback) {
  const overlay = document.createElement("div");
  overlay.className = "day-summary-overlay";

  const intakeText = state.dailyIntake > 0
    ? `섭취량: ${state.dailyIntake}ml`
    : "섭취량: 0 (금식)";
  const condition = state.condition;
  const dayNum = dayText(day);

  overlay.innerHTML = `
    <div class="day-summary-card">
      <h3>${dayNum} 종료</h3>
      <p class="summary-line">${intakeText}</p>
      <p class="summary-line">상태: ${condition}</p>
      <p class="summary-mood">${getDayMoodText(day)}</p>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 500);
  }, 2000);
}

function getDayMoodText(day) {
  if (state.hp <= 25) return "위태로운 하루였다.";
  if (state.dailyIntake >= 10) return "기적 같은 하루였다.";
  if (state.dailyIntake === 0) return "먹지 못한 하루. 내일은 다를까.";
  if (state.sanity <= 30) return "보호자의 마음이 한계에 가까워지고 있다.";
  if (state.comfort >= 70) return "평온한 하루였다.";
  return "또 하루가 지나갔다.";
}
```