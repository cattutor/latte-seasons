# 라떼의 계절 2차 수정 지시서 (Revision Guide v2)

> 작성자: 시나리오 디렉터 (Claude)  
> 수신자: 메인 개발자 (Codex)  
> 기준: 1차 지시서(REVISION_GUIDE.md) 반영 검증 + 플레이 피드백  
> 날짜: 2026-02-15  
> 수정 범위: `script.js`, `style.css`  
> 인코딩: **UTF-8 (BOM 없음)**

---

## 1) 1차 반영 검증 결과

### 1-1. 정상 반영 (핵심)
- SubQ(피하수액) 2단계 미니게임 교체
- 엔딩 4분기(Rainbow/MyLatte/Fighter/Nature) 반영
- `DAY_TEXTS` 레이어 도입 + Day1/Day19-3/Day28 오버라이드
- `dailyIntake`, `todayCommuted` 상태 도입
- CCTV 트리거를 `todayCommuted`와 연동
- 팔레트 GDD 정합 색상 반영
- `DungGeunMo` 폰트 적용
- 저장/복구(localStorage) 및 BGM 기본 구조 반영

### 1-2. 미반영 또는 보완 필요
1. Ch.2 새벽 선택지(“익숙한 자리에 빠르게”) delta가 여전히 과도한 패널티
2. 강제 급여 delta가 일부 챕터에서 규칙 위반(동시 다중 마이너스 과다)
3. Ch.1/Ch.2 기본 텍스트에 IV 뉘앙스 잔존 문구 존재
4. Day2~Day27 새벽(slot 0) `DAY_TEXTS` 확장 미완
5. 선택 직후 피드백(리액션 텍스트/수치 변화 체감) 부족

### 1-3. 신규 확인 버그
1. `DAY_TEXTS["1-1"]` 문구 인코딩 깨짐(모지바케)
2. Day28 cue 하드코딩이 `DAY_TEXTS` cue를 덮어쓰는 충돌 가능성

---

## 2) 즉시 수정 항목 (Quick Fix)

### A. 인코딩/오버라이드 충돌

#### A-1. `DAY_TEXTS["1-1"]` 문구 복구
```javascript
// script.js
"1-1": {
  cue: "첫 출근 고민",
  text: "출근길 지하철에서 검색창을 연다. '고양이 신부전 돌봄'. 오늘 하루를 어떻게 버틸지 아직 답이 없다.",
},
```

#### A-2. Day28 cue 하드코딩 보호 조건
```javascript
// script.js:getEventForDay()
// 기존
if (day === 28 && slot >= 2) scene.cue = "CCTV 알림 점멸";

// 수정
if (day === 28 && slot >= 2 && !override) scene.cue = "CCTV 알림 점멸";
```

### B. Delta 재밸런싱(최소)

#### B-1. Ch.2 새벽 “익숙한 자리에 빠르게”
```javascript
// 기존: { hp: 1, comfort: -3, sanity: -4, money: -1, bond: -2 }
// 수정:
{ hp: 3, comfort: -1, sanity: 2, money: -1, bond: 0 }
```

#### B-2. 강제 급여(챕터별)
```javascript
// Ch.1 slot3
{ hp: 5, comfort: -2, sanity: -1, money: -1, bond: -1 }

// Ch.2 slot3
{ hp: 5, comfort: -2, sanity: -1, money: -2, bond: -1 }

// Ch.4 slot3
{ hp: 4, comfort: -2, sanity: -1, money: -1, bond: -1 }
```

### C. 기본 텍스트 교정(IV 잔재 제거)
```javascript
// EVENTS[1][0].text
"새벽 수액 준비. 뜨거운 물에 링거백을 담그고, 떨리는 손으로 등의 피부를 잡아 올린다."

// EVENTS[2][0].text
"피부 탄력이 더 떨어졌다. 텐트를 만드는 일부터 어제보다 어렵다."
```

---

## 3) 체감 개선 (2차 핵심)

### D. 선택 직후 피드백 강화
- `chooseAction()`에서 즉시 1~2줄 리액션 텍스트 표시 후 턴 진행
- `applyDelta()`에서 수치 팝업(+/-)과 바 플래시 효과 추가

### E. 장면 전환 연출
- 시간대 전환 시 `scene-fade` 적용
- 일자 전환 시 오버레이(`D-xx`) 1회 표시

### F. 라떼 반응 애니메이션
- 선택 결과에 따라 `latte-happy`, `latte-flinch`, `latte-slowblink` 클래스 부여

---

## 4) 데이터 확장

### G. `DAY_TEXTS` 새벽(slot 0) 확장
- Day2~Day27 슬롯 0 텍스트를 1차 지시서 A-4 원문 기준으로 추가
- 우선순위: Ch.2(8~14) → Ch.3(15~21) → Ch.4(22~27)

---

## 5) 실행 순서 (권장)
1. A-1, A-2 (버그/충돌 즉시 수정)
2. B-1, B-2, C (밸런스/정합성 회복)
3. D, E, F (체감 개선)
4. G (데이터 확장)

---

## 6) 완료 기준 (Acceptance Criteria)
- 한글 깨짐 없이 문서/게임 텍스트가 UTF-8로 정상 표시된다.
- Day28 슬롯 3~4에서 `DAY_TEXTS` cue가 유지된다.
- 선택지 하나가 3개 이상 자원을 동시에 크게 잃는 경우가 없다.
- 선택 직후 플레이어가 “무슨 변화가 일어났는지” 즉시 체감한다.
- 콘솔 에러 0, 페이지 로드/입력 동작 정상.

---

> 어떤 선택을 하든, 당신은 좋은 보호자였습니다.
