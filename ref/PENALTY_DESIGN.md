# 라떼의 계절 — 자원 고갈 패널티 설계서

> **설계 원칙**: 게임오버는 없다. 하지만 방치에는 대가가 있다.  
> 자원이 낮아지면 **텍스트가 아파지고, 선택지가 줄어들고, 엔딩의 빛이 바랜다.**  
> 플레이어가 "관리해야 할 이유"를 숫자가 아니라 장면으로 느끼게 한다.

---

## 설계 구조 개요

각 자원에는 3단계 임계점이 있다:

| 단계 | 이름 | 범위 | 역할 |
|------|------|------|------|
| 경고 | Yellow Zone | 30 이하 | 텍스트 변화 + 1회 경고 |
| 위기 | Red Zone | 15 이하 | 선택지 제한 + 강제 이벤트 |
| 고갈 | Collapse | 0 이하 | 서사적 전환 + 엔딩 분기 감산 |

**현재 코드와의 차이**: 기존에는 경고 텍스트 1회(_hpWarnShown 등)뿐이었다. 이제 임계점마다 "계속 머무르는 동안" 매 턴 영향이 발생한다.

---

## 1. Sanity (멘탈) — 보호자의 붕괴 [최우선]

보호자가 무너지면 **판단력이 흐려진다**. 이것은 플레이어의 "시야"를 직접 제한하는 방식으로 표현한다.

### Yellow Zone (Sanity ≤ 30)

**서사적 변화**:
- 모든 씬 텍스트 앞에 보호자 내면 묘사가 1줄 추가된다:
  - "머리가 무겁다. 글씨가 흐릿하게 보인다."
  - "손끝이 떨린다. 지금 내가 제대로 하고 있는 건지."
  - "잠을 못 잔 지 며칠째인지 기억이 안 난다."
  - "라떼를 보는데 초점이 안 맞는다."
- 선택지 힌트(자원 변화 아이콘)가 **부정확해진다**: 실제 delta와 ±1~2 오차가 생김
  - 구현: renderChoices에서 sanity ≤ 30이면 표시되는 delta 값에 랜덤 노이즈 추가
  - 플레이어 체감: "수치를 믿을 수 없다" → 불안감

**시스템적 변화**:
- 출근 선택지 잠금 (기존 구현 유지)
- 미니게임 난이도 상승: 타이밍 윈도우 20% 축소

### Red Zone (Sanity ≤ 15)

**서사적 변화**:
- 씬 텍스트가 **왜곡**된다: 간헐적으로 문장이 반복되거나 끊김
  - "수액을 준비한다. 수액을... 준비한다. 손이 왜 이러지."
  - "출근해야 한다. 아니, 안 해도 된다. 아니... 해야 하나."
- 선택지가 3개 → **2개로 축소**: 가장 "이성적인" 선택지 1개가 사라짐
  - 구현: renderChoices에서 sanity ≤ 15이면 delta.sanity가 가장 높은(멘탈 회복) 선택지 제거
  - 서사적 의미: 합리적 판단이 불가능해진 보호자

**강제 이벤트 — "보호자 붕괴 씬"** (Sanity ≤ 15에 진입한 최초 1회):
```
cue: "멈춤"
text: "숟가락을 들고 있는데 손이 멈췄다. 몸이 더 이상 움직이지 않는다.
      라떼가 올려다본다. 그 눈에 내 모습이 비친다. 
      무너져 있는 사람."
choices:
  - "잠시 쉰다" → sanity +10, comfort -3 (라떼 방치)
  - "울면서라도 계속한다" → sanity +3, bond +2 (끈기)
```

### Collapse (Sanity ≤ 0)

**서사적 전환**:
- 강제 1일 스킵: "정신을 차렸을 때 하루가 지나 있었다."
  - 해당 일자의 5턴이 전부 자동 처리됨 (최저 delta 적용)
  - 일지에 "기록 없음 — 보호자 부재" 자동 기입
- 이후 sanity가 10으로 자동 회복 (최소한의 복귀)
- **Collapse 발생 횟수가 state에 기록**됨 → 엔딩 품질에 직접 영향

