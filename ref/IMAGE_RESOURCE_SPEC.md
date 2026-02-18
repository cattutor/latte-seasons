# 🎨 이미지 리소스 적용 명세서 (Image Resource Specification)

> **문서 버전**: v1.0 | 2026.02.17  
> **작성자**: 시나리오 디렉터 (Claude)  
> **수신자**: 메인 개발자 (Codex)  
> **목적**: `assets/images/` 폴더의 픽셀아트 리소스를 인게임에 정확히 매핑하기 위한 구현 명세

---

## 1. 리소스 구조 총괄

```
assets/images/
├── bg_*.png          (3종) 시간대별 배경
├── cg_*.png          (2종) 엔딩 CG
├── emote_*.png       (3종) 상황 이모션 이펙트
├── item_*.png        (4종) 케어 아이템 아이콘
├── latte_healthy_*.png  (8종) 건강 상태 스프라이트
├── latte_weak_*.png     (7종) 약화 상태 스프라이트
└── latte_critical_*.png (3종) 위독 상태 스프라이트
```

총 30개 파일 / 약 27MB

---

## 2. 배경 이미지 (Background)

배경은 게임의 5턴 시간대 시스템에 따라 전환된다. 현재 3종이 제공되며, 시간대 매핑은 아래와 같다.

### 2.1 파일 목록

| 파일명 | 사이즈 | 설명 |
|--------|--------|------|
| `bg_living_day.png` | 1.15MB | 낮 시간 거실 배경 (밝은 자연광) |
| `bg_living_night.png` | 1.27MB | 밤 시간 거실 배경 (어두운 실내등) |
| `bg_window_sunset.png` | 1.31MB | 석양이 비치는 창가 배경 |

### 2.2 시간대(TimeSlot) → 배경 매핑

```javascript
const BG_MAP = {
  0: 'bg_living_night.png',    // 새벽 05:00 - 어두운 실내
  1: 'bg_living_day.png',      // 오전 09:00 - 밝은 낮
  2: 'bg_living_day.png',      // 오후 14:00 - 밝은 낮
  3: 'bg_window_sunset.png',   // 저녁 19:00 - 석양
  4: 'bg_living_night.png',    // 심야 23:00 - 어두운 밤
};
```

### 2.3 구현 요구사항

- 배경은 게임 화면 상단 씬 뷰 영역(상단 약 60%)에 `background-image`로 적용
- 시간대 전환 시 CSS `opacity` 페이드(약 0.8초)로 자연스럽게 교체
- 챕터별로 기존 팔레트 오버레이(art_guide.md의 컬러 시스템)는 배경 위에 반투명 레이어로 유지
- `image-rendering: pixelated` 적용하여 픽셀아트 선명도 보존

```css
.scene-bg {
  background-size: cover;
  background-position: center;
  image-rendering: pixelated;
  transition: opacity 0.8s ease-in-out;
}
```

---

## 3. 라떼 캐릭터 스프라이트 (Latte States)

라떼의 상태는 HP 수치에 따라 3단계로 구분되며, 각 상태마다 복수의 포즈 변형(variant)이 존재한다.

### 3.1 상태 판정 기준

```javascript
function getLatteState(hp) {
  if (hp > 60) return 'healthy';
  if (hp > 30) return 'weak';
  return 'critical';
}
```

### 3.2 파일 목록 및 포즈 설명

#### Healthy (HP 61~100) — 8종

| 파일명 | 사이즈 | 포즈/상황 |
|--------|--------|-----------|
| `latte_healthy_1.png` | 907KB | 기본 앉은 자세 (정면) |
| `latte_healthy_2.png` | 976KB | 앉은 자세 변형 (고개 살짝 틀기) |
| `latte_healthy_3.png` | 560KB | 편안한 식빵 자세 (웅크림) |
| `latte_healthy_4.png` | 1.62MB | 그루밍 자세 (앞발 핥기) |
| `latte_healthy_5.png` | 2.06MB | 기지개/스트레칭 |
| `latte_healthy_6.png` | 1.60MB | 창가에서 바깥 구경 |
| `latte_healthy_7.png` | 1.84MB | 장난감/반응 자세 (놀이) |
| `latte_healthy_8.png` | 1.04MB | 곁에 와서 눕기 (보호자 옆) |

#### Weak (HP 31~60) — 7종

