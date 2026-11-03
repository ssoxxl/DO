// 추가 분기는 원본 시나리오와 같은 데이터 형식을 사용한다.
// 확인 → 관계의 압박 → 대응을 각각 선택할 수 있게 구성한다.
(() => {
    const add = (key, chapter, sender, bg, location, messages, choices, timeoutNext) => {
        SCENARIOS[key] = { chapter, sender, avatar: ['','👩‍🎓','🕯️','💃','🏃'][chapter], bg,
            location, messages, choices, timeLimit: 24,
            timeout: { text: '잠시 망설이는 사이 상대가 대화를 이어간다.', next: timeoutNext, mentalDmg: 5 } };
    };
    const choice = (text, next, stats = {}) => ({ text, next, ...stats });
    const route = (key, index, next) => SCENARIOS[key].choices[index].next = next;

    route('c1_start', 1, 'c1_identity');
    SCENARIOS.c1_start.choices.push(choice('설문 주최와 개인정보 안내부터 확인한다.', 'c1_identity', { doubt: 10 }));
    add('c1_identity',1,'설문조사 대학생 은지','bg-street','📍 설문지 맨 아래 작은 글씨',[
        '학교 이름을 물으니 학생증 대신 디자인 작업물을 보여준다.',
        '“아직 비공개 프로젝트라 학교는 말씀드리기 어려워요. 연락처만 주시면 결과 보내드릴게요!”',
        '(설문지에는 수집 목적과 연락처 보관 기간이 적혀 있지 않다.)'
    ],[
        choice('학교 공식 홈페이지에서 프로젝트를 찾아본다.','c1_search',{doubt:15}),
        choice('연락처 없이 익명으로만 참여하겠다고 한다.','c1_boundary',{doubt:10}),
        choice('기프티콘이 탐나서 전화번호를 적는다.','c1_followup',{mentalDmg:8}),
        choice('확인할 수 없는 설문은 참여하지 않고 이동한다.','ending_sharp_escape',{doubt:15})
    ],'c1_boundary');
    add('c1_search',1,'은지 & 검색 결과','bg-street','🔎 확인되지 않는 프로젝트',[
        '(검색 결과에는 같은 문구로 접근했다는 경험담이 보인다. 이것만으로 단정할 수는 없다.)',
        '“인터넷에는 별 얘기가 다 있어요. 저를 직접 보고 판단해주세요.”',
        '(질문에는 답하지 않고 내 불신이 문제인 것처럼 대화가 바뀐다.)'
    ],[
        choice('답변을 피하는 점을 짚고 자리를 뜬다.','ending_sharp_escape',{doubt:20}),
        choice('판단을 보류하고 익명 설문만 하겠다고 한다.','c1_boundary'),
        choice('미안해서 스티커 하나만 붙인다.','c1_minigame_sticker',{mentalDmg:5})
    ],'c1_boundary');
    add('c1_boundary',1,'설문조사 대학생 은지','bg-street','📍 거절 뒤의 반응',[
        '“익명으로 해도 되는데, 분석 결과 설명하려면 카페에서 잠깐 만나야 해요.”',
        '(설문 참여 조건이 상담 약속으로 바뀌었다.)',
        '“지금 못 정하면 저희 멘토님 일정이 다 차요. 오늘만 가능해요!”'
    ],[
        choice('오늘만 가능하다는 말에도 내 일정부터 지킨다.','ending_sharp_escape',{doubt:15}),
        choice('카페가 어디인지 먼저 묻고 친구에게 공유한다.','c1_friend',{doubt:10}),
        choice('일단 태블릿 테스트까지만 한다.','c1_minigame_sticker',{mentalDmg:5})
    ],'c1_minigame_sticker');
    add('c1_followup',1,'은지의 메시지','bg-phone','💬 설문 다음 날',[
        '“분석 결과 나왔어요! OO님은 특별 관리 대상이라 무료 상담을 준비했어요.”',
        '(어제는 기프티콘 안내라고 했는데, 오늘은 상담 일정과 가족 고민을 묻는다.)',
        '“상담 내용은 가족한테 말하지 마세요. 선입견이 생기거든요.”'
    ],[
        choice('정보 삭제와 연락 중단을 요청하고 차단한다.','ending_sharp_escape',{doubt:25}),
        choice('친구에게 받은 메시지와 만날 장소를 공유한다.','c1_friend',{doubt:15}),
        choice('나를 특별히 챙긴다는 말에 상담을 수락한다.','c1_cafe_room',{mentalDmg:10})
    ],'c1_cafe_room');
    add('c1_friend',1,'친구 수빈','bg-phone','💬 혼자 판단하지 않기',[
        '“처음 만난 사람이 가족에게 비밀로 하라고 했다고? 장소부터 같이 확인하자.”',
        '(친구에게 연락했다는 말에 은지의 표정이 굳는다.)',
        '“다른 분 동반은 안 돼요. 개인 분석이라 OO님만 오셔야 해요.”'
    ],[
        choice('동행도 확인도 막는 상담은 취소한다.','ending_sharp_escape',{doubt:20}),
        choice('사람 많은 카페에서만 만나겠다고 조건을 건다.','c1_room_doubt',{doubt:15}),
        choice('친구 걱정은 알지만 예약된 룸카페에 간다.','c1_cafe_room',{mentalDmg:8})
    ],'c1_cafe_room');

    route('c2_start',1,'c2_boundary');
    SCENARIOS.c2_start.choices.push(choice('지도만 보여주고 동행은 하지 않는다.','c2_boundary',{doubt:10}));
    add('c2_boundary',2,'공손한 도믿맨','bg-street','📍 길 안내가 끝났는데',[
        '“감사합니다. 그런데 선생님, 얼굴에 근심이 보여서 그냥 보내드릴 수가 없네요.”',
        '(길을 묻던 대화가 갑자기 가족과 운세 이야기로 옮겨간다.)',
        '“최근 집안에 아프신 분 계시죠?”'
    ],[
        choice('누구에게나 할 수 있는 질문이라고 짚는다.','c2_verify',{doubt:15}),
        choice('가족의 건강 이야기를 꺼내며 상담을 구한다.','c2_family',{mentalDmg:8}),
        choice('길 안내는 끝났다고 말하고 이동한다.','ending_ironwall',{doubt:15}),
        choice('공개된 곳에서 이야기만 들어본다.','c2_praise',{mentalDmg:5})
    ],'c2_family');
    add('c2_verify',2,'공손한 도믿맨','bg-street','🔎 구체적인 질문',[
        '“믿지 않으셔도 괜찮아요. 다만 오늘을 놓치면 조상님이 슬퍼하십니다.”',
        '(어떤 근거로 가족의 일을 아는지 묻자 대답 대신 죄책감을 자극한다.)',
        '“무료로 봐드리는 건데 너무 계산적으로 보시는 것 아닌가요?”'
    ],[
        choice('무료 여부와 근거는 별개라고 말하고 떠난다.','ending_sharp_escape',{doubt:20}),
        choice('지금 가족에게 직접 안부를 확인한다.','c2_family',{doubt:10}),
        choice('괜히 무례했나 싶어 찻집에 따라간다.','c2_teahouse',{mentalDmg:8})
    ],'c2_family');
    add('c2_family',2,'가족 단톡방','bg-phone','💬 사실과 불안 나누기',[
        '(엄마에게 연락하니 “지금 저녁 먹는 중인데?”라는 답이 온다.)',
        '상대는 “지금 괜찮다고 앞으로도 괜찮은 게 아니에요”라고 말을 바꾼다.',
        '(아무 결과가 나와도 불안해야 하는 설명이라는 생각이 든다.)'
    ],[
        choice('가족에게 상황을 알리고 통화하며 이동한다.','ending_sharp_escape',{doubt:20}),
        choice('비용과 장소를 서면으로 달라고 한다.','c2_price',{doubt:10}),
        choice('만에 하나가 걱정돼 찻집에 따라간다.','c2_teahouse',{mentalDmg:10})
    ],'c2_price');
    SCENARIOS.c2_teahouse.choices.push(choice('출발 전에 비용·주소·소요 시간을 확인한다.','c2_price',{doubt:10}));
    add('c2_price',2,'선무 & 교정','bg-cafe','📍 무료 상담의 비용',[
        '“상담은 무료예요. 정성은 자율이고요. 보통은 30만 원부터 하시죠.”',
        '(무료라는 설명과 달리 구체적인 금액을 제시한다. 영수증 이야기는 피한다.)',
        '“카드가 안 되면 이체나 현금도 됩니다. 일단 도장부터 가시죠.”'
    ],[
        choice('결제하지 않고 자리에서 일어난다.','ending_wallet_guard',{doubt:20}),
        choice('지금은 결정하지 않겠다고 시간을 확보한다.','c2_delay',{doubt:10}),
        choice('구경만 하겠다고 도장에 따라간다.','c2_altar_inside',{mentalDmg:10}),
        choice('더 큰 정성이 필요하다는 말을 믿고 상담을 계속한다.','c2_loan',{mentalDmg:10})
    ],'c2_delay');
    add('c2_delay',2,'상급 선감','bg-cafe','📍 오늘 결정하라는 압박',[
        '“생각할수록 잡념이 들어요. 오늘 자정 전에 정성을 올려야 합니다.”',
        '(내가 내일 다시 생각하겠다고 하자 상대의 말투가 급해진다.)',
        '“은행 앱 켜보세요. 잔액 확인만 해보자는 거예요.”'
    ],[
        choice('휴대폰을 보관하고 혼자 돌아간다.','ending_wallet_guard',{doubt:20}),
        choice('다른 사람에게 상황을 설명하고 도움을 구한다.','ending_sharp_escape',{doubt:15}),
        choice('불안해서 잔액을 보여준다.','c2_loan',{mentalDmg:10})
    ],'c2_loan');
    add('c2_loan',2,'상급 선감','bg-altar','📍 정성이 대출로 바뀌는 순간',[
        '“잔고가 부족해도 방법은 있어요. 대출은 복이 들어오면 금방 갚습니다.”',
        '(상대가 휴대폰을 달라며 대출 신청 화면을 가리킨다.)',
        '(가족의 안전을 빌미로 내 금융 결정을 대신하려 한다.)'
    ],[
        choice('대출도 송금도 거절하고 휴대폰을 챙긴다.','ending_wallet_guard',{doubt:20}),
        choice('출구를 막는다면 주변 도움과 긴급 신고를 요청한다.','ending_police_call',{doubt:20}),
        choice('이번 한 번으로 끝난다는 약속을 믿고 전액 보낸다.','ending_broke',{moneyDmg:500000,mentalDmg:15}),
        choice('휴대폰을 되찾아 송금 취소를 시도한다.','c2_minigame_tap',{mentalDmg:5})
    ],'c2_minigame_tap');

    SCENARIOS.c3_start.choices.push(choice('추천보다 내 관심사가 맞는 모임인지 먼저 묻는다.','c3_interest',{doubt:10}));
    route('c3_doubt_check',0,'c3_interest');
    add('c3_interest',3,'소모임 호감 이성 민서','bg-bar','📍 취미 모임의 목적',[
        '“다음 와인 모임은 언제예요?”라고 묻자 민서는 멘토 일정만 확인한다.',
        '“사실 다들 와인보다 마음 공부를 좋아해요. OO씨도 금방 적응할 거예요.”',
        '(가입할 때 보았던 모임 설명에는 마음 공부나 상담 이야기가 없었다.)'
    ],[
        choice('모임 공지와 운영진 정보를 확인한다.','c3_roster',{doubt:15}),
        choice('민서와는 따로 만나고 스터디는 거절한다.','c3_boundary',{doubt:10}),
        choice('친해지고 싶으니 한 번 참석한다.','c3_study_room',{mentalDmg:8}),
        choice('목적이 다른 모임이라 인사하고 나온다.','ending_sharp_escape',{doubt:10})
    ],'c3_boundary');
    add('c3_roster',3,'소모임 공지와 이전 사진','bg-phone','🔎 반복되는 우연',[
        '(새로 왔다던 세 명이 반년 전 모임 사진에도 함께 있다.)',
        '(서로 모르는 사이라고 했던 사람들의 프로필에는 같은 행사 사진이 올라와 있다.)',
        '민서: “그게 왜 중요해요? 우리가 OO씨한테 잘해준 건 사실이잖아요.”'
    ],[
        choice('자료를 저장하고 신뢰할 사람에게 상황을 공유한다.','c3_friend',{doubt:15}),
        choice('거짓 소개에 실망했다고 말하고 관계를 정리한다.','ending_dating_scam',{doubt:20}),
        choice('설명을 직접 듣겠다며 스터디에 간다.','c3_study_room',{mentalDmg:8})
    ],'c3_boundary');
    add('c3_boundary',3,'소모임 호감 이성 민서','bg-bar','📍 관계에 붙은 조건',[
        '“저랑 친해지고 싶다면서 멘토님은 왜 싫어요?”',
        '(함께 식사하자는 제안은 거절하고, 스터디에 와야 만날 수 있다고 한다.)',
        '(좋아하는 마음과 모임 참여는 별개의 선택일 수 없을까.)'
    ],[
        choice('내 거절을 존중할 수 있는지 다시 묻는다.','c3_confession',{doubt:15}),
        choice('친구에게 대화 내용을 털어놓는다.','c3_friend',{doubt:10}),
        choice('관계가 끊길까 걱정돼 스터디에 간다.','c3_study_room',{mentalDmg:12}),
        choice('조건부 관계에서 물러난다.','ending_dating_scam',{doubt:15})
    ],'c3_confession');
    add('c3_friend',3,'오래된 친구','bg-phone','💬 관계 밖의 시선',[
        '“네가 원치 않는 모임을 거절했다고 친구까지 잃어야 하는 건 아니잖아.”',
        '(친구와 이야기하니 아까는 보이지 않던 선택지가 보인다.)',
        '민서에게서 “우리 얘기를 다른 사람한테 했어요?”라는 메시지가 온다.'
    ],[
        choice('혼자 감당하지 않겠다고 답하고 모임을 나간다.','ending_sharp_escape',{doubt:20}),
        choice('다른 사람에게 말하면 안 되는 이유를 묻는다.','c3_confession',{doubt:10}),
        choice('민서가 상처받았을까 봐 스터디에 간다.','c3_study_room',{mentalDmg:8})
    ],'c3_confession');
    add('c3_confession',3,'민서','bg-phone','💬 솔직한 대답을 기다리며',[
        '“처음 연락한 것도 모임에 데려오려고 한 거예요?”',
        '(한참 뒤 답장이 온다.)',
        '“처음에는 그랬어요. 하지만 OO씨를 위해서였어요. 이번 주만 와보면 알아요.”'
    ],[
        choice('상처는 남지만 연락을 끝낸다.','ending_dating_scam',{mentalDmg:10,doubt:15}),
        choice('대화를 보관하고 제삼자와 상황을 정리한다.','ending_zoom_evidence',{doubt:20}),
        choice('마지막 한 번이라는 말에 스터디로 간다.','c3_study_room',{mentalDmg:10})
    ],'c3_study_room');

    route('c4_start',0,'c4_rules');
    SCENARIOS.c4_start.choices.push(choice('운영 규칙과 이전 정모 후기를 먼저 읽는다.','c4_rules',{doubt:10}));
    add('c4_rules',4,'한강 러닝크루 공지','bg-phone','📌 공지 속 작은 조건',[
        '(회비는 없지만 가입 설문에는 직장·거주 동네·고민을 적는 칸이 있다.)',
        '(안전 공지보다 1:1 상담 참여 안내가 더 길다.)',
        '방장: “크루원끼리 깊이 알아야 가족처럼 챙기죠. 빈칸 없이 부탁해요!”'
    ],[
        choice('러닝에 불필요한 정보는 제출하지 않는다.','c4_data',{doubt:15}),
        choice('정모에서 직접 분위기를 확인하되 개인정보는 비워둔다.','c4_buddy',{doubt:5}),
        choice('가족 같은 분위기가 좋아 모든 항목을 작성한다.','c4_after_run',{mentalDmg:8}),
        choice('다른 공개 러닝 모임을 알아본다.','ending_crew_exit',{doubt:10})
    ],'c4_data');
    add('c4_data',4,'방장 지훈','bg-phone','🔐 개인정보의 경계',[
        '“직장 이름은 왜 필요하죠?”라고 묻자 방장은 “비상 연락용”이라고 한다.',
        '(비상 연락처 대신 근무지와 퇴근 시간을 묻는 이유는 설명하지 않는다.)',
        '“너무 경계하시면 다른 크루원들이 서운해해요.”'
    ],[
        choice('필요한 정보와 보관 방침을 다시 묻는다.','c4_profile_check',{doubt:10}),
        choice('친구와 같이 참가해도 되는지 묻는다.','c4_buddy',{doubt:10}),
        choice('서운하게 하기 싫어 정보를 보낸다.','c4_after_run',{mentalDmg:10}),
        choice('제출한 정보 삭제를 요청하고 나간다.','ending_crew_exit',{doubt:15})
    ],'c4_buddy');
    add('c4_buddy',4,'크루원 하은','bg-phone','💬 혼자 와야 하는 정모?',[
        '“친구도 같이 뛰고 싶대요.”',
        '하은: “오늘은 인원이 꽉 차서 OO님만 와주세요! 친구는 다음에요.”',
        '(그런데 단톡방에서는 지금도 새 멤버를 모집하고 있다.)'
    ],[
        choice('말이 다른 이유를 물으며 프로필을 확인한다.','c4_profile_check',{doubt:15}),
        choice('사람 많은 코스만 달리고 뒤풀이는 따로 판단한다.','c4_after_run',{doubt:5}),
        choice('동행을 거부하는 모임은 이번에 쉬겠다고 한다.','ending_crew_exit',{doubt:10})
    ],'c4_after_run');
    SCENARIOS.c4_zoom.choices.push(choice('운영 단체와 상담자의 자격을 서면으로 요청한다.','c4_credentials',{doubt:10}));
    add('c4_credentials',4,'사주·MBTI 상담자','bg-phone','🎥 질문을 싫어하는 상담',[
        '“자격보다 중요한 건 OO님 마음이 열려 있느냐예요.”',
        '(단체 이름을 물으니 상담자는 하은이 나를 위해 얼마나 애썼는지 이야기한다.)',
        '“확인하고 싶으면 센터에 오세요. 여기서는 설명할 수 없어요.”'
    ],[
        choice('운영 주체를 밝히지 않는 상담은 종료한다.','ending_crew_exit',{doubt:15}),
        choice('대화 기록을 정리해 믿을 만한 사람과 검토한다.','c4_support',{doubt:15}),
        choice('이미 시간을 썼으니 공부를 조금 더 해본다.','c4_secret',{mentalDmg:8})
    ],'c4_secret');
    SCENARIOS.c4_secret.choices.push(choice('배운 내용과 연락 빈도를 친구에게 보여준다.','c4_support',{doubt:10}));
    add('c4_support',4,'친구와의 통화','bg-phone','💬 모임 밖의 연결',[
        '“공부를 쉬고 싶다고 했을 때 존중해줬어?” 친구의 질문에 한참 생각한다.',
        '(일정을 취소할 때마다 죄책감을 느꼈고, 연락을 못 받으면 여러 명에게 전화가 왔다.)',
        '(그때 하은에게서 회사 앞에서 기다린다는 메시지가 온다.)'
    ],[
        choice('혼자 만나지 않고 주변에 알린 뒤 위협 메시지를 보관한다.','ending_zoom_evidence',{doubt:15}),
        choice('연락 중단을 요청하고 차단한다.','ending_crew_exit',{doubt:10}),
        choice('직접 만나 설명해야 할 것 같아 답장을 보낸다.','c4_quit_block',{mentalDmg:8})
    ],'c4_quit_block');

    // 누적 피해로 후반부 전체가 사라지지 않게 조정한다.
    for (const scene of Object.values(SCENARIOS)) {
        for (const action of [...(scene.choices || []), scene.timeout].filter(Boolean)) {
            if (action.mentalDmg) action.mentalDmg = Math.max(2, Math.round(action.mentalDmg * 0.55));
        }
        if (scene.timeLimit) scene.timeLimit = Math.max(18, Math.min(30, (scene.choices?.length || 3) * 6));
    }
    SCENARIOS.c1_center_inside.choices[0].fakeButton = false;
    SCENARIOS.c1_center_inside.choices.push(choice('위험을 느껴 외부에 위치와 도움 요청을 보낸다.','ending_police_call',{doubt:20}));
    SCENARIOS.c2_minigame_tap.messages[2] = '⚠️ 간편송금 100만 원 승인 진행 중... 다음 화면에서 5초 안에 취소 버튼을 15번 눌러야 합니다!';
})();
