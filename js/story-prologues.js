// 첫 만남 이전의 동기와 관계. 안전한 선택을 지워 체류를 강제하지 않는다.
(() => {
    const create=(id,chapter,location,sender,bg,messages,choices)=>SCENARIOS[id]={chapter,location,sender,bg,avatar:'👤',messages,choices,timeLimit:0};
    const c=(text,next,stats={})=>({text,next,...stats});
    create('c1_evening',1,'📍 강남역, 면접이 끝난 저녁','수빈의 메시지','bg-street',[
        '(오후 7시 12분. 면접 결과는 다음 주에 나온다고 했다. 집에 바로 가기엔 마음이 복잡하다.)',
        '수빈: “오늘 어땠어? 밥은 먹었고?”',
        '(답장을 쓰는데 역 앞에서 누군가 내 쪽을 보고 손을 흔든다. 아는 사람인가?)'
    ],[c('친구에게 오늘 있었던 일을 솔직히 털어놓는다.','c1_first_meeting',{doubt:5}),c('잘 봤다고 짧게 답하고 폰을 넣는다.','c1_first_meeting'),c('역 앞에 잠깐 있다가 가겠다고 위치를 보낸다.','c1_first_meeting',{doubt:8})]);
    create('c1_first_meeting',1,'📍 출구 옆 가로등 아래','대학생 은지','bg-street',[
        '“앗 죄송해요! 저희 팀원인 줄 알았어요. 오늘 하루 힘드셨죠?”',
        '(은지가 웃으며 접이식 테이블 쪽을 가리킨다. 위에는 태블릿과 색색의 스티커가 놓여 있다.)',
        '“졸업작품 때문에 설문 중인데 다들 바쁘시네요. 혹시 잠깐만 시간 괜찮으세요?”'
    ],[c('무슨 프로젝트인지 먼저 들어본다.','c1_start'),c('테이블의 안내문을 가리키며 주최를 묻는다.','c1_identity',{doubt:10}),c('급한 건 아니니 거리를 두고 이야기를 듣는다.','c1_start',{doubt:5})]);
    create('c2_evening',2,'📍 영등포역, 부모님 부재중 전화','엄마의 음성 메시지','bg-street',[
        '“별일 아니고, 아빠 검진 날짜 바뀌어서. 저녁에 시간 되면 전화해.”',
        '(별일 아니라는데도 괜히 마음이 쓰인다. 지난번 검진 결과가 어땠더라.)',
        '(횡단보도 앞에서 한 사람이 조심스레 다가온다. 손에 구겨진 주소 메모가 있다.)'
    ],[c('엄마에게 나중에 통화하겠다고 답한다.','c2_first_meeting'),c('지금 전화해서 검진 이야기를 확인한다.','c2_first_meeting',{doubt:8}),c('검색하던 병원 화면을 닫고 고개를 든다.','c2_first_meeting')]);
    create('c2_first_meeting',2,'📍 지하상가로 이어지는 길','길을 찾는 사람','bg-street',[
        '“실례합니다. 이 근처에 오래된 회관이 하나 있다는데요. 이 주소 아세요?”',
        '(메모에는 건물 이름 없이 번지만 적혀 있다. 지도 앱을 켜니 걸어서 5분 거리다.)',
        '“정말 감사합니다. 인상이 좋으셔서 부탁드렸어요. 요즘 이렇게 도와주는 분이 드물어요.”'
    ],[c('지도에서 방향만 짚어준다.','c2_start'),c('주소를 다시 확인하며 어떤 회관인지 묻는다.','c2_verify',{doubt:8}),c('길을 알려주고 내 갈 길로 몸을 돌린다.','c2_boundary',{doubt:5})]);
    create('c3_evening',3,'💬 모임 앱, 약속 한 시간 전','민서의 메시지','bg-phone',[
        '(이 동네로 이사 온 지 석 달. 주말 저녁에 편하게 만날 친구가 아직 없다.)',
        '민서: “오늘 와인 모임 오시죠? 처음엔 저도 낯가렸어요. 제가 입구에서 기다릴게요!”',
        '(지난 일주일 동안 민서는 내가 한 사소한 이야기까지 기억하며 먼저 안부를 물었다.)'
    ],[c('고맙다고 답하며 모임 장소를 다시 확인한다.','c3_first_meeting'),c('친구에게 오늘 만나는 모임 링크를 보낸다.','c3_first_meeting',{doubt:8}),c('나를 챙겨주는 사람이 생겨 설렌다.','c3_first_meeting',{mentalDmg:3})]);
    create('c3_first_meeting',3,'📍 성수동, 와인바 입구','민서','bg-bar',[
        '“OO씨! 여기예요. 사진보다 훨씬 편한 인상이시네요.”',
        '(민서가 내 취향에 맞는 자리를 골라준다. 다른 사람들은 잠깐 인사를 하고 멀찍이 앉는다.)',
        '“오늘은 일 얘기 안 하기! OO씨 요즘 가장 하고 싶은 거 뭐예요?”'
    ],[c('새로운 취미와 사람을 만나고 싶다고 말한다.','c3_start'),c('가볍게 영화 이야기로 대화를 돌린다.','c3_start',{doubt:3}),c('다른 멤버들은 어떻게 만났는지 물어본다.','c3_interest',{doubt:8})]);
    create('c4_evening',4,'💬 월요일 밤, 러닝크루 검색','나의 메모','bg-phone',[
        '(퇴근하고 소파에 누웠다가 세 시간이 지났다. 이번 주는 정말 생활을 바꾸고 싶다.)',
        '(검색창에 “초보 러닝 모임”을 치니 회비 0원, 퇴근 후 한강, 초보 환영이라는 공지가 뜬다.)',
        '(모집 사진 속 사람들은 밝게 웃고 있다. 나도 저 사이에 있으면 좀 달라질까.)'
    ],[c('운영 규칙을 읽고 오픈채팅에 들어간다.','c4_first_meeting',{doubt:5}),c('친구에게 같이 시작하자고 링크를 보낸다.','c4_first_meeting',{doubt:8}),c('오늘만큼은 망설이지 말자며 입장한다.','c4_first_meeting')]);
    create('c4_first_meeting',4,'💬 한강 야간러닝, 첫 인사','방장 지훈','bg-phone',[
        '“새로 오신 분 환영해요! 기록보다 꾸준함이죠. 저도 처음엔 1km도 못 뛰었어요.”',
        '(사람들이 이모티콘을 보낸다. 한 명이 이번 주 함께 뛸 사람을 찾는다.)',
        '“닉네임이랑 편한 요일만 알려주세요. 자세한 건 정모에서 얘기해요!”'
    ],[c('목요일에 가능하다고 짧게 인사한다.','c4_start'),c('모임 공지와 이전 정모 사진부터 살펴본다.','c4_rules',{doubt:8}),c('분위기를 보며 천천히 대화에 끼어든다.','c4_start')]);
    const descriptions=[
        ['낯선 친절','집에 가기엔 조금 이른 밤','면접이 끝난 저녁. 역 앞에서 한 대학생이 졸업작품 설문을 부탁한다. 잠깐의 친절은 어디까지 이어질까?'],
        ['불안의 가격','길을 묻는 사람','부모님의 검진 소식이 마음에 걸리는 날, 길을 잃은 사람을 만났다. 그는 내 얼굴에서 무엇을 본 걸까.'],
        ['마음의 거리','우리, 우연히 만난 걸까','새 동네에서 처음 나가는 와인 모임. 내 이야기를 기억하는 다정한 사람에게 조금씩 마음이 열린다.'],
        ['연결의 조건','목요일, 같이 달릴래요?','생활을 바꾸고 싶어 들어간 러닝크루. 혼자가 아니어서 좋았다. 서로를 너무 잘 알게 되기 전까지는.']
    ];
    for(const chapter of CHAPTER_INFO) {
        chapter.startKey=`c${chapter.id}_first_meeting`;
        delete SCENARIOS[`c${chapter.id}_evening`];
        [chapter.tag,chapter.title,chapter.desc]=descriptions[chapter.id-1];
    }
    SCENARIOS.c1_identity.choices[2].exposure=1;
    SCENARIOS.c4_rules.choices[2].exposure=2;
    SCENARIOS.c4_data.choices[2].exposure=2;
    SCENARIOS.c4_after_run.timeout.exposure=1;
    Object.assign(SCENARIOS.c4_first_meeting, {
        bg:'bg-street', sender:'러닝크루 방장 지훈', location:'📍 한강 산책로, 저녁 8시',
        messages:['(혼자 달리다 숨을 고르고 있는데 러닝복을 입은 사람이 다가온다.)','“혹시 혼자 뛰세요? 저희 초보 크루인데 같이 한 바퀴 뛰실래요?”','“회비 같은 건 없어요. 저기 사람들도 다 처음 만났어요. 부담 없이요!”']
    });
    SCENARIOS.c4_first_meeting.choices=[
        c('마침 혼자라 심심했는데, 같이 뛰어본다.','c4_start'),
        c('어떤 모임인지 먼저 물어본다.','c4_rules',{doubt:8}),
        c('오늘은 혼자 뛰겠다며 거리를 둔다.','c4_buddy',{doubt:5})
    ];
    Object.assign(SCENARIOS.c4_start, {
        bg:'bg-street', location:'📍 한강 다리 아래, 러닝크루 첫 만남',
        messages:['(방장이 손을 흔들자 크루원들이 밝게 인사한다.)','“새로 오신 분이에요! 오늘은 천천히 뛸 거니까 편하게 따라오세요.”','하은: “저도 시작한 지 얼마 안 됐어요. 힘들면 저랑 같이 걸어요!”']
    });
    SCENARIOS.c4_start.choices[0].text='함께 달리며 크루원들과 이야기를 나눈다.';
    SCENARIOS.c4_start.choices[1].text='쉬는 동안 방장과 크루원들의 프로필을 확인한다.';
    SCENARIOS.c4_start.choices[2].text='아직 어색해서 크루원들 뒤에서 조용히 따라간다.';
})();
