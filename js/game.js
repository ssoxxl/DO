// 메인 게임 엔진
class CultSurvivalGame {
    constructor() {
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.currentScenarioKey = null;
        this.currentChapterId = 1;
        this.isFakeActive = false;

        // 찬스 아이템 (1회용 방어구)
        this.items = {
            airpods: { name: "노캔 에어팟", count: 1, icon: "🎧", desc: "길거리 포교 즉시 무시 & 방어" },
            sinbul: { name: "신불자 명함", count: 1, icon: "💳", desc: "\"저 빚만 2억인데요?\" 상대 멘붕 유도" },
            safety_app: { name: "안전신문고", count: 1, icon: "🚨", desc: "불법 적치물/경범죄 112 즉각 신고" },
            fake_call: { name: "엄마 가짜전화", count: 1, icon: "📱", desc: "긴급 상황 즉시 탈출" }
        };

        this.initEventListeners();
    }

    initEventListeners() {
        // 사운드 토글
        const muteBtn = document.getElementById('mute-toggle-btn');
        if (muteBtn) {
            muteBtn.onclick = () => {
                const muted = audio.toggleMute();
                muteBtn.innerText = muted ? "🔇 사운드 OFF" : "🔊 사운드 ON";
            };
        }
    }

    // 챕터 선택 후 게임 시작
    startChapter(chapterId) {
        audio.init();
        this.currentChapterId = chapterId;
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.isFakeActive = false;

        // 아이템 리셋
        this.items.airpods.count = 1;
        this.items.sinbul.count = 1;
        this.items.safety_app.count = 1;
        this.items.fake_call.count = 1;

        // 화면 전환
        this.switchScreen('game-screen');
        this.updateHUD();
        this.renderInventory();

        const chapter = CHAPTER_INFO.find(c => c.id === chapterId);
        if (chapter) {
            this.showScenario(chapter.startKey);
        }
    }

