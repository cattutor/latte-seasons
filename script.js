const TIME_NAMES = ["새벽 05:00", "오전 09:00", "오후 14:00", "저녁 19:00", "심야 23:00"];

const CHAPTER_META = {
  1: { name: "Chapter 1 - Merry Christmas", stage: "stage-hospital" },
  2: { name: "Chapter 2 - Happy New Year", stage: "stage-room" },
  3: { name: "Chapter 3 - Golden Time", stage: "stage-golden" },
  4: { name: "Chapter 4 - D-Day", stage: "stage-farewell" },
};

const EVENTS = {
  1: [
    {
      slot: 0, cue: "피하수액 준비", text: "새벽 수액 준비. 뜨거운 물에 링거백을 담그고, 떨리는 손으로 등의 피부를 잡아 올린다.", choices: [
        { label: "등을 충분히 데워주고 천천히", delta: { hp: 4, comfort: 3, sanity: -2, money: -2, bond: 2 }, reaction: "라떼가 눈을 감고 힘을 뺐다. 믿고 있다." },
        { label: "최대한 빠르게 끝내기", delta: { hp: 3, comfort: -1, sanity: 2, money: -1, bond: 0 }, reaction: "라떼가 움찔했다. 빨리 끝나서 다행인 건지." },
        { label: "잠시 안아서 긴장을 풀어주고 재시도", delta: { hp: 2, comfort: 4, sanity: -1, money: -3, bond: 3 }, reaction: "품 안에서 가르릉 소리가 났다. 아주 작게." },
      ]
    },
    {
      slot: 1, cue: "선고 직후의 오전", text: "출근할지, 곁에 남을지. 생계와 죄책감이 동시에 밀려온다.", choices: [
        { label: "출근한다", key: "commute", delta: { hp: -2, comfort: -2, sanity: -1, money: 10, bond: -1 }, reaction: "현관문이 닫히는 소리가 유난히 크게 울렸다." },
        { label: "연차를 쓰고 병원과 통화", delta: { hp: 1, comfort: 2, sanity: -1, money: -5, bond: 2 }, reaction: "수화기 너머 수의사의 목소리가 차분하다. 조금 안심된다." },
        { label: "재택으로 절충", delta: { hp: 0, comfort: 1, sanity: -2, money: 5, bond: 1 }, reaction: "노트북 옆에 라떼가 웅크렸다. 키보드 소리에 귀가 움직인다." },
      ]
    },
    {
      slot: 2, cue: "검사 수치 입력", text: "오후는 관찰과 기록의 시간. 작은 변화도 숫자로 남긴다.", choices: [
        { label: "CCTV 확인 후 기록", delta: { hp: 0, comfort: 1, sanity: -1, money: 0, bond: 1 }, reaction: "화면 속 라떼가 잠들어 있다. 숨이 오르내리는 게 보인다." },
        { label: "병원에 전화해 수치 업데이트", delta: { hp: 1, comfort: 0, sanity: -2, money: -2, bond: 1 }, reaction: "수치를 읽어주는 동안 손끝이 차가워진다." },
        { label: "특식 테스트", delta: { hp: 2, comfort: 1, sanity: 0, money: -3, bond: 2 }, reaction: "참치 냄새에 라떼의 코가 벌름거렸다. 한 번." },
      ]
    },
    {
      slot: 3, cue: "저녁 급여", text: "저녁 급여는 매일의 분기점이다.", choices: [
        { label: "육수로 자발 급여 유도", intake: 3, delta: { hp: 3, comfort: 2, sanity: -1, money: -2, bond: 2 }, reaction: "혀가 살짝 나왔다가 들어갔다. 한 스푼의 무게." },
        { label: "강제 급여", key: "forceFeed", intake: 5, delta: { hp: 5, comfort: -2, sanity: -1, money: -1, bond: -1 }, reaction: "라떼가 고개를 돌렸다. 입가에 브로스가 흘렀다." },
        { label: "오늘은 휴식", intake: 0, delta: { hp: -2, comfort: 1, sanity: 1, money: 0, bond: 0 }, reaction: "빈 접시 앞에 둘 다 앉아 있었다. 아무 말 없이." },
      ]
    },
    {
      slot: 4, cue: "심야 로그", text: "심야. 숫자 뒤에 감정을 붙여 일지를 마무리한다.", choices: [
        { label: "수치+감정 상세 기록", delta: { hp: 0, comfort: 1, sanity: 2, money: 0, bond: 1 }, reaction: "펜을 놓으니 손가락 마디가 뻣뻣하다. 오늘의 기록은 끝났다." },
        { label: "곁에서 숨 고르기", hiddenPoint: 1, delta: { hp: 1, comfort: 2, sanity: 1, money: 0, bond: 2 }, reaction: "라떼의 숨소리와 내 숨소리가 겹쳤다. 조용한 밤." },
        { label: "기록 생략", delta: { hp: -1, comfort: -1, sanity: -3, money: 0, bond: -1 }, reaction: "적지 않으면 없던 일이 되는 건 아닌데." },
      ]
    },
  ],
  2: [
    {
      slot: 0, cue: "사투의 새벽", text: "피부 탄력이 더 떨어졌다. 등가죽을 집어 텐트를 만드는 일부터 어제보다 어렵다.", choices: [
        { label: "새 자리를 찾아 조심스럽게", delta: { hp: 4, comfort: 1, sanity: -2, money: -2, bond: 2 }, reaction: "세 번째 시도에 바늘이 들어갔다. 라떼가 참아줬다." },
        { label: "익숙한 자리에 빠르게", delta: { hp: 3, comfort: -1, sanity: 2, money: -1, bond: 0 }, reaction: "자리가 딱딱해졌다. 어제보다 어렵다." },
        { label: "오늘은 쉬었다가 내일", delta: { hp: 2, comfort: 3, sanity: 1, money: -2, bond: 2 }, reaction: "바늘을 내려놓자 라떼가 다가왔다. 오늘은 쉬어도 된다고." },
      ]
    },
    {
      slot: 1, cue: "소진의 오전", text: "몸과 마음이 동시에 소진된다.", choices: [
        { label: "출근한다", key: "commute", delta: { hp: -2, comfort: -1, sanity: -2, money: 9, bond: -1 }, reaction: "지하철 문이 닫힐 때 CCTV 알림이 울렸다. 무시했다." },
        { label: "연차로 회복", delta: { hp: 0, comfort: 2, sanity: 1, money: -5, bond: 2 }, reaction: "이불 속에서 한 시간을 울었다. 일어나니 라떼가 옆에 있었다." },
        { label: "재택으로 버틴다", delta: { hp: -1, comfort: 1, sanity: -1, money: 4, bond: 1 }, reaction: "회의 중에 라떼가 토했다. 카메라를 끄고 달려갔다." },
      ]
    },
    {
      slot: 2, cue: "CCTV의 오후", text: "모니터 속 작은 움직임을 읽어야 한다.", choices: [
        { label: "움직임을 먹이 반응으로 판독", delta: { hp: 1, comfort: 1, sanity: -1, money: 0, bond: 1 }, reaction: "꼬리 끝이 움직였다. 신호일까, 바람일까." },
        { label: "오판 우려로 즉시 귀가", delta: { hp: 0, comfort: 2, sanity: -2, money: -2, bond: 2 }, reaction: "문을 여니 라떼가 현관을 바라보고 있었다. 기다렸나." },
        { label: "병원에 상황 전달", delta: { hp: 1, comfort: 0, sanity: -1, money: -1, bond: 1 }, reaction: "수의사가 '지켜보자'고 했다. 그 말이 가장 무섭다." },
      ]
    },
    {
      slot: 3, cue: "5일 금식", text: "일지의 섭취량 칸이 다시 0이다.", choices: [
        { label: "한 스푼만 시도", intake: 1, delta: { hp: 1, comfort: -2, sanity: -2, money: -1, bond: 1 }, reaction: "입술에 닿자 고개를 돌렸다. 반 스푼도 못 넣었다." },
        { label: "강제 급여", key: "forceFeed", intake: 6, delta: { hp: 5, comfort: -2, sanity: -1, money: -2, bond: -1 }, reaction: "몸부림 후 조용해졌다. 눈이 마주쳤는데 시선을 피했다." },
        { label: "수분만 유지", hiddenPoint: 1, intake: 0, delta: { hp: -1, comfort: 2, sanity: 1, money: 0, bond: 2 }, reaction: "물을 적신 거즈로 입술을 닦아줬다. 혀가 살짝 나왔다." },
      ]
    },
    {
      slot: 4, cue: "번아웃 직전", text: "심야 기록이 무너지면 내일 선택지도 무너진다.", choices: [
        { label: "짧게라도 기록", delta: { hp: 0, comfort: 1, sanity: 2, money: 0, bond: 1 }, reaction: "섭취 0ml. 세 글자가 일지 위에서 크게 보인다." },
        { label: "라떼와 10분 눈맞춤", hiddenPoint: 1, delta: { hp: 1, comfort: 2, sanity: 2, money: 0, bond: 2 }, reaction: "라떼가 먼저 눈을 감았다. 그 10분이 오늘의 전부였다." },
        { label: "그냥 쓰러져 잠듦", delta: { hp: -1, comfort: -1, sanity: -4, money: 0, bond: -1 }, reaction: "눈을 떠보니 새벽이다. 라떼가 발치에서 자고 있었다." },
      ]
    },
  ],
  3: [
    {
      slot: 0, cue: "희망의 새벽", text: "같은 수액인데 손끝의 감각이 조금 가벼워졌다.", choices: [
        { label: "평소 양(150ml) 안정적으로", delta: { hp: 4, comfort: 3, sanity: 0, money: -2, bond: 2 }, reaction: "바늘이 한 번에 들어갔다. 라떼도, 손도 편안하다." },
        { label: "수의사 권고대로 양을 늘려본다(200ml)", delta: { hp: 5, comfort: -1, sanity: -2, money: -2, bond: 0 }, reaction: "양이 늘었지만 라떼가 얌전하다. 몸이 받아들이고 있다." },
        { label: "오늘은 절반만(75ml)", delta: { hp: 2, comfort: 2, sanity: 1, money: -1, bond: 1 }, reaction: "짧게 끝나자 라떼가 그루밍을 시작했다. 좋은 징조." },
      ]
    },
    {
      slot: 1, cue: "짧은 평온", text: "오전의 선택이 오늘 기적의 크기를 바꾼다.", choices: [
        { label: "출근한다", key: "commute", delta: { hp: -1, comfort: -1, sanity: 0, money: 9, bond: -1 }, reaction: "출근길이 가볍다. 라떼가 아침에 물을 마셨으니까." },
        { label: "반차 후 복귀", delta: { hp: 1, comfort: 2, sanity: 1, money: 2, bond: 2 }, reaction: "반나절이지만 라떼 옆에 있으니 충전된 기분이다." },
        { label: "종일 곁에 남는다", delta: { hp: 2, comfort: 3, sanity: 1, money: -5, bond: 3 }, reaction: "라떼가 무릎 위로 올라왔다. 이 무게가 그리웠다." },
      ]
    },
    {
      slot: 2, cue: "관찰의 오후", text: "브로스 냄새에 반응할지 확인한다.", choices: [
        { label: "브로스 워밍업", delta: { hp: 2, comfort: 2, sanity: 1, money: -2, bond: 2 }, reaction: "냄새를 맡자 라떼의 꼬리가 흔들렸다. 며칠 만에 처음." },
        { label: "CCTV로 움직임 확인", delta: { hp: 0, comfort: 1, sanity: 0, money: 0, bond: 1 }, reaction: "화면 속 라떼가 캣타워에 올라갔다. 저절로 웃음이 났다." },
        { label: "수의사와 급여 계획 조정", delta: { hp: 1, comfort: 1, sanity: -1, money: -2, bond: 1 }, reaction: "수의사가 '잘하고 있다'고 했다. 그 말 한마디에 눈물이 났다." },
      ]
    },
    {
      slot: 3, cue: "기적의 19스푼", text: "오늘 몇 스푼까지 갈 수 있을까.", choices: [
        { label: "19스푼 도전", spoon: 19, hiddenPoint: 1, intake: 19, delta: { hp: 7, comfort: 5, sanity: 3, money: -3, bond: 6 }, reaction: "열아홉. 세는 손이 기쁨으로 떨렸다. 라떼가 접시를 핥았다." },
        { label: "9스푼 유지", spoon: 9, intake: 9, delta: { hp: 4, comfort: 3, sanity: 2, money: -2, bond: 4 }, reaction: "아홉 스푼이면 충분하다. 라떼의 속도에 맞추는 거다." },
        { label: "3스푼만 안전하게", spoon: 3, intake: 3, delta: { hp: 2, comfort: 2, sanity: 1, money: -1, bond: 2 }, reaction: "세 스푼이라도 스스로 먹었다. 그것만으로 눈물이 났다." },
      ]
    },
    {
      slot: 4, cue: "환희 뒤의 심야", text: "기쁨 뒤에는 다시 두려움이 온다. 오늘을 기록해 고정한다.", choices: [
        { label: "희망 로그 작성", delta: { hp: 0, comfort: 2, sanity: 2, money: 0, bond: 2 }, reaction: "일지에 '좋은 날'이라고 적었다. 펜이 가볍다." },
        { label: "축하 스티커 남기기", hiddenPoint: 1, delta: { hp: 1, comfort: 1, sanity: 1, money: 0, bond: 2 }, reaction: "일지 한 켠에 별 스티커를 붙였다. 아이처럼." },
        { label: "아무 말 없이 잠듦", delta: { hp: -1, comfort: -1, sanity: -2, money: 0, bond: -1 }, reaction: "기쁜 날인데 불안이 밀려온다. 기적은 영원하지 않으니까." },
      ]
    },
  ],
  4: [
    {
      slot: 0, cue: "이별의 새벽", text: "숨이 더 얕다. 오늘의 수액은 치료보다 편안함에 가깝다.", choices: [
        { label: "통증 부담을 줄이고 소량만(100ml)", delta: { hp: 2, comfort: 4, sanity: -1, money: -2, bond: 2 }, reaction: "라떼가 눈을 뜨지 않았다. 편안해 보여서 다행이다." },
        { label: "수분 보충을 위해 평소대로(150ml)", delta: { hp: 4, comfort: -1, sanity: -2, money: -2, bond: 0 }, reaction: "바늘을 꽂아도 반응이 없다. 아프지 않은 건지, 기력이 없는 건지." },
        { label: "오늘은 안 놓는다. 깨우고 싶지 않다.", delta: { hp: -1, comfort: 2, sanity: 1, money: 0, bond: 1 }, reaction: "바늘을 내려놓고 이불을 덮어줬다. 숨소리만 듣는다." },
      ]
    },
    {
      slot: 1, cue: "마지막 출근 주간", text: "현실은 계속된다. 곁을 지키고 싶어도 선택은 무겁다.", choices: [
        { label: "출근한다", key: "commute", delta: { hp: -2, comfort: -2, sanity: -2, money: 8, bond: -1 }, reaction: "현관에서 한 번 더 돌아봤다. 라떼가 눈을 떴다가 감았다." },
        { label: "지정보호자에게 맡기고 반차", delta: { hp: 0, comfort: 1, sanity: -1, money: 2, bond: 1 }, reaction: "믿을 수 있는 사람이 곁에 있다. 그것만으로 감사하다." },
        { label: "끝까지 곁에 남는다", delta: { hp: 1, comfort: 2, sanity: 0, money: -6, bond: 3 }, reaction: "라떼의 손을 잡았다. 발바닥이 차갑다." },
      ]
    },
    {
      slot: 2, cue: "CCTV 알림 점멸", text: "오후 내내 알림이 깜빡인다. 마음이 먼저 집으로 달린다.", choices: [
        { label: "즉시 상태 확인", delta: { hp: 0, comfort: 1, sanity: -1, money: 0, bond: 1 }, reaction: "라떼가 내 옷 위에 누워있었다. 냄새가 그리운 걸까." },
        { label: "업무 마무리 후 확인", delta: { hp: -1, comfort: -1, sanity: -2, money: 3, bond: -1 }, reaction: "확인이 늦었다. 변한 건 없었지만 죄책감은 남았다." },
        { label: "지정보호자와 통화", delta: { hp: 0, comfort: 2, sanity: 0, money: 0, bond: 2 }, reaction: "'괜찮아, 자고 있어.' 그 말에 잠깐 숨을 쉬었다." },
      ]
    },
    {
      slot: 3, cue: "마지막 저녁", text: "강제 급여가 맞는지, 그냥 안아주는 게 맞는지. 정답은 없다.", choices: [
        { label: "강제 급여", key: "forceFeed", intake: 4, delta: { hp: 4, comfort: -2, sanity: -1, money: -1, bond: -1 }, reaction: "입을 열지 않았다. 더 이상 억지로 하지 않기로 했다." },
        { label: "브로스 한 스푼", intake: 1, delta: { hp: 1, comfort: 2, sanity: 0, money: -1, bond: 1 }, reaction: "손가락 끝을 핥았다. 마지막 인사인 걸까." },
        { label: "안고 함께 쉬기", hiddenPoint: 1, intake: 0, delta: { hp: 0, comfort: 4, sanity: 1, money: 0, bond: 3 }, reaction: "체온이 전해졌다. 아직 따뜻하다. 아직." },
      ]
    },
    {
      slot: 4, cue: "D-Day 심야", text: "마지막 줄을 쓰는 시간. 오늘의 로그가 에필로그가 된다.", choices: [
        { label: "끝까지 기록한다", delta: { hp: 0, comfort: 1, sanity: 1, money: 0, bond: 1 }, reaction: "마지막 줄을 적었다. 펜을 놓자 손이 떨렸다." },
        { label: "손을 잡고 작별 인사", hiddenPoint: 1, delta: { hp: 0, comfort: 3, sanity: 1, money: 0, bond: 3 }, reaction: "라떼의 발이 아주 살짝 움직였다. 알고 있다는 것 같았다." },
        { label: "침묵 속에 곁에 있기", delta: { hp: 0, comfort: 2, sanity: 0, money: 0, bond: 2 }, reaction: "아무 말도 하지 않았다. 숨소리만으로 충분했다." },
      ]
    },
  ],
};

const DAY_TEXTS = {
  "1-0": {
    cue: "첫 새벽",
    text: "뜨거운 물에 링거백을 담가 체온만큼 데운다. 차가우면 라떼가 싫어한다. 등의 피부를 처음 잡아 올리는 손이 떨린다.",
  },
  "1-1": {
    cue: "첫 출근 고민",
    text: "출근길 지하철에서 검색창을 연다. '고양이 신부전 돌봄'. 오늘 하루를 어떻게 버틸지 아직 답이 없다.",
  },
  "1-2": {
    cue: "CCTV 설치",
    text: "흑백 화면 속 라떼가 이불 위에 웅크려 있다. 화면을 자꾸 확대해 숨이 오르내리는지 확인한다.",
  },
  "1-3": {
    cue: "첫 저녁 급여",
    text: "한 스푼을 입가에 댄다. 삼킬지, 고개를 돌릴지 그 짧은 순간이 하루의 무게를 바꾼다.",
  },
  "1-4": {
    cue: "첫 심야 기록",
    text: "숫자를 적다가 멈춘다. 오늘의 수치보다 더 선명한 건 라떼의 체온과 손끝의 떨림이다.",
  },
  "11-3": {
    cue: "기적의 저녁",
    text: "브로스 냄새에 라떼가 고개를 들었다. 한 스푼, 두 스푼. 멈추지 않는다. 세고 있는 내 손이 기쁨으로 떨린다.",
  },
  "18-0": {
    cue: "D-Day 새벽",
    text: "마지막 수액일지 모른다는 생각으로 손이 무거워진다. 그래도 오늘의 고통은 줄여주고 싶다.",
  },
  "18-1": {
    cue: "D-Day 오전",
    text: "현실은 여전히 출근을 요구하지만, 오늘만큼은 시계보다 숨소리를 먼저 본다.",
  },
  "18-2": {
    cue: "CCTV 알림 점멸",
    text: "알림이 연달아 뜬다. 모니터를 보는 손보다 마음이 먼저 집으로 달려간다.",
  },
  "18-3": {
    cue: "마지막 저녁",
    text: "먹이는 것이 사랑인지, 쉬게 두는 것이 사랑인지 끝내 정답은 모른다.",
  },
  "18-4": {
    cue: "마지막 밤",
    text: "숨소리가 얕아졌다. 시간을 붙잡을 수는 없어도, 마지막 온기는 놓치지 않으려 손을 모은다.",
  },
};

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
    "회사에서 전화가 왔다. 업무 마감이 내일이라는 걸 이제야 기억했다.",
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