**엔딩 분기 영향**:
- sanityCollapseCount ≥ 1: Hidden 엔딩 차단 (hiddenPoint 달성해도 불가)
- sanityCollapseCount ≥ 2: A엔딩 "나의 라떼" 차단
- 에필로그에 추가 문장: "기억에 빈 날들이 있다. 그 시간을 라떼는 혼자 보냈다."

---

## 2. Bond (유대) — 관계의 손상

유대가 낮으면 **라떼가 보호자를 경계**하기 시작한다. 이것은 간병 행위의 효율에 직접 영향한다.

### Yellow Zone (Bond ≤ 30)

**서사적 변화**:
- 라떼의 반응 텍스트가 거리감을 보여준다:
  - "라떼가 손길을 피한다. 예전에는 이러지 않았는데."
  - "안으려 하자 몸을 빳빳이 세운다."
  - "눈이 마주쳤는데 먼저 고개를 돌린다."
- 스프라이트에 변화: 라떼가 보호자 반대 방향을 바라봄 (이미지 좌우 반전)

**시스템적 변화**:
- 간병 행위의 comfort/hp delta가 **0.7배로 감소**
  - 구현: applyDelta에서 bond ≤ 30이면 hp/comfort의 양수 delta에 0.7 곱함
  - 서사적 의미: 라떼가 경계하니 같은 돌봄도 효과가 떨어짐

### Red Zone (Bond ≤ 15)

**서사적 변화**:
- 라떼가 적극적으로 거부한다:
  - "수액 바늘을 꽂으려 하자 라떼가 할퀴었다. 처음 있는 일이다."
  - "급여 시도 자체가 불가능하다. 입을 꼭 다물고 돌아누웠다."
- 강제 급여 선택지 잠금 (key: "forceFeed" 비활성화)

**시스템적 변화**:
- 간병 행위의 comfort/hp delta가 **0.4배로 감소**
- 저녁 급여(slot 3)의 intake가 자동으로 **절반**이 됨
  - 서사적 의미: 라떼가 받아들이지 않으니 먹일 수 없다

### Collapse (Bond ≤ 0)

**서사적 전환 — "라떼가 숨는다"**:
```
cue: "빈자리"
text: "라떼가 평소 자리에 없다. 
      침대 밑 가장 깊은 곳에서 웅크려 있다.
      부르면 더 깊이 들어간다. 
      아프면서도 곁에 있기 싫은 거다."
```
- 2턴 동안 모든 직접 간병 선택지 비활성 (수액, 급여, 안기 등)
- 간접 행위만 가능 (CCTV 관찰, 기록, 병원 통화)
- 2턴 후 bond가 5로 자동 회복, 라떼가 돌아옴
  - "라떼가 다시 나왔다. 먼 곳을 보고 있지만, 돌아온 것만으로."

**엔딩 분기 영향**:
- bondCollapseCount ≥ 1: Hidden 엔딩 차단
- bond 최종값이 40 미만: A엔딩 차단
- 에필로그에 추가 문장: "내 손을 피하던 날들이 있었다. 그래도 끝까지 곁에 있었다는 것만은 사실이다."

---

## 3. Comfort (편안함) — 라떼의 고통

편안함이 낮으면 **라떼가 고통받고 있다**는 것이 직접적으로 드러난다.

### Yellow Zone (Comfort ≤ 30)

**서사적 변화**:
- 씬 텍스트에 라떼의 고통 묘사가 삽입:
  - "라떼가 낮게 신음한다. 자세를 자꾸 바꾼다."
  - "호흡이 거칠다. 편한 자세를 찾지 못하고 있다."
  - "만지면 움찔한다. 어딘가 아프다."
- 스프라이트: 눈을 가늘게 뜬 sick 상태 강제 표시

**시스템적 변화**:
- 매 턴 hp가 자동으로 -1 (통증으로 인한 체력 소모)
  - 구현: advanceTurn 시작 시 comfort ≤ 30이면 state.hp -= 1

### Red Zone (Comfort ≤ 15)