    showScenario(key) {
        // 엔딩 체크
        if (ENDINGS[key]) {
            this.triggerEnding(key);
            return;
        }

        const scene = SCENARIOS[key];
        if (!scene) {
            console.error("Scenario not found:", key);
            return;
        }

        this.currentScenarioKey = key;

        // 테마 및 배경 효과
        document.body.className = scene.theme || 'normal';
        if (scene.theme === 'panic') {
            audio.startHeartbeatLoop(110);
            this.vibrate([100, 50, 100]);
        } else if (scene.theme === 'gaslighting') {
            audio.startHeartbeatLoop(80);
        } else {
            audio.stopHeartbeatLoop();
        }

        // 뱃지 및 타이틀
        const badgeElem = document.getElementById('scene-badge');
        if (badgeElem) badgeElem.innerText = scene.badge || "";
        
        const titleElem = document.getElementById('scene-title');
        if (titleElem) titleElem.innerText = scene.title || "";

        // 텍스트 출력
        const textElem = document.getElementById('story-text');
        textElem.innerHTML = scene.text.replace(/\n/g, '<br>');

        // 선택지 렌더링
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        this.isFakeActive = false;

        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-arrow">▶</span> <span class="choice-label">${choice.text}</span>`;

            if (choice.fakeButton) {
                btn.id = "fake-evade-btn";
                btn.onmouseover = (e) => this.evadeCursor(e);
                btn.ontouchstart = (e) => this.evadeCursor(e);
                btn.onclick = () => this.handleGlitchButton(btn);
            } else if (choice.glitch) {
                btn.className += " glitch-text-btn";
                btn.onclick = () => {
                    audio.playGlitch();
                    this.triggerEnding(choice.next);
                };
            } else {
                btn.onclick = () => {
                    this.applyChoiceEffects(choice);
                };
            }
            container.appendChild(btn);
        });
    }

    applyChoiceEffects(choice) {
        audio.init();

        // 멘탈 데미지
        if (choice.mentalDmg) {
            this.mental -= choice.mentalDmg;
            audio.playDamage();
            this.shakeScreen();
            this.vibrate(200);
        }

        // 의심도 증가
        if (choice.doubt) {
            this.doubt += choice.doubt;
            audio.playDoubtUp();
        }

        // 지갑 잔고 손실
        if (choice.moneyDmg) {
            this.money = Math.max(0, this.money - choice.moneyDmg);
            audio.playMoneyLost();
        }

        this.updateHUD();

        // 상태 한계 도달 체크
        if (this.mental <= 0) {
            this.triggerEnding(this.currentChapterId === 2 ? 'ending_ancestor_debt' : 'ending_center_114');
            return;
        }

        if (this.money <= 0) {
            this.triggerEnding('ending_broke');
            return;
        }

        if (this.doubt >= 80) {
            // 높은 의심도로 조기 탈출 성공
            this.triggerEnding('ending_police_call');
            return;
        }

        // 다음 씬 이동
        if (choice.next) {
            this.showScenario(choice.next);
        }
    }

    // 아이템 사용 로직
    useItem(itemKey) {
        const item = this.items[itemKey];
        if (!item || item.count <= 0) return;

        audio.playItemUse();
        item.count--;
        this.renderInventory();

        if (itemKey === 'airpods') {
            alert("🎧 노이즈 캔슬링 에어팟을 장착했습니다!\n주변의 잡소리를 완벽 차단하고 지나갑니다.");
            this.triggerEnding('ending_ironwall');
        } else if (itemKey === 'sinbul') {
            alert("💳 \"저 신용불량자이고 통장 압류 들어왔는데요?\"\n포교원들이 서로 눈빛을 주고받더니 조용히 사라집니다.");
            this.triggerEnding('ending_wallet_guard');
        } else if (itemKey === 'safety_app') {
            alert("🚨 [안전신문고 신고 접수 완료]\n\"불법 도로 점용 및 설문 빙자 사기로 신고했습니다.\" 포교원들이 허겁지겁 도망칩니다.");
            this.triggerEnding('ending_police_call');
        } else if (itemKey === 'fake_call') {
            alert("📱 \"여보세요? 어 엄마! 지금 집 앞이야 갈게!\"\n전화를 받으며 자연스럽게 전력 질주합니다.");
            this.triggerEnding('ending_sharp_escape');
        }
    }

    renderInventory() {
        const container = document.getElementById('inventory-items');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(this.items).forEach(k => {
            const it = this.items[k];
            const div = document.createElement('div');
            div.className = `item-slot ${it.count > 0 ? 'available' : 'used'}`;
            div.innerHTML = `
                <span class="item-icon">${it.icon}</span>
                <span class="item-name">${it.name}</span>
                <span class="item-badge">${it.count > 0 ? '1회 찬스' : '사용됨'}</span>
            `;
            if (it.count > 0) {
                div.onclick = () => this.useItem(k);
            }
            container.appendChild(div);
        });
    }

    updateHUD() {
        // 멘탈 바
        const mentalBar = document.getElementById('mental-bar');
        const mentalText = document.getElementById('mental-value');
        if (mentalBar && mentalText) {
            const clamped = Math.max(0, Math.min(100, this.mental));
            mentalBar.style.width = clamped + '%';
            mentalText.innerText = clamped + '%';

            if (clamped > 50) mentalBar.style.backgroundColor = '#00ff66';
            else if (clamped > 25) mentalBar.style.backgroundColor = '#ffbb00';
            else mentalBar.style.backgroundColor = '#ff3333';
        }

        // 의심도 바
        const doubtBar = document.getElementById('doubt-bar');
        const doubtText = document.getElementById('doubt-value');
        if (doubtBar && doubtText) {
            const clampedDoubt = Math.min(100, this.doubt);
            doubtBar.style.width = clampedDoubt + '%';
            doubtText.innerText = clampedDoubt + '%';
        }

        // 지갑 잔고
        const moneyText = document.getElementById('money-value');
        if (moneyText) {
            moneyText.innerText = this.money.toLocaleString() + '원';
        }
    }

    // 도망가는 버튼 연출
    evadeCursor(e) {
        if (this.isFakeActive) return;
        const btn = e.target.closest('button');
        if (!btn) return;

        const container = document.getElementById('choices-container');
        const maxX = Math.max(50, container.offsetWidth - btn.offsetWidth - 20);
        const randX = (Math.random() - 0.5) * maxX;
        const randY = (Math.random() - 0.5) * 120;

        btn.style.transform = `translate(${randX}px, ${randY}px)`;
        btn.style.borderColor = '#ff0055';
    }

    handleGlitchButton(btn) {
        this.isFakeActive = true;
        audio.playGlitch();
        this.vibrate([150, 50, 150]);

        btn.style.transform = 'translate(0, 0)';
        btn.className = "choice-btn glitch-text-btn";
        btn.innerHTML = `<span style="color:red; font-weight:bold;">앉아 앉아 앉아 앉아 앉아</span>`;

        setTimeout(() => {
            this.triggerEnding('ending_fake_glitch');
        }, 1200);
    }

    triggerEnding(endingId) {
        audio.stopHeartbeatLoop();
        document.body.className = '';

        const endData = ENDINGS[endingId] || ENDINGS['ending_center_114'];
        endingManager.unlock(endingId);

        if (endData.type === 'safe') {
            audio.playVictory();
        } else {
            audio.playGameOver();
        }

        this.switchScreen('result-screen');

        // 결과 화면 데이터 바인딩
        const badge = document.getElementById('result-grade-badge');
        badge.innerText = `등급: ${endData.grade}`;
        badge.style.backgroundColor = endData.badgeColor;

        document.getElementById('result-title').innerText = endData.title;
        document.getElementById('result-subtitle').innerText = endData.subtitle;
        document.getElementById('result-desc').innerText = endData.desc;

        // 최종 스탯 결과
        document.getElementById('stat-mental').innerText = Math.max(0, this.mental) + ' / 100';
        document.getElementById('stat-doubt').innerText = this.doubt + ' / 100';
        document.getElementById('stat-money').innerText = this.money.toLocaleString() + '원';

        // 도감 수집 현황 갱신
        this.updateCollectionStats();
    }

    updateCollectionStats() {
        const total = endingManager.getTotalCount();
        const unlocked = endingManager.getUnlockedCount();
        const rate = Math.round((unlocked / total) * 100);

        const progressElem = document.getElementById('collection-progress');
        if (progressElem) {
            progressElem.innerText = `도감 수집률: ${unlocked}/${total} (${rate}%)`;
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        window.scrollTo(0, 0);
    }

    shakeScreen() {
        const app = document.getElementById('app');
        app.classList.add('shake-effect');
        setTimeout(() => app.classList.remove('shake-effect'), 350);
    }

    vibrate(pattern) {
        if ("vibrate" in navigator) {
            try { navigator.vibrate(pattern); } catch(e) {}
        }
    }
}

const game = new CultSurvivalGame();