const CRISIS_EVENTS = [
  {
    day: [3, 4, 5],
    slot: 0,
    chance: 0.34,
    cue: "응급 상황",
    text: "새벽 3시, 라떼가 갑자기 구토했다. 입가가 젖어 있고 호흡이 거칠다.",
    choices: [
      { label: "즉시 응급 병원으로 이동", delta: { hp: 5, comfort: -1, sanity: -3, money: -12, bond: 1 } },
      { label: "상태를 관찰하며 대기", delta: { hp: -2, comfort: 1, sanity: -2, money: 0, bond: -1 } },
      { label: "수의사에게 영상 전송", delta: { hp: 2, comfort: 0, sanity: -1, money: -4, bond: 1 } },
    ],
  },
  {
    day: [8, 9, 10],
    slot: 2,
    chance: 0.32,
    cue: "CCTV 이상 신호",
    text: "CCTV 화면이 끊기며 번쩍인다. 정전인지 장비 고장인지 알 수 없다. 심장이 먼저 내려앉는다.",
    choices: [
      { label: "즉시 귀가", delta: { hp: 1, comfort: 2, sanity: -2, money: -3, bond: 2 } },
      { label: "이웃에게 확인 요청", delta: { hp: 0, comfort: 1, sanity: -1, money: 0, bond: 1 } },
      { label: "30분 뒤 재확인", delta: { hp: -2, comfort: -1, sanity: -3, money: 0, bond: -1 } },
    ],
  },
  {
    day: [12, 13, 14],
    slot: 3,
    chance: 0.36,
    cue: "급여 실패",
    text: "강제 급여 도중 라떼가 격하게 몸부림친다. 주사기에서 브로스가 새고, 둘 다 지친다.",
    choices: [
      { label: "잠시 쉬고 다시 시도", delta: { hp: 2, comfort: -3, sanity: -3, money: -1, bond: -1 } },
      { label: "오늘은 중단", delta: { hp: -3, comfort: 3, sanity: 1, money: 0, bond: 1 } },
      { label: "다른 급여 방법 탐색", delta: { hp: 1, comfort: 1, sanity: -2, money: -4, bond: 2 } },
    ],
  },
  {
    day: [17, 18],
    slot: 1,
    chance: 0.38,
    cue: "직장 경고",
    text: "프로젝트 마감 경고가 떴다. 오늘 결근하면 공식 경고를 받을 수 있다. 머리가 복잡해진다.",
    choices: [
      { label: "출근한다", delta: { hp: -2, comfort: -2, sanity: -3, money: 11, bond: -2 } },
      { label: "사직서를 낸다", delta: { hp: 0, comfort: 1, sanity: -5, money: -20, bond: 3 } },
      { label: "사정을 설명하고 원격 처리", delta: { hp: -1, comfort: 0, sanity: -3, money: 6, bond: 1 } },
    ],
  },
  {
    day: [15, 16],
    slot: 4,
    chance: 0.46,
    cue: "호흡 이상",
    text: "잠든 사이 라떼 호흡이 불규칙해졌다. 10초 가까이 숨이 멈춘 듯해 손끝이 얼어붙는다.",
    choices: [
      { label: "숨소리를 지키며 관찰", delta: { hp: 1, comfort: 2, sanity: -6, money: 0, bond: 3 } },
      { label: "응급 병원과 통화", delta: { hp: 4, comfort: 0, sanity: -2, money: -10, bond: 1 } },
      { label: "안고 진정 유도", hiddenPoint: 1, delta: { hp: -1, comfort: 4, sanity: -2, money: 0, bond: 4 } },
    ],
  },
  {
    day: [16, 17],
    slot: 0,
    chance: 0.52,
    cue: "수액 난항",
    text: "수액용 바늘이 피부를 자꾸 비껴간다. 더 이상 놓을 자리가 거의 없어 선택이 더 아프다.",
    choices: [
      { label: "새 부위를 찾아 재시도", delta: { hp: 3, comfort: -3, sanity: -2, money: -2, bond: 0 } },
      { label: "오늘 수액은 중단", delta: { hp: -5, comfort: 2, sanity: 1, money: 0, bond: 1 } },
      { label: "병원 방문 후 재처치", delta: { hp: 6, comfort: -1, sanity: -3, money: -12, bond: -1 } },
    ],
  },
];

const RANDOM_DAWN_EVENTS = [
  {
    cue: "돌발: 컨디션 상승",
    text: "오늘따라 라떼의 기운이 좋아 보인다. 오늘 선택의 효율이 오를 수 있다.",
    choices: [
      { label: "리듬을 유지한다", special: { dailyEfficiencyBuff: 1.2 }, delta: { hp: 1, comfort: 1, sanity: 0, money: 0, bond: 1 } },
      { label: "무리하지 않고 관찰한다", delta: { hp: 0, comfort: 2, sanity: 1, money: 0, bond: 1 } },
    ],
  },
  {
    cue: "돌발: 빈혈 증세",
    text: "갑작스러운 빈혈 징후가 보인다. 대응이 늦으면 체력이 급락할 수 있다.",
    choices: [
      { label: "응급 보조제를 투여한다", delta: { hp: 3, comfort: -2, sanity: -2, money: -6, bond: -1 } },
      { label: "안정 우선으로 휴식", delta: { hp: -2, comfort: 2, sanity: -1, money: 0, bond: 1 } },
      { label: "지켜보며 다음 턴 대비", delta: { hp: -5, comfort: 0, sanity: -2, money: 0, bond: -1 } },
    ],
  },
];

const CHAPTER_HP_DECAY = {
  1: -2,
  2: -4,
  3: -1,
  4: -5,
};

const GAME_TOTAL_DAYS = 18;
const CHAPTER_LENGTH_DAYS = 4;
const ACTIVITY_SCALE = 1.6;
const ITEM_MONEY_THRESHOLD = 5;
const CHAPTER_BGM_PITCH = { 1: 1.0, 2: 1.02, 3: 0.99, 4: 0.96 };
const LATTE_STATE_THRESHOLDS = {
  1: { healthy: 74, weak: 60 },
  2: { healthy: 78, weak: 62 },
  3: { healthy: 82, weak: 64 },
  4: { healthy: 86, weak: 66 },
};
const EMOTE_TRIM_CACHE = new Map();

const state = {
  day: 1,
  timeSlot: 0,
  hp: 65,
  comfort: 50,
  sanity: 70,
  money: 40,
  bond: 45,
  hiddenPoint: 0,
  spoonBest: 0,
  intake: 0,
  dailyIntake: 0,
  todayCommuted: false,
  condition: "Normal",
  ended: false,
  ending: null,
  turnKey: "",
  turnCrisis: null,
  turnRandom: null,
  lastCrisisDay: 0,
  crisisCooldownUntil: 0,
  lastRandomDay: 0,
  dailyEfficiencyBuff: 1,
  systemMessages: [],
  collapseCounts: { hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0, total: 0 },
  sanityCollapseCount: 0,
  bondCollapseCount: 0,
  comfortCollapseCount: 0,
  moneyCollapseCount: 0,
  usedPainkiller: false,
  bondHideTimer: 0,
  sanityBlackoutDay: 0,
  dayStartSnapshot: null,
  pendingSanityBlackout: false,
  pendingComfortCollapseChoice: false,
  pendingMoneyCollapseChoice: false,
  pendingSanityBreakChoice: false,
  sanityBreakEventShown: false,
  _hpWarnShown: false,
  _moneyWarnShown: false,
  _sanityWarnShown: false,
  lastLatteState: null,
  emoteToken: 0,
  emoteTimer: null,
  reactionPending: false,
  reactionToken: 0,
  minigame: { active: false, cleanup: null },
  typing: { active: false, timer: null, fullText: "", target: null, startedAt: 0 },
  sprite: { key: "", status: "healthy", variant: 1, context: null, contextTurns: 0 },
  lastActionContext: null,
  itemCooldowns: { blanket: 0, brush: 0, iv: 0, meds: 0 },
  endingCGKey: null,
  imagePreloaded: { critical: false, ending: false },
  audio: { currentChapter: null, heartbeatPrepared: false, muted: false, startedByUser: false, context: null, masterGain: null, chapterNodes: [], primed: false, lastRecoverAt: 0, stateCueTimer: null },
};

const prologueLines = [
  { text: "12월 24일, 크리스마스 이브.", filter: "sepia(0.9)" },
  { text: "라떼가 갑자기 쓰러졌다. 구토, 탈수, 급격한 체중 감소.", filter: "sepia(0.7)" },
  { text: "긴급 병원 이송. 소세포성 림프종, 말기 신부전.", filter: "sepia(0.5)" },
  { text: "수의사가 말했다. '한 달 정도 남았습니다.'", filter: "sepia(0.3)" },
  { text: "어린 시절, 응급실 복도에서 마지막 숨을 지켜봤다.", filter: "sepia(0.8)" },
  { text: "다시는 후회하지 않겠다고. 이번에는 끝까지 곁에 있겠다고.", filter: "sepia(0.4)" },
  { text: "15년을 함께한 라떼와, 마지막 여정이 시작된다.", filter: "none" },
];

const el = {
  chapterLabel: document.getElementById("chapterLabel"),
  dayLabel: document.getElementById("dayLabel"),
  timeLabel: document.getElementById("timeLabel"),
  hpBar: document.getElementById("hpBar"),
  comfortBar: document.getElementById("comfortBar"),
  sanityBar: document.getElementById("sanityBar"),
  moneyBar: document.getElementById("moneyBar"),
  bondBar: document.getElementById("bondBar"),
  sceneText: document.getElementById("sceneText"),
  statusHint: document.getElementById("statusHint"),
  stageScene: document.getElementById("stageScene"),
  backgroundCue: document.getElementById("backgroundCue"),
  logBody: document.getElementById("logBody"),
  logPanel: document.querySelector(".log-panel"),
  choiceContainer: document.getElementById("choiceContainer"),
  mainArea: document.querySelector(".main-area"),
  latteCard: document.getElementById("latteCard"),
  latteSprite: document.getElementById("latteSprite"),
  catCanvas: document.getElementById("catCanvas"),
  beeSuit: document.getElementById("beeSuit"),
  cakeProp: document.getElementById("cakeProp"),
  bookProp: document.getElementById("bookProp"),
  prologueOverlay: document.getElementById("prologueOverlay"),
  prologueText: document.getElementById("prologueText"),
  prologueNextBtn: document.getElementById("prologueNextBtn"),
  minigameOverlay: document.getElementById("minigameOverlay"),
  minigameTitle: document.getElementById("minigameTitle"),
  minigameDesc: document.getElementById("minigameDesc"),
  minigameBody: document.getElementById("minigameBody"),
  minigameCancelBtn: document.getElementById("minigameCancelBtn"),
  endingOverlay: document.getElementById("endingOverlay"),
  endingTitle: document.getElementById("endingTitle"),
  endingText: document.getElementById("endingText"),
  creditsRoll: document.getElementById("creditsRoll"),
  endingRestartBtn: document.getElementById("endingRestartBtn"),
  cgOverlay: document.getElementById("cgOverlay"),
  cgImage: document.getElementById("cgImage"),
  sceneBg: document.getElementById("sceneBg"),
  emoteEffect: document.getElementById("emoteEffect"),
  itemPanel: document.getElementById("itemPanel"),
  audioToggleBtn: document.getElementById("audioToggleBtn"),
  exportBtn: document.getElementById("exportBtn"),
  restartBtn: document.getElementById("restartBtn"),
};

const catCtx = el.catCanvas.getContext("2d", { alpha: true });
let prologueIndex = 0;
const SAVE_KEY = "latte_prototype_save_v1";
const IMAGE_COUNTS = { healthy: 8, weak: 7, critical: 3 };
const SPRITE_ASSET_VERSION = "20260216-3";
const AUDIO_GRAPH_ENABLED = false;
const ENABLE_OPAQUE_BORDER_BLOCK = false;
const ENABLE_BOXED_BACKGROUND_BLOCK = false;
const BLOCKED_SPRITE_PATHS = new Set();
const blockedSpriteSrc = new Set();
const AUDIO_PATHS = {
  bgm: {
    ch1: "assets/audio/bgm_ch1.mp3",
    ch2: "assets/audio/bgm_ch2.mp3",
    ch3: "assets/audio/bgm_ch3.mp3",
    ch4: "assets/audio/bgm_ch4.mp3",
    ending: "assets/audio/bgm_ending.mp3",
  },
  sfx: {
    heartbeat: "assets/audio/sfx_heartbeat.mp3",
    type: "assets/audio/sfx_typewriter.mp3",
    success: "assets/audio/sfx_success.mp3",
    fail: "assets/audio/sfx_fail.mp3",
  },
};
const raf = (cb) => (window.requestAnimationFrame ? window.requestAnimationFrame(cb) : setTimeout(cb, 16));
const caf = (id) => (window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : clearTimeout(id));
const BG_MAP = {
  0: "bg_living_night.png",
  1: "bg_living_day.png",
  2: "bg_living_day.png",
  3: "bg_window_sunset.png",
  4: "bg_living_night.png",
};
const LATTE_SPRITE_RULES = {
  healthy: {
    default: { 0: "latte_healthy_8.png", 1: "latte_healthy_1.png", 2: "latte_healthy_6.png", 3: "latte_healthy_1.png", 4: "latte_healthy_8.png" },
    contextual: { feeding: "latte_healthy_2.png", playing: "latte_healthy_7.png", grooming: "latte_healthy_4.png", stretching: "latte_healthy_5.png", bonding: "latte_healthy_8.png" },
  },
  weak: {
    default: { 0: "latte_weak_7.png", 1: "latte_weak_1.png", 2: "latte_weak_6.png", 3: "latte_weak_2.png", 4: "latte_weak_2.png" },
    contextual: { feeding: "latte_weak_2.png", forceFeed: "latte_weak_4.png", iv_therapy: "latte_weak_7.png", moving: "latte_weak_5.png", hiding: "latte_weak_6.png" },
  },
  critical: {
    default: { 0: "latte_critical_1.png", 1: "latte_critical_2.png", 2: "latte_critical_1.png", 3: "latte_critical_3.png", 4: "latte_critical_2.png" },
    contextual: {
      blanket: "latte_critical_2.png",
      resting: "latte_critical_3.png",
      feeding: "latte_critical_2.png",
      forceFeed: "latte_critical_3.png",
      iv_therapy: "latte_critical_1.png",
    },
  },
};
const ITEM_DATA = {
  blanket: { id: "blanket", name: "담요", icon: "item_blanket.png", description: "따뜻한 담요로 라떼를 감싸준다.", stars: 1, cost: 2, effect: { comfort: 3, bond: 1 }, latteContext: "blanket", emote: "heart", usableStates: ["healthy", "weak", "critical"], cooldownTurns: 0 },
  brush: { id: "brush", name: "빗", icon: "item_brush.png", description: "부드럽게 빗질해준다.", stars: 2, cost: 4, effect: { bond: 3, comfort: 1 }, latteContext: "grooming", emote: "heart", usableStates: ["healthy", "weak"], cooldownTurns: 0 },
  iv: { id: "iv", name: "수액 세트", icon: "item_iv.png", description: "따뜻하게 데운 피하수액을 놓는다.", stars: 3, cost: 6, effect: { hp: 5, comfort: -1, sanity: -2 }, latteContext: "iv_therapy", emote: null, usableStates: ["weak", "critical"], cooldownTurns: 1 },
  meds: { id: "meds", name: "약", icon: "item_meds.png", description: "처방 약을 먹인다.", stars: 4, cost: 8, effect: { hp: 3, comfort: -2, bond: -1 }, latteContext: "feeding", emote: "stress", usableStates: ["healthy", "weak", "critical"], cooldownTurns: 1 },
};
const ENDING_CG_MAP = { peaceful: "cg_peaceful.png", miracle: "cg_miracle.png", exhaustion: null, regret: null };
const BAD_SPRITE_FILES = new Set(["latte_weak_3.png"]);
const PRELOAD_GROUPS = {
  immediate: ["bg_living_night.png", "latte_healthy_8.png", "emote_heart.png", "emote_stress.png", "item_iv.png"],
  deferred: [
    "bg_living_day.png", "bg_window_sunset.png", "emote_sparkle.png", "item_blanket.png", "item_brush.png", "item_meds.png",
    ...["1", "2", "4", "5", "6", "7", "8"].map((n) => `latte_healthy_${n}.png`),
    ...["1", "2", "3", "4", "5", "6", "7"].map((n) => `latte_weak_${n}.png`),
  ],
  conditional: {
    critical: ["latte_critical_1.png", "latte_critical_2.png", "latte_critical_3.png"],
    ending: ["cg_peaceful.png", "cg_miracle.png"],
  },
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function dayText(day) { return day === GAME_TOTAL_DAYS ? "D-Day" : `D-${GAME_TOTAL_DAYS + 1 - day}`; }
const RESOURCE_KEYS = ["hp", "comfort", "sanity", "money", "bond"];
const COLLAPSE_PRIORITY = ["sanity", "bond", "comfort", "money"];
const PENALTY_THRESHOLDS = { yellow: 30, red: 15 };
const COLLAPSE_RECOVERY = { hp: 30, comfort: 28, sanity: 32, money: 20, bond: 28 };
const SYSTEM_PENALTY_ORDER = ["domino", "collapse", "warnings"];

function getCurrentChapter() {
  if (state.day <= CHAPTER_LENGTH_DAYS) return 1;
  if (state.day <= CHAPTER_LENGTH_DAYS * 2) return 2;
  if (state.day <= CHAPTER_LENGTH_DAYS * 3) return 3;
  return 4;
}

function chapterByDay(day) {
  if (day <= CHAPTER_LENGTH_DAYS) return 1;
  if (day <= CHAPTER_LENGTH_DAYS * 2) return 2;
  if (day <= CHAPTER_LENGTH_DAYS * 3) return 3;
  return 4;
}

function isFreeCareChoice(choice) {
  const label = String(choice?.label || "");
  return /쓰다듬|말\s*걸/.test(label);
}

function scaleActivityDelta(delta) {
  const src = delta || {};
  const out = { hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0 };
  for (const key of RESOURCE_KEYS) {
    const v = Number(src[key] || 0);
    out[key] = Math.round(v * ACTIVITY_SCALE);
  }
  return out;
}

function getScaledItemCost(item) {
  return Math.max(1, Math.round((item?.cost || 0) * ACTIVITY_SCALE));
}

function isDirectCareChoice(choice, slot) {
  if (!choice) return false;
  if (choice.key === "forceFeed") return true;
  if (slot === 0 || slot === 3) return true;
  const label = String(choice.label || "");
  return /수액|급여|브로스|안고|손을 잡고|눈맞춤|숨 고르기|먹이/.test(label);
}

function isHospitalChoice(choice) {
  if (!choice) return false;
  const label = String(choice.label || "");
  return /병원|수의사|응급|통화|약|보조제|이동/.test(label);
}

function distortByLowSanity(text) {
  const source = String(text || "");
  if (!source) return source;
  const parts = source.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length === 0) return `${source} ...`;
  const first = parts[0];
  const tail = parts.slice(1).join(" ");
  return `${first} ${first.replace(/[.!?]$/, "...")} 손이 왜 이러지.\n${tail}`.trim();
}

