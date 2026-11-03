// 엔딩 도감 및 등급 정의 (12가지 멀티 엔딩)
const ENDINGS = {
    // S등급 (완벽 대처 & 참교육)
    ending_ironwall: {
        id: "ending_ironwall",
        grade: "S",
        title: "절대영도 철벽왕",
        subtitle: "말 한마디 안 섞고 영혼을 사수한 전설의 길거리 방어막",
        desc: "에어팟을 낀 채 단 0.1초의 눈빛도 주지 않고 스쳐 지나갔습니다. 사이비 포교꾼은 당신의 매서운 냉기에 기가 질려 다음 타겟을 찾으러 도망쳤습니다. 당신의 시간과 지갑, 영혼이 안전합니다.",
        badgeColor: "#00ffcc",
        type: "safe"
    },
    ending_police_call: {
        id: "ending_police_call",
        grade: "S",
        title: "안전신문고 & 112 응징",
        subtitle: "법과 행정의 매운맛으로 불법 포교단을 합법적 참교육",
        desc: "길거리 불법 설문 부스를 안전신문고 '불법 적치물'로 촬영 신고하고, 끈질기게 따라붙는 포교원을 경범죄 '불안감 조성'으로 112 신고했습니다. 당황한 전도원들이 부리나케 짐을 싸서 튀는 장관을 목격했습니다.",
        badgeColor: "#00ffcc",
        type: "safe"
    },
    ending_reverse_preach: {
        id: "ending_reverse_preach",
        grade: "S",
        title: "광기의 역포교자",
        subtitle: "오히려 상대방을 멘붕에 빠뜨려 회개(?)하게 만든 변종",
        desc: "\"선생님, 혹시 퀘이사존과 라면 사리의 우주적 순환 법칙을 믿으십니까?\" 30분 동안 쉬지 않고 헛소리 폭격을 퍼부었더니 전도원이 눈물을 글썽이며 \"제가 잘못했습니다.. 제발 보내주세요\" 하고 도망쳤습니다.",
        badgeColor: "#00ffcc",
        type: "safe"
    },

    // A등급 (현명한 손절 & 지갑 사수)
    ending_sharp_escape: {
        id: "ending_sharp_escape",
        grade: "A",
        title: "칼단발 탈출러",
        subtitle: "약간의 미끼를 물었으나 수상함을 감지하고 즉시 도주",
        desc: "스티커 설문조사까지는 해줬지만, 카페로 유인하려는 멘트에 \"저 친구 약속 늦어서요 수고하세요!\" 하며 번개같이 택시를 탔습니다. 약간의 찝찝함은 남았지만 피해는 0원입니다.",
        badgeColor: "#33ff33",
        type: "safe"
    },
    ending_wallet_guard: {
        id: "ending_wallet_guard",
        grade: "A",
        title: "지갑의 결계술사",
        subtitle: "몸은 도장(회관)까지 끌려갔으나 1원도 결제하지 않은 짠돌이",
        desc: "\"치성비 30만원 내셔야 조상님이 편안하십니다\"라는 협박에 \"저 전재산 1,400원 있고 신용불량자인데요? 조상님이 제 빚 갚아주시나요?\"라고 받아쳐 강제 퇴장당했습니다. 생존 성공!",
        badgeColor: "#33ff33",
        type: "safe"
    },

    // B등급 (약간의 손해 & 기 빨림)
    ending_awkward_escape: {
        id: "ending_awkward_escape",
        grade: "B",
        title: "찝찝한 귀가길",
        subtitle: "커피값 뜯기고 2시간 동안 훈계 듣다가 간신히 탈출",
        desc: "룸카페에서 '우연히 합석한 멘토'와 전도원 2명에게 둘러싸여 2시간 동안 가스라이팅을 당했습니다. 커피값 18,000원을 결제해주고 기가 다 빨려 집에 와서 3일 동안 앓아누웠습니다.",
        badgeColor: "#ffaa00",
        type: "warning"
    },

    // C등급 (감정 소비 & 상처)
    ending_dating_scam: {
        id: "ending_dating_scam",
        grade: "C",
        title: "로맨스 피싱의 눈물",
        subtitle: "운명의 이상형인 줄 알았는데... 철저히 기획된 '잎사귀'",
        desc: "소모임 앱에서 만난 다정한 그/그녀... 나에게 보여준 모든 미소와 공감이 텔레그램 상부에 보고되던 '포교 매뉴얼'이었음을 알게 되었습니다. 마음의 큰 상처를 입고 당분간 인간 불신에 시달립니다.",
        badgeColor: "#ff8800",
        type: "warning"
    },

    // D등급 (금전적 피해)
    ending_ancestor_debt: {
        id: "ending_ancestor_debt",
        grade: "D",
        title: "조상님 효도 제사(?)",
        subtitle: "흰 한복 입고 사배(절 4번) 300번 하고 잔고 50만원 털림",
        desc: "분위기에 압도되어 간판 없는 빌라 4층에서 한복을 입고 치성을 드렸습니다. ATM기까지 끌려가 50만 원을 인출해 바쳤습니다. 집에 오는 길에 조상님이 원망스러워 눈물이 났습니다.",
        badgeColor: "#ff4444",
        type: "danger"
    },

    // F등급 (완전 세뇌 & 패망)
    ending_center_114: {
        id: "ending_center_114",
        grade: "F",
        title: "시온센터 114기 신입",
        subtitle: "월화목금 매일 3시간... 거짓말을 거룩한 '모략'이라 믿는 삶",
        desc: "복음방을 거쳐 6개월 센터 과정에 등록했습니다. 매일 아침 흰 셔츠에 검은 슬랙스를 입고 길거리에 나가 '웹툰 설문조사'를 위장한 모략 전도를 시작합니다. 휴대폰은 텔레그램으로 감시당합니다.",
        badgeColor: "#ff0000",
        type: "danger"
    },
    ending_cult_leaf: {
        id: "ending_cult_leaf",
        grade: "F",
        title: "영혼의 잎사귀",
        subtitle: "사랑의 폭탄(Love-Bombing)에 녹아내려 가족과 절연",
        desc: "\"너를 진심으로 사랑해 주는 건 우리뿐이야. 가족도 마귀가 틈타면 적이 돼.\" 가스라이팅에 굴복하여 부모님과 친구들의 연락을 모두 차단하고 합숙소 생활을 시작했습니다.",
        badgeColor: "#ff0000",
        type: "danger"
    },
    ending_broke: {
        id: "ending_broke",
        grade: "F",
        title: "신용불량 대출 막장",
        subtitle: "조상님 액운 푼다며 2금융권 대출까지 받아 바치고 파산",
        desc: "\"이번 정성만 들이면 평생 풀립니다\"라는 선감의 말에 넘어가 햇살론, 대부업체 대출까지 끌어모아 2,000만 원을 헌납했습니다. 남은 것은 독촉장과 찢겨진 영혼뿐입니다.",
        badgeColor: "#ff0000",
        type: "danger"
    },

    // 히든 엔딩
    ending_fake_glitch: {
        id: "ending_fake_glitch",
        grade: "???",
        title: "의식의 붕괴: 앉아",
        subtitle: "도망치려 했으나 화면이 왜곡되며 세뇌실에 감금",
        desc: "버튼을 누르려 발버둥 쳤지만 손가락이 말을 듣지 않았습니다. \"앉아 앉아 앉아...\" 귓가에 맴도는 환청과 함께 당신의 눈동자에서 생기가 사라졌습니다.",
        badgeColor: "#bf00ff",
        type: "danger"
    }
};

// 로컬스토리지 엔딩 관리
class EndingManager {
    constructor() {
        this.storageKey = 'cult_survival_endings_v2';
    }

    getUnlockedEndings() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch(e) {
            return [];
        }
    }

    unlock(endingId) {
        if (!ENDINGS[endingId]) return;
        const current = this.getUnlockedEndings();
        if (!current.includes(endingId)) {
            current.push(endingId);
            localStorage.setItem(this.storageKey, JSON.stringify(current));
        }
    }

    getTotalCount() {
        return Object.keys(ENDINGS).length;
    }

    getUnlockedCount() {
        return this.getUnlockedEndings().length;
    }
}

const endingManager = new EndingManager();
