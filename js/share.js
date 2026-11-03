// 공유 및 모달 관리 (html2canvas 카드 다운로드, 링크 복사, 도감 UI)
class ShareController {
    constructor() {
        this.init();
    }

    init() {
        // 링크 복사
        const copyBtn = document.getElementById('btn-copy-link');
        if (copyBtn) {
            copyBtn.onclick = () => this.copyLink();
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

    // 링크 클립보드 복사
    copyLink() {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                alert("🔗 테스트 링크가 클립보드에 복사되었습니다!\n친구에게 공유해서 호구력을 테스트해보세요.");
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
        alert("🔗 링크가 복사되었습니다!");
    }

    // 결과 화면 카드 이미지 생성 (html2canvas)
    generateResultImage() {
        const cardArea = document.getElementById('result-card-capture');
        if (!cardArea) return;

        if (typeof html2canvas === 'undefined') {
            alert("이미지 생성 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
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
            alert("이미지 저장 중 오류가 발생했습니다. 화면을 캡처해서 공유해보세요!");
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