function deriveActionContext(choice) {
  if (!choice) return null;
  const label = String(choice.label || "");
  if (choice.key === "forceFeed") return "forceFeed";
  if (/급여|브로스|스푼|먹/.test(label)) return "feeding";
  if (/수액/.test(label)) return "iv_therapy";
  if (/안고|눈맞춤|손을 잡고|곁/.test(label)) return "bonding";
  if (/CCTV|관찰|귀가|확인|이동/.test(label)) return "moving";
  if (/휴식|쉰다|침묵/.test(label)) return "resting";
  return null;
}

function setSpriteContext(ctx, turns = 1) {
  if (!ctx) return;
  state.sprite.context = ctx;
  state.sprite.contextTurns = turns;
}

function getItemUsable(itemId) {
  const item = ITEM_DATA[itemId];
  if (!item) return false;
  const latteState = getLatteState(state.hp);
  if (!item.usableStates.includes(latteState)) return false;
  if ((state.itemCooldowns[itemId] || 0) > 0) return false;
  if (state.money <= ITEM_MONEY_THRESHOLD) return false;
  if (state.money < getScaledItemCost(item)) return false;
  return true;
}

function getTrimmedEmoteSrc(emoteKey, src) {
  if (!src) return Promise.resolve(src);
  if (EMOTE_TRIM_CACHE.has(emoteKey)) return Promise.resolve(EMOTE_TRIM_CACHE.get(emoteKey));
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => {
      const w = probe.naturalWidth || probe.width || 0;
      const h = probe.naturalHeight || probe.height || 0;
      if (!w || !h) {
        EMOTE_TRIM_CACHE.set(emoteKey, src);
        resolve(src);
        return;
      }
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        EMOTE_TRIM_CACHE.set(emoteKey, src);
        resolve(src);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(probe, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let minX = w;
      let minY = h;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          const a = data[((y * w) + x) * 4 + 3];
          if (a <= 16) continue;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < minX || maxY < minY) {
        EMOTE_TRIM_CACHE.set(emoteKey, src);
        resolve(src);
        return;
      }
      const pad = 2;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(w - 1, maxX + pad);
      maxY = Math.min(h - 1, maxY + pad);
      const tw = Math.max(1, (maxX - minX + 1));
      const th = Math.max(1, (maxY - minY + 1));
      const tc = document.createElement("canvas");
      tc.width = tw;
      tc.height = th;
      const tctx = tc.getContext("2d");
      if (!tctx) {
        EMOTE_TRIM_CACHE.set(emoteKey, src);
        resolve(src);
        return;
      }
      tctx.clearRect(0, 0, tw, th);
      tctx.drawImage(c, minX, minY, tw, th, 0, 0, tw, th);
      const trimmed = tc.toDataURL("image/png");
      EMOTE_TRIM_CACHE.set(emoteKey, trimmed);
      resolve(trimmed);
    };
    probe.onerror = () => {
      EMOTE_TRIM_CACHE.set(emoteKey, src);
      resolve(src);
    };
    probe.src = src;
  });
}

function triggerEmoteByKey(emoteKey) {
  if (!el.emoteEffect) return;
  const srcMap = {
    heart: "assets/images/emote_heart.png",
    sparkle: "assets/images/emote_sparkle.png",
    stress: "assets/images/emote_stress.png",
  };
  const clsMap = {
    heart: "emote-float-up",
    sparkle: "emote-twinkle",
    stress: "emote-shake",
  };
  const src = srcMap[emoteKey];
  if (!src) return;
  const img = el.emoteEffect;
  const token = (state.emoteToken || 0) + 1;
  state.emoteToken = token;
  if (state.emoteTimer) {
    clearTimeout(state.emoteTimer);
    state.emoteTimer = null;
  }

  const reveal = () => {
    if (!el.emoteEffect || token !== state.emoteToken) return;
    if (!positionEmoteAboveLatteHead()) return;
    img.classList.remove("hidden", "emote-float-up", "emote-twinkle", "emote-shake");
    img.classList.add(clsMap[emoteKey] || "emote-float-up");
    state.emoteTimer = setTimeout(() => {
      if (!el.emoteEffect || token !== state.emoteToken) return;
      img.classList.add("hidden");
      img.classList.remove("emote-float-up", "emote-twinkle", "emote-shake");
      state.emoteTimer = null;
    }, emoteKey === "sparkle" ? 2000 : 1500);
  };

  img.classList.add("hidden");
  img.classList.remove("emote-float-up", "emote-twinkle", "emote-shake");
  img.onload = () => {
    if (token !== state.emoteToken) return;
    reveal();
  };
  img.onerror = () => {
    if (token !== state.emoteToken) return;
    img.classList.add("hidden");
    img.classList.remove("emote-float-up", "emote-twinkle", "emote-shake");
  };
  getTrimmedEmoteSrc(emoteKey, src).then((resolvedSrc) => {
    if (token !== state.emoteToken) return;
    img.src = resolvedSrc || src;
    if (img.complete && img.naturalWidth > 0) reveal();
  });
}

function positionEmoteAboveLatteHead() {
  if (!el.emoteEffect || !el.latteSprite || !el.stageScene) return false;
  if (el.latteSprite.hidden) return false;
  const spriteRect = el.latteSprite.getBoundingClientRect();
  const sceneRect = el.stageScene.getBoundingClientRect();
  if (!spriteRect.width || !spriteRect.height || !sceneRect.width || !sceneRect.height) return false;
  const headX = (spriteRect.left - sceneRect.left) + (spriteRect.width * 0.5);
  const headY = (spriteRect.top - sceneRect.top) + (spriteRect.height * 0.03);
  el.emoteEffect.style.left = `${Math.round(headX)}px`;
  el.emoteEffect.style.top = `${Math.round(headY)}px`;
  return true;
}

function resolveActionEmote(delta, scene, actionContext) {
  if ((delta.bond || 0) >= 2 || actionContext === "bonding" || actionContext === "grooming") return "heart";
  if ((delta.comfort || 0) >= 3 || getCurrentChapter() === 3) return "sparkle";
  if ((delta.sanity || 0) <= -3 || actionContext === "forceFeed" || (scene && scene.isCrisis)) return "stress";
  // [피드백 강화] 어떤 선택이든 반드시 이모트 표시
  if ((delta.bond || 0) >= 1 || (delta.comfort || 0) >= 1) return "heart";
  if ((delta.hp || 0) >= 2) return "sparkle";
  if ((delta.sanity || 0) <= -1 || (delta.comfort || 0) <= -1) return "stress";
  // 다른 분류에 해당되지 않는 중립 선택에도 sparkle
  return "sparkle";
}

function triggerStageFeedback(delta, scene, actionContext) {
  const stage = el.stageScene;
  if (!stage) return;
  // 긍정 선택: 밝은 플래시 + 하트 FX
  const netPositive = (delta.hp || 0) + (delta.comfort || 0) + (delta.bond || 0);
  const netNegative = Math.abs(Math.min(0, delta.sanity || 0)) + Math.abs(Math.min(0, delta.comfort || 0)) + Math.abs(Math.min(0, delta.bond || 0));
  const isCrisis = scene && scene.isCrisis;
  if (netPositive >= 4 && !isCrisis) {
    // 긍정: 밝은 플래시 + 하트
    stage.classList.add("stage-flash-positive");
    setTimeout(() => stage.classList.remove("stage-flash-positive"), 500);
    triggerHeartFX(3);
  } else if (isCrisis || netNegative >= 4 || actionContext === "forceFeed") {
    // 부정: 흔들림
    stage.classList.add("stage-shake-negative");
    setTimeout(() => stage.classList.remove("stage-shake-negative"), 400);
  } else {
    // 중립: 아주 약한 펌스
    stage.classList.add("stage-pulse-neutral");
    setTimeout(() => stage.classList.remove("stage-pulse-neutral"), 350);
  }
}

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
    const icon = document.createElement("img");
    icon.src = `assets/images/${item.icon}`;
    icon.alt = item.name;
    icon.className = "item-icon";
    const label = document.createElement("span");
    label.className = "item-label";
    label.textContent = item.name;
    const scaledCost = getScaledItemCost(item);
    const costEl = document.createElement("span");
    costEl.className = "item-cost";
    costEl.textContent = `-${scaledCost}\uD83D\uDCB0`;
    btn.appendChild(icon);
    btn.appendChild(label);
    btn.appendChild(costEl);
    const cd = state.itemCooldowns[itemId] || 0;
    let reason = item.description;
    if (!item.usableStates.includes(latteState)) {
      reason = `상태 제한 (${latteState})`;
    } else if (cd > 0) {
      reason = `쿨다운 ${cd}턴`;
    } else if (state.money <= ITEM_MONEY_THRESHOLD) {
      reason = `돈 부족 (${state.money} \u2264 ${ITEM_MONEY_THRESHOLD})`;
    } else if (state.money < scaledCost) {
      reason = `돈 부족 (필요: ${scaledCost}, 보유: ${state.money})`;
    }
    btn.title = reason;
    btn.disabled = !usable;
    btn.onclick = () => useItem(itemId);
    el.itemPanel.appendChild(btn);
  }
  if (state.money <= ITEM_MONEY_THRESHOLD) {
    el.itemPanel.classList.add("money-warning");
  } else {
    el.itemPanel.classList.remove("money-warning");
  }
}

function useItem(itemId) {
  if (state.ended || state.minigame.active || state.reactionPending) return;
  const item = ITEM_DATA[itemId];
  if (!item || !getItemUsable(itemId)) return;
  // [피드백] 클릭 즉시 시각+청각 반응
  playSFX("type");
  const btnEl = el.itemPanel && el.itemPanel.querySelector(`.item-btn:not(.disabled)[title*="${item.name}"]`);
  if (btnEl) {
    btnEl.classList.add("item-btn-pressed");
    setTimeout(() => btnEl.classList.remove("item-btn-pressed"), 200);
  }
  const scaledCost = getScaledItemCost(item);
  state.money -= scaledCost;
  applyResourceClamp();
  const delta = scaleActivityDelta({ hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0, ...item.effect });
  applyDelta(delta);
  state.lastActionContext = item.latteContext;
  setSpriteContext(item.latteContext, 1);
  if (item.emote) triggerEmoteByKey(item.emote);
  const emote = resolveActionEmote(delta, null, item.latteContext);
  if (emote && !item.emote) triggerEmoteByKey(emote);
  state.itemCooldowns[itemId] = Math.max(0, item.cooldownTurns || 0);

  addLogRow({
    date: dayText(state.day),
    time: TIME_NAMES[state.timeSlot],
    hp: state.hp,
    comfort: state.comfort,
    intake: state.intake,
    note: `[아이템] ${item.name} (${"\u2605".repeat(item.stars)} / -${scaledCost}\uD83D\uDCB0)`,
  });
  const reaction = `${item.name} 사용 (${"\u2605".repeat(item.stars)}): ${item.description}`;
  showReaction(reaction, () => advanceTurn());
}

function resolveEndingCG(ending) {
  if (!ending || !ending.code) return null;
  if (ending.code === "Hidden" || ending.code === "A") return ENDING_CG_MAP.miracle;
  if (ending.code === "C") return ENDING_CG_MAP.peaceful;
  return null;
}

function showEndingCG(cgFile, callback) {
  if (!cgFile || !el.cgOverlay || !el.cgImage) {
    if (callback) callback();
    return;
  }
  el.cgImage.src = `assets/images/${cgFile}`;
  el.cgOverlay.classList.remove("hidden", "fade-out");
  el.cgOverlay.classList.add("active");
  setTimeout(() => {
    if (callback) callback();
  }, 2000);
}

function hideEndingCG() {
  if (!el.cgOverlay) return;
  el.cgOverlay.classList.add("fade-out");
  setTimeout(() => {
    if (!el.cgOverlay) return;
    el.cgOverlay.classList.remove("active", "fade-out");
    el.cgOverlay.classList.add("hidden");
  }, 400);
}

function getEventForDay(day, slot) {
  const chapter = chapterByDay(day);
  const base = EVENTS[chapter].find((e) => e.slot === slot) || EVENTS[chapter][0];
  const dayKey = `${day}-${slot}`;
  const override = DAY_TEXTS[dayKey];
  const variantKey = `${chapter}-${slot}`;
  const variants = SLOT_VARIANTS[variantKey];
  let variantText = null;
  if (variants && !override) {
    const chapterStartDay = (chapter - 1) * CHAPTER_LENGTH_DAYS + 1;
    const dayInChapter = day - chapterStartDay;
    variantText = variants[dayInChapter % variants.length];
  }
  const scene = {
    cue: override?.cue || base.cue,
    text: override?.text || variantText || base.text,
    choices: base.choices.map((c) => ({ ...c, delta: { ...c.delta } })),
    accessories: {
      bee: chapter === 3,
      cake: state.spoonBest >= 19,
      book: chapter >= 3 && slot === 4,
    },
  };
  if (state.comfort <= 15 && slot === 4) {
    scene.text = "일지를 쓸 수가 없다. 라떼의 울음이 멈추지 않는다.";
  }
  if (state.sanity <= 30) {
    const innerLines = [
      "머리가 무겁다. 글씨가 흐릿하게 보인다.",
      "손끝이 떨린다. 지금 내가 제대로 하고 있는 건지.",
      "잠을 못 잔 지 며칠째인지 기억이 안 난다.",
      "라떼를 보는데 초점이 안 맞는다.",
    ];
    const line = innerLines[(state.day + state.timeSlot) % innerLines.length];
    scene.text = `${line}\n${scene.text}`;
  }
  if (state.sanity <= 15) {
    scene.text = distortByLowSanity(scene.text);
  }
  if (day === GAME_TOTAL_DAYS && slot >= 2 && !override) scene.cue = "CCTV 알림 점멸";
  if (state.money <= 0) {
    scene.choices = scene.choices.map((c) => {
      if (isFreeCareChoice(c)) return { ...c, locked: false, lockReason: undefined };
      if (isHospitalChoice(c)) return { ...c, locked: true, lockReason: "돈 고갈로 병원 선택지 잠김" };
      const next = { ...c, delta: { ...c.delta } };
      if (next.key === "commute") next.delta.money = (next.delta.money || 0) + 3;
      if (next.delta.money < -2) return { ...next, locked: true, lockReason: "돈 부족" };
      return next;
    });
  }
  if (state.sanity <= 30 && slot === 1) {
    scene.choices = scene.choices.map((c) => c.key === "commute" ? { ...c, locked: true } : c);
  }
  if (state.bond <= 15) {
    scene.choices = scene.choices.map((c) => c.key === "forceFeed" ? { ...c, locked: true, lockReason: "관계 붕괴로 강제 급여 불가" } : c);
  }
  if (state.bondHideTimer > 0) {
    scene.choices = scene.choices.map((c) => (
      isDirectCareChoice(c, slot) ? { ...c, locked: true, lockReason: "라떼가 거리를 두는 중" } : c
    ));
  }
  return scene;
}

function checkCrisisEvent(day, slot) {
  const crisis = CRISIS_EVENTS.find((e) => e.day.includes(day) && e.slot === slot);
  if (!crisis) return null;
  if (state.lastCrisisDay === day) return null;
  if (day < state.crisisCooldownUntil) return null;
  const chance = typeof crisis.chance === "number" ? clamp(crisis.chance, 0, 1) : 0.5;
  const chanceWithCooldown = state.lastCrisisDay === day - 1 ? chance * 0.4 : chance;
  const daysSinceCrisis = state.lastCrisisDay > 0 ? day - state.lastCrisisDay : day;
  const droughtBoost = daysSinceCrisis >= 8 ? 0.4 : daysSinceCrisis >= 6 ? 0.28 : daysSinceCrisis >= 5 ? 0.16 : 0;
  const tunedChance = clamp(chanceWithCooldown + droughtBoost, 0, 0.95);
  if (Math.random() > tunedChance) return null;
  return {
    cue: crisis.cue,
    text: crisis.text,
    choices: crisis.choices.map((c) => ({ ...c, delta: { ...c.delta } })),
    accessories: { bee: false, cake: false, book: false },
    isCrisis: true,
  };
}

function checkRandomDawnEvent(day, slot) {
  if (slot !== 0) return null;
  if (state.lastRandomDay === day) return null;
  if (Math.random() > 0.15) return null;
  const picked = RANDOM_DAWN_EVENTS[Math.floor(Math.random() * RANDOM_DAWN_EVENTS.length)];
  if (!picked) return null;
  state.lastRandomDay = day;
  return {
    cue: picked.cue,
    text: picked.text,
    choices: picked.choices.map((c) => ({ ...c, delta: { ...c.delta } })),
    accessories: { bee: false, cake: false, book: false },
    isRandomDawn: true,
  };
}

function getSceneForCurrentTurn() {
  if (state.pendingSanityBreakChoice) {
    return {
      cue: "멈춤",
      text: "숟가락을 들고 있는데 손이 멈췄다. 몸이 더 이상 움직이지 않는다.\n라떼가 올려다본다. 그 눈에 내 모습이 비친다.",
      choices: [
        { label: "잠시 쉰다", key: "sanity_break_rest", delta: { hp: 0, comfort: -3, sanity: 10, money: 0, bond: 0 } },
        { label: "울면서라도 계속한다", key: "sanity_break_push", delta: { hp: 0, comfort: 0, sanity: 3, money: 0, bond: 2 } },
      ],
      accessories: { bee: false, cake: false, book: false },
      isForcedSanityBreak: true,
    };
  }
  if (state.pendingComfortCollapseChoice) {
    return {
      cue: "한계",
      text: "라떼의 고통이 한계를 넘었다.\n수의사가 말한다. '진통제를 쓸 수 있습니다. 다만 의식이 흐려질 수 있어요.'",
      choices: [
        { label: "진통제를 쓴다", key: "painkiller_yes", delta: { hp: -5, comfort: 25, sanity: 0, money: -1, bond: -5 } },
        { label: "자연 회복을 기다린다", key: "painkiller_no", delta: { hp: 0, comfort: 5, sanity: 0, money: 0, bond: 3 } },
      ],
      accessories: { bee: false, cake: false, book: false },
      isForcedComfortCollapse: true,
    };
  }
  if (state.pendingMoneyCollapseChoice) {
    return {
      cue: "전화벨",
      text: "도움을 요청하는 전화를 건다.\n'미안한데... 이번 달만...'\n수화기 너머 잠깐의 침묵이 길게 느껴진다.",
      choices: [
        { label: "도움을 받는다", key: "money_help_yes", delta: { hp: 0, comfort: 0, sanity: -5, money: 20, bond: 1 } },
        { label: "됐어, 괜찮아", key: "money_help_no", delta: { hp: 0, comfort: 0, sanity: -3, money: 0, bond: 2 } },
      ],
      accessories: { bee: false, cake: false, book: false },
      isForcedMoneyCollapse: true,
    };
  }
  const key = `${state.day}-${state.timeSlot}`;
  if (state.turnKey !== key) {
    state.turnKey = key;
    state.turnRandom = checkRandomDawnEvent(state.day, state.timeSlot);
    state.turnCrisis = checkCrisisEvent(state.day, state.timeSlot);
  }
  return state.turnRandom || state.turnCrisis || getEventForDay(state.day, state.timeSlot);
}

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

  el.stageScene.className = `stage-scene ${CHAPTER_META[getCurrentChapter()].stage}`;
  updateSceneBackground(slot);
}