| 파일명 | 사이즈 | 포즈/상황 |
|--------|--------|-----------|
| `latte_weak_1.png` | 1009KB | 식빵 자세로 웅크림 (눈 반쯤) |
| `latte_weak_2.png` | 947KB | 이불 위에 힘없이 앉아있음 |
| `latte_weak_3.png` | 614KB | 밥 앞에서 고개 돌림 |
| `latte_weak_4.png` | 872KB | 물그릇 앞에서 움찔 |
| `latte_weak_5.png` | 685KB | 느린 걸음으로 이동 |
| `latte_weak_6.png` | 582KB | 구석에 웅크림 |
| `latte_weak_7.png` | 962KB | 수액 맞는 자세 (피부 잡힘) |

#### Critical (HP 0~30) — 3종

| 파일명 | 사이즈 | 포즈/상황 |
|--------|--------|-----------|
| `latte_critical_1.png` | 811KB | 옆으로 누워있음 (얕은 호흡) |
| `latte_critical_2.png` | 977KB | 담요 속에서 눈만 보임 |
| `latte_critical_3.png` | 661KB | 눈을 감고 웅크린 상태 |

### 3.3 스프라이트 선택 로직

상태 내에서 어떤 포즈를 표시할지는 **현재 시간대(slot)와 직전 선택(choice context)**에 따라 결정한다.

```javascript
const LATTE_SPRITE_RULES = {

  healthy: {
    // 시간대별 기본 스프라이트
    default: {
      0: 'latte_healthy_3.png',  // 새벽 - 식빵 자세로 자고 있음
      1: 'latte_healthy_1.png',  // 오전 - 기본 앉은 자세
      2: 'latte_healthy_6.png',  // 오후 - 창가 구경
      3: 'latte_healthy_1.png',  // 저녁 - 기본 앉은 자세 (급여 시간)
      4: 'latte_healthy_8.png',  // 심야 - 곁에 와서 눕기
    },
    // 특정 행동 후 스프라이트 오버라이드
    contextual: {
      'feeding':    'latte_healthy_2.png',  // 급여 관련 선택 후
      'playing':    'latte_healthy_7.png',  // 놀아주기 선택 후
      'grooming':   'latte_healthy_4.png',  // 빗질 아이템 사용 시
      'stretching': 'latte_healthy_5.png',  // 컨디션 좋을 때 랜덤
      'bonding':    'latte_healthy_8.png',  // Bond 상승 이벤트 후
    },
  },

  weak: {
    default: {
      0: 'latte_weak_7.png',    // 새벽 - 수액 맞는 자세
      1: 'latte_weak_1.png',    // 오전 - 웅크림
      2: 'latte_weak_6.png',    // 오후 - 구석에 웅크림
      3: 'latte_weak_3.png',    // 저녁 - 밥 앞에서 고개 돌림
      4: 'latte_weak_2.png',    // 심야 - 이불 위에 힘없이
    },
    contextual: {
      'feeding':      'latte_weak_3.png',   // 급여 시도
      'forceFeed':    'latte_weak_4.png',   // 강제 급여 시
      'iv_therapy':   'latte_weak_7.png',   // 수액 치료 중
      'moving':       'latte_weak_5.png',   // 이동 감지
      'hiding':       'latte_weak_6.png',   // 구석으로 숨기
    },
  },

  critical: {
    default: {
      0: 'latte_critical_1.png',  // 새벽 - 옆으로 누워있음
      1: 'latte_critical_2.png',  // 오전 - 담요 속
      2: 'latte_critical_1.png',  // 오후 - 옆으로 누워있음
      3: 'latte_critical_3.png',  // 저녁 - 눈 감고 웅크림
      4: 'latte_critical_2.png',  // 심야 - 담요 속
    },
    contextual: {
      'blanket':   'latte_critical_2.png',  // 담요 아이템 사용 시
      'resting':   'latte_critical_3.png',  // 휴식 선택 시
    },
  },
};
```

### 3.4 스프라이트 전환 구현

```javascript
function updateLatteSprite(hp, timeSlot, actionContext = null) {
  const state = getLatteState(hp);
  const rules = LATTE_SPRITE_RULES[state];
  
  // 1. contextual 오버라이드 우선 확인
  let spriteFile = null;
  if (actionContext && rules.contextual[actionContext]) {
    spriteFile = rules.contextual[actionContext];
  }
  
  // 2. 없으면 시간대별 기본 스프라이트
  if (!spriteFile) {
    spriteFile = rules.default[timeSlot];
  }
  
  const spriteEl = document.getElementById('latte-sprite');
  spriteEl.src = `assets/images/${spriteFile}`;
}
```

- 스프라이트 전환 시 0.3초 페이드 애니메이션 적용
- `image-rendering: pixelated` 필수
- 스프라이트는 씬 뷰 중앙 하단에 배치, 배경 위에 레이어링