**서사적 변화**:
- 텍스트 톤이 심각해짐:
  - "라떼가 계속 울고 있다. 멈추지 않는다."
  - "통증 때문에 잠들지 못하고 밤새 뒤척인다."
- 심야 슬롯(slot 4) 텍스트 오버라이드: "일지를 쓸 수가 없다. 라떼의 울음이 멈추지 않는다."

**시스템적 변화**:
- 매 턴 hp 자동 -2
- sanity도 매 턴 자동 -1 (고통을 지켜보는 보호자의 소모)
  - 서사적 의미: 라떼의 고통이 보호자의 멘탈도 깎는다

### Collapse (Comfort ≤ 0)

**서사적 전환 — "진통제 선택"**:
```
cue: "한계"
text: "라떼의 고통이 한계를 넘었다. 
      수의사가 전화로 말한다.
      '진통제를 쓸 수 있습니다. 다만 의식이 흐려질 수 있어요.'
      선택해야 한다."
choices:
  - "진통제를 쓴다" → comfort +25, bond -5, hp -5
    reaction: "라떼가 조용해졌다. 편안해 보이지만 눈이 흐릿하다."
  - "자연 회복을 기다린다" → comfort +5, bond +3
    reaction: "라떼가 당신의 손을 핥았다. 아파도 여기 있겠다는 것 같다."
```
- 진통제 선택은 이후 라떼의 반응 텍스트가 둔해짐 ("라떼가 멍하게 있다.")
- 자연 회복 선택은 comfort 회복이 느리지만 bond 보전

**엔딩 분기 영향**:
- comfortCollapseCount ≥ 2: C엔딩 "자연의 섭리" 차단 (편안한 이별이 불가능)
- 진통제 사용 시: 에필로그에 "마지막 며칠, 라떼는 고통 없이 지냈다. 하지만 눈빛은 이전과 달랐다."

---

## 4. Money (자금) — 현실의 압박

돈이 없으면 **치료 옵션이 줄어들고, 현실의 무게가 서사에 스며든다.**

### Yellow Zone (Money ≤ 10)

**서사적 변화**:
- 비용 관련 선택지에 추가 텍스트:
  - "통장 잔고가 한 자릿수다. 이번 달 카드값도 못 냈다."
  - "약값 영수증을 모아보니 월급의 절반이다."
- 일일 요약에 자금 경고 라인 추가: "남은 자금: ○만원"

**시스템적 변화**:
- 비용 -2 초과 선택지 잠금 (기존 구현 유지)

### Red Zone (Money ≤ 0)

**서사적 변화**:
- 텍스트에 생존 압박 등장:
  - "냉장고가 비었다. 라떼 특식은커녕 내 밥도 없다."
  - "연체 알림이 왔다. 무시한다. 지금은 그게 중요한 게 아니다."

**시스템적 변화**:
- 병원 관련 선택지 전부 잠금 (응급 이동, 병원 통화, 약 추가 등)
- 출근 선택지의 money 보상 +3 추가 (절박함 반영)

### Collapse (Money ≤ -10)

**서사적 전환 — "도움 요청"**:
```
cue: "전화벨"
text: "새벽 3시에 전화를 건다. 
      부모님, 친구, 누구라도.
      '미안한데... 이번 달만...'
      수화기 너머 잠깐의 침묵이 길게 느껴진다."
choices:
  - "도움을 받는다" → money +20, sanity -5, bond +1
    reaction: "돈이 들어왔다. 마음은 가벼워지지 않는다."
  - "됐어, 괜찮아" → money +0, sanity -3, bond +2
    reaction: "끊고 나서 한참을 앉아 있었다. 라떼가 무릎에 올라왔다."
```

**엔딩 분기 영향**:
- moneyCollapseCount ≥ 1: 에필로그에 "빚이 남았다. 하지만 후회는 없다."
- 최종 money < 0: 엔딩 후 "생활이 무너졌다. 하지만 라떼와의 시간은 돈으로 살 수 없었다."

---

## 5. HP (체력) — 기존 유지 + 보강

HP ≤ 0은 기존대로 즉시 엔딩 트리거. 이것은 유일한 "하드 실패" 조건이며 변경하지 않는다.