function updateSceneBackground(slot) {
  if (!el.sceneBg) return;
  const file = BG_MAP[slot] || BG_MAP[4];
  el.sceneBg.style.opacity = "0.2";
  el.sceneBg.style.backgroundImage = `url("assets/images/${file}")`;
  requestAnimationFrame(() => {
    if (!el.sceneBg) return;
    el.sceneBg.style.opacity = "1";
  });
}

function updateCondition() {
  const latteState = getLatteState(state.hp);
  if (!state.lastLatteState) {
    state.lastLatteState = latteState;
  } else if (!state.ended && state.lastLatteState !== latteState) {
    triggerLatteStateTransitionFeedback(state.lastLatteState, latteState);
    updateCatSprite(true);
    state.lastLatteState = latteState;
  }

  if (!state.ended) {
    if (latteState === "critical") state.condition = "Critical";
    else if (latteState === "weak" || state.sanity <= 35) state.condition = "Sick";
    else if (state.comfort >= 70) state.condition = "Comfort";
    else state.condition = "Normal";
  }
  if (latteState === "critical" && !state.imagePreloaded.critical) {
    state.imagePreloaded.critical = true;
    preloadImages(PRELOAD_GROUPS.conditional.critical);
  }
}

function drawPixelRect(x, y, w, h, color) {
  catCtx.fillStyle = color;
  catCtx.fillRect(x, y, w, h);
}

function drawFallbackPixelCat() {
  const px = 8;
  catCtx.clearRect(0, 0, el.catCanvas.width, el.catCanvas.height);

  const c = state.condition;
  const main = "#F39C12";
  const stripe = "#D35400";
  const light = "#f9c977";
  const eye = "#2d241b";

  drawPixelRect(11 * px, 8 * px, 4 * px, 2 * px, light);
  drawPixelRect(25 * px, 8 * px, 4 * px, 2 * px, light);
  drawPixelRect(10 * px, 10 * px, 20 * px, 14 * px, main);

  if (c === "Normal" || c === "Comfort") {
    drawPixelRect(10 * px, 22 * px, 20 * px, 12 * px, main);
    drawPixelRect(8 * px, 30 * px, 24 * px, 6 * px, main);
    drawPixelRect(30 * px, 28 * px, 4 * px, 2 * px, stripe);
  }
  if (c === "Sick") {
    drawPixelRect(8 * px, 24 * px, 24 * px, 10 * px, main);
    drawPixelRect(8 * px, 32 * px, 24 * px, 4 * px, main);
  }
  if (c === "Critical") {
    drawPixelRect(7 * px, 26 * px, 26 * px, 8 * px, main);
    drawPixelRect(9 * px, 34 * px, 20 * px, 3 * px, main);
    const breath = Math.floor(Date.now() / 220) % 2;
    drawPixelRect(29 * px, (33 + breath) * px, 3 * px, 2 * px, light);
  }

  drawPixelRect(12 * px, 15 * px, 3 * px, 2 * px, stripe);
  drawPixelRect(17 * px, 15 * px, 3 * px, 2 * px, stripe);
  drawPixelRect(22 * px, 15 * px, 3 * px, 2 * px, stripe);

  if (c === "Sick") {
    drawPixelRect(14 * px, 18 * px, 2 * px, 1 * px, eye);
    drawPixelRect(24 * px, 18 * px, 2 * px, 1 * px, eye);
  } else {
    drawPixelRect(14 * px, 17 * px, 2 * px, 2 * px, eye);
    drawPixelRect(24 * px, 17 * px, 2 * px, 2 * px, eye);
  }
}

function getLatteState(hp) {
  const ch = getCurrentChapter();
  const thresholds = LATTE_STATE_THRESHOLDS[ch] || LATTE_STATE_THRESHOLDS[4];
  const healthyThreshold = thresholds.healthy;
  const weakThreshold = thresholds.weak;
  if (hp > healthyThreshold) return "healthy";
  if (hp > weakThreshold) return "weak";
  return "critical";
}

function showStateShiftNotice(text, level = "warn") {
  if (!el.stageScene) return;
  const stale = el.stageScene.querySelector(".state-shift-overlay");
  if (stale) stale.remove();
  const node = document.createElement("div");
  node.className = `state-shift-overlay level-${level}`;
  node.textContent = text;
  el.stageScene.appendChild(node);
  requestAnimationFrame(() => node.classList.add("visible"));
  setTimeout(() => {
    node.classList.remove("visible");
    node.classList.add("fade-out");
    setTimeout(() => node.remove(), 320);
  }, 1250);
}

function triggerLatteStateTransitionFeedback(fromState, toState) {
  if (!el.stageScene || !fromState || fromState === toState) return;
  const stage = el.stageScene;
  if (toState === "critical") {
    triggerStateAudioCue("critical");
    stage.classList.add("stage-critical-alert");
    setTimeout(() => stage.classList.remove("stage-critical-alert"), 900);
    triggerEmoteByKey("stress");
    showStateShiftNotice("위기 상태: 라떼가 크게 약해졌다.", "danger");
    return;
  }
  if (toState === "weak") {
    triggerStateAudioCue("weak");
    stage.classList.add("stage-weak-alert");
    setTimeout(() => stage.classList.remove("stage-weak-alert"), 700);
    triggerEmoteByKey("stress");
    showStateShiftNotice("주의 상태: 라떼 컨디션이 내려갔다.", "warn");
    return;
  }
  if (toState === "healthy") {
    triggerStateAudioCue("healthy");
    stage.classList.add("stage-flash-positive");
    setTimeout(() => stage.classList.remove("stage-flash-positive"), 500);
    triggerEmoteByKey("heart");
    showStateShiftNotice("안정 상태: 라떼가 조금 나아 보인다.", "safe");
  }
}

function getRenderableImageStatus(status) {
  if (status === "healthy" || status === "weak" || status === "critical") return status;
  return getLatteState(state.hp);
}

function getImageStatusByCondition() {
  return getLatteState(state.hp);
}

function buildLatteImagePath(status, variant) {
  return `assets/images/latte_${status}_${variant}.png`;
}

function chooseLatteSpriteFile() {
  const stateKey = getLatteState(state.hp);
  const rules = LATTE_SPRITE_RULES[stateKey] || LATTE_SPRITE_RULES.weak;
  const ctx = state.sprite.context || null;
  let file = null;
  if (ctx && rules.contextual && rules.contextual[ctx]) file = rules.contextual[ctx];
  if (!file) file = rules.default[state.timeSlot] || rules.default[4];
  if (BAD_SPRITE_FILES.has(file)) {
    if (stateKey === "weak") return "latte_weak_2.png";
    return rules.default[1] || file;
  }
  return file;
}

function getFallbackSpriteFileForState() {
  const s = getLatteState(state.hp);
  if (s === "critical") return "latte_critical_1.png";
  if (s === "weak") return "latte_weak_1.png";
  return "latte_healthy_1.png";
}

function getFallbackSpriteFileFromTarget(targetSrc) {
  const t = String(targetSrc || "");
  if (t.includes("latte_critical_")) return "latte_critical_1.png";
  if (t.includes("latte_weak_")) return "latte_weak_1.png";
  if (t.includes("latte_healthy_")) return "latte_healthy_1.png";
  return getFallbackSpriteFileForState();
}

function toSpriteAssetUrl(path) {
  if (!path) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${SPRITE_ASSET_VERSION}`;
}

function preloadImages(filenames) {
  const files = Array.isArray(filenames) ? filenames : [];
  return Promise.all(files.map((file) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `assets/images/${file}`;
  })));
}

async function initImageResources() {
  await preloadImages(PRELOAD_GROUPS.immediate);
  preloadImages(PRELOAD_GROUPS.deferred);
}

function normalizeSpriteSrc(src) {
  if (!src) return "";
  const s = String(src).replace(/\\/g, "/").replace(/[?#].*$/, "");
  const marker = "assets/images/";
  const i = s.lastIndexOf(marker);
  if (i >= 0) return s.slice(i);
  return s;
}

function hasOpaqueBorderBackground(imgEl) {
  const w = imgEl.naturalWidth || imgEl.width || 0;
  const h = imgEl.naturalHeight || imgEl.height || 0;
  if (!w || !h) return false;

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(imgEl, 0, 0, w, h);

  const margin = Math.max(2, Math.floor(Math.min(w, h) * 0.03));
  const step = Math.max(8, Math.floor(Math.min(w, h) / 20));
  let total = 0;
  let opaque = 0;
  const sample = (x, y) => {
    const a = ctx.getImageData(x, y, 1, 1).data[3];
    total += 1;
    if (a > 245) opaque += 1;
  };

  for (let x = margin; x < w - margin; x += step) {
    sample(x, margin);
    sample(x, h - margin - 1);
  }
  for (let y = margin; y < h - margin; y += step) {
    sample(margin, y);
    sample(w - margin - 1, y);
  }
  if (!total) return false;
  return (opaque / total) >= 0.9;
}

function hasBoxedFillBackground(imgEl) {
  const w = imgEl.naturalWidth || imgEl.width || 0;
  const h = imgEl.naturalHeight || imgEl.height || 0;
  if (!w || !h) return false;

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(imgEl, 0, 0, w, h);

  const ringInset = 0.15;
  const step = Math.max(8, Math.floor(Math.min(w, h) / 64));
  let ringTotal = 0;
  let ringOpaque = 0;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const inRing = x < (w * ringInset) || x > (w * (1 - ringInset)) || y < (h * ringInset) || y > (h * (1 - ringInset));
      if (!inRing) continue;
      ringTotal += 1;
      const a = ctx.getImageData(x, y, 1, 1).data[3];
      if (a > 16) ringOpaque += 1;
    }
  }

  if (!ringTotal) return false;
  return (ringOpaque / ringTotal) >= 0.33;
}

function showFallbackSprite() {
  // Legacy canvas fallback is intentionally disabled.
  // Keep PNG sprite path only to avoid prototype art flashes.
  if (el.catCanvas) el.catCanvas.hidden = true;
  if (el.latteSprite) el.latteSprite.hidden = false;
}

function showImageSprite() {
  if (el.latteSprite) el.latteSprite.hidden = false;
  if (el.catCanvas) el.catCanvas.hidden = true;
}

function resolveLoadedSpriteVisibility() {
  if (!el.latteSprite) return;
  const img = el.latteSprite;
  const src = normalizeSpriteSrc(img.getAttribute("data-src") || img.src || "");
  if (!src || (img.naturalWidth || 0) <= 0) {
    const fallbackSrc = `assets/images/${getFallbackSpriteFileFromTarget(src)}`;
    if (img.getAttribute("data-src") !== fallbackSrc) {
      img.setAttribute("data-src", fallbackSrc);
      img.src = toSpriteAssetUrl(fallbackSrc);
      return;
    }
    showFallbackSprite();
    return;
  }
  showImageSprite();
}

function updateCatSprite(forceRandom = false) {
  const status = getRenderableImageStatus(getImageStatusByCondition());
  const spriteFile = chooseLatteSpriteFile();
  const sceneKey = `${state.day}-${state.timeSlot}-${status}-${spriteFile}-${state.ended ? "end" : "play"}`;
  if (forceRandom || state.sprite.key !== sceneKey) {
    state.sprite.key = sceneKey;
    state.sprite.status = status;
  }
  const src = `assets/images/${spriteFile}`;
  if (el.latteSprite) {
    if (el.latteSprite.getAttribute("data-src") !== src) {
      // Keep current PNG sprite while loading the next one.
      el.latteSprite.setAttribute("data-src", src);
      el.latteSprite.src = toSpriteAssetUrl(src);
    }
    // If the image is already cached, `load` may not fire again in some browsers.
    // Run the same visibility validation path immediately.
    if (el.latteSprite.complete) {
      if (el.latteSprite.naturalWidth > 0) {
        resolveLoadedSpriteVisibility();
      } else {
        showFallbackSprite();
      }
    }
  } else {
    drawFallbackPixelCat();
  }
  if (el.emoteEffect && !el.emoteEffect.classList.contains("hidden")) {
    positionEmoteAboveLatteHead();
  }
  if (state.sprite.contextTurns > 0) state.sprite.contextTurns -= 1;
  if (state.sprite.contextTurns <= 0) state.sprite.context = null;
}

function updateBar(bar, value, maxValue = 100) {
  const percent = clamp((value / maxValue) * 100, 0, 100);
  bar.style.width = `${percent}%`;
  bar.classList.remove("warn", "danger");
  if (percent < 30) bar.classList.add("danger");
  else if (percent < 70) bar.classList.add("warn");
}

function updateStatsUI() {
  el.chapterLabel.textContent = CHAPTER_META[getCurrentChapter()].name;
  el.dayLabel.textContent = dayText(state.day);
  el.timeLabel.textContent = TIME_NAMES[state.timeSlot];

  updateBar(el.hpBar, state.hp);
  updateBar(el.comfortBar, state.comfort);
  updateBar(el.sanityBar, state.sanity);
  updateBar(el.moneyBar, state.money, 150);
  updateBar(el.bondBar, state.bond);
  const hpVal = document.getElementById("hpValue");
  const comfortVal = document.getElementById("comfortValue");
  const sanityVal = document.getElementById("sanityValue");
  const moneyVal = document.getElementById("moneyValue");
  const bondVal = document.getElementById("bondValue");
  if (hpVal) hpVal.textContent = String(Math.round(state.hp));
  if (comfortVal) comfortVal.textContent = String(Math.round(state.comfort));
  if (sanityVal) sanityVal.textContent = String(Math.round(state.sanity));
  if (moneyVal) moneyVal.textContent = String(Math.round(state.money));
  if (bondVal) bondVal.textContent = String(Math.round(state.bond));

  const hints = [`상태: ${state.condition}`];
  hints.push(`스프라이트: ${getLatteState(state.hp)}`);
  if (state.dailyEfficiencyBuff > 1) hints.push(`돌발 버프 x${state.dailyEfficiencyBuff.toFixed(1)}`);
  if (state.crisisCooldownUntil > state.day) hints.push(`위기 휴지기 D-${state.crisisCooldownUntil - state.day}`);
  if (state.bondHideTimer > 0) hints.push(`관계 Collapse 여파: 직접 돌봄 제한 ${state.bondHideTimer}턴`);
  if (state.collapseCounts.total > 0) hints.push(`붕괴 x${state.collapseCounts.total}`);
  const dangerOrder = ["sanity", "bond", "comfort", "money"];
  const labels = { sanity: "멘탈", bond: "관계", comfort: "편안함", money: "돈" };  // 통일: 자금→돈, 유대→관계
  const topDanger = dangerOrder.find((k) => state[k] <= PENALTY_THRESHOLDS.red);
  if (topDanger) hints.push(`우선 회복: ${labels[topDanger]}`);
  if (state.sanity <= 30) hints.push("멘탈 저하: 오전 출근 선택 잠김");
  if (state.spoonBest > 0) hints.push(`최고 스푼: ${state.spoonBest}`);
  el.statusHint.textContent = hints.join(" | ");

  const critical = state.hp <= 25;
  el.mainArea.classList.toggle("pain-shake", critical);
  const hpDanger = clamp((30 - state.hp) / 30, 0, 1);
  const sanityDanger = clamp((35 - state.sanity) / 35, 0, 1);
  const vignetteAlpha = Math.max(hpDanger * 0.45, sanityDanger * 0.25);
  const noiseAlpha = Math.max(hpDanger * 0.2, sanityDanger * 0.1);
  document.documentElement.style.setProperty("--vignette-alpha", vignetteAlpha.toFixed(3));
  document.documentElement.style.setProperty("--noise-alpha", noiseAlpha.toFixed(3));
}

function addLogRow({ date, time, hp, comfort, intake, note }) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${date}</td><td>${time}</td><td>${hp}</td><td>${comfort}</td><td>${intake}</td><td>${note}</td>`;
  row.classList.add("flash-row");
  el.logBody.appendChild(row);
  for (const cell of row.querySelectorAll("td")) {
    cell.classList.add("highlight-cell");
    setTimeout(() => cell.classList.remove("highlight-cell"), 700);
  }
  if (el.logPanel) {
    el.logPanel.scrollTop = el.logPanel.scrollHeight;
  }
}

function typeText(target, text, speed = 30) {
  if (state.typing.timer) clearInterval(state.typing.timer);
  state.typing = { active: true, timer: null, fullText: text, target };
  state.typing.startedAt = Date.now();
  target.textContent = "";
  let idx = 0;
  const tickSpeed = Math.max(12, Math.round(speed / 1.5));
  state.typing.timer = setInterval(() => {
    idx += 1;
    target.textContent = text.slice(0, idx);
    playTypeTick();
    if (idx >= text.length) {
      clearInterval(state.typing.timer);
      state.typing.active = false;
      state.typing.timer = null;
    }
  }, tickSpeed);
}

function skipTypingIfNeeded() {
  if (!state.typing.active || !state.typing.target) return;
  if (Date.now() - state.typing.startedAt < 80) return;
  clearInterval(state.typing.timer);
  state.typing.target.textContent = state.typing.fullText;
  state.typing.active = false;
  state.typing.timer = null;
}

function triggerHeartFX(count = 6) {
  if (!el.latteCard) return;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.textContent = "♥";
    const spread = 16 + Math.random() * 34;
    const angle = (-Math.PI / 2) + ((Math.random() - 0.5) * 0.9);
    heart.style.setProperty("--hx", `${Math.cos(angle) * spread}px`);
    heart.style.setProperty("--hy", `${-18 - Math.sin(angle) * spread}px`);
    el.latteCard.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    setTimeout(() => heart.remove(), 960);
  }
}

function triggerPerfectFX() {
  playSFX("success");
  const app = document.getElementById("app");
  app.classList.add("flash-screen");
  setTimeout(() => app.classList.remove("flash-screen"), 100);
  triggerHeartFX(8);

  for (const stale of el.latteCard.querySelectorAll(".spark, .perfect-text")) {
    stale.remove();
  }

  const label = document.createElement("div");
  label.className = "perfect-text";
  label.textContent = "Perfect!";
  el.latteCard.appendChild(label);
  setTimeout(() => label.remove(), 900);

  for (let i = 0; i < 12; i += 1) {
    const spark = document.createElement("div");
    spark.className = "spark";
    const angle = (Math.PI * 2 * i) / 12;
    const dist = 20 + Math.random() * 30;
    spark.style.setProperty("--dx", String(Math.cos(angle) * dist));
    spark.style.setProperty("--dy", String(Math.sin(angle) * dist));
    spark.style.left = "50%";
    spark.style.top = "50%";
    el.latteCard.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
    setTimeout(() => spark.remove(), 820);
  }
}

function createLoopAudio(src, volume = 0.5) {
  const a = new Audio(src);
  a.loop = true;
  a.preload = "auto";
  a.volume = volume;
  return a;
}

