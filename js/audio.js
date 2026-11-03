// Web Audio API를 활용한 무음원 자체 합성 사운드 엔진
// 외부 mp3 파일 없이 브라우저 자체 오디오 신시사이저로 100% 작동
class SoundController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.heartbeatTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        return this.isMuted;
    }

    // 1. 심장 박동 저음 (두근... 두근...)
    playHeartbeat() {
        if (this.isMuted || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);

        // 두 번째 박동 (더블 비트)
        setTimeout(() => {
            if (this.isMuted || !this.ctx) return;
            const now2 = this.ctx.currentTime;
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(60, now2);
            osc2.frequency.exponentialRampToValueAtTime(30, now2 + 0.2);

            gain2.gain.setValueAtTime(0.4, now2);
            gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.22);

            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);

            osc2.start(now2);
            osc2.stop(now2 + 0.24);
        }, 160);
    }

    startHeartbeatLoop(bpm = 75) {
        this.stopHeartbeatLoop();
        if (this.isMuted) return;
        const interval = (60 / bpm) * 1000;
        this.playHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.playHeartbeat();
        }, interval);
    }

    stopHeartbeatLoop() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    // 2. 멘탈 타격음 (쿵! 노이즈+저음)
    playDamage() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // 3. 의심도 상승 띵- 소리 (직관/눈치 발동)
    playDoubtUp() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    // 4. 지갑 돈 뜯기는 소리 (찰랑~)
    playMoneyLost() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [987.77, 880, 783.99, 659.25];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = now + idx * 0.06;

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.1);
        });
    }

    // 5. 아이템 사용 효과음 (쉬익- 치트키 발동)
    playItemUse() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // 6. 글리치 / 기괴한 노이즈
    playGlitch() {
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.25);
    }

    // 7. 게임오버 / 세뇌 완료 (우울한 디센딩)
    playGameOver() {
        this.stopHeartbeatLoop();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [330, 311.13, 293.66, 261.63, 196];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = now + idx * 0.22;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.35);
        });
    }

    // 8. 승리 / 탈출 팬파레 (희망찬 아르페지오)
    playVictory() {
        this.stopHeartbeatLoop();
        if (this.isMuted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = now + idx * 0.12;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.4);
        });
    }
}

const audio = new SoundController();
