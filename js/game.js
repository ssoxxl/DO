// 리얼 카톡/채팅 뷰 & 타임어택 & 미니게임 게임 엔진
class CultSurvivalGame {
    constructor() {
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.currentScenarioKey = null;
        this.currentChapterId = 1;
        this.isFakeActive = false;

        // 타임어택 관리
        this.timerInterval = null;
        this.timeRemaining = 0;
        this.maxTime = 5;

        // 미니게임 상태
        this.tapCount = 10;
        this.tapTimer = null;

        // 긴급 찬스 아이템
        this.items = {
            airpods: { name: "노캔 에어팟", count: 1, icon: "🎧", desc: "길거리 포교 즉시 무시" },
            sinbul: { name: "신불자 명함", count: 1, icon: "💳", desc: "\"저 빚만 2억인데요?\"" },
            safety_app: { name: "안전신문고", count: 1, icon: "🚨", desc: "불법 적치물/경범죄 112 신고" },
            fake_call: { name: "엄마 가짜전화", count: 1, icon: "📱", desc: "긴급 전력질주 탈출" }
        };

        this.initEventListeners();
    }

    initEventListeners() {
        const muteBtn = document.getElementById('mute-toggle-btn');
        if (muteBtn) {
            muteBtn.onclick = () => {
                const muted = audio.toggleMute();
                muteBtn.innerText = muted ? "🔇 사운드 OFF" : "🔊 사운드 ON";
            };
        }
    }

    startChapter(chapterId) {
        audio.init();
        this.currentChapterId = chapterId;
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.isFakeActive = false;
        this.clearTimer();

        // 아이템 초기화
        this.items.airpods.count = 1;
        this.items.sinbul.count = 1;
        this.items.safety_app.count = 1;
        this.items.fake_call.count = 1;

        // 채팅창 비우기
        const chatBox = document.getElementById('chat-messages-container');
        if (chatBox) chatBox.innerHTML = '';

        this.switchScreen('game-screen');
        this.updateHUD();
        this.renderInventory();

        const chapter = CHAPTER_INFO.find(c => c.id === chapterId);
        if (chapter) {
            this.showScenario(chapter.startKey);
        }
    }

    showScenario(key) {
        this.clearTimer();

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

        // 배경 전환
        document.body.className = scene.bg || 'bg-street';

        // 상단 프로필 및 위치 갱신
        document.getElementById('chat-avatar').innerText = scene.avatar || "👤";
        document.getElementById('chat-sender-name').innerText = scene.sender || "상대방";
        document.getElementById('chat-location-badge').innerText = scene.location || "";

        // 미니게임 체크
        if (scene.minigame) {
            this.renderMinigame(scene);
            return;
        }

        // 카톡 말풍선 순차 출력
        this.renderChatMessages(scene);
    }

    // 카톡 말풍선 순차 렌더링
    renderChatMessages(scene) {
        const chatBox = document.getElementById('chat-messages-container');
        const choicesArea = document.getElementById('choices-container');
        choicesArea.innerHTML = '';
        this.hideTimer();

        // 상대방 메시지를 하나씩 0.35초 간격으로 추가
        let delay = 0;
        scene.messages.forEach((msg, idx) => {
            setTimeout(() => {
                this.appendOtherMessage(scene.avatar, scene.sender, msg);
                audio.playMessagePop();
                this.scrollChatToBottom();

                // 모든 메시지 출력 완료 후 선택지 표시 및 타임어택 가동
                if (idx === scene.messages.length - 1) {
                    setTimeout(() => {
                        this.renderChoices(scene);
                    }, 300);
                }
            }, delay);
            delay += 450;
        });
    }

    appendOtherMessage(avatar, name, text) {
        const chatBox = document.getElementById('chat-messages-container');
        const row = document.createElement('div');
        row.className = 'chat-bubble-row other';
        row.innerHTML = `
            <div class="bubble-avatar">${avatar}</div>
            <div class="bubble-content">
                <span class="bubble-name">${name}</span>
                <div class="bubble-text other-bubble">${text}</div>
            </div>
        `;
        chatBox.appendChild(row);
    }