function createSfxAudio(src, volume = 0.45) {
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = volume;
  return a;
}

function waitAudioReady(audio, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("error", onError);
      clearTimeout(timer);
      resolve(ok);
    };
    const onReady = () => finish(true);
    const onError = () => finish(false);
    const timer = setTimeout(() => finish(false), timeoutMs);
    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("loadedmetadata", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
    try { audio.load(); } catch (_) { finish(false); }
  });
}

function initAudioEngine() {
  if (state.audio.bgmTracks && state.audio.bgmTracks.ch1) return;
  state.audio.bgmTracks = {
    ch1: createLoopAudio(AUDIO_PATHS.bgm.ch1, 0),
    ch2: createLoopAudio(AUDIO_PATHS.bgm.ch2, 0),
    ch3: createLoopAudio(AUDIO_PATHS.bgm.ch3, 0),
    ch4: createLoopAudio(AUDIO_PATHS.bgm.ch4, 0),
    ending: createLoopAudio(AUDIO_PATHS.bgm.ending, 0),
  };
  state.audio.heartbeat = createLoopAudio(AUDIO_PATHS.sfx.heartbeat, 0);
  state.audio.sfx = {
    type: createSfxAudio(AUDIO_PATHS.sfx.type, 0.5),
    success: createSfxAudio(AUDIO_PATHS.sfx.success, 0.6),
    fail: createSfxAudio(AUDIO_PATHS.sfx.fail, 0.65),
    hover: createSfxAudio(AUDIO_PATHS.sfx.type, 0.2),
  };
}

async function preloadAudioEngine() {
  initAudioEngine();
  if (state.audio.preloaded) return;
  const tracks = [
    ...(Object.values(state.audio.bgmTracks || {})),
    state.audio.heartbeat,
    ...(Object.values(state.audio.sfx || {})),
  ].filter(Boolean);
  await Promise.all(tracks.map((a) => waitAudioReady(a)));
  state.audio.preloaded = true;
}

function ensureAudioGraph() {
  if (!AUDIO_GRAPH_ENABLED) return;
  if (state.audio.graphReady) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = state.audio.context || new Ctx();
  const lowPass = ctx.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.value = 18000;
  const master = ctx.createGain();
  master.gain.value = 1;
  lowPass.connect(master);
  master.connect(ctx.destination);
  state.audio.context = ctx;
  state.audio.lowPass = lowPass;
  state.audio.masterGain = master;
  state.audio.graphReady = true;

  for (const track of Object.values(state.audio.bgmTracks || {})) {
    try {
      const src = ctx.createMediaElementSource(track);
      src.connect(lowPass);
    } catch (_) { }
  }
}

function assertAudioKeysOnce() {
  if (state.audio.asserted) return;
  state.audio.asserted = true;
  const probes = [
    ["bgm.ch1", AUDIO_PATHS.bgm.ch1],
    ["bgm.ch2", AUDIO_PATHS.bgm.ch2],
    ["bgm.ch3", AUDIO_PATHS.bgm.ch3],
    ["bgm.ch4", AUDIO_PATHS.bgm.ch4],
    ["bgm.ending", AUDIO_PATHS.bgm.ending],
    ["sfx.heartbeat", AUDIO_PATHS.sfx.heartbeat],
    ["sfx.type", AUDIO_PATHS.sfx.type],
    ["sfx.success", AUDIO_PATHS.sfx.success],
    ["sfx.fail", AUDIO_PATHS.sfx.fail],
  ];
  for (const [key, src] of probes) {
    if (!String(src || "").toLowerCase().endsWith(".mp3")) {
      console.warn(`[AUDIO EXTENSION WARNING] ${key}: ${src}`);
    }
    const a = new Audio();
    a.src = src;
    a.addEventListener("error", () => {
      console.warn(`[AUDIO MISSING] ${key}: ${src}`);
    }, { once: true });
    a.load();
  }
}

function safePlay(audio) {
  if (!audio || state.audio.muted) return;
  audio.play().catch(() => { });
}

function stopBGM() {
  if (!state.audio.bgmTracks) return;
  for (const track of Object.values(state.audio.bgmTracks)) {
    track.pause();
    track.currentTime = 0;
    track.volume = 0;
  }
  if (state.audio.heartbeat) {
    state.audio.heartbeat.pause();
    state.audio.heartbeat.currentTime = 0;
  }
  state.audio.currentBGM = null;
}

function applyAudioMute(muted) {
  state.audio.muted = Boolean(muted);
  const all = [
    ...(Object.values(state.audio.bgmTracks || {})),
    state.audio.heartbeat,
    ...(Object.values(state.audio.sfx || {})),
  ].filter(Boolean);
  for (const a of all) a.muted = state.audio.muted;
  if (el.audioToggleBtn) {
    el.audioToggleBtn.textContent = state.audio.muted ? "소리 켜기" : "소리 끄기";
    el.audioToggleBtn.setAttribute("aria-pressed", state.audio.muted ? "true" : "false");
  }
}

function getChapterBgmPitch() {
  if (state.ended) return 1;
  return CHAPTER_BGM_PITCH[getCurrentChapter()] || 1;
}

function switchBGM(trackKey) {
  if (!state.audio.startedByUser) return;
  initAudioEngine();
  ensureAudioGraph();
  if (state.audio.context && state.audio.context.state === "suspended") {
    state.audio.context.resume().catch(() => { });
  }
  const next = state.audio.bgmTracks[trackKey];
  if (!next) return;
  if (state.audio.currentBGM === next) {
    if (next.paused && !state.audio.muted) {
      tryPlayTrack(next);
    }
    return;
  }
  const prev = state.audio.currentBGM;
  state.audio.currentBGM = next;

  next.currentTime = 0;
  next.playbackRate = getChapterBgmPitch();
  next.volume = 0;
  tryPlayTrack(next);

  let step = 0;
  const fadeTimer = setInterval(() => {
    step += 1;
    const t = Math.min(step / 12, 1);
    if (prev) prev.volume = (1 - t) * 0.45;
    next.volume = t * 0.45;
    if (t >= 1) {
      if (prev) prev.pause();
      clearInterval(fadeTimer);
    }
  }, 70);
}

function playBGM(trackName) {
  switchBGM(trackName);
}

function updateDangerAudioLayer() {
  const hb = state.audio.heartbeat;
  if (!hb) return;
  const danger = state.hp < 20 && !state.ended;
  if (!danger) {
    hb.pause();
    hb.currentTime = 0;
    if (state.audio.lowPass && state.audio.context) {
      state.audio.lowPass.frequency.setTargetAtTime(18000, state.audio.context.currentTime, 0.08);
    }
    return;
  }
  if (state.audio.lowPass && state.audio.context) {
    state.audio.lowPass.frequency.setTargetAtTime(950, state.audio.context.currentTime, 0.1);
  }
  const rate = clamp(1 + (20 - state.hp) / 35, 1, 1.35);
  hb.playbackRate = rate;
  hb.volume = 0.2 + (20 - state.hp) * 0.01;
  safePlay(hb);
}

function playTypeTick() {
  const a = state.audio.sfx && state.audio.sfx.type;
  if (!a || state.audio.muted) return;
  a.currentTime = 0;
  safePlay(a);
  setTimeout(() => {
    a.pause();
    a.currentTime = 0;
  }, 100);
}

function playSFX(name) {
  const a = state.audio.sfx && state.audio.sfx[name];
  if (!a || state.audio.muted) return;
  a.currentTime = 0;
  safePlay(a);
}

function triggerStateAudioCue(level) {
  if (state.audio.muted || !state.audio.startedByUser) return;
  const bgm = state.audio.currentBGM;
  const hb = state.audio.heartbeat;
  const basePitch = getChapterBgmPitch();

  if (state.audio.stateCueTimer) {
    clearTimeout(state.audio.stateCueTimer);
    state.audio.stateCueTimer = null;
  }

  if (level === "critical") {
    playSFX("fail");
    if (bgm) {
      bgm.volume = Math.max(0.2, (bgm.volume || 0.45) * 0.62);
      bgm.playbackRate = clamp(basePitch * 0.94, 0.78, 1.2);
    }
    if (hb) {
      hb.playbackRate = 1.28;
      hb.volume = Math.max(hb.volume || 0, 0.34);
      safePlay(hb);
    }
    if (state.audio.lowPass && state.audio.context) {
      state.audio.lowPass.frequency.setTargetAtTime(700, state.audio.context.currentTime, 0.08);
    }
    state.audio.stateCueTimer = setTimeout(() => {
      if (bgm) {
        bgm.playbackRate = basePitch;
        bgm.volume = Math.max(bgm.volume || 0, 0.45);
      }
      if (state.audio.lowPass && state.audio.context) {
        state.audio.lowPass.frequency.setTargetAtTime(18000, state.audio.context.currentTime, 0.12);
      }
      updateDangerAudioLayer();
      state.audio.stateCueTimer = null;
    }, 1200);
    return;
  }

  if (level === "weak") {
    playSFX("type");
    if (bgm) {
      bgm.volume = Math.max(0.3, (bgm.volume || 0.45) * 0.82);
      bgm.playbackRate = clamp(basePitch * 0.98, 0.82, 1.2);
    }
    if (hb && !state.ended) {
      hb.playbackRate = 1.1;
      hb.volume = Math.max(hb.volume || 0, 0.16);
      safePlay(hb);
    }
    if (state.audio.lowPass && state.audio.context) {
      state.audio.lowPass.frequency.setTargetAtTime(3600, state.audio.context.currentTime, 0.1);
    }
    state.audio.stateCueTimer = setTimeout(() => {
      if (bgm) {
        bgm.playbackRate = basePitch;
        bgm.volume = Math.max(bgm.volume || 0, 0.45);
      }
      if (state.audio.lowPass && state.audio.context) {
        state.audio.lowPass.frequency.setTargetAtTime(18000, state.audio.context.currentTime, 0.12);
      }
      updateDangerAudioLayer();
      state.audio.stateCueTimer = null;
    }, 850);
    return;
  }

  if (level === "healthy") {
    playSFX("success");
    if (bgm) {
      bgm.playbackRate = basePitch;
      bgm.volume = Math.max(bgm.volume || 0, 0.45);
    }
  }
}

function setAudioMuted(muted) {
  applyAudioMute(muted);
}

function getTargetBGMKey() {
  const chapter = getCurrentChapter();
  return state.ended
    ? "ending"
    : (chapter === 1 ? "ch1" : chapter === 2 ? "ch2" : chapter === 3 ? "ch3" : "ch4");
}

function tryPlayTrack(track, attempt = 0) {
  if (!track || state.audio.muted) return;
  const playPromise = track.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (attempt >= 3) return;
      setTimeout(() => {
        try { track.load(); } catch (_) { }
        tryPlayTrack(track, attempt + 1);
      }, 180 * (attempt + 1));
    });
  }
}

function ensureBGMPlaying() {
  if (state.audio.muted) return;
  initAudioEngine();
  const trackKey = getTargetBGMKey();
  const track = state.audio.bgmTracks && state.audio.bgmTracks[trackKey];
  if (!track) return;
  if (state.audio.currentBGM !== track) {
    switchBGM(trackKey);
    return;
  }
  if (track.paused || track.ended) {
    tryPlayTrack(track);
    recoverAudioPlayback(false);
  }
}

function recoverAudioPlayback(withPrimeSfx = false) {
  if (!state.audio.startedByUser || state.audio.muted) return;
  const now = Date.now();
  if (now - (state.audio.lastRecoverAt || 0) < 300) return;
  state.audio.lastRecoverAt = now;

  initAudioEngine();
  const trackKey = getTargetBGMKey();
  const track = state.audio.bgmTracks && state.audio.bgmTracks[trackKey];
  if (track) {
    if (track.readyState < 2) {
      try { track.load(); } catch (_) { }
    }
    track.volume = Math.max(track.volume || 0, 0.42);
    tryPlayTrack(track);
  }

  if (withPrimeSfx && !state.audio.primed) {
    const sfx = state.audio.sfx && state.audio.sfx.success;
    if (sfx) {
      sfx.volume = 0.25;
      sfx.currentTime = 0;
      safePlay(sfx);
    }
    state.audio.primed = true;
  }
}

function unlockAudioFromUserGesture() {
  if (!state.audio.startedByUser) {
    state.audio.startedByUser = true;
  }
  initAudioEngine();
  ensureAudioGraph();
  if (state.audio.context && state.audio.context.state === "suspended") {
    state.audio.context.resume().then(() => {
      updateAudioState();
      ensureBGMPlaying();
      recoverAudioPlayback(true);
    }).catch(() => { });
  }
  updateAudioState();
  ensureBGMPlaying();
  recoverAudioPlayback(true);
  saveProgress();
}

function updateAudioState() {
  const chapter = getCurrentChapter();
  const targetTrack = getTargetBGMKey();
  if (state.audio.currentChapter !== chapter || state.audio.currentBGM !== (state.audio.bgmTracks && state.audio.bgmTracks[targetTrack])) {
    state.audio.currentChapter = chapter;
    playBGM(targetTrack);
  }
  updateDangerAudioLayer();
}

function triggerMinigameFailFX() {
  playSFX("fail");
  const app = document.getElementById("app");
  if (app) {
    app.classList.remove("fail-shake", "fail-flash");
    void app.offsetWidth;
    app.classList.add("fail-shake", "fail-flash");
  }
  document.body.classList.add("minigame-fail");
  setTimeout(() => {
    if (app) app.classList.remove("fail-shake", "fail-flash");
    document.body.classList.remove("minigame-fail");
    runArtifactWatchdog(1800);
  }, 180);
}

function cleanupVisualArtifacts(options = {}) {
  const closeMinigame = Boolean(options.closeMinigame);
  const shouldHideMinigame = closeMinigame || !state.minigame.active;
  for (const stale of document.querySelectorAll(".spark, .perfect-text, .delta-indicator")) {
    stale.remove();
  }
  document.body.classList.remove("minigame-fail");
  const app = document.getElementById("app");
  if (app) {
    app.classList.remove("shake-screen", "fail-shake", "fail-flash", "flash-screen");
    app.style.boxShadow = "none";
    app.style.filter = "none";
    app.style.transform = "none";
  }
  if (shouldHideMinigame && el && el.minigameOverlay) {
    el.minigameOverlay.classList.remove("active");
    el.minigameOverlay.hidden = true;
    el.minigameOverlay.style.display = "none";
    el.minigameOverlay.style.opacity = "";
    el.minigameOverlay.style.background = "transparent";
  }
  if (shouldHideMinigame && el && el.minigameBody) {
    el.minigameBody.style.background = "";
    el.minigameBody.style.boxShadow = "";
    el.minigameBody.style.filter = "";
  }
}

function runArtifactWatchdog(durationMs = 2000) {
  const startedAt = Date.now();
  cleanupVisualArtifacts();
  const timer = setInterval(() => {
    cleanupVisualArtifacts();
    if (Date.now() - startedAt >= durationMs) {
      clearInterval(timer);
    }
  }, 80);
}

function openMinigame(title, desc) {
  state.minigame.active = true;
  state.minigame.cleanup = null;
  el.minigameTitle.textContent = title;
  el.minigameDesc.textContent = desc;
  el.minigameBody.innerHTML = "";
  el.minigameOverlay.hidden = false;
  el.minigameOverlay.style.display = "";
  el.minigameOverlay.classList.add("active");
  document.body.classList.add("minigame-open");
}

function closeMinigame() {
  if (typeof state.minigame.cleanup === "function") {
    state.minigame.cleanup();
  }
  state.minigame.active = false;
  state.minigame.cleanup = null;
  el.minigameOverlay.hidden = true;
  el.minigameOverlay.classList.remove("active");
  el.minigameOverlay.style.display = "";
  el.minigameOverlay.style.opacity = "";
  document.body.classList.remove("minigame-open");
  cleanupVisualArtifacts({ closeMinigame: true });
  el.minigameBody.innerHTML = "";
}

function runSubQMinigame(choice, scene) {
  openMinigame("피하수액 놓기", "1단계: 녹색 구간에서 꾹 눌러 텐트를 만드세요.");
  el.minigameBody.innerHTML = `<div id="tentTrack" class="timing-track"><div id="tentSafeZone" class="safe-zone"></div><div id="tentCursor" class="timing-cursor"></div></div><button id="tentHoldBtn" class="choice-btn">텐트 잡기 (홀드)</button>`;

  const chapter = getCurrentChapter();
  const chapterDifficulty = { 1: 1.0, 2: 0.82, 3: 0.64, 4: 0.5 }[chapter] || 1.0;
  const tentCursor = document.getElementById("tentCursor");
  const tentSafeZone = document.getElementById("tentSafeZone");
  const tentHoldBtn = document.getElementById("tentHoldBtn");

  const tentSafeWidth = clamp(26 * chapterDifficulty, 10, 26);
  const tentSafeLeft = 50 - tentSafeWidth / 2;
  tentSafeZone.style.left = `${tentSafeLeft}%`;
  tentSafeZone.style.width = `${tentSafeWidth}%`;

  let tentPos = 0;
  let tentDir = 1;
  let tentRaf = 0;
  let holdStart = 0;
  const animateTent = () => {
    tentPos += tentDir * (1.6 + (1 - chapterDifficulty) * 2.0);
    if (tentPos >= 96) tentDir = -1;
    if (tentPos <= 0) tentDir = 1;
    tentCursor.style.left = `${tentPos}%`;
    tentRaf = raf(animateTent);
  };
  tentRaf = raf(animateTent);

  const finishPhase1 = () => {
    caf(tentRaf);
    const inSafe = tentPos >= tentSafeLeft && tentPos <= tentSafeLeft + tentSafeWidth;
    const holdMs = holdStart ? Date.now() - holdStart : 0;
    const holdQuality = clamp(holdMs / (700 + (1 - chapterDifficulty) * 450), 0, 1);
    const tentQuality = inSafe ? holdQuality : holdQuality * 0.45;
    launchSubQPhase2(choice, scene, tentQuality);
  };

  tentHoldBtn.onpointerdown = () => {
    holdStart = Date.now();
    el.latteCard.classList.add("hold-shake");
  };
  const release = () => {
    el.latteCard.classList.remove("hold-shake");
    if (holdStart) finishPhase1();
    holdStart = 0;
  };
  tentHoldBtn.onpointerup = release;
  tentHoldBtn.onpointerleave = release;
  tentHoldBtn.onpointercancel = release;

  state.minigame.cleanup = () => {
    caf(tentRaf);
    el.latteCard.classList.remove("hold-shake");
  };
}