### 추가할 것: HP 저구간 패널티

**HP ≤ 25 (Yellow)**:
- 매 턴 comfort 자동 -1 (체력이 떨어지면 편안함도 떨어짐)
- 씬 텍스트에 라떼 쇠약 묘사 추가

**HP ≤ 10 (Red)**:
- 매 턴 comfort 자동 -2, bond 자동 -1
- 모든 선택지의 hp 양수 delta가 0.5배 (치료 효율 감소)
- 강제 이벤트: "수의사 경고"
  ```
  "수의사가 말한다. '지금 상태에서 더 떨어지면...' 
   끝까지 듣지 못했다."
  ```

---

## 6. 구현 명세: state 추가 필드

```javascript
// state 객체에 추가
state.sanityCollapseCount = 0;    // 멘탈 Collapse 횟수
state.bondCollapseCount = 0;      // 유대 Collapse 횟수
state.comfortCollapseCount = 0;   // 편안함 Collapse 횟수
state.moneyCollapseCount = 0;     // 자금 Collapse 횟수
state.usedPainkiller = false;     // 진통제 사용 여부
state.bondHideTimer = 0;          // 라떼 숨기 남은 턴
state.sanityBlackoutDay = 0;      // 멘탈 블랙아웃 스킵 날짜
state.dayStartSnapshot = null;    // 일일 시작 시 자원 스냅샷
```

## 7. 구현 명세: 턴 시작 시 자동 감쇠 로직

advanceTurn() 시작 부분에 삽입:

```javascript
function applyPassiveDecay() {
  // Comfort → HP 감쇠
  if (state.comfort <= 15) {
    state.hp = Math.max(0, state.hp - 2);
  } else if (state.comfort <= 30) {
    state.hp = Math.max(0, state.hp - 1);
  }

  // Comfort Red → Sanity 감쇠
  if (state.comfort <= 15) {
    state.sanity = Math.max(0, state.sanity - 1);
  }

  // HP Red → Comfort/Bond 감쇠
  if (state.hp <= 10) {
    state.comfort = Math.max(0, state.comfort - 2);
    state.bond = Math.max(0, state.bond - 1);
  } else if (state.hp <= 25) {
    state.comfort = Math.max(0, state.comfort - 1);
  }

  // Collapse 체크
  checkCollapseEvents();
}
```

## 8. 구현 명세: Collapse 체크 로직

```javascript
function checkCollapseEvents() {
  // Sanity Collapse
  if (state.sanity <= 0 && state.sanityBlackoutDay !== state.day) {
    state.sanityCollapseCount += 1;
    state.sanityBlackoutDay = state.day;
    triggerSanityCollapse();
    return; // 하루 스킵하므로 다른 Collapse와 겹치지 않음
  }

  // Bond Collapse
  if (state.bond <= 0 && state.bondHideTimer <= 0) {
    state.bondCollapseCount += 1;
    state.bondHideTimer = 2; // 2턴 간 직접 간병 불가
    triggerBondCollapse();
    return;
  }

  // Comfort Collapse
  if (state.comfort <= 0) {
    state.comfortCollapseCount += 1;
    triggerComfortCollapse();
    return;
  }

  // Money Collapse
  if (state.money <= -10) {
    state.moneyCollapseCount += 1;
    triggerMoneyCollapse();
    return;
  }
}
```

## 9. 구현 명세: 엔딩 분기 개정

