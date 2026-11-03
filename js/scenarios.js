// 리얼 카톡/채팅 뷰 & 타임어택 & 미니게임 연동 시나리오 데이터
const SCENARIOS = {
    // ==========================================
    // CHAPTER 1: 신천지 모략 전도 & 센터 편
    // ==========================================
    c1_start: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 강남역 11번 출구 앞 (저녁 7시)",
        timeLimit: 6, // 6초 타임어택
        messages: [
            "저기요! 죄송한데 혹시 대학생이신가요? 🥺",
            "저희가 이번 졸업작품으로 웹툰 스토리 콘티 짜고 있거든요!",
            "딱 1분만 간단한 설문조사 가능할까요? 커피 기프티콘도 드려요!"
        ],
        choices: [
            { text: "🎧 (에어팟 노캔 켜고 눈길도 안 준 채 쌩 지나간다)", next: "ending_ironwall", doubt: 30 },
            { text: "저 직장인인데요. 바빠서 가봐야 합니다.", next: "c1_street_push", doubt: 15 },
            { text: "아.. 네. 진짜 1분만이면 해드릴게요.", next: "c1_minigame_sticker", mentalDmg: 15 }
        ],
        timeout: {
            text: "(머뭇거리며 멈춰 섰다..)",
            next: "c1_street_push",
            mentalDmg: 15
        }
    },
    c1_street_push: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 끈질긴 추격",
        timeLimit: 5,
        messages: [
            "어머! 직장인 분들 현실 피드백이 진짜 너무 절실했거든요!!",
            "태블릿에 스티커 딱 하나만 붙여주시면 돼요 제발요 ㅠㅠ",
            "저희 이번에 통과 못하면 진짜 졸업 유급당해요..."
        ],
        choices: [
            { text: "🚨 \"길에서 테이블 깔고 이러시면 불법 적치물 위반입니다.\"", next: "ending_police_call", doubt: 50 },
            { text: "하.. 알겠어요. 스티커만 얼른 붙이고 갈게요.", next: "c1_minigame_sticker", mentalDmg: 20 },
            { text: "(전화기 귀에 대며) \"어 엄마? 어 지금 역 앞이야!\"", next: "ending_sharp_escape", doubt: 20 }
        ],
        timeout: {
            text: "(눈이 마주치자 태블릿을 불쑥 들이밀었다)",
            next: "c1_minigame_sticker",
            mentalDmg: 20
        }
    },
    // 미니게임 1: 스티커 붙이기
    c1_minigame_sticker: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 태블릿 설문지 작성",
        minigame: "sticker",
        messages: [
            "우와 감사해요! 여기 태블릿 화면에 보이는 문항에 스티커 하나만 꾹 붙여주세요!"
        ],
        // 미니게임 완료 시 넘어갈 씬
        nextAfterMinigame: "c1_minigame_shape"
    },
    // 미니게임 2: 도형 심리테스트
    c1_minigame_shape: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 도형 심리분석 낚시",
        minigame: "shape",
        messages: [
            "답변 감사해요! 보답으로 대박 재미있는 도형 심리테스트 해드릴게요 ✨",
            "화면에 보이는 동그라미(○), 세모(△), 네모(□), 지그재그(S) 중 제일 끌리는 도형 1개를 눌러보세요!"
        ],
        nextAfterMinigame: "c1_shape_reaction"
    },
    c1_shape_reaction: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 심리 분석 사기",
        timeLimit: 6,
        messages: [
            "헐... 대박... 소름 돋아 😱",
            "혹시 요즘 겉으로는 밝고 씩씩한 척하지만...",
            "속으로는 미래나 인간관계 때문에 혼자 끙끙 앓고 계시지 않나요?",
            "기질이 너무 맑은데 영적으로 많이 지쳐 보이세요."
        ],
        choices: [
            { text: "\"어.. 맞아요! 어떻게 아셨어요?\" (신기해한다)", next: "c1_cafe_invite", mentalDmg: 25 },
            { text: "\"누구나 다 겪는 바넘 효과(Barnum Effect)네요.\" (냉소)", next: "c1_skeptic", doubt: 35 },
            { text: "\"저 심리학 전공자인데 수법 다 보입니다. 가세요.\"", next: "ending_sharp_escape", doubt: 40 }
        ],
        timeout: {
            text: "(말문이 막혀 고개를 끄덕이고 말았다)",
            next: "c1_cafe_invite",
            mentalDmg: 25
        }
    },
    c1_skeptic: {
        chapter: 1,
        sender: "은지의 친구 (바람잡이)",
        avatar: "👩‍🦰",
        bg: "bg-street",
        location: "📍 바람잡이 투입",
        timeLimit: 5,
        messages: [
            "와.. 눈치가 진짜 빠르시다! 성향 통찰력이 남다르신데요?",
            "사실 제 친구가 단순 학생이 아니라 한국상담심리연구원 인턴이에요.",
            "길거리라 쌀쌀한데, 제가 스벅에서 따뜻한 아메리카노 살게요! 10분만 대화 나눠봐요."
        ],
        choices: [
            { text: "공짜 커피니까.. 10분만 얘기 듣자.", next: "c1_cafe_room", mentalDmg: 25 },
            { text: "\"저 신용불량자라 마실 자격이 없습니다.\" (단칼 거절)", next: "ending_sharp_escape", doubt: 30 }
        ],
        timeout: {
            text: "(분위기에 휩쓸려 카페로 발걸음을 옮겼다)",
            next: "c1_cafe_room",
            mentalDmg: 30
        }
    },
    c1_cafe_invite: {
        chapter: 1,
        sender: "설문조사 대학생 은지",
        avatar: "👩‍🎓",
        bg: "bg-street",
        location: "📍 사랑의 폭탄 (Love-Bombing)",
        timeLimit: 5,
        messages: [
            "제가 상담 공부 3년째인데 이렇게 맑고 섬세한 분 진짜 오랜만에 봐요!",
            "이대로 두면 주변 사람들한테 기만 다 빨려요 ㅠㅠ",
            "제가 바로 앞 카페에서 커피 살게요! 기질 보완하는 비법 딱 10분만 알려드릴게요."
        ],
        choices: [
            { text: "커피 한 잔 얻어마시러 따라간다.", next: "c1_cafe_room", mentalDmg: 30 },
            { text: "\"약속 시간 다 돼서 가봐야 합니다.\" 칼거절", next: "ending_sharp_escape", doubt: 25 }
        ],
        timeout: {
            text: "(어색하게 미소 지으며 카페로 끌려갔다)",
            next: "c1_cafe_room",
            mentalDmg: 30
        }
    },
    c1_cafe_room: {
        chapter: 1,
        sender: "은지 & 우연한 선배",
        avatar: "👩‍💼",
        bg: "bg-cafe",
        location: "📍 조용한 룸카페 (밀실)",
        timeLimit: 6,
        messages: [
            "(룸카페 문이 벌컥 열리며 30대 여성이 들어온다)",
            "어머! 은지야 여기서 뭐 해?! 😮",
            "은지: \"어?? 팀장님! 웬일이세요? 대박! 저번에 말씀드린 그 상담협회 수석 멘토님이신데 진짜 소름 돋는 우연이다! 인사해요, 예약 잡기도 힘든 분이야!\""
        ],
        choices: [
            { text: "(우연이 너무 딱 맞아떨어지는데..? 의심한다)", next: "c1_room_doubt", doubt: 40 },
            { text: "대단한 분인가 보다 하고 깍듯하게 인사한다.", next: "c1_room_deep", mentalDmg: 35 }
        ],
        timeout: {
            text: "(얼떨결에 같이 마주 앉아 인사를 나누었다)",
            next: "c1_room_deep",
            mentalDmg: 35
        }
    },
    c1_room_doubt: {
        chapter: 1,
        sender: "은지의 폰 [텔레그램]",
        avatar: "📱",
        bg: "bg-cafe",
        location: "📍 텔레그램 지령 포착",
        timeLimit: 6,
        messages: [
            "팀장이라는 사람이 내 손을 잡고 눈을 지그시 응시한다.",
            "그 순간, 테이블 위 은지의 폰 화면에 [텔레그램] 알림이 떴다!",
            "『구역장님 지침: 대상자 지금 눈치챘으니 가족 갈등 찔러서 고립시키세요. 잎사귀 투입 완료』"
        ],
        choices: [
            { text: "🚨 폰을 가리키며 \"너네 신천지지? 당장 경찰 부른다!\"", next: "ending_police_call", doubt: 50 },
            { text: "소름이 돋아 벌떡 일어나서 가방 챙겨 도망친다.", next: "ending_awkward_escape", doubt: 30 },
            { text: "(너무 무서워서 모르는 척 굳어버린다)", next: "c1_room_deep", mentalDmg: 35 }
        ],
        timeout: {
            text: "(공포에 질려 아무 말도 하지 못했다)",
            next: "c1_room_deep",
            mentalDmg: 35
        }
    },
    c1_room_deep: {
        chapter: 1,
        sender: "상담 수석 멘토",
        avatar: "👩‍💼",
        bg: "bg-cafe",
        location: "📍 비밀 유지 서약 강요",
        timeLimit: 5,
        messages: [
            "당신 영혼에 짙은 상처가 있어요. 이건 인문학 성경 말씀으로 치유해야 해요.",
            "저희가 비밀리에 여는 무료 '선교 센터'가 있는데...",
            "⚠️ 단! 이건 가족이나 친구, 교회 목사님께 절대 말하면 안 돼요.",
            "영이 어린 사람들에게 말하면 마귀가 틈타서 복을 뺏어가거든요. 약속할 수 있죠?"
        ],
        choices: [
            { text: "가족에게 비밀로 하라는 순간 100% 사이비다! 박차고 나간다.", next: "ending_awkward_escape", doubt: 35 },
            { text: "\"네.. 제 인생이 바뀔 수 있다면 가볼게요..\"", next: "c1_center_inside", mentalDmg: 40 }
        ],
        timeout: {
            text: "(가스라이팅에 짓눌려 고개를 끄덕이고 말았다)",
            next: "c1_center_inside",
            mentalDmg: 40
        }
    },
    c1_center_inside: {
        chapter: 1,
        sender: "센터 총괄 강사",
        avatar: "🧑‍🏫",
        bg: "bg-center",
        location: "📍 간판 없는 상가 3층 (시온센터)",
        timeLimit: 4,
        messages: [
            "(철문을 열자 흰 셔츠를 입은 수십 명이 일제히 박수를 친다)",
            "자, 마귀가 틈타지 못하게 휴대폰은 전부 바구니에 제출하세요!",
            "가족들에게는 취업 스터디 늦게 끝난다고 카톡 보내세요!"
        ],
        choices: [
            { text: "탈출하기! 문을 박차고 도망친다!", next: "c1_fake_run", fakeButton: true },
            { text: "(공포에 질려 휴대폰을 바구니에 낸다)", next: "ending_center_114", mentalDmg: 50 }
        ],
        timeout: {
            text: "(신도들이 둘러싸며 휴대폰을 뺏어갔다)",
            next: "ending_center_114",
            mentalDmg: 50
        }
    },
    c1_fake_run: {
        chapter: 1,
        sender: "흰 셔츠 무리",
        avatar: "👥",
        bg: "bg-center",
        location: "📍 세뇌실 감금",
        timeLimit: 3,
        messages: [
            "여러 명의 신도들이 당신의 팔과 어깨를 부드럽지만 단단히 옭아맨다.",
            "\"사탄의 유혹에 빠지시면 안 돼요... 앉으세요. 앉으세요.\""
        ],
        choices: [
            { text: "앉아 앉아 앉아 앉아 앉아", next: "ending_fake_glitch", glitch: true }
        ],
        timeout: {
            text: "의식이 붕괴된다...",
            next: "ending_fake_glitch"
        }
    },

    // ==========================================
    // CHAPTER 2: 대순진리회 조상 제사 & 치성비 편
    // ==========================================
    c2_start: {
        chapter: 2,
        sender: "공손한 도믿맨",
        avatar: "🧑‍🌾",
        bg: "bg-street",
        location: "📍 영등포역 지하상가 근처",
        timeLimit: 6,
        messages: [
            "실례합니다! 길 좀 여쭐게요 🙏",
            "혹시 이 근처에 구민회관이 어디쯤인가요?",
            "저희가 폰 배터리가 다 나가서 지도를 못 보고 있어서요..."
        ],
        choices: [
            { text: "\"스마트폰 켜져 있는데요?\" (손에 든 폰을 찌른다)", next: "c2_caught_phone", doubt: 30 },
            { text: "\"저쪽으로 가시면 돼요.\" (길만 알려준다)", next: "c2_praise", mentalDmg: 10 },
            { text: "(대꾸도 없이 앞만 보고 직진한다)", next: "ending_ironwall", doubt: 20 }
        ],
        timeout: {
            text: "(길을 알려주려 멈춰 섰다)",
            next: "c2_praise",
            mentalDmg: 10
        }
    },
    c2_caught_phone: {
        chapter: 2,
        sender: "공손한 도믿맨",
        avatar: "🧑‍🌾",
        bg: "bg-street",
        location: "📍 길거리 대치",
        timeLimit: 5,
        messages: [
            "아.. 화면이 먹통이라서요 ㅎㅎ;",
            "그런데 선생님, 길을 떠나서...",
            "얼굴에 조상님의 지극한 공덕이 흐르고 계십니다.",
            "하지만 눈 밑에 아주 짙은 우환과 액운의 그늘이 드리워져 있네요."
        ],
        choices: [
            { text: "\"도를 아십니까 레퍼토리 아직도 쓰나요?\" 비웃는다.", next: "ending_sharp_escape", doubt: 30 },
            { text: "\"제 조상님이요..? 그늘이요..?\" (살짝 솔깃)", next: "c2_teahouse", mentalDmg: 20 }
        ],
        timeout: {
            text: "(그늘이라는 말에 마음이 덜컥 내려앉았다)",
            next: "c2_teahouse",
            mentalDmg: 20
        }
    },
    c2_praise: {
        chapter: 2,
        sender: "공손한 도믿맨",
        avatar: "🧑‍🌾",
        bg: "bg-street",
        location: "📍 조상님의 눈물",
        timeLimit: 5,
        messages: [
            "말씀하시는 목소리에 영기(靈氣)가 가득하시네요!",
            "대대로 덕을 많이 쌓으신 집안의 귀한 자손이십니다.",
            "그런데 지금 조상님 한 분이 억울하게 구천을 떠돌며 목이 타 울고 계십니다...",
            "자손이 정성을 드리지 않아 인생이 자꾸 꼬이는 거예요."
        ],
        choices: [
            { text: "\"제 인생 잘 풀리고 있는데요? 헛소리 마세요.\"", next: "ending_sharp_escape", doubt: 25 },
            { text: "\"따뜻한 찻집 가서 10분만 액운 푸는 법 들으시죠.\"에 이끌린다.", next: "c2_teahouse", mentalDmg: 25 }
        ],
        timeout: {
            text: "(찝찝한 마음에 찻집으로 따라 들어갔다)",
            next: "c2_teahouse",
            mentalDmg: 25
        }
    },
    c2_teahouse: {
        chapter: 2,
        sender: "선무 & 교정",
        avatar: "🍵",
        bg: "bg-cafe",
        location: "📍 전통 찻집 액운 가스라이팅",
        timeLimit: 6,
        messages: [
            "선생님, 올해 안에 집안에 큰 상(喪)이나 금전 파탄이 날 액운이 끼었어요.",
            "다행히 저희 도장에 아주 영험한 상급 선감님이 계십니다.",
            "오늘 딱 30분만 조상님께 맑은 물 올리고 사배(절 4번) 드리면 모든 액운이 복으로 바뀝니다!",
            "택시비도 저희가 낼 테니 지금 당장 가시죠."
        ],
        choices: [
            { text: "\"간판 없는 빌라 도장 가면 감금이라던데요? 안 갑니다.\"", next: "ending_sharp_escape", doubt: 40 },
            { text: "가족이 다친다는 말에 겁을 먹고 택시에 오른다.", next: "c2_altar_inside", mentalDmg: 35 }
        ],
        timeout: {
            text: "(불안감에 휩쓸려 택시에 타버렸다)",
            next: "c2_altar_inside",
            mentalDmg: 35
        }
    },
    c2_altar_inside: {
        chapter: 2,
        sender: "상급 선감",
        avatar: "🕯️",
        bg: "bg-altar",
        location: "📍 간판 없는 빌라 4층 치성소",
        timeLimit: 5,
        messages: [
            "(암막 커튼이 쳐진 방, 향 냄새와 촛불 제단 앞에 흰 한복 입은 무리가 서 있다)",
            "몸과 마음에 낀 부정을 씻어야 합니다.",
            "속옷만 남기고 이 정결한 백의(흰 한복)로 환복하세요."
        ],
        choices: [
            { text: "\"옷을 왜 벗어요 미쳤습니까? 당장 나갑니다!\"", next: "c2_door_blocked", doubt: 35 },
            { text: "(위압적인 분위기에 눌려 한복으로 갈아입는다)", next: "c2_minigame_tap", mentalDmg: 35 }
        ],
        timeout: {
            text: "(기세에 눌려 엉겁결에 한복을 받아 들었다)",
            next: "c2_minigame_tap",
            mentalDmg: 35
        }
    },
    c2_door_blocked: {
        chapter: 2,
        sender: "건장한 신도들",
        avatar: "🥋",
        bg: "bg-altar",
        location: "📍 출구 봉쇄",
        timeLimit: 5,
        messages: [
            "(건장한 신도 2명이 현관문을 막아선다)",
            "선생님, 여기서 그냥 나가시면 발걸음 닿는 곳마다 조상님 원귀가 붙습니다.",
            "부모님이 길 가다 차에 치이셔도 괜찮습니까?",
            "딱 10분 정성만 올리고 가세요."
        ],
        choices: [
            { text: "🚨 \"스마트폰 112 긴급 SOS 눌렀습니다. 경찰 옵니다!\"", next: "ending_police_call", doubt: 50 },
            { text: "겁에 질려 울먹이며 제단 앞으로 돌아간다.", next: "c2_minigame_tap", mentalDmg: 40 }
        ],
        timeout: {
            text: "(협박에 못 이겨 제단으로 돌아갔다)",
            next: "c2_minigame_tap",
            mentalDmg: 40
        }
    },
    // 미니게임 3: 송금 취소 10회 광클 미니게임!
    c2_minigame_tap: {
        chapter: 2,
        sender: "상급 선감",
        avatar: "🕯️",
        bg: "bg-altar",
        location: "📍 치성비 100만 원 요구",
        minigame: "tap_cancel",
        messages: [
            "절을 수십 번 올리자 선감이 태블릿 송금 화면을 들이민다.",
            "\"조상님 해원과 100일 정성비로 100만 원을 올려야 합니다.\"",
            "⚠️ 카카오페이 100만 원 송금 승인 진행 중... 취소 버튼을 10번 광클해서 지갑을 사수하세요!"
        ],
        nextAfterMinigame: "ending_wallet_guard",
        failEnding: "ending_ancestor_debt"
    },

    // ==========================================
    // CHAPTER 3: 소모임 & 데이팅앱 '잎사귀' 편
    // ==========================================
    c3_start: {
        chapter: 3,
        sender: "소모임 호감 이성 민서",
        avatar: "💃",
        bg: "bg-bar",
        location: "📍 성수동 감성 와인바",
        timeLimit: 6,
        messages: [
            "OO씨 오늘 나와줘서 너무 고마워요 ㅎㅎ 와인 맛있죠?",
            "진짜 OO씨는 따뜻하고 빛나는 사람인데...",
            "주변에서 많이 외롭고 힘들었겠다 ㅠㅠ 저도 작년에 번아웃 와서 죽을 뻔했거든요.",
            "근데 저를 완전히 구원해 준 인생 멘토님이 계세요. OO씨 꼭 소개해주고 싶어요!"
        ],
        choices: [
            { text: "\"멘토님? 데이트하러 와서 갑자기 웬 멘토 얘기예요?\"", next: "c3_doubt_check", doubt: 35 },
            { text: "\"와, 민서씨가 추천하는 분이면 저도 꼭 뵙고 싶어요!\"", next: "c3_study_room", mentalDmg: 25 }
        ],
        timeout: {
            text: "(미소에 홀려 고개를 끄덕였다)",
            next: "c3_study_room",
            mentalDmg: 25
        }
    },
    c3_doubt_check: {
        chapter: 3,
        sender: "소모임 호감 이성 민서",
        avatar: "💃",
        bg: "bg-bar",
        location: "📍 감정 조작 (가스라이팅)",
        timeLimit: 5,
        messages: [
            "(민서가 시무룩한 표정으로 와인잔을 만지작거린다)",
            "OO씨한테 정말 도움 주고 싶어서 어렵게 부탁드린 건데...",
            "저를 그렇게 못 믿으세요? 서운해요...",
            "제가 무슨 이상한 사이비라도 되는 줄 아시나 봐요 ㅠㅠ"
        ],
        choices: [
            { text: "\"미안해요 민서씨, 제가 예민했나 봐요. 만나볼게요.\"", next: "c3_study_room", mentalDmg: 30 },
            { text: "\"소모임에 신천지 위장 잠입 많다던데 그 패턴 그대로네요.\" 자리에서 일어난다.", next: "ending_dating_scam", doubt: 45 }
        ],
        timeout: {
            text: "(미안한 마음에 사과하며 만나겠다고 해버렸다)",
            next: "c3_study_room",
            mentalDmg: 30
        }
    },
    c3_study_room: {
        chapter: 3,
        sender: "위장 스터디룸 수강생들",
        avatar: "👥",
        bg: "bg-cafe",
        location: "📍 강남 위장 스터디룸",
        timeLimit: 5,
        messages: [
            "멘토라는 중년 신사와 인문학 스터디를 시작했다.",
            "그런데 다른 수강생 3명이 멘토의 말마다 \"아멘!\", \"와 맞아요!\" 하며 과하게 호응한다.",
            "사실 민서를 포함해 방 안의 모든 사람이 신천지 '잎사귀(바람잡이)'들이다."
        ],
        choices: [
            { text: "종교 집단 냄새가 너무 난다. 화장실 핑계로 탈출한다!", next: "ending_sharp_escape", doubt: 40 },
            { text: "\"다들 열심히 배우네.. 나도 집중해야지.\" 마음을 연다.", next: "c3_secret_pledge", mentalDmg: 35 }
        ],
        timeout: {
            text: "(분위기에 압도되어 계속 앉아 있었다)",
            next: "c3_secret_pledge",
            mentalDmg: 35
        }
    },
    c3_secret_pledge: {
        chapter: 3,
        sender: "멘토 (신천지 강사)",
        avatar: "🧑‍🏫",
        bg: "bg-cafe",
        location: "📍 비밀 유지 서약서",
        timeLimit: 5,
        messages: [
            "오늘 들은 이 말씀은 영적 비밀입니다.",
            "가족이나 친구에게 말하면 사탄이 그들을 통해 당신을 시험에 들게 할 겁니다.",
            "다른 사람에게 절대 발설하지 않겠다는 서약서에 서명하세요."
        ],
        choices: [
            { text: "가족에게 비밀로 하라는 순간 100% 이단이다! 서약서를 찢는다.", next: "ending_awkward_escape", doubt: 50 },
            { text: "민서의 손을 꼭 잡으며 서약서에 서명한다.", next: "ending_cult_leaf", mentalDmg: 50 }
        ],
        timeout: {
            text: "(얼떨결에 서약서에 이름을 쓰고 말았다)",
            next: "ending_cult_leaf",
            mentalDmg: 50
        }
    }
};

const CHAPTER_INFO = [
    {
        id: 1,
        startKey: "c1_start",
        tag: "신천지 모략 전도",
        title: "강남역 11번 출구의 덫",
        desc: "웹툰 설문조사, 태블릿 스티커 붙이기, 도형 심리검사, 룸카페 잎사귀 투입, 시온센터 감금!",
        icon: "📍"
    },
    {
        id: 2,
        startKey: "c2_start",
        tag: "대순진리회 치성/제사",
        title: "조상님의 목마름",
        desc: "길 묻기 위장 접근, \"인상이 맑으신데 조상님 원한이...\", 간판 없는 빌라 도장과 100만원 치성비 광클 방어!",
        icon: "🕯️"
    },
    {
        id: 3,
        startKey: "c3_start",
        tag: "소모임 & 연애 포교",
        title: "달콤한 소모임과 잎사귀",
        desc: "소모임 앱에서 만난 완벽한 이상형. 모든 호감과 공감이 철저히 기획된 '잎사귀'의 모략이었다면?",
        icon: "💌"
    }
];