function launchSubQPhase2(choice, scene, tentQuality) {
  el.minigameDesc.textContent = "2단계: 텐트 아래로 바늘을 넣습니다. 안전 구간에서 [삽입]을 누르세요.";
  el.minigameBody.innerHTML = `<div id="subqTrack" class="timing-track"><div id="subqSafeZone" class="safe-zone"></div><div id="subqCursor" class="timing-cursor"></div></div><button id="subqJudgeBtn" class="choice-btn">삽입</button>`;

  const cursor = document.getElementById("subqCursor");
  const safeZone = document.getElementById("subqSafeZone");
  const judgeBtn = document.getElementById("subqJudgeBtn");

  const chapter = getCurrentChapter();
  const chapterDifficulty = { 1: 1.0, 2: 0.82, 3: 0.64, 4: 0.5 }[chapter] || 1.0;
  const safeWidth = clamp((7 + tentQuality * 13) * chapterDifficulty, 6, 20);
  const safeLeft = 50 - safeWidth / 2;
  safeZone.style.left = `${safeLeft}%`;
  safeZone.style.width = `${safeWidth}%`;

  let pos = 0;
  let dir = 1;
  let rafId = 0;
  let settled = false;
  const animate = () => {
    pos += dir * (2.0 + (1 - chapterDifficulty) * 2.5);
    if (pos >= 96) dir = -1;
    if (pos <= 0) dir = 1;
    cursor.style.left = `${pos}%`;
    rafId = raf(animate);
  };
  rafId = raf(animate);
  state.minigame.cleanup = () => caf(rafId);

  judgeBtn.onclick = () => {
    if (settled) return;
    caf(rafId);
    const hit = pos >= safeLeft && pos <= safeLeft + safeWidth;
    let rank = "Miss";
    let delta = { hp: 1, comfort: -3, sanity: -3, money: -2, bond: -1 };
    if (hit && tentQuality >= 0.78) {
      rank = "Perfect";
      delta = { hp: 4, comfort: 3, sanity: 1, money: -2, bond: 2 };
      triggerPerfectFX();
      typeText(el.minigameDesc, "Perfect! 바늘이 부드럽게 들어갔다.");
    } else if (hit) {
      rank = "Good";
      delta = { hp: 3, comfort: 1, sanity: 0, money: -2, bond: 1 };
      typeText(el.minigameDesc, "Good. 살짝 움찔했지만 괜찮다.");
    } else {
      triggerMinigameFailFX();
      typeText(el.minigameDesc, "Miss... 라떼가 몸을 비틀었다.");
    }
    settled = true;
    judgeBtn.disabled = true;
    setTimeout(() => {
      if (!state.minigame.active) return;
      closeMinigame();
      chooseAction({ ...choice, label: `${choice.label} (피하수액 ${rank})`, delta }, scene);
    }, 260);
  };
}

function runFeedMinigame(choice, scene) {
  openMinigame("강제 급여 리듬", "입이 열린 타이밍에 눌러 19스푼을 달성하세요.");
  el.minigameBody.innerHTML = `<div id="spoonCount" class="feed-count">0/19</div><div id="mouthIndicator" class="mouth-indicator mouth-close">입 닫힘</div><button id="feedTapBtn" class="choice-btn">스푼 넣기</button>`;

  const countEl = document.getElementById("spoonCount");
  const mouthEl = document.getElementById("mouthIndicator");
  const tapBtn = document.getElementById("feedTapBtn");
  let spoons = 0;
  let misses = 0;
  let open = false;
  let openStarted = 0;
  let settled = false;
  const OPEN_WINDOW = 220;

  const mouthTimer = setInterval(() => {
    open = !open;
    if (open) openStarted = Date.now();
    mouthEl.textContent = open ? "입 열림 - 지금!" : "입 닫힘";
    mouthEl.className = `mouth-indicator ${open ? "mouth-open" : "mouth-close"}`;
  }, 420);
  state.minigame.cleanup = () => clearInterval(mouthTimer);

  tapBtn.onclick = () => {
    if (settled) return;
    const inWindow = open && (Date.now() - openStarted) <= OPEN_WINDOW;
    if (inWindow) {
      playSFX("type");
      triggerHeartFX(2);
      spoons += 1;
      countEl.textContent = `${spoons}/19`;
      if (spoons >= 19) {
        clearInterval(mouthTimer);
        triggerPerfectFX();
        typeText(el.minigameDesc, "Perfect! 19스푼을 모두 먹였습니다.");
        settled = true;
        tapBtn.disabled = true;
        setTimeout(() => {
          if (!state.minigame.active) return;
          closeMinigame();
          chooseAction({
            ...choice,
            label: `${choice.label} (19스푼 성공)`,
            intake: 19,
            spoon: 19,
            delta: { hp: 9, comfort: 6, sanity: 2, money: -2, bond: 6 },
          }, scene);
        }, 260);
      }
    } else {
      misses += 1;
      triggerMinigameFailFX();
      if (misses >= 6) {
        clearInterval(mouthTimer);
        typeText(el.minigameDesc, "Fail... 급여 리듬이 무너졌습니다.");
        settled = true;
        tapBtn.disabled = true;
        setTimeout(() => {
          if (!state.minigame.active) return;
          closeMinigame();
          chooseAction({
            ...choice,
            label: `${choice.label} (급여 실패)`,
            intake: 4,
            delta: { hp: 2, comfort: -4, sanity: -3, money: -1, bond: -2 },
          }, scene);
        }, 260);
      }
    }
  };
}

function runCCTVMinigame(choice, scene) {
  openMinigame("CCTV 관찰 퀴즈", "지금 라떼의 상태를 맞추세요.");
  const answers = ["숨가쁨", "식빵", "경련"];
  const target = Math.floor(Math.random() * 3);
  let settled = false;
  el.minigameBody.innerHTML = `<p id="cctvStatus" class="cctv-blur" style="margin:0 0 10px;">저해상도 CCTV: ${answers[target]}</p><div class="quiz-buttons"><button class="choice-btn" data-v="0">1. 숨가쁨</button><button class="choice-btn" data-v="1">2. 식빵</button><button class="choice-btn" data-v="2">3. 경련</button></div>`;
  const statusEl = document.getElementById("cctvStatus");
  for (const btn of el.minigameBody.querySelectorAll("button[data-v]")) {
    btn.onclick = () => {
      if (settled) return;
      settled = true;
      for (const b of el.minigameBody.querySelectorAll("button[data-v]")) b.disabled = true;
      const pick = Number(btn.getAttribute("data-v"));
      const success = pick === target;
      if (!success) triggerMinigameFailFX();
      statusEl.classList.toggle("cctv-clear", success);
      setTimeout(() => {
        if (!state.minigame.active) return;
        closeMinigame();
        chooseAction({
          ...choice,
          label: `${choice.label} (CCTV ${success ? "정답" : "오판"})`,
          delta: success
            ? { hp: choice.delta.hp + 1, comfort: choice.delta.comfort + 1, sanity: choice.delta.sanity + 1, money: choice.delta.money, bond: choice.delta.bond + 1 }
            : { hp: choice.delta.hp, comfort: choice.delta.comfort - 1, sanity: choice.delta.sanity - 2, money: choice.delta.money, bond: choice.delta.bond },
        }, scene);
      }, success ? 280 : 0);
    };
  }
}

function launchChoiceInteraction(choice, scene) {
  if (state.minigame.active || state.reactionPending) return;
  if (scene.cue.includes("CCTV") && state.timeSlot === 2 && state.todayCommuted) return runCCTVMinigame(choice, scene);
  if (choice.key === "forceFeed" && state.timeSlot === 3) return runFeedMinigame(choice, scene);
  if (choice.label.includes("수액") && state.timeSlot === 0) return runSubQMinigame(choice, scene);
  return chooseAction(choice, scene);
}

function clearChoiceButton(btn) {
  btn.onpointerdown = null;
  btn.onpointerup = null;
  btn.onpointerleave = null;
  btn.onpointercancel = null;
  btn.onclick = null;
  btn.classList.remove("hold-target");
  btn.style.removeProperty("--hold-progress");
}

function attachHoldBehavior(btn, onComplete) {
  let timer = null;
  let progress = 0;
  btn.classList.add("hold-target");

  const stop = (commit) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    btn.style.setProperty("--hold-progress", "0%");
    el.latteCard.classList.remove("hold-shake");
    if (commit) onComplete();
  };

  btn.onpointerdown = () => {
    playSFX("type");
    progress = 0;
    el.latteCard.classList.add("hold-shake");
    timer = setInterval(() => {
      progress += 5;
      btn.style.setProperty("--hold-progress", `${progress}%`);
      if (progress >= 100) stop(true);
    }, 40);
  };

  btn.onpointerup = () => stop(false);
  btn.onpointerleave = () => stop(false);
  btn.onpointercancel = () => stop(false);
}

function showDeltaIndicator(barId, delta) {
  if (!delta) return;
  const bar = document.getElementById(barId);
  if (!bar) return;
  const wrap = bar.closest(".bar-wrap");
  if (!wrap) return;

  const indicator = document.createElement("span");
  indicator.className = `delta-indicator ${delta > 0 ? "positive" : "negative"}`;
  indicator.textContent = `${delta > 0 ? "+" : ""}${delta}`;
  wrap.appendChild(indicator);
  setTimeout(() => indicator.remove(), 1200);
}

function withDailyEfficiency(delta) {
  const buff = typeof state.dailyEfficiencyBuff === "number" ? state.dailyEfficiencyBuff : 1;
  if (buff === 1) return { ...delta };
  const scaled = { ...delta };
  for (const key of ["hp", "comfort", "sanity", "bond"]) {
    const v = Number(scaled[key] || 0);
    if (!v) continue;
    const next = Math.round(v * buff);
    scaled[key] = next === 0 ? (v > 0 ? 1 : -1) : next;
  }
  return scaled;
}

function withBondCarePenalty(delta) {
  const scaled = { ...delta };
  const factor = state.bond <= 15 ? 0.4 : state.bond <= 30 ? 0.7 : 1;
  if (factor >= 1) return scaled;
  for (const key of ["hp", "comfort"]) {
    const v = Number(scaled[key] || 0);
    if (v > 0) scaled[key] = Math.max(1, Math.round(v * factor));
  }
  return scaled;
}

function withHpLowEfficiency(delta) {
  if (state.hp > 10) return { ...delta };
  const scaled = { ...delta };
  const v = Number(scaled.hp || 0);
  if (v > 0) scaled.hp = Math.max(1, Math.round(v * 0.5));
  return scaled;
}

function addSanityHintNoise(v) {
  if (!Number.isFinite(v) || v === 0 || state.sanity > 30) return v;
  const noise = (Math.floor(Math.random() * 3) + 1) * (Math.random() < 0.5 ? -1 : 1);
  return v + noise;
}

function withForceFeedTradeoff(delta, choice) {
  if (choice.key !== "forceFeed") return { ...delta };
  const intake = Number.isFinite(choice.intake) ? choice.intake : 0;
  const penalty = intake >= 12 ? 7 : intake >= 6 ? 5 : 4;
  return {
    ...delta,
    comfort: (delta.comfort || 0) - penalty,
    bond: (delta.bond || 0) - (penalty - 1),
    sanity: (delta.sanity || 0) - 1,
    hp: (delta.hp || 0) + 1,
  };
}

function withSeparationPressure(delta, choice, actionContext, scene) {
  const label = String(choice?.label || "");
  const isCommute = choice?.key === "commute";
  const isSeparationLike = isCommute || actionContext === "moving" || /출근|업무 마무리 후 확인|재확인|대기|관찰/.test(label);
  if (!isSeparationLike) return { ...delta };

  const chapter = getCurrentChapter();
  const base = { 1: 4, 2: 5, 3: 6, 4: 7 }[chapter] || 5;
  const crisisBoost = (scene && scene.isCrisis) ? 2 : 0;
  const pressure = base + crisisBoost;

  return {
    ...delta,
    hp: (delta.hp || 0) - pressure,
    comfort: (delta.comfort || 0) - Math.max(2, Math.round(pressure * 0.7)),
    sanity: (delta.sanity || 0) - Math.max(1, Math.round(pressure * 0.5)),
    bond: (delta.bond || 0) - Math.max(1, Math.round(pressure * 0.45)),
  };
}

function applyChoiceSpecial(choice) {
  if (!choice || !choice.special || typeof choice.special !== "object") return;
  if (typeof choice.special.dailyEfficiencyBuff === "number") {
    state.dailyEfficiencyBuff = clamp(choice.special.dailyEfficiencyBuff, 1, 1.3);
  }
}

function queueSystemMessage(text) {
  if (!text) return;
  if (!Array.isArray(state.systemMessages)) state.systemMessages = [];
  state.systemMessages.push(text);
}

function applyResourceClamp() {
  state.hp = clamp(state.hp, 0, 100);
  state.comfort = clamp(state.comfort, 0, 100);
  state.sanity = clamp(state.sanity, 0, 100);
  state.money = clamp(state.money, -999, 999);
  state.bond = clamp(state.bond, 0, 100);
}

function getResourceBand(value) {
  if (value <= 0) return "collapse";
  if (value <= PENALTY_THRESHOLDS.red) return "red";
  if (value <= PENALTY_THRESHOLDS.yellow) return "yellow";
  return "normal";
}

function applyResourceByKey(resource, amount) {
  state[resource] += amount;
  applyResourceClamp();
}

function triggerSanityCollapse() {
  state.sanityCollapseCount += 1;
  state.collapseCounts.sanity += 1;
  state.collapseCounts.total += 1;
  state.sanityBlackoutDay = state.day;
  state.pendingSanityBlackout = true;
  applyResourceByKey("sanity", 10 - state.sanity);
  applyResourceByKey("comfort", -2);
  applyResourceByKey("bond", -1);
  queueSystemMessage("멘탈 Collapse: 기억이 끊겼다. 잠깐 멈췄다가 다시 붙든다.");
}

function triggerBondCollapse() {
  state.bondCollapseCount += 1;
  state.collapseCounts.bond += 1;
  state.collapseCounts.total += 1;
  state.bondHideTimer = 2;
  applyResourceByKey("bond", 5 - state.bond);
  applyResourceByKey("sanity", -2);
  applyResourceByKey("comfort", -1);
  queueSystemMessage("관계 Collapse: 라떼가 거리를 둔다. 2턴 동안 직접 돌봄이 제한된다.");
}

function triggerComfortCollapse() {
  state.comfortCollapseCount += 1;
  state.collapseCounts.comfort += 1;
  state.collapseCounts.total += 1;
  state.pendingComfortCollapseChoice = true;
  applyResourceByKey("comfort", 1 - state.comfort);
  queueSystemMessage("편안함 Collapse: 통증 관리 선택이 필요하다.");
}

function triggerMoneyCollapse() {
  state.moneyCollapseCount += 1;
  state.collapseCounts.money += 1;
  state.collapseCounts.total += 1;
  state.pendingMoneyCollapseChoice = true;
  if (state.money <= -10) applyResourceByKey("money", -9 - state.money);
  queueSystemMessage("돈 Collapse: 도움을 요청할지 선택해야 한다.");
}

function checkSanityBreakEvent() {
  if (state.sanity <= 15 && !state.sanityBreakEventShown && !state.pendingSanityBreakChoice) {
    state.pendingSanityBreakChoice = true;
    return true;
  }
  return false;
}

function checkCollapseEvents() {
  let triggered = false;
  for (let pass = 0; pass < 8; pass += 1) {
    let found = false;
    for (const key of COLLAPSE_PRIORITY) {
      if (key === "sanity" && state.sanity <= 0 && state.sanityBlackoutDay !== state.day) {
        triggerSanityCollapse();
        found = true;
        triggered = true;
        break;
      }
      if (key === "bond" && state.bond <= 0 && state.bondHideTimer <= 0) {
        triggerBondCollapse();
        found = true;
        triggered = true;
        break;
      }
      if (key === "comfort" && state.comfort <= 0) {
        triggerComfortCollapse();
        found = true;
        triggered = true;
        break;
      }
      if (key === "money" && state.money <= -10 && !state.pendingMoneyCollapseChoice) {
        triggerMoneyCollapse();
        found = true;
        triggered = true;
        break;
      }
    }
    if (!found) break;
  }

  if (state.hp <= 0) {
    state.collapseCounts.hp += 1;
    state.collapseCounts.total += 1;
    state.hp = COLLAPSE_RECOVERY.hp;
    applyResourceByKey("comfort", -2);
    applyResourceByKey("sanity", -2);
    applyResourceByKey("bond", -1);
    queueSystemMessage("체력 붕괴: 응급 안정화 후 겨우 숨을 돌렸다.");
    triggered = true;
  }
  applyResourceClamp();
  return triggered;
}

function applyDominoPenalty() {
  const penalty = { hp: 0, comfort: 0, sanity: 0, money: 0, bond: 0 };
  if (state.comfort <= PENALTY_THRESHOLDS.red) {
    penalty.hp -= 3;
    penalty.sanity -= 1;
  } else if (state.comfort <= PENALTY_THRESHOLDS.yellow) {
    penalty.hp -= 2;
  }
  if (state.hp <= 10) {
    penalty.comfort -= 2;
    penalty.bond -= 1;
  } else if (state.hp <= 25) {
    penalty.comfort -= 1;
  }
  if (state.sanity <= PENALTY_THRESHOLDS.red) {
    penalty.hp -= 1;
  }
  // [이슈C] 돈 0 이하 → 연쇄 패널티: 돌봄 품질 저하 + 멘탈 타격
  if (state.money <= 0) {
    penalty.comfort -= 2;
    penalty.sanity -= 2;
    penalty.bond -= 1;
  } else if (state.money <= ITEM_MONEY_THRESHOLD) {
    penalty.sanity -= 1;
  }
  for (const key of RESOURCE_KEYS) {
    if (!penalty[key]) continue;
    state[key] += penalty[key];
  }
  applyResourceClamp();
}

function applyPassiveDecay() {
  applyDominoPenalty();
  if (state.money < 0 && Math.random() < 0.2) {
    applyResourceByKey("money", 50);
    queueSystemMessage("비상금 50,000원을 발견했습니다");
  }
  checkCollapseEvents();
  checkSanityBreakEvent();
}

function applyThresholdWarnings(prev) {
  const labels = { hp: "체력", comfort: "편안함", sanity: "멘탈", money: "돈", bond: "관계" };
  for (const key of RESOURCE_KEYS) {
    const before = getResourceBand(prev[key]);
    const after = getResourceBand(state[key]);
    if (before === after) continue;
    if (after === "yellow") queueSystemMessage(`${labels[key]} 경고: 상태가 흔들린다.`);
    if (after === "red") queueSystemMessage(`${labels[key]} 위험: 즉시 회복 루틴이 필요하다.`);
  }
}

function runPenaltySystems(prev, includeDomino = false) {
  for (const phase of SYSTEM_PENALTY_ORDER) {
    if (phase === "domino" && includeDomino) applyDominoPenalty();
    if (phase === "collapse") checkCollapseEvents();
    if (phase === "warnings") applyThresholdWarnings(prev);
  }
  checkSanityBreakEvent();
}

function applyDelta(delta) {
  const prev = {
    hp: state.hp,
    comfort: state.comfort,
    sanity: state.sanity,
    money: state.money,
    bond: state.bond,
  };
  state.hp += delta.hp;
  state.comfort += delta.comfort;
  state.sanity += delta.sanity;
  state.money += delta.money;
  state.bond += delta.bond;
  applyResourceClamp();
  runPenaltySystems(prev, false);

  showDeltaIndicator("hpBar", Math.round(state.hp - prev.hp));
  showDeltaIndicator("comfortBar", Math.round(state.comfort - prev.comfort));
  showDeltaIndicator("sanityBar", Math.round(state.sanity - prev.sanity));
  showDeltaIndicator("moneyBar", Math.round(state.money - prev.money));
  showDeltaIndicator("bondBar", Math.round(state.bond - prev.bond));
}

