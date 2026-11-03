// 리얼 카톡/채팅 뷰 & 타임어택 & 미니게임 게임 엔진

// 씬에 items 지정이 없을 때 배경별로 쓸 수 있는 아이템
const ITEMS_BY_BG = {
    'bg-street': ['airpods', 'sinbul', 'safety_app', 'fake_call'],
    'bg-cafe': ['sinbul', 'fake_call'],
    'bg-bar': ['fake_call'],
    'bg-altar': ['sinbul', 'safety_app'],
    'bg-center': [],
    'bg-phone': []
};

class CultSurvivalGame {
    constructor() {
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.currentScenarioKey = null;
        this.currentChapterId = 1;
        this.isFakeActive = false;
        this.choicesReady = false;
        this.ended = false;

        // 지연 실행 관리 (챕터 재시작/엔딩 시 남은 연출이 끼어들지 않도록)
        this.pending = [];
        this.history = [];
        this.visitedScenes = new Set();

        // 타임어택 관리
        this.timerInterval = null;
        this.timeRemaining = 0;
        this.maxTime = 10;

        // 미니게임 상태
        this.tapCount = 15;
        this.tapTimer = null;

        // 긴급 찬스 아이템
        this.items = {
            airpods: { name: "노캔 에어팟", count: 1, icon: "🎧", desc: "길거리 포교 즉시 무시" },
            sinbul: { name: "신불자 명함", count: 1, icon: "💳", desc: "\"저 빚만 2억인데요?\"" },
            safety_app: { name: "112·안전신문고", count: 1, icon: "🚨", desc: "불법 적치물/경범죄 112 신고" },
            fake_call: { name: "엄마 가짜전화", count: 1, icon: "📱", desc: "긴급 전력질주 탈출" }
        };

        this.initEventListeners();
        this.renderChapterGrid();
    }

    initEventListeners() {
        const muteBtn = document.getElementById('mute-toggle-btn');
        if (muteBtn) {
            muteBtn.onclick = () => {
                const muted = audio.toggleMute();
                muteBtn.innerText = muted ? "🔇 OFF" : "🔊 ON";
            };
        }
    }