    appendMyMessage(text) {
        const chatBox = document.getElementById('chat-messages-container');
        const row = document.createElement('div');
        row.className = 'chat-bubble-row my';
        row.innerHTML = `
            <div class="bubble-content">
                <div class="bubble-text my-bubble">${text}</div>
            </div>
        `;
        chatBox.appendChild(row);
        this.scrollChatToBottom();
    }

    scrollChatToBottom() {
        const chatBox = document.getElementById('chat-messages-container');
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 선택지 렌더링 및 타임어택 시작
    renderChoices(scene) {
        const container = document.getElementById('choices-container');
        container.innerHTML = '';
        this.isFakeActive = false;

        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-arrow">💬</span> <span class="choice-label">${choice.text}</span>`;

            if (choice.fakeButton) {
                btn.id = "fake-evade-btn";
                btn.onmouseover = (e) => this.evadeCursor(e);
                btn.ontouchstart = (e) => this.evadeCursor(e);
                btn.onclick = () => this.handleGlitchButton(btn);
            } else if (choice.glitch) {
                btn.className += " glitch-text-btn";
                btn.onclick = () => {
                    audio.playGlitch();
                    this.clearTimer();
                    this.triggerEnding(choice.next);
                };
            } else {
                btn.onclick = () => {
                    this.clearTimer();
                    this.selectChoice(choice);
                };
            }
            container.appendChild(btn);
        });