function getReactionText(choice, scene) {
  if (state.systemMessages && state.systemMessages.length > 0) {
    return state.systemMessages.shift();
  }
  if (choice && choice.reaction) {
    return choice.reaction;
  }
  if (scene && scene.isCrisis) {
    const crisisReactions = [
      "심장이 쿵 내려앉았지만, 지금은 손을 먼저 움직여야 한다.",
      "패닉을 누르고 순서대로 대응한다. 지금 필요한 건 침착함이다.",
      "짧은 몇 분이 길게 늘어난다. 그래도 해야 할 선택은 분명하다.",
    ];
    return crisisReactions[Math.floor(Math.random() * crisisReactions.length)];
  }
  if (scene && scene.isRandomDawn) {
    return "예상치 못한 변수가 하루의 결을 바꾼다.";
  }

  if (choice.delta.hp >= 5) return "라떼의 숨결이 조금 더 안정됐다.";
  if (choice.delta.hp <= -2) return "...괜찮을까. 불안이 더 짙어진다.";
  if (choice.delta.comfort >= 4) return "라떼가 조금 더 편안해 보인다.";
  if (choice.delta.comfort <= -3) return "라떼가 고개를 돌린다. 마음이 무겁다.";
  if (choice.delta.bond >= 3) return "가르릉, 가르릉. 짧지만 분명한 신호다.";
  if (choice.delta.sanity <= -3) return "머리가 무거워진다. 잠깐 숨을 고르고 싶다.";

  if (choice.key === "commute") return "현관문을 나서는 발걸음이 유난히 무겁다.";
  if (choice.key === "forceFeed" && (choice.intake || 0) >= 5) return "오늘도 버틴다. 이 선택이 최선이길 빈다.";
  if (choice.hiddenPoint) return "...조용히 체온이 전해진다.";

  if (state.hp <= 25 && !state._hpWarnShown) {
    state._hpWarnShown = true;
    return "체력이 위험하다. 다음 선택은 더 신중해야 한다.";
  }
  if (state.money <= 5 && !state._moneyWarnShown) {
    state._moneyWarnShown = true;
    return "통장이 바닥이다. 비용 선택이 점점 날카로워진다.";
  }
  if (state.sanity <= 25 && !state._sanityWarnShown) {
    state._sanityWarnShown = true;
    return "멘탈이 흔들린다. 판단이 거칠어지지 않게 버텨야 한다.";
  }

  if (Math.random() < 0.24) {
    const ambientBySlot = {
      0: [
        "새벽 공기가 차갑다. 물 데우는 소리만 또렷하다.",
        "알람보다 먼저 눈이 떠진다. 몸이 이 시간을 기억했다.",
      ],
      1: [
        "현관 앞에서 한 번 더 뒤돌아본다.",
        "아침 햇빛이 밝을수록 마음은 더 무겁다.",
      ],
      2: [
        "모니터 속 작은 움직임 하나에 숨이 멈춘다.",
        "점심시간이 짧게 지나간다. 확인할 건 아직 많다.",
      ],
      3: [
        "저녁 공기가 내려앉는다. 오늘의 분기점이 다가온다.",
        "숟가락을 쥔 손끝에 힘이 들어간다.",
      ],
      4: [
        "집이 조용해질수록 생각은 더 커진다.",
        "시계 소리가 유난히 크게 들리는 밤이다.",
      ],
    };
    const ambient = ambientBySlot[state.timeSlot] || ambientBySlot[4];
    return ambient[Math.floor(Math.random() * ambient.length)];
  }
  return null;
}

function showReaction(text, callback) {
  const token = (state.reactionToken || 0) + 1;
  state.reactionToken = token;
  state.reactionPending = true;
  for (const stale of el.stageScene.querySelectorAll(".reaction-overlay")) {
    stale.remove();
  }
  const overlay = document.createElement("div");
  overlay.className = "reaction-overlay";
  overlay.innerHTML = `<p class="reaction-text">${text}</p>`;
  el.stageScene.appendChild(overlay);
  setTimeout(() => {
    if (token !== state.reactionToken) return;
    overlay.classList.add("fade-out");
    setTimeout(() => {
      if (token !== state.reactionToken) return;
      overlay.remove();
      state.reactionPending = false;
      if (!callback) return;
      if (!state.minigame.active) {
        callback();
        return;
      }
      const wait = setInterval(() => {
        if (token !== state.reactionToken) {
          clearInterval(wait);
          return;
        }
        if (state.minigame.active) return;
        clearInterval(wait);
        callback();
      }, 80);
    }, 700);
  }, 4200);
}

function getDayMoodText() {
  if (state.hp <= 25) return "위태로운 하루였다.";
  if (state.dailyIntake >= 10) return "기적 같은 하루였다.";
  if (state.dailyIntake === 0) return "먹지 못한 하루. 내일은 다를까.";
  if (state.sanity <= 30) return "보호자의 마음이 한계에 가까워졌다.";
  if (state.comfort >= 70) return "따뜻한 하루였다.";
  return "그래도 하루가 지나갔다.";
}