---

## 4. 이모트 이펙트 (Emote)

라떼의 머리 위 또는 씬 영역에 표시되는 감정/상황 이펙트.

### 4.1 파일 목록

| 파일명 | 사이즈 | 비주얼 | 용도 |
|--------|--------|--------|------|
| `emote_heart.png` | 89KB | 빨간 픽셀 하트 | Bond 상승 / 애정 표현 이벤트 |
| `emote_sparkle.png` | 222KB | 노란 반짝임 (다이아몬드 파티클 다수) | Comfort 상승 / 좋은 반응 / 기적의 순간 |
| `emote_stress.png` | 236KB | 보라색 X자 스트레스 마크 (만화 화남 표현) | Sanity 하락 / 스트레스 / 위기 이벤트 |

### 4.2 트리거 조건

```javascript
const EMOTE_TRIGGERS = {
  'emote_heart.png': {
    conditions: [
      { type: 'delta', resource: 'bond', threshold: 2 },      // Bond +2 이상 획득 시
      { type: 'action', keys: ['bonding', 'grooming'] },      // 특정 행동 후
      { type: 'event', name: 'hiddenPoint' },                  // 히든 포인트 이벤트
    ],
    position: 'above_latte',    // 라떼 머리 위
    animation: 'float_up_fade', // 위로 떠오르며 페이드
    duration: 1500,             // ms
  },

  'emote_sparkle.png': {
    conditions: [
      { type: 'delta', resource: 'comfort', threshold: 3 },   // Comfort +3 이상
      { type: 'state_change', to: 'healthy' },                 // weak → healthy 회복 시
      { type: 'chapter', id: 3 },                              // Chapter 3 기적 챕터 진입
    ],
    position: 'around_latte',   // 라떼 주변 흩뿌림
    animation: 'scatter_twinkle', // 흩어지며 반짝
    duration: 2000,
  },

  'emote_stress.png': {
    conditions: [
      { type: 'delta', resource: 'sanity', threshold: -3 },   // Sanity -3 이하 하락
      { type: 'action', keys: ['forceFeed'] },                 // 강제 급여 시
      { type: 'crisis', active: true },                        // 위기 이벤트 발생
    ],
    position: 'above_player',   // 보호자(화면 측면) 또는 씬 상단
    animation: 'shake_pop',     // 떨리며 팝업
    duration: 1200,
  },
};
```

### 4.3 구현 요구사항

- 이모트는 PNG 이미지를 `position: absolute`로 씬 위에 오버레이
- 배경은 투명(PNG alpha), 흰색 배경이 보이지 않도록 처리
- 여러 이모트가 동시에 트리거될 경우 우선순위: heart > sparkle > stress (최대 1개만 표시)
- CSS 애니메이션 예시:

```css
.emote-float-up {
  animation: emoteFloatUp 1.5s ease-out forwards;
}
@keyframes emoteFloatUp {
  0%   { opacity: 0; transform: translateY(0) scale(0.5); }
  30%  { opacity: 1; transform: translateY(-10px) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.8); }
}

.emote-shake {
  animation: emoteShake 1.2s ease-out forwards;
}
@keyframes emoteShake {
  0%, 100% { opacity: 0; transform: translate(0, 0); }
  10%      { opacity: 1; transform: translate(-3px, 0); }
  20%      { transform: translate(3px, 0); }
  30%      { transform: translate(-3px, 0); }
  40%      { transform: translate(3px, 0); }
  70%      { opacity: 1; }
}
```

---

## 5. 아이템 아이콘 (Item)

플레이어가 라떼에게 적용할 수 있는 케어 아이템의 아이콘. UI 상의 아이템 버튼이나 인벤토리 표시에 사용.

### 5.1 파일 목록

| 파일명 | 사이즈 | 비주얼 | 게임 내 기능 |
|--------|--------|--------|-------------|
| `item_blanket.png` | 185KB | 갈색 따뜻한 담요 (접혀있는 형태) | Comfort 상승, 체온 유지 |
| `item_brush.png` | 425KB | 빗/브러시 | Bond 상승, 그루밍 케어 |
| `item_iv.png` | 498KB | 수액 세트 (링거백 + 줄) | HP 회복, 피하수액 치료 |
| `item_meds.png` | 296KB | 약병 + 주사기 세트 | HP 회복, 투약 |

### 5.2 아이템 데이터 정의