        // 타임어택 시작
        if (scene.timeLimit && scene.timeLimit > 0) {
            this.startTimer(scene.timeLimit, scene.timeout);
        }
    }

    selectChoice(choice) {
        audio.playSendClick();
        this.appendMyMessage(choice.text);

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

        // 상태 한계 체크
        if (this.mental <= 0) {
            setTimeout(() => {
                this.triggerEnding(this.currentChapterId === 2 ? 'ending_ancestor_debt' : 'ending_center_114');
            }, 600);
            return;
        }

        if (this.money <= 0) {
            setTimeout(() => {
                this.triggerEnding('ending_broke');
            }, 600);
            return;
        }

        if (this.doubt >= 80) {
            setTimeout(() => {
                this.triggerEnding('ending_police_call');
            }, 600);
            return;
        }

        // 다음 씬 이동 (약간의 딜레이로 실시간 느낌 조성)
        if (choice.next) {
            setTimeout(() => {
                this.showScenario(choice.next);
            }, 500);
        }
    }

    // ==========================================
    // 타임어택(초시계) 시스템
    // ==========================================
    startTimer(seconds, timeoutData) {
        this.clearTimer();
        this.maxTime = seconds;
        this.timeRemaining = seconds;

        const timerWrap = document.getElementById('timeattack-bar-wrap');
        const timerFill = document.getElementById('timeattack-bar-fill');
        const timerText = document.getElementById('timeattack-text');

        timerWrap.style.display = 'block';
        timerFill.style.width = '100%';
        timerFill.style.backgroundColor = '#00ffcc';
        timerText.innerText = `⏱️ ${this.timeRemaining.toFixed(1)}초 남음!`;

        const intervalMs = 100;
        this.timerInterval = setInterval(() => {
            this.timeRemaining -= intervalMs / 1000;
            const pct = Math.max(0, (this.timeRemaining / this.maxTime) * 100);
            timerFill.style.width = pct + '%';
            timerText.innerText = `⏱️ ${Math.max(0, this.timeRemaining).toFixed(1)}초`;

            // 긴급 경고 (2초 이하)
            if (this.timeRemaining <= 2.5) {
                timerFill.style.backgroundColor = '#ff0055';
                audio.playTick();
            } else if (this.timeRemaining <= 4) {
                timerFill.style.backgroundColor = '#ffbb00';
            }

            // 타임 오버
            if (this.timeRemaining <= 0) {
                this.clearTimer();
                this.handleTimeout(timeoutData);
            }
        }, intervalMs);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    hideTimer() {
        const timerWrap = document.getElementById('timeattack-bar-wrap');
        if (timerWrap) timerWrap.style.display = 'none';
    }

    handleTimeout(timeoutData) {
        audio.playDamage();
        this.shakeScreen();
        this.vibrate([100, 100, 100]);

        const timeoutMsg = timeoutData && timeoutData.text ? timeoutData.text : "어버버... (아무 말도 하지 못했다)";
        this.appendMyMessage(`⚠️ [시간 초과!] ${timeoutMsg}`);

        if (timeoutData && timeoutData.mentalDmg) {
            this.mental -= timeoutData.mentalDmg;
            this.updateHUD();
        }

        setTimeout(() => {
            if (timeoutData && timeoutData.next) {
                this.showScenario(timeoutData.next);
            } else {
                this.triggerEnding('ending_center_114');
            }
        }, 800);
    }

    // ==========================================
    // 인터랙티브 미니게임 시스템
    // ==========================================
    renderMinigame(scene) {
        const modal = document.getElementById('minigame-modal');
        const body = document.getElementById('minigame-content');
        modal.classList.add('active');

        if (scene.minigame === 'sticker') {
            body.innerHTML = `
                <div class="tablet-frame">
                    <div class="tablet-header">📋 [웹툰 기획 설문조사] 스티커 부착</div>
                    <p class="tablet-question">Q. 평소 진로나 마음에 혼자만의 고민이 많으신가요?</p>
                    <div class="survey-options">
                        <div class="survey-option" id="survey-target-box">
                            <span>[매우 그렇다] 여기에 스티커를 꾹 붙여주세요!</span>
                            <div id="placed-sticker-slot"></div>
                        </div>
                    </div>
                    <div class="sticker-palette">
                        <div id="draggable-heart-sticker" class="heart-sticker">💖 꾹 눌러서 붙이기!</div>
                    </div>
                </div>
            `;

            const sticker = document.getElementById('draggable-heart-sticker');
            const target = document.getElementById('placed-sticker-slot');

            sticker.onclick = () => {
                audio.playStickerSnap();
                this.vibrate(100);
                target.innerHTML = `<span style="font-size:2.5rem; animation:popIn 0.3s;">💖</span>`;
                sticker.style.opacity = '0.3';
                sticker.innerText = "부착 완료!";

                setTimeout(() => {
                    modal.classList.remove('active');
                    this.appendMyMessage("스티커를 붙여주었다.");
                    this.showScenario(scene.nextAfterMinigame);
                }, 1000);
            };

        } else if (scene.minigame === 'shape') {
            body.innerHTML = `
                <div class="tablet-frame">
                    <div class="tablet-header">🔮 도형 성향 심리테스트</div>
                    <p class="tablet-question">가장 마음이 끌리는 도형 1개를 터치하세요!</p>
                    <div class="shapes-grid">
                        <button class="shape-card" onclick="game.selectShape('동그라미(○)', '${scene.nextAfterMinigame}')">
                            <span class="shape-icon">⭕</span>
                            <span class="shape-title">동그라미</span>
                            <span class="shape-desc">관계 지향형</span>
                        </button>
                        <button class="shape-card" onclick="game.selectShape('세모(△)', '${scene.nextAfterMinigame}')">
                            <span class="shape-icon">🔺</span>
                            <span class="shape-title">세모</span>
                            <span class="shape-desc">성취 주도형</span>
                        </button>
                        <button class="shape-card" onclick="game.selectShape('네모(□)', '${scene.nextAfterMinigame}')">
                            <span class="shape-icon">⏹️</span>
                            <span class="shape-title">네모</span>
                            <span class="shape-desc">원칙 신중형</span>
                        </button>
                        <button class="shape-card" onclick="game.selectShape('지그재그(S)', '${scene.nextAfterMinigame}')">
                            <span class="shape-icon">⚡</span>
                            <span class="shape-title">지그재그(S)</span>
                            <span class="shape-desc">창의 감성형</span>
                        </button>
                    </div>
                </div>
            `;
        } else if (scene.minigame === 'tap_cancel') {
            this.tapCount = 10;
            body.innerHTML = `
                <div class="tablet-frame" style="border-color: #ff0055;">
                    <div class="tablet-header" style="color: #ff0055;">⚠️ [위기] 카카오페이 100만 원 송금 승인 중!</div>
                    <p class="tablet-question">선감이 폰을 뺏어 송금 버튼을 누르려 합니다!<br><strong>[송금 취소]</strong> 버튼을 10번 광클해서 막아내세요!</p>
                    
                    <div class="tap-counter-box">
                        남은 연타 횟수: <span id="tap-remaining-count" style="color: #ff0055; font-size: 2rem;">10</span>회
                    </div>

                    <button id="tap-cancel-action-btn" class="tap-giant-btn">
                        🚨 송금 취소 연타!! (클릭!)
                    </button>
                </div>
            `;

            const tapBtn = document.getElementById('tap-cancel-action-btn');
            const countElem = document.getElementById('tap-remaining-count');

            tapBtn.onclick = () => {
                this.tapCount--;
                audio.playTapSuccess();
                this.vibrate(50);
                countElem.innerText = this.tapCount;
                tapBtn.style.transform = `scale(${0.92 + Math.random() * 0.15})`;

                if (this.tapCount <= 0) {
                    modal.classList.remove('active');
                    alert("🛡️ 송금 취소 성공! 지갑 잔고를 완벽하게 지켜냈습니다!");
                    this.triggerEnding(scene.nextAfterMinigame);
                }
            };
        }
    }

    selectShape(shapeName, nextKey) {
        audio.playStickerSnap();
        this.vibrate(100);
        document.getElementById('minigame-modal').classList.remove('active');
        this.appendMyMessage(`[도형 테스트] ${shapeName}을 선택했다.`);
        setTimeout(() => {
            this.showScenario(nextKey);
        }, 500);
    }

    // 아이템 사용 로직
    useItem(itemKey) {
        const item = this.items[itemKey];
        if (!item || item.count <= 0) return;

        this.clearTimer();
        audio.playItemUse();
        item.count--;
        this.renderInventory();

        if (itemKey === 'airpods') {
            alert("🎧 노이즈 캔슬링 에어팟 장착!\n주변의 잡소리를 완벽히 차단하고 지나갑니다.");
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

        const doubtBar = document.getElementById('doubt-bar');
        const doubtText = document.getElementById('doubt-value');
        if (doubtBar && doubtText) {
            const clampedDoubt = Math.min(100, this.doubt);
            doubtBar.style.width = clampedDoubt + '%';
            doubtText.innerText = clampedDoubt + '%';
        }

        const moneyText = document.getElementById('money-value');
        if (moneyText) {
            moneyText.innerText = this.money.toLocaleString() + '원';
        }
    }

    evadeCursor(e) {
        if (this.isFakeActive) return;
        const btn = e.target.closest('button');
        if (!btn) return;

        const container = document.getElementById('choices-container');
        const maxX = Math.max(50, container.offsetWidth - btn.offsetWidth - 20);
        const randX = (Math.random() - 0.5) * maxX;
        const randY = (Math.random() - 0.5) * 100;

        btn.style.transform = `translate(${randX}px, ${randY}px)`;
        btn.style.borderColor = '#ff0055';
    }

    handleGlitchButton(btn) {
        this.isFakeActive = true;
        this.clearTimer();
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
        this.clearTimer();
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

        const badge = document.getElementById('result-grade-badge');
        badge.innerText = `등급: ${endData.grade}`;
        badge.style.backgroundColor = endData.badgeColor;

        document.getElementById('result-title').innerText = endData.title;
        document.getElementById('result-subtitle').innerText = endData.subtitle;
        document.getElementById('result-desc').innerText = endData.desc;

        document.getElementById('stat-mental').innerText = Math.max(0, this.mental) + ' / 100';
        document.getElementById('stat-doubt').innerText = this.doubt + ' / 100';
        document.getElementById('stat-money').innerText = this.money.toLocaleString() + '원';

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