function showDaySummary(day, callback) {
  const overlay = document.createElement("div");
  overlay.className = "day-summary-overlay";
  const intakeText = state.dailyIntake > 0 ? `섭취량 ${state.dailyIntake}ml` : "섭취량 0ml (금식)";
  overlay.innerHTML = `
    <div class="day-summary-card">
      <h3>${dayText(day)} 종료</h3>
      <p class="summary-line">${intakeText}</p>
      <p class="summary-line">상태: ${state.condition}</p>
      <p class="summary-mood">${getDayMoodText()}</p>
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

function advanceTurn() {
  applyPassiveDecay();
  for (const itemId of Object.keys(state.itemCooldowns || {})) {
    if (state.itemCooldowns[itemId] > 0) state.itemCooldowns[itemId] -= 1;
  }
  if (state.pendingSanityBlackout) {
    state.pendingSanityBlackout = false;
    addLogRow({ date: dayText(state.day), time: "기록 없음", hp: state.hp, comfort: state.comfort, intake: 0, note: "기록 없음 — 보호자 부재" });
    state.timeSlot = 0;
    state.day += 1;
    state.turnKey = "";
    state.turnCrisis = null;
    state.turnRandom = null;
    state.dailyIntake = 0;
    state.todayCommuted = false;
    state.dailyEfficiencyBuff = 1;
    if (state.day > GAME_TOTAL_DAYS) {
      triggerEnding();
      return;
    }
    renderScene();
    saveProgress();
    return;
  }
  if (state.bondHideTimer > 0) state.bondHideTimer -= 1;
  state.timeSlot += 1;
  if (state.timeSlot > 4) {
    const endedDay = state.day;
    state.timeSlot = 0;
    state.day += 1;
    state.turnKey = "";
    state.turnCrisis = null;
    state.turnRandom = null;
    // [이슈#1] 챕터별 HP 자연 감소 — 신부전 진행 시뮬레이션
    if (state.day > 1) {
      const chapterForDecay = getCurrentChapter();
      const decay = CHAPTER_HP_DECAY[chapterForDecay] || -2;
      state.hp = clamp(state.hp + decay, 0, 100);
    }
    state.dayStartSnapshot = {
      day: state.day,
      hp: state.hp,
      comfort: state.comfort,
      sanity: state.sanity,
      money: state.money,
      bond: state.bond,
    };
    addLogRow({ date: dayText(state.day - 1), time: "종료", hp: state.hp, comfort: state.comfort, intake: state.dailyIntake, note: "하루 마감" });
    if (state.day > GAME_TOTAL_DAYS) {
      triggerEnding();
      return;
    }
    showDaySummary(endedDay, () => {
      state.dailyIntake = 0;
      state.todayCommuted = false;
      state.dailyEfficiencyBuff = 1;
      renderScene();
      saveProgress();
    });
    return;
  }
  state.turnKey = "";
  state.turnCrisis = null;
  state.turnRandom = null;
  if (state.day > GAME_TOTAL_DAYS) {
    triggerEnding();
    return;
  }
  renderScene();
  saveProgress();
}

function chooseAction(choice, scene) {
  if (state.ended || choice.locked) return;
  if (state.minigame.active || state.reactionPending) return;
  const actionContext = deriveActionContext(choice);
  state.lastActionContext = actionContext;
  const baseDelta = withForceFeedTradeoff(choice.delta, choice);
  const pressuredDelta = withSeparationPressure(baseDelta, choice, actionContext, scene);
  const tunedDelta = withHpLowEfficiency(withBondCarePenalty(withDailyEfficiency(pressuredDelta)));
  const scaledDelta = scaleActivityDelta(tunedDelta);
  if (choice.key === "commute") {
    const commuteBase = Math.max(1, Math.round((Number(choice?.delta?.money || 0) + 2) * ACTIVITY_SCALE));
    scaledDelta.money = Math.max(commuteBase, Number(scaledDelta.money || 0));
  }
  const adjustedIntake = (state.bond <= 15 && state.timeSlot === 3)
    ? Math.floor((Number.isFinite(choice.intake) ? choice.intake : 0) / 2)
    : (Number.isFinite(choice.intake) ? choice.intake : 0);
  applyDelta(scaledDelta);
  setSpriteContext(actionContext, 1);
  // [스테이지 즉시 피드백] 스프라이트 즉시 전환 + 화면 효과
  updateCatSprite(true);
  triggerStageFeedback(scaledDelta, scene, actionContext);
  const emoteKey = resolveActionEmote(scaledDelta, scene, actionContext);
  if (emoteKey) triggerEmoteByKey(emoteKey);
  if (scene && scene.isForcedSanityBreak) {
    state.pendingSanityBreakChoice = false;
    state.sanityBreakEventShown = true;
  }
  if (scene && scene.isForcedComfortCollapse) {
    state.pendingComfortCollapseChoice = false;
    state.usedPainkiller = choice.key === "painkiller_yes";
  }
  if (scene && scene.isForcedMoneyCollapse) {
    state.pendingMoneyCollapseChoice = false;
  }
  applyChoiceSpecial(choice);
  if (choice.hiddenPoint) state.hiddenPoint += choice.hiddenPoint;
  if (typeof choice.spoon === "number") state.spoonBest = Math.max(state.spoonBest, choice.spoon);
  state.intake = adjustedIntake;
  state.dailyIntake += state.intake;
  if (state.timeSlot === 1 && choice.key === "commute") state.todayCommuted = true;

  const finalizeTurn = () => {
    if (scene.isCrisis) {
      state.lastCrisisDay = state.day;
      state.crisisCooldownUntil = state.day + 3 + Math.floor(Math.random() * 3);
    }
    addLogRow({
      date: dayText(state.day),
      time: TIME_NAMES[state.timeSlot],
      hp: state.hp,
      comfort: state.comfort,
      intake: state.intake,
      note: `${scene.isRandomDawn ? "[돌발] " : ""}${scene.isCrisis ? "[위기] " : ""}${scene.cue} | ${choice.label}`,
    });

    if (state.day === GAME_TOTAL_DAYS && state.timeSlot === 4) {
      addLogRow({ date: "D-Day", time: "23:00", hp: state.hp, comfort: state.comfort, intake: state.intake, note: "라떼는 기다리지 않고 떠났다. 하지만 표정은 편안했다." });
      state.day = GAME_TOTAL_DAYS + 1;
      triggerEnding();
      return;
    }
    if (state.pendingSanityBlackout) {
      state.pendingSanityBlackout = false;
      addLogRow({ date: dayText(state.day), time: "기록 없음", hp: state.hp, comfort: state.comfort, intake: 0, note: "기록 없음 — 보호자 부재" });
      state.timeSlot = 0;
      state.day += 1;
      state.turnKey = "";
      state.turnCrisis = null;
      state.turnRandom = null;
      state.dailyIntake = 0;
      state.todayCommuted = false;
      state.dailyEfficiencyBuff = 1;
      if (state.day > GAME_TOTAL_DAYS) {
        triggerEnding();
        return;
      }
      renderScene();
      saveProgress();
      return;
    }
    advanceTurn();
  };

  const reaction = getReactionText(choice, scene);
  if (reaction) {
    showReaction(reaction, finalizeTurn);
    return;
  }
  finalizeTurn();
}

function renderChoices(scene) {
  el.choiceContainer.innerHTML = "";
  let choices = scene.choices;
  if (state.sanity <= 15 && Array.isArray(choices) && choices.length >= 3) {
    let dropIndex = 0;
    let maxSanity = -Infinity;
    choices.forEach((c, idx) => {
      const v = Number(c?.delta?.sanity || 0);
      if (v > maxSanity) {
        maxSanity = v;
        dropIndex = idx;
      }
    });
    choices = choices.filter((_, idx) => idx !== dropIndex);
  }

  // [데드락 방지] 모든 선택지가 잠긴 경우 소진 엔딩
  const allLocked = choices.every(c => c.locked);
  if (allLocked && !state.ended) {
    const exhaustBtn = document.createElement("button");
    exhaustBtn.className = "choice-btn";
    exhaustBtn.textContent = "...\ub354 \uc774\uc0c1 \uc120\ud0dd\ud560 \uc218 \uc5c6\ub2e4.";
    exhaustBtn.onclick = () => {
      playSFX("type");
      triggerExhaustionEnding();
    };
    el.choiceContainer.appendChild(exhaustBtn);
    return;
  }

  choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";

    if (choice.locked) {
      btn.textContent = `${i + 1}. ${choice.label} (잠김)`;
      btn.disabled = true;
      el.choiceContainer.appendChild(btn);
      return;
    }

    const hintHp = addSanityHintNoise(choice.delta.hp);
    const hintComfort = addSanityHintNoise(choice.delta.comfort);
    const hintSanity = addSanityHintNoise(choice.delta.sanity);
    const hintMoney = addSanityHintNoise(choice.delta.money);
    const hintBond = addSanityHintNoise(choice.delta.bond);
    const iconParts = [
      hintHp ? `❤️ ${hintHp >= 0 ? "+" : ""}${hintHp}` : null,
      hintComfort ? `☁️ ${hintComfort >= 0 ? "+" : ""}${hintComfort}` : null,
      hintSanity ? `⭐ ${hintSanity >= 0 ? "+" : ""}${hintSanity}` : null,
      hintMoney ? `💰 ${hintMoney >= 0 ? "+" : ""}${hintMoney}` : null,
      hintBond ? `🎀 ${hintBond >= 0 ? "+" : ""}${hintBond}` : null,
    ].filter(Boolean);
    const iconHint = iconParts.length ? ` (${iconParts.join(", ")})` : "";
    btn.textContent = `${i + 1}. ${choice.label}${iconHint}`;
    btn.title = `${choice.delta.hp < 0 ? "⚠" : "♥"} HP ${choice.delta.hp >= 0 ? "+" : ""}${choice.delta.hp}, ${choice.delta.bond > 0 ? "♥" : "•"} Bond ${choice.delta.bond >= 0 ? "+" : ""}${choice.delta.bond}`;

    clearChoiceButton(btn);
    btn.onpointerenter = () => playSFX("hover");
    const isBreathChoice = /숨\s*고르기/.test(String(choice.label || ""));
    const holdRequired = !isBreathChoice && (
      choice.label.includes("수액")
      || choice.label.includes("안고")
      || choice.label.includes("눈맞춤")
      || choice.label.includes("숨 고르기")
    );
    if (holdRequired) {
      attachHoldBehavior(btn, () => launchChoiceInteraction(choice, scene));
    } else {
      btn.onclick = () => {
        playSFX("type");
        btn.classList.add("choice-btn-pressed");
        setTimeout(() => btn.classList.remove("choice-btn-pressed"), 200);
        launchChoiceInteraction(choice, scene);
      };
    }

    el.choiceContainer.appendChild(btn);
  });
}

function triggerExhaustionEnding() {
  if (state.ended) return;
  state.ended = true;

  state.ending = {
    code: "E",
    title: "소진",
    text: "몸도 마음도 멈춰버렸다.\n선택할 힘조차 남지 않은 밤, 라떼는 조용히 곁에 있었다.",
    epilogue: [
      "미안하다는 말도 못 했다.",
      "그냥 손을 잡고 있었다.",
      "라떼가 마지막으로 본 건, 울고 있는 나였다.",
      "",
      "그래도 끝까지 곁에 있었다.",
      "그것만은 사실이다.",
      "",
      "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
    ],
  };
  try { localStorage.setItem("ending_E", "true"); } catch (e) { /* private mode */ }

  if (state.sanityCollapseCount >= 1) state.ending.epilogue.push("기억에 빈 날들이 있다. 그 시간을 라떼는 혼자 보냈다.");
  if (state.moneyCollapseCount >= 1) state.ending.epilogue.push("빚이 남았다. 하지만 후회는 없다.");
  if (state.comfortCollapseCount >= 1) state.ending.epilogue.push("고통을 덜어주지 못한 밤들이 떠오른다.");

  state.condition = "Critical";
  typeText(el.sceneText, `[엔딩 ${state.ending.code}] ${state.ending.title}\n${state.ending.text}`);
  el.choiceContainer.innerHTML = "";

  addLogRow({
    date: dayText(state.day),
    time: TIME_NAMES[state.timeSlot],
    hp: state.hp,
    comfort: state.comfort,
    intake: state.intake,
    note: `엔딩 E: 소진 — 모든 선택지 소진`,
  });
  document.body.classList.add("finale-mode");
  playBGM("ending");

  setTimeout(() => {
    showEndingStage1(state.ending, () => {
      if (state.ending.epilogue.length > 0) {
        showEpilogue(state.ending.epilogue, () => startEndingCredits(state.ending));
      } else {
        startEndingCredits(state.ending);
      }
    });
  }, 300);
  saveProgress();
}

function triggerEnding() {
  if (state.ended) return;
  state.ended = true;

  const { hp, comfort, bond, hiddenPoint, money } = state;
  const sc = state.sanityCollapseCount || 0;
  const bc = state.bondCollapseCount || 0;
  const cc = state.comfortCollapseCount || 0;
  const mc = state.moneyCollapseCount || 0;
  const collapseTotal = state.collapseCounts.total || (sc + bc + cc + mc);

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
        `${GAME_TOTAL_DAYS}일 동안 매일 새벽에 일어났던 것이,`,
        "전부 사랑이었다는 것을.",
        "",
        "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
      ],
    };
  } else if (bond >= 80 && comfort >= 60 && sc <= 1 && bc === 0) {
    state.ending = {
      code: "A",
      title: "나의 라떼",
      text: "라떼가 꿈결처럼 떠났다.\n마지막까지 당신의 품이었다.",
      epilogue: [
        "마지막 체온이 손끝에서 사라졌다.",
        "울음이 멈추지 않았다.",
        "하지만 라떼의 마지막 표정은 편안했다.",
        "그것만으로 충분했다고, 언젠가 믿을 수 있을 것이다.",
        "",
        "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
      ],
    };
  } else if (hp >= 50) {
    state.ending = {
      code: "B",
      title: "병원에서의 사투",
      text: "끝까지 치료를 놓지 않았다.\n라떼는 병원에서 마지막을 맞았다.",
      epilogue: [
        "할 수 있는 것은 다 했다.",
        "그래도 남는 건 '더 할 수 있지 않았을까'라는 물음이다.",
        "시간이 지나면 답이 바뀔 수도 있다.",
        "",
        "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
      ],
    };
  } else if (comfort >= 65 && cc === 0) {
    state.ending = {
      code: "C",
      title: "자연의 섭리",
      text: "고통 없이, 평화롭게.\n라떼는 잠들 듯 별이 되었다.",
      epilogue: [
        "아프지 않았으면 좋겠다고 빌었다.",
        "마지막 숨이 고요했으니, 들어준 걸지도 모른다.",
        "꽃을 한 송이 놓았다. 라떼가 좋아하던 색으로.",
        "",
        "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
      ],
    };
  } else {
    state.ending = {
      code: "D",
      title: "고요한 이별",
      text: "흐린 날의 이별이 조용히 내려앉았다.",
      epilogue: [
        "더 잘할 수 있었을까. 답은 모르겠다.",
        "그래도 끝까지 곁에 있었다.",
        "그것만은 사실이다.",
        "",
        "어떤 선택을 하든, 당신은 좋은 보호자였습니다.",
      ],
    };
  }

  if (!Array.isArray(state.ending.epilogue)) state.ending.epilogue = [];
  if (sc >= 1) state.ending.epilogue.push("기억에 빈 날들이 있다. 그 시간을 라떼는 혼자 보냈다.");
  if (bc >= 1) state.ending.epilogue.push("내 손을 피하던 날들이 있었다.");
  if (cc >= 2) state.ending.epilogue.push("고통을 덜어주지 못한 밤들이 떠오른다.");
  if (mc >= 1) state.ending.epilogue.push("빚이 남았다. 하지만 후회는 없다.");
  if (money < 0) state.ending.epilogue.push("생활이 무너졌다. 하지만 라떼와의 시간은 돈으로 살 수 없었다.");
  if (state.usedPainkiller) state.ending.epilogue.push("마지막 며칠, 라떼는 고통 없이 지냈다. 하지만 눈빛은 이전과 달랐다.");

  try { localStorage.setItem(`ending_${state.ending.code}`, "true"); } catch (e) { /* private mode */ }

  state.condition = "Comfort";
  const e = state.ending;
  typeText(el.sceneText, `[엔딩 ${e.code}] ${e.title}\n${e.text}`);
  el.choiceContainer.innerHTML = "";

  addLogRow({
    date: "END",
    time: "-",
    hp: state.hp,
    comfort: state.comfort,
    intake: state.intake,
    note: `${e.code} ${e.title}`,
  });
  document.body.classList.add("finale-mode");
  playBGM("ending");
  if (!state.imagePreloaded.ending) {
    state.imagePreloaded.ending = true;
    preloadImages(PRELOAD_GROUPS.conditional.ending);
  }
  const cgFile = resolveEndingCG(e);
  state.endingCGKey = cgFile ? (e.code === "C" ? "peaceful" : "miracle") : null;
  setTimeout(() => {
    showEndingCG(cgFile, () => {
      showEndingStage1(e, () => {
        if (Array.isArray(e.epilogue) && e.epilogue.length > 0) {
          showEpilogue(e.epilogue, () => startEndingCredits(e));
        } else {
          startEndingCredits(e);
        }
      });
    });
  }, 300);
  saveProgress();
}

function showEndingStage1(ending, callback) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (continueBtn && continueBtn.parentNode) continueBtn.remove();
    if (callback) callback();
  };
  const continueBtn = document.createElement("button");
  continueBtn.className = "small ending-continue-btn";
  continueBtn.textContent = "계속";

  document.body.classList.add("ending-sepia");
  el.endingTitle.textContent = `[엔딩 ${ending.code}] ${ending.title}`;
  el.endingText.textContent = "";
  el.creditsRoll.innerHTML = "";
  el.endingOverlay.hidden = false;
  el.endingOverlay.classList.add("active");
  if (el.endingRestartBtn && el.endingRestartBtn.parentNode) {
    el.endingRestartBtn.hidden = true;
    el.endingRestartBtn.parentNode.insertBefore(continueBtn, el.endingRestartBtn);
  }

  typeText(el.endingText, ending.text);
  continueBtn.onclick = finish;
}

function showEpilogue(epilogueLines, callback) {
  const stale = el.endingOverlay.querySelector(".epilogue-container");
  if (stale) stale.remove();
  const container = document.createElement("div");
  container.className = "epilogue-container";
  el.creditsRoll.before(container);

  let lineIndex = 0;
  let done = false;
  const cleanup = () => container.removeEventListener("click", skipHandler);

  const finish = () => {
    if (done) return;
    done = true;
    cleanup();
    container.classList.add("fade-out");
    setTimeout(() => {
      container.remove();
      if (callback) callback();
    }, 800);
  };

  const showNextLine = () => {
    if (done) return;
    if (lineIndex >= epilogueLines.length) {
      finish();
      return;
    }
    const line = String(epilogueLines[lineIndex] || "");
    lineIndex += 1;
    if (line === "") {
      return;
    }

    const lineEl = document.createElement("p");
    lineEl.className = "epilogue-line";
    lineEl.textContent = line;
    container.appendChild(lineEl);
    requestAnimationFrame(() => lineEl.classList.add("visible"));

    const prevLines = container.querySelectorAll(".epilogue-line.visible");
    prevLines.forEach((prev, i) => {
      if (i < prevLines.length - 2) prev.classList.add("fading");
    });
  };

  const skipHandler = () => {
    if (done) return;
    const current = container.querySelector(".epilogue-line:last-child");
    if (current) current.classList.add("visible");
    showNextLine();
  };

  container.addEventListener("click", skipHandler);
  showNextLine();
}

function startEndingCredits(ending) {
  hideEndingCG();
  document.body.classList.add("ending-sepia");
  el.endingTitle.textContent = `ENDING: ${ending.title}`;
  el.endingText.textContent = ending.text;
  if (el.endingRestartBtn) el.endingRestartBtn.hidden = false;

  const lines = [];
  for (const row of el.logBody.querySelectorAll("tr")) {
    const cells = [...row.querySelectorAll("td")].map((c) => c.textContent.trim());
    lines.push(cells.join(" | "));
  }
  el.creditsRoll.innerHTML = `<div id="creditsContent" class="credits-content">${lines.join("\n")}</div>`;
  el.endingOverlay.hidden = false;
  el.endingOverlay.classList.add("active");
  requestAnimationFrame(() => {
    const content = document.getElementById("creditsContent");
    let y = el.creditsRoll.clientHeight;
    const tempo = (state.audio.currentBGM && state.audio.currentBGM.playbackRate) ? state.audio.currentBGM.playbackRate : 1;
    const speed = 0.32 + (tempo * 0.12);
    const tick = () => {
      y -= speed;
      content.style.transform = `translateY(${y}px)`;
      if (y + content.scrollHeight > 0) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function renderScene() {
  if (!state.minigame.active) cleanupVisualArtifacts();
  if (state.ended) {
    updateCondition();
    updateVisualsByTime(Math.min(state.timeSlot, 4));
    updateStatsUI();
    updateCatSprite(true);
    if (el.itemPanel) el.itemPanel.innerHTML = "";
    return;
  }

  updateCondition();
  updateVisualsByTime(state.timeSlot);
  updateAudioState();
  updateStatsUI();
  updateCatSprite(true);

  const scene = getSceneForCurrentTurn();
  el.backgroundCue.textContent = scene.cue;
  typeText(el.sceneText, scene.text);
  el.beeSuit.hidden = !scene.accessories.bee;
  el.cakeProp.hidden = !scene.accessories.cake;
  el.bookProp.hidden = !scene.accessories.book;
  renderChoices(scene);
  renderItemPanel();
}

function showPrologue() {
  if (state.typing.timer) clearInterval(state.typing.timer);
  state.typing.active = false;
  state.typing.timer = null;
  state.typing.fullText = "";
  state.typing.target = null;

  if (el.prologueOverlay) {
    el.prologueOverlay.hidden = false;
    el.prologueOverlay.style.display = "";
  }
  document.body.classList.add("prologue-mode");
  if (el.sceneText) el.sceneText.textContent = "";
  if (el.backgroundCue) el.backgroundCue.textContent = "";
  if (el.choiceContainer) el.choiceContainer.innerHTML = "";
  if (el.statusHint) el.statusHint.textContent = "";
  if (el.chapterLabel) el.chapterLabel.textContent = "PROLOGUE";
  if (el.dayLabel) el.dayLabel.textContent = "";
  if (el.timeLabel) el.timeLabel.textContent = "";
  if (el.beeSuit) el.beeSuit.hidden = true;
  if (el.cakeProp) el.cakeProp.hidden = true;
  if (el.bookProp) el.bookProp.hidden = true;
  if (el.emoteEffect) el.emoteEffect.classList.add("hidden");

  const line = prologueLines[prologueIndex];
  el.prologueText.textContent = line.text;
  document.body.style.filter = line.filter || "";
  el.prologueNextBtn.textContent = prologueIndex >= prologueLines.length - 1 ? "시작" : "다음";
}

function nextPrologue() {
  unlockAudioFromUserGesture();
  prologueIndex += 1;
  if (prologueIndex >= prologueLines.length) {
    el.prologueOverlay.style.display = "none";
    document.body.classList.remove("prologue-mode");
    document.body.style.filter = "";
    addLogRow({ date: "PROL", time: "-", hp: state.hp, comfort: state.comfort, intake: 0, note: "서늘한 응급실의 기억이 현재로 전환됨" });
    renderScene();
    saveProgress();
    return;
  }
  saveProgress();
  showPrologue();
}

function collectLogRows() {
  const rows = [];
  for (const row of el.logBody.querySelectorAll("tr")) {
    const cells = [...row.querySelectorAll("td")].map((c) => c.textContent.trim());
    if (cells.length === 6) {
      rows.push({
        date: cells[0],
        time: cells[1],
        hp: Number(cells[2]) || 0,
        comfort: Number(cells[3]) || 0,
        intake: Number(cells[4]) || 0,
        note: cells[5],
      });
    }
  }
  return rows;
}

function saveProgress() {
  if (state.minigame.active) return;
  const snapshot = {
    day: state.day,
    timeSlot: state.timeSlot,
    hp: state.hp,
    comfort: state.comfort,
    sanity: state.sanity,
    money: state.money,
    bond: state.bond,
    hiddenPoint: state.hiddenPoint,
    spoonBest: state.spoonBest,
    intake: state.intake,
    dailyIntake: state.dailyIntake,
    dailyEfficiencyBuff: state.dailyEfficiencyBuff,
    todayCommuted: state.todayCommuted,
    lastCrisisDay: state.lastCrisisDay,
    crisisCooldownUntil: state.crisisCooldownUntil,
    lastRandomDay: state.lastRandomDay,
    collapseCounts: state.collapseCounts,
    sanityCollapseCount: state.sanityCollapseCount,
    bondCollapseCount: state.bondCollapseCount,
    comfortCollapseCount: state.comfortCollapseCount,
    moneyCollapseCount: state.moneyCollapseCount,
    usedPainkiller: state.usedPainkiller,
    bondHideTimer: state.bondHideTimer,
    sanityBlackoutDay: state.sanityBlackoutDay,
    dayStartSnapshot: state.dayStartSnapshot,
    pendingSanityBlackout: state.pendingSanityBlackout,
    pendingComfortCollapseChoice: state.pendingComfortCollapseChoice,
    pendingMoneyCollapseChoice: state.pendingMoneyCollapseChoice,
    pendingSanityBreakChoice: state.pendingSanityBreakChoice,
    sanityBreakEventShown: state.sanityBreakEventShown,
    itemCooldowns: state.itemCooldowns,
    lastActionContext: state.lastActionContext,
    endingCGKey: state.endingCGKey,
    sprite: state.sprite,
    imagePreloaded: state.imagePreloaded,
    condition: state.condition,
    ended: state.ended,
    ending: state.ending,
    prologueIndex,
    prologueDone: el.prologueOverlay.style.display === "none",
    audioMuted: state.audio.muted,
    audioStartedByUser: state.audio.startedByUser,
    logs: collectLogRows(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  } catch (_) { }
}

function clearProgress() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (_) { }
}

function restoreProgress() {
  let raw = null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch (_) {
    return false;
  }
  if (!raw) return false;

  let data = null;
  try {
    data = JSON.parse(raw);
  } catch (_) {
    return false;
  }
  if (!data || typeof data !== "object") return false;

  const keys = ["day", "timeSlot", "hp", "comfort", "sanity", "money", "bond", "hiddenPoint", "spoonBest", "intake", "dailyIntake", "lastCrisisDay", "crisisCooldownUntil", "lastRandomDay"];
  for (const key of keys) {
    if (typeof data[key] === "number") state[key] = data[key];
  }
  if (typeof data.dailyEfficiencyBuff === "number") state.dailyEfficiencyBuff = clamp(data.dailyEfficiencyBuff, 1, 1.3);
  state.todayCommuted = Boolean(data.todayCommuted);
  state.ended = Boolean(data.ended);
  state.ending = data.ending && typeof data.ending === "object" ? data.ending : null;
  if (data.collapseCounts && typeof data.collapseCounts === "object") {
    for (const key of ["hp", "comfort", "sanity", "money", "bond", "total"]) {
      if (typeof data.collapseCounts[key] === "number") {
        state.collapseCounts[key] = Math.max(0, Math.floor(data.collapseCounts[key]));
      }
    }
  }
  if (typeof data.sanityCollapseCount === "number") state.sanityCollapseCount = Math.max(0, Math.floor(data.sanityCollapseCount));
  if (typeof data.bondCollapseCount === "number") state.bondCollapseCount = Math.max(0, Math.floor(data.bondCollapseCount));
  if (typeof data.comfortCollapseCount === "number") state.comfortCollapseCount = Math.max(0, Math.floor(data.comfortCollapseCount));
  if (typeof data.moneyCollapseCount === "number") state.moneyCollapseCount = Math.max(0, Math.floor(data.moneyCollapseCount));
  state.usedPainkiller = Boolean(data.usedPainkiller);
  if (typeof data.bondHideTimer === "number") state.bondHideTimer = Math.max(0, Math.floor(data.bondHideTimer));
  if (typeof data.sanityBlackoutDay === "number") state.sanityBlackoutDay = Math.max(0, Math.floor(data.sanityBlackoutDay));
  if (data.dayStartSnapshot && typeof data.dayStartSnapshot === "object") {
    state.dayStartSnapshot = { ...data.dayStartSnapshot };
  }
  state.pendingSanityBlackout = Boolean(data.pendingSanityBlackout);
  state.pendingComfortCollapseChoice = Boolean(data.pendingComfortCollapseChoice);
  state.pendingMoneyCollapseChoice = Boolean(data.pendingMoneyCollapseChoice);
  state.pendingSanityBreakChoice = Boolean(data.pendingSanityBreakChoice);
  state.sanityBreakEventShown = Boolean(data.sanityBreakEventShown);
  if (data.itemCooldowns && typeof data.itemCooldowns === "object") {
    for (const key of Object.keys(state.itemCooldowns)) {
      if (typeof data.itemCooldowns[key] === "number") {
        state.itemCooldowns[key] = Math.max(0, Math.floor(data.itemCooldowns[key]));
      }
    }
  }
  state.lastActionContext = typeof data.lastActionContext === "string" ? data.lastActionContext : null;
  state.endingCGKey = typeof data.endingCGKey === "string" ? data.endingCGKey : null;
  if (data.sprite && typeof data.sprite === "object") {
    state.sprite = { ...state.sprite, ...data.sprite };
  }
  if (data.imagePreloaded && typeof data.imagePreloaded === "object") {
    state.imagePreloaded = { ...state.imagePreloaded, ...data.imagePreloaded };
  }
  state.systemMessages = [];
  state.condition = typeof data.condition === "string" ? data.condition : state.condition;
  state.audio.muted = Boolean(data.audioMuted);
  state.audio.startedByUser = Boolean(data.audioStartedByUser);
  state.turnKey = "";
  state.turnCrisis = null;
  state.turnRandom = null;

  prologueIndex = typeof data.prologueIndex === "number" ? clamp(data.prologueIndex, 0, prologueLines.length) : 0;
  el.logBody.innerHTML = "";
  if (Array.isArray(data.logs)) {
    for (const row of data.logs) addLogRow(row);
  }

  if (data.prologueDone) {
    el.prologueOverlay.style.display = "none";
    document.body.classList.remove("prologue-mode");
    renderScene();
    if (state.ended && state.ending) {
      startEndingCredits(state.ending);
    }
  } else {
    showPrologue();
  }
  setAudioMuted(state.audio.muted);
  return true;
}

function logDayTextsRuntimeCheck() {
  const targets = [
    [Math.max(3, GAME_TOTAL_DAYS - 4), 3],
    [GAME_TOTAL_DAYS, 0],
    [GAME_TOTAL_DAYS, 1],
    [GAME_TOTAL_DAYS, 2],
    [GAME_TOTAL_DAYS, 3],
    [GAME_TOTAL_DAYS, 4],
  ];
  for (const [day, slot] of targets) {
    const scene = getEventForDay(day, slot);
    console.log(`[DAY_TEXTS CHECK] D${day}-S${slot} cue="${scene.cue}" text="${scene.text}"`);
  }
}

if (el.latteSprite) {
  el.latteSprite.addEventListener("load", () => {
    resolveLoadedSpriteVisibility();
  });
  el.latteSprite.addEventListener("error", () => {
    const currentTarget = el.latteSprite.getAttribute("data-src") || el.latteSprite.src || "";
    const fallbackSrc = `assets/images/${getFallbackSpriteFileFromTarget(currentTarget)}`;
    if (el.latteSprite.getAttribute("data-src") !== fallbackSrc) {
      el.latteSprite.setAttribute("data-src", fallbackSrc);
      el.latteSprite.src = toSpriteAssetUrl(fallbackSrc);
      return;
    }
    showFallbackSprite();
  });
}
if (el.catCanvas) {
  el.catCanvas.hidden = true;
}
window.addEventListener("resize", () => {
  if (el.emoteEffect && !el.emoteEffect.classList.contains("hidden")) {
    positionEmoteAboveLatteHead();
  }
});

function exportLog() {
  const lines = ["SEASON OF LATTE - 보호자 기록", "", "날짜\t시간\t체력\t편안함\t섭취량\t비고"];
  for (const row of el.logBody.querySelectorAll("tr")) {
    const cells = [...row.querySelectorAll("td")].map((c) => c.textContent.trim());
    lines.push(cells.join("\t"));
  }
  if (state.ending) lines.push(`\n엔딩: ${state.ending.code} ${state.ending.title}`);

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "latte_record.txt";
  a.click();
  URL.revokeObjectURL(url);
}

el.prologueNextBtn.addEventListener("click", nextPrologue);
el.minigameCancelBtn.addEventListener("click", closeMinigame);
el.sceneText.addEventListener("click", skipTypingIfNeeded);
document.addEventListener("click", skipTypingIfNeeded);
el.endingRestartBtn.addEventListener("click", () => {
  clearProgress();
  stopBGM();
  window.location.reload();
});
if (el.audioToggleBtn) {
  el.audioToggleBtn.addEventListener("click", () => {
    const nextMuted = !state.audio.muted;
    if (nextMuted) {
      setAudioMuted(true);
      updateAudioState();
      saveProgress();
      return;
    }
    setAudioMuted(false);
    unlockAudioFromUserGesture();
    recoverAudioPlayback(true);
    updateAudioState();
    saveProgress();
  });
}
el.exportBtn.addEventListener("click", exportLog);
el.restartBtn.addEventListener("click", () => {
  clearProgress();
  stopBGM();
  window.location.reload();
});

async function bootstrapGame() {
  assertAudioKeysOnce();
  await initImageResources();
  await preloadAudioEngine();
  setAudioMuted(state.audio.muted);
  document.addEventListener("pointerdown", unlockAudioFromUserGesture, { once: true });
  document.addEventListener("keydown", unlockAudioFromUserGesture, { once: true });
  document.addEventListener("touchstart", unlockAudioFromUserGesture, { once: true });
  if (!restoreProgress()) showPrologue();
  setInterval(() => {
    if (!state.ended && state.audio.startedByUser) {
      ensureBGMPlaying();
    }
  }, 1200);
  setInterval(() => {
    if (!state.minigame.active) {
      document.body.classList.remove("minigame-fail");
      cleanupVisualArtifacts();
    }
  }, 800);
  logDayTextsRuntimeCheck();
}

bootstrapGame();
