/* 픽셀 배경 위에서 사람이 접근하고 대화와 선택이 바로 이어진다. */
class PixelAdventure {
    constructor(game) {
        this.game = game;
        game.adventure = this;
        this.canvas = document.getElementById('world-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.background = new Image();
        this.background.src = 'assets/pixel-worlds.png';
        this.mode = 'dialogue';
        this.frame = this.frame.bind(this);
        document.getElementById('field-choices').append(document.getElementById('choices-container'));
        document.getElementById('field-timer').append(document.getElementById('timeattack-bar-wrap'));
        document.getElementById('world-exit').onclick = () => game.switchScreen('start-screen');
        document.getElementById('dialogue-next').onclick = () => {
            if (this.finishMinigameIntro) {
                const next = this.finishMinigameIntro;
                this.finishMinigameIntro = null;
                next();
            }
        };
        requestAnimationFrame(this.frame);
    }

    enter(scene, onDone) {
        this.scene = scene;
        this.startedAt = performance.now();
        this.mode = 'dialogue';
        this.finishMinigameIntro = null;
        const key = this.game.currentScenarioKey;
        document.getElementById('world-dialogue').hidden = false;
        document.getElementById('dialogue-speaker').textContent = scene.sender;
        document.getElementById('world-location').textContent = scene.location;
        document.getElementById('encounter-caption').textContent = scene.bg === 'bg-phone'
            ? '대화가 이어진다' : '누군가 말을 걸어왔다';
        document.getElementById('choices-container').replaceChildren();
        document.getElementById('dialogue-next').hidden = true;
        const transcript = document.getElementById('dialogue-line');
        transcript.replaceChildren();
        for (const message of scene.messages) {
            const p = document.createElement('p');
            p.textContent = message.replace(/^\(|\)$/g, '');
            if (message.startsWith('(')) p.className = 'scene-narration';
            transcript.append(p);
        }
        document.getElementById('choice-prompt').textContent = scene.minigame
            ? '상황을 확인하고 계속 진행해.' : '어떻게 대답할까? 아래에서 골라줘.';
        this.updateState();
        audio.playMessagePop();
        this.game.later(() => {
            if (this.game.ended || this.game.currentScenarioKey !== key) return;
            if (scene.minigame) {
                this.finishMinigameIntro = onDone;
                const next = document.getElementById('dialogue-next');
                next.textContent = '계속하기 →'; next.hidden = false;
            } else {
                onDone();
                document.getElementById('choices-container').querySelectorAll('.choice-btn').forEach((button, index) => {
                    button.querySelector('.choice-arrow').textContent = `${index + 1}`;
                });
            }
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
    }

    onChoice() {
        this.mode = 'transition';
        document.getElementById('choice-prompt').textContent = '상대의 반응을 기다리는 중…';
    }
    closeDialogue() {
        this.finishMinigameIntro = null;
        document.getElementById('world-dialogue').hidden = true;
    }
    updateState() {
        document.getElementById('status-mental').textContent = `${Math.max(0, this.game.mental)} / 100`;
        document.getElementById('status-doubt').textContent = `${this.game.doubt} / 100`;
        document.getElementById('status-money').textContent = `${this.game.money.toLocaleString()}원`;
        document.getElementById('status-mental-bar').style.width = `${Math.max(0, this.game.mental)}%`;
        document.getElementById('status-doubt-bar').style.width = `${this.game.doubt}%`;
    }
    useItem() { return; }
    frame(now) {
        if (this.scene && document.getElementById('game-screen').classList.contains('active') && !this.game.ended) this.draw(now);
        requestAnimationFrame(this.frame);
    }
    draw(now) {
        const c = this.ctx;
        c.imageSmoothingEnabled = false;
        c.fillStyle = '#101b29'; c.fillRect(0, 0, 480, 270);
        let index = this.game.currentChapterId - 1;
        if (['bg-cafe','bg-altar','bg-center'].includes(this.scene.bg)) index = 1;
        if (this.scene.bg === 'bg-bar') index = 2;
        if (this.background.complete && this.background.naturalWidth) {
            const w = this.background.width / 2, h = this.background.height / 2;
            c.drawImage(this.background, index % 2 * w, Math.floor(index / 2) * h, w, h, 0, 0, 480, 270);
        }
        c.fillStyle = 'rgba(4,9,21,.13)'; c.fillRect(0, 0, 480, 270);
        const progress = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : Math.min(1, (now-this.startedAt)/600);
        this.sprite(175, 235, '#83ced1', false, now);
        this.sprite(420 - 110 * progress, 230, '#d8bf9d', progress < 1, now);
        c.fillStyle = '#101e2ce0'; c.fillRect(155, 245, 40, 14); c.fillRect(285, 240, 50, 14);
        c.font = '9px sans-serif'; c.textAlign = 'center'; c.fillStyle = '#d9e5d5';
        c.fillText('나', 175, 255); c.fillText('상대방', 310, 250);
    }
    sprite(x,y,shirt,walking,now) {
        const c=this.ctx;x=Math.round(x);const step=walking?(Math.floor(now/130)%2?2:-2):0;
        c.fillStyle='#0005';c.fillRect(x-10,y+2,20,4);
        c.fillStyle='#171c26';c.fillRect(x-6,y-35,12,7);
        c.fillStyle='#dfb697';c.fillRect(x-5,y-29,10,9);
        c.fillStyle='#171c26';c.fillRect(x-6,y-32,12,4);
        c.fillStyle=shirt;c.fillRect(x-7,y-19,14,14);c.fillRect(x-10,y-16,3,11);c.fillRect(x+7,y-16,3,11);
        c.fillStyle='#dfb697';c.fillRect(x-10,y-6,3,3);c.fillRect(x+7,y-6,3,3);
        c.fillStyle='#1a2639';c.fillRect(x-6,y-5,5,8+step);c.fillRect(x+1,y-5,5,8-step);
        c.fillStyle='#ddd7bf';c.fillRect(x-7,y+2+step,6,2);c.fillRect(x+1,y+2-step,6,2);
    }
}
const adventure = new PixelAdventure(game);