    renderChapterGrid() {
        const grid = document.getElementById('chapter-grid');
        if (!grid) return;
        grid.innerHTML = '';
        CHAPTER_INFO.forEach(ch => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'chapter-card' + (ch.tag.startsWith('NEW') ? ' chapter-new' : '');
            card.innerHTML = `
                <span class="chapter-art art-${ch.id}" aria-hidden="true"></span>
                <div class="chapter-card-header">
                    <span class="chapter-badge">Chapter ${ch.id}</span>
                    <span class="chapter-name">${ch.icon} ${ch.title}</span>
                </div>
                <span class="chapter-tag">${ch.tag}</span>
                <p class="chapter-desc">${ch.desc}</p>
                <span class="chapter-meta">${Object.values(SCENARIOS).filter(s => s.chapter === ch.id).length}개 장면 · 대화와 선택<br>이야기 시작하기 ↗</span>
            `;
            card.onclick = () => this.startChapter(ch.id);
            grid.appendChild(card);
        });
    }

    later(fn, ms) {
        const id = setTimeout(() => {
            this.pending = this.pending.filter(p => p !== id);
            fn();
        }, ms);
        this.pending.push(id);
    }

    cancelPending() {
        this.pending.forEach(id => clearTimeout(id));
        this.pending = [];
        if (this.tapTimer) {
            clearInterval(this.tapTimer);
            this.tapTimer = null;
        }
    }

    startChapter(chapterId) {
        audio.init();
        this.cancelPending();
        this.currentChapterId = chapterId;
        this.history = [];
        this.visitedScenes = new Set();
        this.readingMode = document.getElementById('reading-mode').checked;
        this.mental = 100;
        this.doubt = 0;
        this.money = 500000;
        this.isFakeActive = false;
        this.choicesReady = false;
        this.ended = false;
        this.clearTimer();
        this.hideTimer();

        Object.values(this.items).forEach(it => it.count = 1);

        const chatBox = document.getElementById('chat-messages-container');
        if (chatBox) chatBox.innerHTML = '';
        document.getElementById('minigame-modal').classList.remove('active');

        this.switchScreen('game-screen');
        this.updateHUD();

        const chapter = CHAPTER_INFO.find(c => c.id === chapterId);
        if (chapter) {
            this.showScenario(chapter.startKey);
        }
    }

    showScenario(key) {
        if (this.ended) return;
        this.clearTimer();
        this.choicesReady = false;

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
        this.visitedScenes.add(key);
        document.getElementById('journey-progress').innerText = `CHAPTER ${this.currentChapterId} · ${this.visitedScenes.size}개 장면 탐색`;
        document.getElementById('scene-art').className = `scene-art art-${this.currentChapterId}`;
        this.renderInventory();

        // 배경 전환
        document.body.className = scene.bg || 'bg-street';

        // 상단 프로필 및 위치 갱신
        document.getElementById('chat-avatar').innerText = scene.avatar || "👤";
        document.getElementById('chat-sender-name').innerText = scene.sender || "상대방";
        document.getElementById('chat-location-badge').innerText = scene.location || "";
        const modeBadge = document.getElementById('chat-mode-badge');
        if (modeBadge) {
            modeBadge.innerText = scene.bg === 'bg-phone' ? '💬 메신저' : '🗣️ 대면 상황';
        }

        if (scene.minigame) {
            this.renderChatMessages(scene, () => this.renderMinigame(scene));
            return;
        }

        this.renderChatMessages(scene, () => this.renderChoices(scene));
    }

    // 말풍선 순차 렌더링 후 onDone 실행
    renderChatMessages(scene, onDone) {
        if (this.adventure) return this.adventure.enter(scene, onDone);
        const choicesArea = document.getElementById('choices-container');
        choicesArea.innerHTML = '';
        this.hideTimer();

        this.appendDivider(scene.location);

        let delay = 300;
        scene.messages.forEach((msg, idx) => {
            this.later(() => {
                if (this.isNarration(msg)) {
                    this.appendNarration(msg);
                } else {
                    this.appendOtherMessage(scene.avatar, scene.sender, msg);
                    audio.playMessagePop();
                }
                this.scrollChatToBottom();

                if (idx === scene.messages.length - 1) {
                    this.later(onDone, 350);
                }
            }, delay);
            // 긴 문장일수록 읽을 시간을 조금 더 준다
            delay += Math.min(1100, 450 + msg.length * 12);
        });
    }

    isNarration(text) {
        return text.startsWith('(') || text.startsWith('⚠️');
    }

    appendDivider(text) {
        if (!text) return;
        const chatBox = document.getElementById('chat-messages-container');
        const div = document.createElement('div');
        div.className = 'chat-divider';
        div.innerText = text;
        chatBox.appendChild(div);
    }

    appendNarration(text) {
        const chatBox = document.getElementById('chat-messages-container');
        const div = document.createElement('div');
        div.className = 'chat-narration';
        div.innerText = text.replace(/^\(|\)$/g, '');
        chatBox.appendChild(div);
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
        this.choicesReady = true;
        this.renderInventory();

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
                    if (!this.choicesReady) return;
                    this.clearTimer();
                    this.selectChoice(choice);
                };
            }
            container.appendChild(btn);
        });

        if (!this.readingMode && scene.timeLimit && scene.timeLimit > 0) {
            this.startTimer(scene.timeLimit, scene.timeout);
        }
    }

    selectChoice(choice) {
        if (this.adventure) this.adventure.onChoice(choice);
        this.history.push({ location: SCENARIOS[this.currentScenarioKey].location, text: choice.text });
        this.choicesReady = false;
        document.getElementById('choices-container').innerHTML = '';
        this.hideTimer();
        this.renderInventory();

        audio.playSendClick();
        this.appendMyMessage(choice.text);
        this.applyStats(choice);

        if (this.checkLimits()) return;

        if (choice.next) {
            this.later(() => this.showScenario(choice.next), 600);
        }
    }

    applyStats(data) {
        if (data.mentalDmg) {
            this.mental -= data.mentalDmg;
            audio.playDamage();
            this.shakeScreen();
            this.vibrate(200);
            this.floatStat(`🧠 -${data.mentalDmg}`, 'neg');
        }
        if (data.doubt) {
            this.doubt = Math.min(100, this.doubt + data.doubt);
            audio.playDoubtUp();
            this.floatStat(`🔍 +${data.doubt}`, 'pos');
        }
        if (data.moneyDmg) {
            this.money = Math.max(0, this.money - data.moneyDmg);
            audio.playMoneyLost();
            this.floatStat(`💰 -${data.moneyDmg.toLocaleString()}`, 'neg');
        }
        this.updateHUD();
    }

    // 상태 한계 체크: 엔딩으로 넘어갔으면 true
    checkLimits() {
        let ending = null;
        if (this.mental <= 0) {
            ending = this.currentChapterId === 2 ? 'ending_ancestor_debt'
                : this.currentChapterId === 3 ? 'ending_cult_leaf'
                : this.currentChapterId === 4 ? 'ending_crew_center'
                : 'ending_center_114';
        } else if (this.money <= 0) {
            ending = 'ending_broke';
        }
        if (!ending) return false;
        this.later(() => this.triggerEnding(ending), 700);
        return true;
    }

    // 작은 스탯 변화 팝업
    floatStat(text, kind) {
        const hud = document.querySelector('.chat-hud-bar');
        if (!hud) return;
        const el = document.createElement('span');
        el.className = `stat-float ${kind}`;
        el.innerText = text;
        hud.appendChild(el);
        setTimeout(() => el.remove(), 1100);
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
        let lastTick = Infinity;
        this.timerInterval = setInterval(() => {
            if (document.hidden || document.querySelector('#collection-modal.active, #guide-modal.active')) return;
            this.timeRemaining -= intervalMs / 1000;
            const pct = Math.max(0, (this.timeRemaining / this.maxTime) * 100);
            timerFill.style.width = pct + '%';
            timerText.innerText = `⏱️ ${Math.max(0, this.timeRemaining).toFixed(1)}초`;

            if (this.timeRemaining <= 3) {
                timerFill.style.backgroundColor = '#ff0055';
                // 1초마다 한 번만 째깍
                const sec = Math.ceil(this.timeRemaining);
                if (sec < lastTick) {
                    lastTick = sec;
                    audio.playTick();
                }
            } else if (this.timeRemaining <= 5) {
                timerFill.style.backgroundColor = '#ffbb00';
            }

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
        this.choicesReady = false;
        document.getElementById('choices-container').innerHTML = '';
        this.hideTimer();
        this.renderInventory();
        this.vibrate([100, 100, 100]);

        const timeoutMsg = timeoutData && timeoutData.text ? timeoutData.text : "어버버... (아무 말도 하지 못했다)";
        this.history.push({ location: SCENARIOS[this.currentScenarioKey].location, text: `시간 초과: ${timeoutMsg}` });
        this.appendMyMessage(`⚠️ [시간 초과!] ${timeoutMsg}`);

        if (timeoutData) this.applyStats(timeoutData);
        if (this.checkLimits()) return;

        this.later(() => {
            if (timeoutData && timeoutData.next) {
                this.showScenario(timeoutData.next);
            } else {
                this.triggerEnding('ending_center_114');
            }
        }, 900);
    }

    // ==========================================
    // 인터랙티브 미니게임 시스템
    // ==========================================
    renderMinigame(scene) {
        this.shapeSelected = false;
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
                    <p class="tablet-footnote">※ 이 설문지 답변은 '고민 많은 사람' 명단으로 따로 분류됩니다.</p>
                </div>
            `;

            const sticker = document.getElementById('draggable-heart-sticker');
            const target = document.getElementById('placed-sticker-slot');

            sticker.onclick = () => {
                sticker.onclick = null;
                audio.playStickerSnap();
                this.vibrate(100);
                target.innerHTML = `<span style="font-size:2.5rem; animation:popIn 0.3s;">💖</span>`;
                sticker.style.opacity = '0.3';
                sticker.innerText = "부착 완료!";

                this.later(() => {
                    modal.classList.remove('active');
                    this.appendMyMessage("스티커를 붙여주었다.");
                    this.showScenario(scene.nextAfterMinigame);
                }, 1000);
            };

        } else if (scene.minigame === 'shape') {
            const shapes = [
                ['동그라미(○)', '⭕', '동그라미', '관계 지향형'],
                ['세모(△)', '🔺', '세모', '성취 주도형'],
                ['네모(□)', '⏹️', '네모', '원칙 신중형'],
                ['지그재그(S)', '⚡', '지그재그(S)', '창의 감성형']
            ];
            body.innerHTML = `
                <div class="tablet-frame">
                    <div class="tablet-header">🔮 도형 성향 심리테스트</div>
                    <p class="tablet-question">가장 마음이 끌리는 도형 1개를 터치하세요!</p>
                    <div class="shapes-grid"></div>
                </div>
            `;
            const grid = body.querySelector('.shapes-grid');
            shapes.forEach(([name, icon, title, desc]) => {
                const btn = document.createElement('button');
                btn.className = 'shape-card';
                btn.innerHTML = `<span class="shape-icon">${icon}</span><span class="shape-title">${title}</span><span class="shape-desc">${desc}</span>`;
                btn.onclick = () => this.selectShape(name, scene.nextAfterMinigame);
                grid.appendChild(btn);
            });

        } else if (scene.minigame === 'tap_cancel') {
            const goal = 15;
            const limit = 5;
            this.tapCount = goal;
            let left = limit;
            body.innerHTML = `
                <div class="tablet-frame" style="border-color: #ff0055;">
                    <div class="tablet-header" style="color: #ff0055;">⚠️ [위기] 간편송금 1,000,000원 승인 중!</div>
                    <p class="tablet-question">선감이 폰을 뺏어 송금 버튼을 누르려 합니다!<br><strong>${limit}초 안에 [송금 취소]를 ${goal}번</strong> 연타하세요!</p>

                    <div class="tap-counter-box">
                        남은 연타: <span id="tap-remaining-count" style="color: #ff0055; font-size: 2rem;">${goal}</span>회
                        · <span id="tap-time-left">${limit.toFixed(1)}</span>초
                    </div>
                    <div class="timeattack-bar-bg"><div id="tap-progress" class="timeattack-bar-fill" style="width:0%; background:#00ffcc;"></div></div>

                    <button id="tap-cancel-action-btn" class="tap-giant-btn">
                        🚨 송금 취소!! (연타!)
                    </button>
                </div>
            `;

            const tapBtn = document.getElementById('tap-cancel-action-btn');
            const countElem = document.getElementById('tap-remaining-count');
            const timeElem = document.getElementById('tap-time-left');
            const progress = document.getElementById('tap-progress');

            const finish = (success) => {
                clearInterval(this.tapTimer);
                this.tapTimer = null;
                tapBtn.onclick = null;
                this.later(() => {
                    modal.classList.remove('active');
                    if (success) {
                        this.appendMyMessage("🛡️ 송금 취소 성공! 폰을 낚아채 주머니에 넣었다.");
                        this.later(() => this.triggerEnding(scene.nextAfterMinigame), 900);
                    } else {
                        this.appendMyMessage("💸 [송금 완료] 1,000,000원이 빠져나갔다...");
                        this.applyStats({ moneyDmg: 500000, mentalDmg: 30 });
                        this.later(() => this.triggerEnding(scene.failEnding || 'ending_ancestor_debt'), 1200);
                    }
                }, 400);
            };

            this.tapTimer = setInterval(() => {
                if (document.hidden || document.querySelector('#collection-modal.active, #guide-modal.active')) return;
                left -= 0.1;
                timeElem.innerText = Math.max(0, left).toFixed(1);
                if (left <= 0) finish(false);
            }, 100);

            tapBtn.onclick = () => {
                this.tapCount--;
                audio.playTapSuccess();
                this.vibrate(30);
                countElem.innerText = Math.max(0, this.tapCount);
                progress.style.width = ((goal - this.tapCount) / goal * 100) + '%';
                tapBtn.style.transform = `scale(${0.92 + Math.random() * 0.15}) rotate(${(Math.random() - 0.5) * 6}deg)`;
                if (this.tapCount <= 0) finish(true);
            };
        }
    }

    selectShape(shapeName, nextKey) {
        if (this.shapeSelected) return;
        this.shapeSelected = true;
        audio.playStickerSnap();
        this.vibrate(100);
        document.getElementById('minigame-modal').classList.remove('active');
        this.appendMyMessage(`[도형 테스트] ${shapeName}을 선택했다.`);
        this.later(() => this.showScenario(nextKey), 500);
    }

    // ==========================================
    // 긴급 아이템
    // ==========================================
    availableItems() {
        const scene = SCENARIOS[this.currentScenarioKey];
        if (!scene) return [];
        return scene.items || ITEMS_BY_BG[scene.bg] || [];
    }

    useItem(itemKey) {
        if (this.adventure) return this.adventure.useItem(itemKey);
        const item = this.items[itemKey];
        if (!item || item.count <= 0) return;

        if (!this.choicesReady || !this.availableItems().includes(itemKey)) {
            this.showToast(`${item.icon} 지금 상황에서는 ${item.name}을(를) 쓸 수 없다!`, 'warn');
            return;
        }

        this.clearTimer();
        this.hideTimer();
        this.choicesReady = false;
        document.getElementById('choices-container').innerHTML = '';
        audio.playItemUse();
        item.count--;
        this.renderInventory();

        const effects = {
            airpods: ["🎧 노이즈 캔슬링 ON. 주변의 잡소리가 완벽히 차단됐다.", 'ending_ironwall'],
            sinbul: ["💳 \"저 신용불량자고 통장 압류 들어왔는데요?\" ...상대가 눈빛을 주고받더니 조용히 사라진다.", 'ending_wallet_guard'],
            safety_app: ["🚨 [신고 접수 완료] \"불법 점용·불안감 조성으로 신고했습니다.\" 상대가 허겁지겁 짐을 챙긴다.", 'ending_police_call'],
            fake_call: ["📱 \"여보세요? 어 엄마! 지금 바로 갈게!\" 전화를 받으며 자연스럽게 전력 질주한다.", 'ending_sharp_escape']
        };
        const [msg, ending] = effects[itemKey];
        this.history.push({ location: SCENARIOS[this.currentScenarioKey].location, text: `${item.icon} ${item.name} 사용` });
        this.appendMyMessage(msg);
        this.showToast(`${item.icon} ${item.name} 사용!`, 'good');
        this.later(() => this.triggerEnding(ending), 1300);
    }

    renderInventory() {
        const container = document.getElementById('inventory-items');
        if (!container) return;
        container.innerHTML = '';
        const usable = this.choicesReady ? this.availableItems() : [];

        Object.keys(this.items).forEach(k => {
            const it = this.items[k];
            const state = it.count <= 0 ? 'used' : usable.includes(k) ? 'available' : 'locked';
            const badge = { used: '사용됨', available: '지금 사용!', locked: '사용 불가' }[state];
            const div = document.createElement('div');
            div.className = `item-slot ${state}`;
            div.title = it.desc;
            div.innerHTML = `
                <span class="item-icon">${it.icon}</span>
                <span class="item-name">${it.name}</span>
                <span class="item-badge">${badge}</span>
            `;
            if (it.count > 0) {
                div.onclick = () => this.useItem(k);
            }
            container.appendChild(div);
        });
    }

    showToast(text, kind = 'info') {
        const toast = document.getElementById('game-toast');
        if (!toast) return;
        toast.innerText = text;
        toast.className = `game-toast show ${kind}`;
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.className = 'game-toast', 1800);
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
            doubtBar.style.width = this.doubt + '%';
            doubtText.innerText = this.doubt + '%';
        }

        const moneyText = document.getElementById('money-value');
        if (moneyText) {
            moneyText.innerText = this.money.toLocaleString() + '원';
        }

        // 멘탈이 낮을수록 화면이 어두워지고 심장 소리가 빨라진다
        const app = document.getElementById('app');
        if (app) app.classList.toggle('low-mental', this.mental <= 30);
        if (this.adventure) this.adventure.updateState();
        const bpm = this.ended || this.mental > 30 ? 0 : this.mental <= 15 ? 120 : 95;
        if (bpm !== this.heartBpm) {
            this.heartBpm = bpm;
            if (bpm) audio.startHeartbeatLoop(bpm);
            else audio.stopHeartbeatLoop();
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
        if (!this.choicesReady || this.isFakeActive) return;
        this.choicesReady = false;
        this.isFakeActive = true;
        this.clearTimer();
        audio.playGlitch();
        this.vibrate([150, 50, 150]);

        btn.style.transform = 'translate(0, 0)';
        btn.className = "choice-btn glitch-text-btn";
        btn.innerHTML = `<span style="color:red; font-weight:bold;">앉아 앉아 앉아 앉아 앉아</span>`;

        this.later(() => this.triggerEnding('ending_fake_glitch'), 1200);
    }

    // 호구력 지수: 0(철벽) ~ 100(완전 호구)
    gullibilityScore() {
        const mentalLoss = 100 - Math.max(0, this.mental);
        const moneyLoss = (500000 - this.money) / 500000 * 100;
        const raw = mentalLoss * 0.6 + moneyLoss * 0.3 + (100 - this.doubt) * 0.1;
        return Math.round(Math.max(0, Math.min(100, raw)));
    }

    triggerEnding(endingId) {
        if (this.ended) return;
        if (this.adventure) this.adventure.closeDialogue();
        this.ended = true;
        this.cancelPending();
        this.clearTimer();
        this.hideTimer();
        this.choicesReady = false;
        audio.stopHeartbeatLoop();
        this.heartBpm = 0;
        document.body.className = '';
        document.getElementById('app').classList.remove('low-mental');
        document.getElementById('minigame-modal').classList.remove('active');

        if (!ENDINGS[endingId]) endingId = 'ending_center_114';
        const endData = ENDINGS[endingId];
        const isNew = !endingManager.getUnlockedEndings().includes(endingId);
        endingManager.unlock(endingId);
        this.lastEndingId = endingId;

        if (endData.type === 'safe') {
            audio.playVictory();
        } else {
            audio.playGameOver();
        }

        this.switchScreen('result-screen');

        const badge = document.getElementById('result-grade-badge');
        badge.innerText = `등급: ${endData.grade}`;
        badge.style.backgroundColor = endData.badgeColor;

        document.getElementById('result-new-badge').style.display = isNew ? 'inline-block' : 'none';
        document.getElementById('result-title').innerText = endData.title;
        document.getElementById('result-subtitle').innerText = endData.subtitle;
        document.getElementById('result-persona').innerText = ENDING_PERSONA[endingId] || '';
        document.getElementById('result-desc').innerText = endData.desc;
        const history = document.getElementById('decision-history');
        history.replaceChildren();
        this.history.forEach(entry => {
            const li = document.createElement('li');
            li.innerText = `${entry.location} — ${entry.text}`;
            history.appendChild(li);
        });

        const score = this.gullibilityScore();
        this.lastScore = score;
        document.getElementById('result-score').innerText = score + '%';
        document.getElementById('result-score-fill').style.width = score + '%';

        document.getElementById('stat-mental').innerText = Math.max(0, this.mental) + ' / 100';
        document.getElementById('stat-doubt').innerText = this.doubt + ' / 100';
        document.getElementById('stat-money').innerText = this.money.toLocaleString() + '원';

        this.updateCollectionStats();
        this.loadResultAd();
    }

    // 숨겨진 화면에서는 광고 폭이 0이라 채워지지 않으므로, 결과 화면이 처음 보일 때 한 번만 로드
    loadResultAd() {
        if (this.resultAdLoaded) return;
        this.resultAdLoaded = true;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    }

    retryChapter() {
        this.startChapter(this.currentChapterId);
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
        document.body.dataset.screen = screenId;
        if (screenId === 'start-screen') {
            this.cancelPending();
            this.clearTimer();
            this.ended = true;
            audio.stopHeartbeatLoop();
            this.heartBpm = 0;
            document.body.className = 'bg-street';
            document.getElementById('minigame-modal').classList.remove('active');
            document.getElementById('app').classList.remove('low-mental');
        }
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
