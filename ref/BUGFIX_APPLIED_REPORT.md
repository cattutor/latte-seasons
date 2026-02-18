# ✅ 버그 수정 & 게임플레이 개선 — 적용 완료 보고

> **적용일**: 2026.02.17  
> **대상 파일**: `script.js`, `style.css`

---

## 이슈 #1: HP 밸런스 — weak/critical 노출 빈도 개선 ✅

### 적용 내역
- **초기 HP**: 72 → **65** 하향
- **챕터별 Daily HP Decay** 신규 추가 (매일 새벽 자동 적용):
  - Ch.1: -2 / Ch.2: -4 / Ch.3: -1 (회복기) / Ch.4: -5
- **domino penalty 강화**:
  - comfort ≤15: HP -2 → **-3**
  - comfort ≤30: HP -1 → **-2**
  - sanity ≤15: **HP -1 추가** (신규)

### 예상 결과
| 챕터 | 예상 HP 범위 | 주 상태 |
|------|-------------|---------|
| Ch.1 | 50~65 | healthy → weak 진입 |
| Ch.2 | 30~50 | **weak 중심** |
| Ch.3 | 35~55 | weak (회복 가능) |
| Ch.4 | 0~30 | **critical 중심** |

---

## 이슈 #2: 이모트/아이템 이미지 비율 일그러짐 수정 ✅

### 적용 내역 (style.css)
- `.emote-effect`: `max-width: 72px` → `max-width: none` + `object-fit: contain` 추가
- `.item-icon`: `object-fit: contain` 추가

---

## 이슈 #3: UI 폰트 컬러 가독성 수정 ✅

### 적용 내역 (style.css)
- `:root`에 `--ui-text`, `--ui-text-dim`, `--ui-text-muted` 신규 변수 추가
- 시간대별로 변하는 `--text` 대신, UI 요소는 고정 `--ui-text` 사용:
  - `.bar-label`, `.bar-value`, `.choice-btn`, `button`, `.item-btn`
  - `.scene-text`, `.background-cue`, `.meta-row`, `.status-hint`

---

## 이슈 #4: 아이템 별 등급 + 자금 연동 시스템 ✅

### 적용 내역

**별 등급 & 비용:**
| 아이템 | 별 | 비용 |
|--------|-----|------|
| 담요 | ★☆☆☆ | -2 |
| 빗 | ★★☆☆ | -4 |
| 수액 | ★★★☆ | -6 |
| 약 | ★★★★ | -8 |

**비활성화 조건:**
- `money ≤ 5` → 전체 아이템 비활성
- `money < item.cost` → 해당 아이템만 비활성

**UI 변경:**
- 아이템 버튼에 별 등급(`★★☆☆`) + 비용(`-4💰`) 표시
- 자금 부족 시 패널에 빨간 경고 테두리

**ITEM_DATA 변경:**
- `stars`, `cost` 필드 추가
- `effect`에서 `money` 제거 (cost로 분리, 중복 방지)
