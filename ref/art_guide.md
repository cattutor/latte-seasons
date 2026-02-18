# 🎨 [추가] 라떼의 계절: 아트 & 비주얼 가이드 (Art Direction)

> **작성자**: 총괄 디렉터 (Gemini)
> **수신자**: 메인 개발자 (Claude/Codex)
> **목표**: GDD v1.0의 감정선(Emotional Curve)을 시각적으로 구현.

## 4. 🎨 Art & Visual Guide (필수 반영)
**[Action]** CSS 및 Canvas 렌더링 시 아래 가이드를 준수하세요.

### A. 시간대별 컬러 팔레트 (Mood System)
배경색(`body-bg`)과 텍스트 색상을 시간대에 맞춰 변경하여 심리적 압박감을 조성합니다.

| TimeSlot | 명칭 | 분위기(Mood) | Background (Hex) | Text Color | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0 (새벽)** | Dawn | 차가움, 고독 | `#2C3E50` (Dark Blue-Grey) | `#ECF0F1` | 수액 미니게임 |
| **1 (오전)** | Morning | 희망, 임상적 | `#FDFFE6` (Pale Yellow) | `#333333` | 출근 결정 |
| **2 (오후)** | Afternoon | 나른함, 불안 | `#E67E22` (Burnt Orange) | `#FFFFFF` | CCTV 확인 |
| **3 (저녁)** | Evening | 긴장, 압박 | `#8E44AD` (Muted Purple) | `#ECF0F1` | 강제 급여 |
| **4 (심야)** | Night | 어둠, 정산 | `#111111` (Almost Black) | `#BDC3C7` | 일지 작성 |

### B. 캐릭터 디자인 가이드 (Latte)
CSS Canvas 또는 Pixel Art 생성 시 다음 특징을 반드시 묘사해야 합니다.

1.  **종(Breed):** **스코티시 폴드 (Scottish Fold)**
    * **귀:** 반드시 **접혀 있어야 함** (쫑긋한 귀 X). 머리가 둥근 형태.
2.  **색상(Color):** **오렌지색 (Orange Tabby)**
    * Main Color: `#F39C12` (오렌지)
    * Stripe Color: `#D35400` (진한 줄무늬)
3.  **상태별 묘사:**
    * `Normal`: 앉아있는 자세, 꼬리를 천천히 흔듦.
    * `Sick`: 식빵 자세(웅크림), 눈을 반쯤 감음.
    * `Critical`: 옆으로 누워있음, 호흡 애니메이션(몸통이 빠르게 오르내림).

### C. UI/UX 컨셉
* **전체 테마:** "낡은 병원 차트" 또는 "엑셀 시트" 느낌.
* **폰트:** Monospace (고정폭) 폰트 사용 (데이터의 정확성 강조).
* **효과:** 상태가 나빠질수록 화면에 노이즈(Noise)나 비네팅(Vignetting) 효과 추가.