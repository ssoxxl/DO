// 3대 현실 고증 시나리오 챕터 데이터
const SCENARIOS = {
    // ==========================================
    // CHAPTER 1: 신천지 모략 전도 & 센터 편
    // ==========================================
    c1_start: {
        chapter: 1,
        title: "강남역 11번 출구 앞의 그림자",
        theme: "normal",
        badge: "📍 강남역 11번 출구 앞",
        text: "평일 저녁 7시, 강남역 11번 출구 앞은 퇴근길 인파로 붐빕니다.\n\n갑자기 단정한 옷차림의 20대 여성 2명이 생글생글 웃으며 당신 앞을 살포시 가로막습니다.\n\n\"저기요! 죄송한데 대학생이신가요? 저희가 졸업 작품으로 웹툰 스토리 콘티를 짜고 있는데, 딱 1분만 간단한 설문조사 가능할까요? 커피 쿠폰도 드려요!\"",
        choices: [
            { text: "🎧 에어팟 노캔 켜고 0.1초 만에 쌩 지나간다", next: "ending_ironwall", doubt: 30 },
            { text: "저 직장인인데요. 바빠서 가봐야 합니다.", next: "c1_street_push", doubt: 15 },
            { text: "아.. 네. 진짜 1분만이면 스티커 붙여드릴게요.", next: "c1_survey", mentalDmg: 15 }
        ]
    },
    c1_street_push: {
        chapter: 1,
        title: "집요한 타겟팅",
        theme: "normal",
        badge: "📍 끈질긴 추격",
        text: "발걸음을 옮기려 하자, 다른 한 명이 자연스럽게 당신의 보폭에 맞추며 태블릿을 들이밉니다.\n\n\"어머! 직장인 분들 현실 피드백이 진짜 너무 절실했거든요! 딱 스티커 2개만 붙여주시면 돼요. 제발요, 저희 이번에 통과 못하면 유급이에요 ㅠㅠ\"",
        choices: [
            { text: "🚨 \"길에서 이런 거 하시면 도로교통법 및 적치물 위반입니다.\"", next: "ending_police_call", doubt: 50 },
            { text: "하.. 알겠어요. 스티커만 얼른 붙이고 갈게요.", next: "c1_survey", mentalDmg: 20 },
            { text: "(전화기 귀에 대며) \"어 엄마? 어 지금 역 앞이야!\"", next: "ending_sharp_escape", doubt: 20 }
        ]
    },
    c1_survey: {
        chapter: 1,
        title: "도형 심리테스트의 덫",
        theme: "love-bombing",
        badge: "📍 설문지 작성 중",
        text: "간단한 질문에 스티커를 붙이자, 그녀가 종이 한 장을 꺼냅니다.\n\n\"감사해요! 보답으로 재미있는 성향 분석 하나 해드릴게요. 여기 종이에 동그라미(○), 세모(△), 네모(□), 지그재그(S) 중 마음에 드는 걸 자유롭게 3개 그려보세요!\"\n\n당신이 무심코 그리자, 그녀가 입을 틀어막으며 놀란 표정을 짓습니다.\n\"와... 소름 돋아. 혹시 요즘 겉으로는 괜찮은 척하지만 속으로는 진로나 인간관계 때문에 엄청 공허하지 않으세요?\"",
        choices: [
            { text: "\"어.. 맞아요! 어떻게 아셨어요?\" (신기해한다)", next: "c1_cafe_invite", mentalDmg: 25 },
            { text: "\"누구나 다 있는 고민 아닌가요? 바넘 효과네요.\" (코웃음)", next: "c1_skeptic", doubt: 35 },
            { text: "\"저 심리학 전공자인데 수법 다 보입니다. 가세요.\"", next: "ending_sharp_escape", doubt: 40 }
        ]
    },
    c1_skeptic: {
        chapter: 1,
        title: "바람잡이의 칭찬 세례",
        theme: "love-bombing",
        badge: "📍 심리적 압박",
        text: "당신이 냉담하게 반응하자, 옆에 있던 친구가 눈을 반짝이며 감탄합니다.\n\n\"와.. 눈치가 진짜 빠르시다! 사실 제 친구가 단순 학생이 아니라 한국상담심리협회 연구원 인턴이거든요. 기운이나 성향 통찰력이 진짜 남다르신 분인 거 같은데, 여기서 이러지 말고 제가 따뜻한 아메리카노 한잔 사드릴게요! 10분만 얘기 나눠봐요.\"",
        choices: [
            { text: "커피는 공짜니까.. 10분만 얘기 듣자.", next: "c1_cafe_room", mentalDmg: 25, moneyDmg: 0 },
            { text: "\"신용불량자라 마실 자격이 없습니다.\" (단칼 거절)", next: "ending_sharp_escape", doubt: 30 }
        ]
    },
    c1_cafe_invite: {
        chapter: 1,
        title: "사랑의 폭탄 (Love-Bombing)",
        theme: "love-bombing",
        badge: "📍 카페 유인",
        text: "\"제가 상담 공부를 3년째 하고 있는데, 이렇게 영적으로 맑으면서도 섬세한 기질은 진짜 오랜만에 봐요! 이대로 두면 주변 사람들한테 기만 빨리거든요.\n\n제가 저기 스타벅스에서 커피 살 테니까, 성향 보완하는 팁 조금만 알려드릴게요! 진짜 순수한 마음으로 돕고 싶어서 그래요.\"",
        choices: [
            { text: "공짜 커피도 준다는데 잠깐 따라간다.", next: "c1_cafe_room", mentalDmg: 30 },
            { text: "\"약속 시간 다 돼서 안 됩니다.\" 거절하고 잰걸음 친다.", next: "ending_sharp_escape", doubt: 25 }
        ]
    },
    c1_cafe_room: {
        chapter: 1,
        title: "우연을 가장한 '잎사귀'의 등장",
        theme: "gaslighting",
        badge: "📍 조용한 룸카페",
        text: "일반 카페가 시끄럽다며 데려간 곳은 밀폐된 룸카페였습니다.\n\n상담 이야기를 나눈 지 15분쯤 되었을 때, 갑자기 문이 열리며 30대 중반의 단정한 여성이 들어옵니다.\n\n\"어머, 은지야! 여기서 뭐 해?\"\n\"어? 팀장님! 웬일이세요? 대박! 저번에 말씀드린 그 상담협회 전문 수석 멘토님이신데 진짜 우연이다! 인사해요, 이분 예약 잡기도 힘든 분이야!\"",
        choices: [
            { text: "(이상하다.. 우연이 너무 딱 들어맞는데?) 의심한다", next: "c1_room_doubt", doubt: 40 },
            { text: "대단한 분인가 보다 하며 반갑게 인사한다", next: "c1_room_deep", mentalDmg: 35 }
        ]
    },
    c1_room_doubt: {
        chapter: 1,
        title: "텔레그램 뒤편의 진실",
        theme: "gaslighting",
        badge: "📍 룸카페 밀실",
        text: "우연을 가장한 '팀장님'이 테이블에 앉으며 당신의 손을 잡고 눈을 지그시 바라봅니다.\n\n그 순간, 테이블 밑에 놓인 은지의 스마트폰 화면에 **[텔레그램]** 알림이 번쩍입니다.\n\n『구역장님 지침: 대상자 지금 경계 중이니 인간관계 결핍 위주로 찔러서 안심시키세요. 잎사귀 투입 성공』",
        choices: [
            { text: "🚨 스마트폰을 낚아채며 \"너네 신천지지? 당장 경찰 부른다!\"", next: "ending_police_call", doubt: 50 },
            { text: "소름이 돋아 벌떡 일어나며 가방을 챙긴다", next: "ending_awkward_escape", doubt: 30 },
            { text: "(너무 무서워서 모르는 척 굳어버린다)", next: "c1_room_deep", mentalDmg: 30 }
        ]
    },
    c1_room_deep: {
        chapter: 1,
        title: "비밀 유지 서약과 고립",
        theme: "panic",
        badge: "📍 가스라이팅의 늪",
        text: "팀장이라는 사람이 당신의 생년월일과 성향을 읊으며 깊은 탄식을 내뱉습니다.\n\n\"당신 영혼에 큰 상처가 있어요. 이건 인문학 성경 말씀으로 치유해야 풀립니다. 저희가 비밀리에 운영하는 무료 '센터'가 있는데...\n\n⚠️ **단, 이건 부모님이나 친구, 목사님께 절대 말하면 안 돼요.** 영이 어린 사람들에게 말하면 마귀가 틈타서 당신의 복을 빼앗아가거든요. 우리끼리의 비밀 약속이에요.\"",
        choices: [
            { text: "비밀을 요구하는 순간 100% 사이비다! 박차고 나간다", next: "ending_awkward_escape", doubt: 30 },
            { text: "\"네.. 제 인생이 바뀐다면 한번 가볼게요..\"", next: "c1_center_inside", mentalDmg: 40 }
        ]
    },
    c1_center_inside: {
        chapter: 1,
        title: "간판 없는 상가 3층의 진실",
        theme: "panic",
        badge: "📍 시온선교센터 앞",
        text: "간판도 없는 낡은 빌딩 3층, 두꺼운 철문을 열자 기이한 광경이 펼쳐집니다.\n\n흰 셔츠에 검은 바지를 입은 수십 명의 청년들이 일제히 무표정하게 박수를 치고 있습니다.\n단상의 강사가 마이크를 잡고 당신을 노려보며 외칩니다.\n\n\"휴대폰 전원 끄고 바구니에 제출하세요! 가족에게는 취업 스터디 간다고 카톡 보내세요!\"",
        choices: [
            { text: "탈출하기! 문을 박차고 도망친다!", next: "c1_fake_run", fakeButton: true },
            { text: "(공포에 질려 휴대폰을 바구니에 넣는다)", next: "ending_center_114", mentalDmg: 50 }
        ]
    },
    c1_fake_run: {
        chapter: 1,
        title: "의식의 붕괴",
        theme: "panic",
        badge: "📍 세뇌실 감금",
        text: "문 손잡이를 잡으려 했으나 여러 명의 잎사귀들이 당신의 팔과 어깨를 부드럽지만 단단하게 감싸 쥡니다.\n\n\"자매님/형제님, 사탄의 시험에 흔들리시면 영원히 구원받지 못해요. 앉으세요. 앉으세요.\"",
        choices: [
            { text: "앉아 앉아 앉아 앉아 앉아", next: "ending_fake_glitch", glitch: true }
        ]
    },

    // ==========================================
    // CHAPTER 2: 대순진리회 조상 제사 & 치성비 편
    // ==========================================
    c2_start: {
        chapter: 2,
        title: "인상이 참 맑으신데요",
        theme: "normal",
        badge: "📍 영등포역 지하상가 근처",
        text: "퇴근길, 허름하지만 깔끔한 코트를 입은 남녀 2명이 당신에게 다가와 공손히 허리를 숙입니다.\n\n\"실례합니다, 길 좀 여쭐게요. 혹시 이 근처에 영등포 구민회관이 어디쯤인가요? 스마트폰 배터리가 다 나가서요...\"",
        choices: [
            { text: "\"스마트폰 켜져 있는데요?\" (손에 든 폰을 가리킨다)", next: "c2_caught_phone", doubt: 30 },
            { text: "\"저쪽으로 가시면 돼요.\" (길만 알려주고 가려 한다)", next: "c2_praise", mentalDmg: 10 },
            { text: "(대꾸도 없이 앞만 보고 직진한다)", next: "ending_ironwall", doubt: 20 }
        ]
    },
    c2_caught_phone: {
        chapter: 2,
        title: "허를 찌르는 반격",
        theme: "normal",
        badge: "📍 길거리 대치",
        text: "상대방이 황급히 폰 화면을 뒤로 숨기더니 헛기침을 합니다.\n\n\"아.. 화면이 이상해서요. 그런데 선생님, 길을 떠나서... 얼굴에 조상님의 지극한 공덕이 빛나고 계십니다. 하늘의 복을 타고나셨는데 눈 밑에 짙은 그늘이 드리워져 있네요.\"",
        choices: [
            { text: "\"도를 아십니까 레퍼토리 아직도 쓰나요?\" 비웃는다", next: "ending_sharp_escape", doubt: 30 },
            { text: "\"제 조상님이요? 그늘이요..?\" (살짝 솔깃해진다)", next: "c2_teahouse", mentalDmg: 20 }
        ]
    },
    c2_praise: {
        chapter: 2,
        title: "조상님의 눈물과 원한",
        theme: "love-bombing",
        badge: "📍 길거리 포교",
        text: "길을 알려주자 남자가 깊은 감탄사를 내뱉습니다.\n\n\"말씀하시는 목소리에 영기(靈氣)가 가득하시네요. 조상 대대로 덕을 많이 쌓으신 집안의 귀한 자손이십니다.\n\n하지만 지금 조상님 한 분이 억울하게 구천을 떠돌며 목이 타 울고 계십니다. 자손께서 정성을 드리지 않아 일이 자꾸 꼬이는 거예요.\"",
        choices: [
            { text: "\"제 일 잘 풀리고 있는데요? 헛소리 마세요.\"", next: "ending_sharp_escape", doubt: 25 },
            { text: "\"따뜻한 전통 찻집 가서 10분만 대화 나누시죠.\"에 이끌린다", next: "c2_teahouse", mentalDmg: 25 }
        ]
    },
    c2_teahouse: {
        chapter: 2,
        title: "찻집에서의 액운 가스라이팅",
        theme: "gaslighting",
        badge: "📍 전통 찻집",
        text: "쌍화차를 시켜놓고 두 사람이 당신의 사주와 얼굴을 번갈아 보며 혀를 찹니다.\n\n\"선생님, 올해 안에 집안에 큰 상(喪)이나 금전적 파탄이 날 액운이 끼어 있어요. 이건 인간의 힘으로는 절대 못 막습니다.\n\n다행히 저희 도장(회관)에 상급 선감님이 계십니다. 오늘 딱 30분만 조상님께 맑은 물 올리고 예를 갖추면 모든 액운이 복으로 바뀝니다! 택시비도 저희가 낼게요.\"",
        choices: [
            { text: "\"택시 타고 간판 없는 빌라 가면 감금이라던데요? 거절합니다.\"", next: "ending_sharp_escape", doubt: 40 },
            { text: "액운이라는 말이 찝찝해서 택시에 올라탄다", next: "c2_altar_inside", mentalDmg: 35 }
        ]
    },
    c2_altar_inside: {
        chapter: 2,
        title: "간판 없는 빌라 4층 치성소",
        theme: "panic",
        badge: "📍 비밀 치성 도장",
        text: "외딴 빌라 4층, 창문이 온통 암막 커튼으로 가려진 방입니다.\n\n향 냄새가 진동하고 촛불이 켜진 제단 앞에 흰 한복을 입은 사람들이 서 있습니다.\n상급 선무라는 사람이 흰 한복을 건네며 말합니다.\n\n\"몸과 마음의 부정을 씻어야 합니다. 속옷만 남기고 이 정결한 백의(한복)로 갈아입으세요.\"",
        choices: [
            { text: "\"옷을 왜 벗어요 미쳤습니까? 당장 나갑니다!\"", next: "c2_door_blocked", doubt: 35 },
            { text: "(분위기에 위압당해 한복으로 갈아입는다)", next: "c2_money_demanded", mentalDmg: 35 }
        ]
    },
    c2_door_blocked: {
        chapter: 2,
        title: "출구 봉쇄와 협박",
        theme: "panic",
        badge: "📍 현관문 앞",
        text: "도망치려 현관으로 가자, 건장한 남성 신도 2명이 문 앞을 가로막습니다.\n\n\"선생님, 여기서 그냥 나가시면 발걸음 닿는 곳마다 조상님의 원귀가 붙어 사고가 납니다. 부모님이 다치셔도 괜찮습니까? 딱 10분 치성만 들이고 가세요.\"",
        choices: [
            { text: "🚨 \"폰에 112 긴급 SOS 눌렀습니다. 3분 뒤 경찰 도착합니다!\"", next: "ending_police_call", doubt: 50 },
            { text: "겁에 질려 울먹이며 제단 앞으로 돌아간다", next: "c2_money_demanded", mentalDmg: 40 }
        ]
    },
    c2_money_demanded: {
        chapter: 2,
        title: "치성비 (제사 비용) 요구",
        theme: "panic",
        badge: "📍 제단 앞",
        text: "사배(절 4번)를 수없이 시킨 뒤, 선감이 흰 봉투를 내밉니다.\n\n\"조상님께 올릴 제물값과 100일 정성비로 **100만 원**의 복채(치성비)를 봉헌해야 온전한 해원이 됩니다.\n\n현금이 없으시면 카카오페이, 토스 송금이나 근처 편의점 ATM기에서 뽑아오시면 됩니다. 정성의 무게가 곧 복의 크기입니다.\"",
        choices: [
            { text: "\"저 전재산 1,400원이고 신불자인데요? 조상님이 빚 갚아주나요?\"", next: "ending_wallet_guard", doubt: 45 },
            { text: "(사시나무 떨듯 떨며) 50만 원만 계좌이체 해준다", next: "ending_ancestor_debt", moneyDmg: 500000, mentalDmg: 40 },
            { text: "대출이라도 받아서 100만 원을 전부 송금한다", next: "ending_broke", moneyDmg: 1000000, mentalDmg: 50 }
        ]
    },

    // ==========================================
    // CHAPTER 3: 소모임 & 데이팅앱 '잎사귀' 편
    // ==========================================
    c3_start: {
        chapter: 3,
        title: "완벽한 이상형의 등장",
        theme: "normal",
        badge: "📍 소모임 / 데이팅 앱",
        text: "최근 가입한 2030 독서&와인 소모임 앱에서 유독 코드가 잘 통하는 매력적인 이성(민서)을 알게 되었습니다.\n\n취향, 가치관, 음악 취향까지 소름 돋게 일치하며 매일 밤 늦게까지 다정한 카톡을 주고받았습니다.\n\n드디어 이번 주말, 분위기 좋은 성수동 카페에서 첫 1:1 만남을 가졌습니다.",
        choices: [
            { text: "설레는 마음으로 카페에 들어선다.", next: "c3_cafe_date", mentalDmg: 5 }
        ]
    },
    c3_cafe_date: {
        chapter: 3,
        title: "과도한 공감과 신뢰 형성",
        theme: "love-bombing",
        badge: "📍 성수동 감성 카페",
        text: "실물도 사진보다 훨씬 준수하고, 당신의 사소한 고민 하나하나에 눈을 맞추며 진심 어린 눈물을 글썽입니다.\n\n\"OO씨는 진짜 따뜻하고 빛나는 사람인데, 주변에서 많이 외로웠겠다... 사실 저도 작년에 번아웃 와서 죽을 뻔했거든요.\n\n근데 저를 완전히 구원해 준 인생 멘토님이 계세요. OO씨 이야기 들려드렸더니 꼭 한번 만나보고 싶다고 하시던데!\"",
        choices: [
            { text: "\"멘토님? 데이트하러 와서 갑자기 멘토 얘기요?\"", next: "c3_doubt_check", doubt: 35 },
            { text: "\"와, 민서씨가 추천하는 분이면 저도 꼭 뵙고 싶어요!\"", next: "c3_study_room", mentalDmg: 25 }
        ]
    },
    c3_doubt_check: {
        chapter: 3,
        title: "서운해하는 감정 조작",
        theme: "gaslighting",
        badge: "📍 성수동 카페",
        text: "당신이 경계하자, 민서가 시무룩한 표정으로 커피잔을 만지작거립니다.\n\n\"OO씨한테 정말 도움 주고 싶어서 어렵게 부탁드린 건데... 저를 못 믿으시는군요. 서운해요. 제가 무슨 이상한 사이비라도 되는 줄 아세요? ㅠㅠ\"",
        choices: [
            { text: "\"미안해요 민서씨, 제가 예민했나 봐요. 만나볼게요.\"", next: "c3_study_room", mentalDmg: 30 },
            { text: "\"소모임에 신천지 위장 잠입 많다던데 그 패턴 그대로네요.\" 자리에서 일어난다", next: "ending_dating_scam", doubt: 45 }
        ]
    },
    c3_study_room: {
        chapter: 3,
        title: "위장 스터디룸의 잎사귀들",
        theme: "gaslighting",
        badge: "📍 강남 위장 스터디룸",
        text: "멘토라는 중년 신사와 인문학 독서 스터디를 시작했습니다.\n\n그런데 스터디룸에 함께 있는 다른 수강생 3명도 어딘가 이상합니다. 멘토의 말 한마디 한마디에 과도하게 \"아멘!\", \"와 맞아요!\" 하며 격하게 호응합니다.\n\n사실 당신을 제외한 방 안의 모든 사람(민서 포함)은 신천지 내부 신도인 **'잎사귀'**들입니다.",
        choices: [
            { text: "분위기가 너무 종교 집단 같다. 화장실 핑계로 탈출한다!", next: "ending_sharp_escape", doubt: 40 },
            { text: "\"다들 열심히 배우시네.. 나도 집중해야지.\" 마음을 연다", next: "c3_secret_pledge", mentalDmg: 35 }
        ]
    },
    c3_secret_pledge: {
        chapter: 3,
        title: "사탄의 시험과 함구령",
        theme: "panic",
        badge: "📍 스터디룸 밀실",
        text: "멘토가 갑자기 성경 구절을 비유적으로 풀이하며 당신의 눈을 응시합니다.\n\n\"오늘 들은 이 귀한 말씀은 영적 비밀입니다. 가족이나 친구에게 발설하면 사탄이 그들을 통해 당신을 방해할 것입니다. 만약 다른 사람에게 말하면 천국 문이 닫힙니다. 서약서에 서명하세요.\"",
        choices: [
            { text: "가족에게 비밀로 하라는 순간 100% 이단이다! 서약서를 찢는다", next: "ending_awkward_escape", doubt: 50 },
            { text: "민서의 손을 잡으며 맹세하고 서명한다", next: "ending_cult_leaf", mentalDmg: 50 }
        ]
    }
};

// 챕터 목록 정보
const CHAPTER_INFO = [
    {
        id: 1,
        startKey: "c1_start",
        tag: "신천지 모략 전도",
        title: "강남역 11번 출구의 덫",
        desc: "웹툰 스토리 설문조사, 도형 심리테스트, 룸카페 잎사귀 투입, 복음방 센터 감금의 전 과정 고증.",
        icon: "📍"
    },
    {
        id: 2,
        startKey: "c2_start",
        tag: "대순진리회 치성/제사",
        title: "조상님의 목마름",
        desc: "길 묻기로 위장 접근, \"인상이 맑으신데 조상님 원한이...\", 간판 없는 빌라 도장과 촛불 치성비 갈취 고증.",
        icon: "🕯️"
    },
    {
        id: 3,
        startKey: "c3_start",
        tag: "소모임 & 연애 포교",
        title: "달콤한 소모임과 잎사귀",
        desc: "소모임/데이팅 앱에서 만난 완벽한 이상형. 모든 호감과 공감이 철저히 기획된 '잎사귀'의 모략이었다면?",
        icon: "💌"
    }
];