```javascript
const ITEM_DATA = {
  blanket: {
    id: 'blanket',
    name: '담요',
    icon: 'item_blanket.png',
    description: '따뜻한 담요로 라떼를 감싸준다.',
    effect: { comfort: 3, bond: 1 },
    latteContext: 'blanket',       // 스프라이트 contextual 키
    emote: 'emote_sparkle.png',    // 사용 시 트리거할 이모트
    usableStates: ['healthy', 'weak', 'critical'],  // 모든 상태에서 사용 가능
    cooldownTurns: 0,              // 매 턴 사용 가능
  },
  brush: {
    id: 'brush',
    name: '빗',
    icon: 'item_brush.png',
    description: '부드럽게 빗질해준다. 라떼가 좋아하던 것.',
    effect: { bond: 3, comfort: 1 },
    latteContext: 'grooming',
    emote: 'emote_heart.png',
    usableStates: ['healthy', 'weak'],  // critical 상태에서는 사용 불가
    cooldownTurns: 0,
  },
  iv: {
    id: 'iv',
    name: '수액 세트',
    icon: 'item_iv.png',
    description: '따뜻한 물에 데운 링거백으로 피하수액을 놓는다.',
    effect: { hp: 5, comfort: -1, sanity: -2, money: -3 },
    latteContext: 'iv_therapy',
    emote: null,                    // 이모트 없음 (의료 행위)
    usableStates: ['weak', 'critical'],  // 건강할 때는 불필요
    cooldownTurns: 1,              // 하루 1회
    note: '피하수액은 따뜻한 물(미지근한 온도)에 링거백을 담가 체온까지 데운 후 사용. 전자레인지 사용 금지.',
  },
  meds: {
    id: 'meds',
    name: '약',
    icon: 'item_meds.png',
    description: '처방받은 약을 먹인다.',
    effect: { hp: 3, comfort: -2, bond: -1, money: -2 },
    latteContext: 'feeding',
    emote: 'emote_stress.png',     // 약 먹이기 = 스트레스
    usableStates: ['healthy', 'weak', 'critical'],
    cooldownTurns: 1,
  },
};
```

### 5.3 UI 배치

- 아이템 아이콘은 하단 UI 영역 또는 액션 패널에 32x32 ~ 48x48 크기로 렌더링
- `image-rendering: pixelated` 필수
- 사용 불가 상태(cooldown 또는 state 제한)일 때 `filter: grayscale(1); opacity: 0.4` 적용
- 호버 시 아이템명 + 설명 툴팁 표시

---

## 6. 엔딩 CG (Event CG)

엔딩 도달 시 전체 화면에 표시되는 일러스트레이션.

### 6.1 파일 목록

| 파일명 | 사이즈 | 대응 엔딩 |
|--------|--------|-----------|
| `cg_peaceful.png` | 1.49MB | **평온한 이별 (Peaceful Farewell)** — Bond 높음, Comfort 높음 |
| `cg_miracle.png` | 1.40MB | **작은 기적 (Small Miracle)** — HP 유지 + Bond 최고치 도달 |

### 6.2 엔딩 분기 → CG 매핑

```javascript
const ENDING_CG_MAP = {
  'peaceful':     'cg_peaceful.png',   // 엔딩 A: 평온한 이별
  'miracle':      'cg_miracle.png',    // 엔딩 B: 작은 기적
  'exhaustion':   null,                // 엔딩 C: 소진 — CG 미제공 (추후 추가 예정)
  'regret':       null,                // 엔딩 D: 후회 — CG 미제공 (추후 추가 예정)
};
```

### 6.3 구현 요구사항

- CG는 엔딩 시퀀스 진입 시 전체 화면 오버레이로 표시
- 검은 화면에서 2초간 페이드인
- CG 위에 엔딩 텍스트를 반투명 오버레이로 표시
- `image-rendering: pixelated` 적용
- CG가 `null`인 엔딩은 기존 팔레트 연출(배경색 전환 + 텍스트)으로 대체

---

## 7. 프리로드 및 최적화

전체 리소스가 약 27MB이므로 성능을 위한 로딩 전략이 필요하다.

### 7.1 프리로드 그룹

