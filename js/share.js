// 공유 및 모달 관리 (html2canvas 카드 다운로드, 링크 복사, 도감 UI)

class ShareController {
    constructor() {
        this.init();
    }

    init() {
        // 링크 복사
        const copyBtn = document.getElementById('btn-copy-link');
        if (copyBtn) {
            copyBtn.onclick = () => this.shareResult();
        }

        // 이미지 카드 저장 (html2canvas)
        const saveImgBtn = document.getElementById('btn-save-card');
        if (saveImgBtn) {
            saveImgBtn.onclick = () => this.generateResultImage();
        }

        // 도감 모달 토글
        const bookBtn = document.getElementById('header-book-btn');
        if (bookBtn) {
            bookBtn.onclick = () => this.openCollectionModal();
        }

        const closeBookBtn = document.getElementById('close-collection-modal');
        if (closeBookBtn) {
            closeBookBtn.onclick = () => this.closeCollectionModal();
        }

        // 실전 가이드 모달 토글
        const guideBtn = document.getElementById('header-guide-btn');
        if (guideBtn) {
            guideBtn.onclick = () => this.openGuideModal();
        }

        const closeGuideBtn = document.getElementById('close-guide-modal');
        if (closeGuideBtn) {
            closeGuideBtn.onclick = () => this.closeGuideModal();
        }
    }

    // 결과가 담긴 공유 URL (?r=엔딩ID&s=호구력)
    resultUrl() {
        const url = new URL(window.location.href);
        url.search = '';
        url.hash = '';
        if (game.lastEndingId) {
            url.searchParams.set('r', game.lastEndingId);
            url.searchParams.set('s', game.lastScore);
        }
        return url.toString();
    }

    shareText() {
        const end = ENDINGS[game.lastEndingId];
        if (!end) return "도를 아십니까? 길거리 사이비 생존 시뮬레이션";
        return `나는 [${end.grade}등급] ${end.title} · 호구력 ${game.lastScore}%\n${ENDING_PERSONA[game.lastEndingId] || ''}\n너는 사이비한테서 살아남을 수 있어? 👁️`;
    }

    // 결과 문구 + 도전장 링크를 클립보드에 복사
    shareResult() {
        this.copyLink(`${this.shareText()}\n${this.resultUrl()}`);
    }

    // 친구 결과 링크로 들어온 경우 시작 화면에 도전장 표시
    showIncomingChallenge() {
        const params = new URLSearchParams(window.location.search);
        const end = ENDINGS[params.get('r')];
        const box = document.getElementById('challenge-banner');
        if (!end || !box) return;
        const rawScore = parseInt(params.get('s'), 10);
        const score = Number.isNaN(rawScore) ? NaN : Math.max(0, Math.min(100, rawScore));
        box.innerHTML = `
            <div class="challenge-label">👀 친구가 보낸 도전장</div>
            <div class="challenge-title">[${end.grade}등급] ${end.title}${isNaN(score) ? '' : ` · 호구력 ${score}%`}</div>
            <div class="challenge-sub">당신은 이 친구보다 잘 버틸 수 있을까요? 아래에서 시나리오를 골라보세요!</div>
        `;
        box.style.display = 'block';
    }

    // 링크 클립보드 복사
    copyLink(textOverride) {
        const url = typeof textOverride === 'string' ? textOverride : this.resultUrl();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                game.showToast("🔗 테스트 링크가 클립보드에 복사되었습니다!\n친구에게 공유해서 호구력을 테스트해보세요.");
            }).catch(() => {
                this.fallbackCopy(url);
            });
        } else {
            this.fallbackCopy(url);
        }
    }

    fallbackCopy(text) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        game.showToast("🔗 링크가 복사되었습니다!");
    }

    // 결과 화면 카드 이미지 생성 (html2canvas)
    generateResultImage() {
        const cardArea = document.getElementById('result-card-capture');
        if (!cardArea) return;

        if (typeof html2canvas === 'undefined') {
            game.showToast("이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const btn = document.getElementById('btn-save-card');
        const origText = btn.innerText;
        btn.innerText = "⏳ 이미지 생성 중...";
        btn.disabled = true;

        html2canvas(cardArea, {
            scale: 2, // 고해상도
            useCORS: true,
            backgroundColor: '#111317'
        }).then(canvas => {
            btn.innerText = origText;
            btn.disabled = false;

            const link = document.createElement('a');
            link.download = `도를아십니까_생존결과_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error(err);
            btn.innerText = origText;
            btn.disabled = false;
            game.showToast("이미지 저장 중 오류가 발생했습니다. 화면을 캡처해서 공유해보세요!");
        });
    }

    // 엔딩 도감 모달 열기
    openCollectionModal() {
        const modal = document.getElementById('collection-modal');
        const list = document.getElementById('collection-list');
        const unlocked = endingManager.getUnlockedEndings();
        
        list.innerHTML = '';

        Object.keys(ENDINGS).forEach(k => {
            const end = ENDINGS[k];
            const isUnlocked = unlocked.includes(k);
            const item = document.createElement('div');
            item.className = `collection-card ${isUnlocked ? 'unlocked' : 'locked'}`;

            if (isUnlocked) {
                item.innerHTML = `
                    <div class="col-head">
                        <span class="col-grade" style="background:${end.badgeColor}">${end.grade}등급</span>
                        <span class="col-title">${end.title}</span>
                    </div>
                    <p class="col-sub">${end.subtitle}</p>
                `;
            } else {
                item.innerHTML = `
                    <div class="col-head">
                        <span class="col-grade locked">🔒 미발견</span>
                        <span class="col-title">???</span>
                    </div>
                    <p class="col-sub">다양한 선택을 통해 숨겨진 엔딩을 발견해보세요.</p>
                `;
            }
            list.appendChild(item);
        });

        modal.classList.add('active');
    }

    closeCollectionModal() {
        document.getElementById('collection-modal').classList.remove('active');
    }

    // 실전 가이드 모달 열기
    openGuideModal() {
        document.getElementById('guide-modal').classList.add('active');
    }

    closeGuideModal() {
        document.getElementById('guide-modal').classList.remove('active');
    }
}

const shareController = new ShareController();
shareController.showIncomingChallenge();