```javascript
function triggerEnding() {
  if (state.ended) return;
  state.ended = true;

  const { hp, comfort, bond, hiddenPoint } = state;
  const sc = state.sanityCollapseCount;
  const bc = state.bondCollapseCount;
  const cc = state.comfortCollapseCount;

  // Hidden: 무지개 다리
  if (hiddenPoint >= 7 && bond >= 70 && sc === 0 && bc === 0) {
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
  }
  // A: 나의 라떼
  else if (bond >= 80 && comfort >= 60 && sc <= 1 && bc === 0) {
    state.ending = {
      code: "A",
      title: "나의 라떼",
      text: "라떼가 꿈결처럼 떠났다.\n마지막까지 당신의 품이었다.",
      epilogue: [
        "마지막 체온이 손끝에서 사라졌다.",
        "울음이 멈추지 않았다.",
        "하지만 라떼의 마지막 표정은 편안했다.",
        "그것만으로 충분했다고, 언젠가 믿을 수 있을 것이다.",
      ],
    };
  }
  // B: 병원에서의 사투
  else if (hp >= 50) {
    state.ending = {
      code: "B",
      title: "병원에서의 사투",
      text: "끝까지 치료를 놓지 않았다.\n라떼는 병원에서 마지막을 맞았다.",
      epilogue: [
        "할 수 있는 것은 다 했다.",
        "그래도 남는 건 '더 할 수 있지 않았을까'라는 물음이다.",
        "시간이 지나면 답이 바뀔 수도 있다.",
      ],
    };
  }
  // C: 자연의 섭리
  else if (comfort >= 65 && cc === 0) {
    state.ending = {
      code: "C",
      title: "자연의 섭리",
      text: "고통 없이, 평화롭게.\n라떼는 잠들 듯 별이 되었다.",
      epilogue: [
        "아프지 않았으면 좋겠다고 빌었다.",
        "마지막 숨이 고요했으니, 들어준 걸지도 모른다.",
        "꽃을 한 송이 놓았다. 라떼가 좋아하던 색으로.",
      ],
    };
  }
  // 기본: 회한
  else {
    state.ending = {
      code: "D",
      title: "회한",
      text: "흐린 날의 이별이 조용히 내려앉았다.",
      epilogue: [
        "잘한 건지 모르겠다.",
        "더 잘할 수 있었는데, 라는 말이 맴돈다.",
        "그래도 끝까지 곁에 있었다.",
        "그것만은 사실이다.",
      ],
    };

    // Collapse 기록에 따른 에필로그 추가
    if (sc >= 1) state.ending.epilogue.push("기억에 빈 날들이 있다. 그 시간을 라떼는 혼자 보냈다.");
    if (bc >= 1) state.ending.epilogue.push("내 손을 피하던 날들이 있었다.");
    if (cc >= 2) state.ending.epilogue.push("고통을 덜어주지 못한 밤들이 떠오른다.");
  }

  // 이하 기존 엔딩 연출 로직...
}
```

## 10. 자원 간 연쇄 관계 요약

```
Comfort ≤ 30 → HP 매턴 -1
Comfort ≤ 15 → HP 매턴 -2, Sanity 매턴 -1
HP ≤ 25     → Comfort 매턴 -1  
HP ≤ 10     → Comfort 매턴 -2, Bond 매턴 -1
Bond ≤ 30   → 간병 효율 0.7배
Bond ≤ 15   → 간병 효율 0.4배, 강제급여 잠금
Sanity ≤ 30 → 선택지 힌트 부정확, 출근 잠금
Sanity ≤ 15 → 선택지 3→2개 축소
Money ≤ 0   → 병원/약 선택지 잠금
```

이 연쇄 구조 덕분에 하나의 자원을 방치하면 **다른 자원도 무너지는** 도미노 효과가 생긴다. 하지만 각 Collapse에서 자동 회복이 있으므로 완전한 붕괴 루프에는 빠지지 않는다. "아슬아슬하지만 회복 가능한" 긴장감이 목표다.

---

## 11. 핵심 설계 철학 체크리스트

- [x] 게임오버는 없다 (HP 0 즉시 엔딩은 "이별"이지 "실패"가 아님)
- [x] 모든 Collapse에 자동 회복이 있다
- [x] 패널티는 숫자가 아니라 텍스트/장면으로 전달된다
- [x] 방치의 대가는 "엔딩의 빛이 바래는 것"이다
- [x] 좋은 선택만 해도 모든 자원을 유지할 수는 없다 (트레이드오프)
- [x] 자원 간 연쇄가 있어 관리의 의미가 생긴다
- [x] 어떤 엔딩이든 "끝까지 곁에 있었다"는 사실은 변하지 않는다

> **"배드엔딩은 없다. 하지만 아름다운 이별과 아픈 이별은 다르다."**