```javascript
const PRELOAD_GROUPS = {
  // 즉시 로드: 게임 시작 시 반드시 필요
  immediate: [
    'bg_living_night.png',      // 새벽(첫 턴) 배경
    'latte_healthy_3.png',      // 첫 턴 기본 스프라이트
    'emote_heart.png',
    'emote_stress.png',
    'item_iv.png',              // 첫 턴 수액 이벤트
  ],

  // 지연 로드: 게임 시작 후 백그라운드 로딩
  deferred: [
    'bg_living_day.png',
    'bg_window_sunset.png',
    'emote_sparkle.png',
    'item_blanket.png',
    'item_brush.png',
    'item_meds.png',
    // healthy 나머지 + weak 전체
    ...['1','2','4','5','6','7','8'].map(n => `latte_healthy_${n}.png`),
    ...['1','2','3','4','5','6','7'].map(n => `latte_weak_${n}.png`),
  ],

  // 조건부 로드: 해당 상태 진입 시 로드
  conditional: {
    critical: ['latte_critical_1.png', 'latte_critical_2.png', 'latte_critical_3.png'],
    ending:   ['cg_peaceful.png', 'cg_miracle.png'],
  },
};
```

### 7.2 프리로드 함수

```javascript
function preloadImages(filenames) {
  return Promise.all(filenames.map(file => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = `assets/images/${file}`;
    });
  }));
}

// 게임 초기화 시
async function initResources() {
  await preloadImages(PRELOAD_GROUPS.immediate);
  // 게임 시작 가능
  preloadImages(PRELOAD_GROUPS.deferred); // fire-and-forget
}
```

---

## 8. HTML 구조 (권장)

```html
<div id="scene-container" class="scene-container">
  <!-- 레이어 1: 배경 -->
  <div id="scene-bg" class="scene-bg"></div>
  
  <!-- 레이어 2: 시간대 팔레트 오버레이 -->
  <div id="palette-overlay" class="palette-overlay"></div>
  
  <!-- 레이어 3: 라떼 스프라이트 -->
  <img id="latte-sprite" class="latte-sprite" src="" alt="라떼" />
  
  <!-- 레이어 4: 이모트 이펙트 -->
  <img id="emote-effect" class="emote-effect hidden" src="" alt="" />
  
  <!-- 레이어 5: CG 오버레이 (엔딩 전용) -->
  <div id="cg-overlay" class="cg-overlay hidden">
    <img id="cg-image" src="" alt="" />
  </div>
</div>
```

```css
.scene-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.scene-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  image-rendering: pixelated;
  z-index: 1;
}

.palette-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.3;
  pointer-events: none;
}

.latte-sprite {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  max-height: 60%;
  image-rendering: pixelated;
  z-index: 3;
  transition: opacity 0.3s ease;
}

.emote-effect {
  position: absolute;
  z-index: 4;
  pointer-events: none;
  image-rendering: pixelated;
}

.emote-effect.above-latte {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
}

.cg-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cg-overlay img {
  max-width: 100%;
  max-height: 100%;
  image-rendering: pixelated;
}

.hidden { display: none; }
```

---

## 9. 미제공 리소스 및 추후 작업

현재 미제공 상태이며 추후 추가 예정인 리소스 목록:

| 카테고리 | 필요 리소스 | 비고 |
|----------|------------|------|
| 배경 | `bg_hospital.png` | 병원 배경 (Chapter 1 초반) |
| 배경 | `bg_living_rain.png` | 비 오는 날 배경 (날씨 시스템) |
| 엔딩 CG | `cg_exhaustion.png` | 엔딩 C: 소진 |
| 엔딩 CG | `cg_regret.png` | 엔딩 D: 후회 |
| 이모트 | `emote_zzz.png` | 수면/휴식 상태 표시 |
| 이모트 | `emote_question.png` | 불안/혼란 표현 |
| 아이템 | `item_food.png` | 사료/특식 아이콘 |
| 아이템 | `item_toy.png` | 장난감 아이콘 |
| UI | 리소스 아이콘 (HP/Comfort/Sanity/Money/Bond) | 기존 emoji 대체용 |

이 리소스들이 추가되면 본 명세서를 업데이트하여 매핑을 확장한다.

---

## 10. 체크리스트 (구현 확인용)

- [ ] `BG_MAP`에 따라 시간대별 배경 전환 동작
- [ ] `getLatteState()` → HP 기반 상태 판정 동작
- [ ] `LATTE_SPRITE_RULES`에 따라 상태+시간대+컨텍스트 스프라이트 선택
- [ ] 스프라이트 전환 시 페이드 애니메이션 적용
- [ ] 이모트 트리거 조건 충족 시 이펙트 표시
- [ ] 아이템 아이콘이 UI에 표시되고 상태별 사용 가능/불가 반영
- [ ] 엔딩 CG가 해당 엔딩 도달 시 전체 화면 표시
- [ ] 모든 이미지에 `image-rendering: pixelated` 적용
- [ ] 프리로드 그룹에 따른 로딩 전략 구현
- [ ] 미제공 리소스에 대한 폴백(기존 CSS/텍스트 연출) 유지
