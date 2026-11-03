/* DOM 대화 + 저해상도 캔버스 탐색. 광고는 이 화면에 삽입하지 않는다. */
class PixelAdventure {
    constructor(game) {
        this.game = game;
        game.adventure = this;
        this.canvas = document.getElementById('world-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.player = { x: 125, y: 210 };
        this.keys = new Set();
        this.clues = new Map();
        this.inspected = new Set();
        this.exposure = 0;
        this.trust = 0;
        this.chapter = null;
        this.mode = 'explore';
        this.background = new Image();
        this.background.src = 'assets/pixel-worlds.png';
        this.background.onerror = () => { this.fallback = true; this.background.src = 'assets/chapter-panorama.png'; this.background.onerror = null; };
        document.getElementById('field-choices').append(document.getElementById('choices-container'));
        document.getElementById('field-timer').append(document.getElementById('timeattack-bar-wrap'));
        document.getElementById('world-interact').onclick = () => this.interactNearest();
        document.getElementById('world-exit').onclick = () => game.switchScreen('start-screen');
        document.getElementById('dialogue-next').onclick = () => this.advance();
        document.getElementById('dialogue-close').onclick = () => this.closeDialogue();
        document.getElementById('journal-toggle').onclick = () => this.toggleJournal();
        document.getElementById('journal-close').onclick = () => this.toggleJournal(false);
        document.getElementById('bag-toggle').onclick = () => document.getElementById('game-screen').classList.toggle('bag-open');
        this.canvas.addEventListener('pointerdown', e => {
            if (this.mode !== 'explore' || this.blocked()) return;
            const r = this.canvas.getBoundingClientRect();
            this.target = { x: Math.max(18, Math.min(462, (e.clientX-r.left)/r.width*this.canvas.width+(this.cameraX||0))), y: Math.max(175, Math.min(244,(e.clientY-r.top)/r.height*270)) };
        });
        window.addEventListener('keydown', e => {
            if (!this.active() || this.blocked() || /INPUT|TEXTAREA/.test(e.target.tagName) || e.target.tagName==='BUTTON'&&[' ','Enter'].includes(e.key)) return;
            const k=e.key.toLowerCase();
            if (['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d','e',' ','enter','escape'].includes(k)) e.preventDefault();
            if (e.repeat && ['e',' ','enter'].includes(k)) return;
            if (k === 'escape') { this.closeDialogue(); this.toggleJournal(false); return; }
            if (['e',' ','enter'].includes(k)) { this.mode === 'dialogue' ? this.advance() : this.interactNearest(); return; }
            this.keys.add(k);
        });
        window.addEventListener('keyup', e => this.keys.delete(e.key.toLowerCase()));
        window.addEventListener('blur',()=>this.keys.clear());
        for(const [id,key] of [['walk-left','a'],['walk-right','d']]) {
            const b=document.getElementById(id);
            b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.keys.add(key);});
            for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>this.keys.delete(key));
        }
        document.addEventListener('visibilitychange',()=>this.keys.clear());
        this.lastTime = performance.now();
        this.frame = this.frame.bind(this);
        requestAnimationFrame(this.frame);
    }

    active() { return document.getElementById('game-screen').classList.contains('active') && !this.game.ended; }
    blocked() { return !!document.querySelector('#collection-modal.active, #guide-modal.active, #minigame-modal.active') || !document.getElementById('field-journal').hidden; }

    enter(scene, onDone) {
        if (this.chapter !== this.game.currentChapterId || this.game.visitedScenes.size === 1) {
            this.clues.clear(); this.inspected.clear(); this.exposure=0; this.trust=0;
            this.chapter=this.game.currentChapterId;
        }
        this.scene=scene; this.onDone=onDone; this.lines=null; this.lineIndex=0;
        this.closeDialogue(); this.toggleJournal(false); this.game.hideTimer();
        document.getElementById('choices-container').replaceChildren();
        this.player={x:110,y:222}; this.target=null; this.keys.clear();
        this.objects=this.makeObjects(scene);
        document.getElementById('world-location').textContent=scene.location.replace(/^[^\p{L}\p{N}]+/u,'');
        document.getElementById('world-objective').textContent=scene.bg==='bg-phone'?'휴대폰과 주변 기록을 확인하고, 메시지에 답해보자.':'주변을 살피거나, 오른쪽 사람에게 다가가 말을 걸어보자.';
        this.renderHotspots(); this.updateState();
        this.notice(this.game.visitedScenes.size===1?'낯선 밤이 시작됐다. 반짝이는 물건을 조사해보자.':'장소가 바뀌었다. 먼저 주변을 살펴볼까?');
    }

    makeObjects(scene) {
        const chapter=this.game.currentChapterId;
        const prelude=/_evening|_first_meeting/.test(this.game.currentScenarioKey);
        let clues={
            1:[['설문지','작은 글씨','설문지에는 연락처 수집 항목이 있지만, 주최와 보관 기간은 비어 있다.'],['안내판','모집 공고','공식 행사 안내에는 이 설문이 보이지 않는다. 허가 여부는 별도로 확인해야 한다.']],
            2:[['가격표','무료의 조건','상담은 무료라고 적혀 있지만, 제사 비용과 환불 기준은 어디에도 없다.'],['출입문','돌아갈 길','출입문과 도로 위치를 기억했다. 위협이 느껴지면 혼자 버티지 않고 도움을 요청할 수 있다.']],
            3:[['모임 사진','반복되는 얼굴','처음 만났다는 사람들이 예전 모임 사진에도 함께 있다. 우연인지 설명을 들어볼 필요가 있다.'],['모임 공지','달라진 목적','와인 모임 설명에는 멘토링이나 종교 공부 이야기가 없었다.']],
            4:[['크루 공지','필요 이상의 정보','참가 설문이 직장과 퇴근 시간까지 묻는다. 달리기에 왜 필요한지 설명이 없다.'],['지난 사진','이어지는 모임','러닝·독서·상담 모임 사진에 같은 운영자들이 등장한다. 연결 관계를 기록해두자.']]
        }[chapter];
        if(prelude) clues={
            1:[['역 안내도','집으로 가는 길','집으로 가는 막차까지 아직 시간이 있다. 서두를 필요는 없지만, 내 일정은 기억해두자.'],['편의점','잠깐의 휴식','편의점 불빛이 밝다. 늦은 시간에도 사람이 오가는 장소다.']],
            2:[['병원 문자','검진 일정','아버지의 검진은 정기 검사였다. 엄마에게 확인한 사실을 따로 기록해둔다.'],['역 안내도','주변의 위치','지하상가 출구와 큰길 위치를 확인했다.']],
            3:[['모임 소개','처음의 약속','가입 안내에는 가벼운 와인 시음과 취향 이야기를 나누는 모임이라고 적혀 있다.'],['메뉴판','오늘의 메뉴','한 잔만 마실 생각이다. 오늘 쓸 예산을 정해둔다.']],
            4:[['러닝 지도','나의 페이스','초보자는 걷기와 달리기를 번갈아도 괜찮다. 남의 속도에 맞출 필요는 없다.'],['모임 소개','처음의 목적','내가 찾던 것은 꾸준히 함께 달릴 사람들이다. 그 마음을 메모해두었다.']]
        }[chapter];
        const phase=prelude?'first':'case';
        return [
            {id:`c${chapter}-${phase}-clue-0`,label:clues[0][0],x:90,y:185,type:'clue',evidence:!prelude,title:clues[0][1],text:clues[0][2]},
            {id:`c${chapter}-${phase}-clue-1`,label:clues[1][0],x:225,y:195,type:'clue',evidence:!prelude,title:clues[1][1],text:clues[1][2]},
            {id:'phone',label:'내 휴대폰',x:165,y:231,type:'phone'},
            {id:'person',label:scene.bg==='bg-phone'?'메시지 확인':scene.sender,x:365,y:211,type:'person'}
        ];
    }

    renderHotspots() {
        const root=document.getElementById('world-hotspots'); root.replaceChildren();
        this.objects.forEach(o=>{
            const b=document.createElement('button'); b.className=`world-hotspot ${o.type}`;
            b.style.left=`${o.x/480*100}%`; b.style.top=`${(o.y-32)/270*100}%`;
            b.innerHTML=`<span class="hotspot-mark">${o.type==='person'?'!':o.type==='phone'?'▣':this.inspected.has(o.id)?'✓':'✦'}</span><span class="hotspot-label"></span>`;
            b.querySelector('.hotspot-label').textContent=o.label;
            b.onclick=()=>{if(this.mode!=='explore'||this.blocked())return;this.target={x:o.x,y:o.y,object:o};};
            b.dataset.objectId=o.id; root.append(b);
        });
    }

    interactNearest() {
        if(!this.active()||this.mode!=='explore'||this.blocked())return;
        const nearest=[...this.objects].sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y))[0];
        if(Math.hypot(nearest.x-this.player.x,nearest.y-this.player.y)>62){this.notice('조사할 물건이나 사람 쪽으로 조금 더 가까이 가보자.');return;}
        this.interact(nearest);
    }

    interact(o) {
        this.target=null; this.keys.clear();
        if(o.type==='person') {
            const extra=[];
            if(this.exposure>=2) extra.push('(상대는 내가 전에 알려준 사적인 이야기를 꺼내며 말을 시작한다.)');
            if(this.trust>=3) extra.push('(이미 몇 번 호의를 받았다. 이상하다고 느끼면서도 단호하게 말하기가 어려워졌다.)');
            this.openDialogue(this.scene.sender,[...extra,...this.scene.messages],()=>{
                this.onDone();
                if(!this.scene.minigame) this.addEvidenceQuestion();
                else this.closeDialogue();
            });
        } else if(o.type==='clue') {
            if(!this.inspected.has(o.id)) {
                this.inspected.add(o.id); this.clues.set(o.id,{title:o.title,text:o.text,evidence:o.evidence});
                this.game.doubt=Math.min(100,this.game.doubt+8);this.game.updateHUD();
                this.game.history.push({location:this.scene.location,text:`[조사] ${o.title}`});
                audio.playDoubtUp(); this.updateState(); this.renderHotspots();
            }
            this.openDialogue(`조사 · ${o.label}`,[o.text,'(기록을 수첩에 남겼다. 단서는 대화에서 질문할 근거가 된다.)'],()=>this.closeDialogue());
        } else {
            this.openDialogue('내 휴대폰',[
                this.exposure?'(낯선 사람이 내 일상과 연락처를 얼마나 알고 있는지 다시 생각해본다.)':'(아직 내 사적인 정보는 알려주지 않았다.)',
                '수빈: “늦으면 연락해. 누구 만나든 네가 원할 때 나올 수 있어야 해.”',
                '(위치를 공유했다. 다음 장면에서도 이 기록은 남는다.)'
            ],()=>{if(!this.clues.has('friend')){this.clues.set('friend',{title:'밖과의 연결',text:'친구에게 현재 상황과 위치를 공유했다.'});this.game.mental=Math.min(100,this.game.mental+8);this.game.updateHUD();this.updateState();}this.closeDialogue();});
        }
    }

    openDialogue(speaker,lines,done) {
        this.mode='dialogue';this.lines=lines;this.lineIndex=0;this.dialogueDone=done;
        this.game.clearTimer(); this.game.hideTimer();
        document.getElementById('choices-container').replaceChildren();
        document.getElementById('world-dialogue').hidden=false;
        document.getElementById('dialogue-speaker').textContent=speaker;
        document.getElementById('dialogue-next').hidden=false;
        this.showLine();
    }

    showLine() { document.getElementById('dialogue-line').textContent=this.lines[this.lineIndex]; audio.playMessagePop(); }
    advance() {
        if(this.mode!=='dialogue'||!this.lines)return;
        if(this.lineIndex<this.lines.length-1){this.lineIndex++;this.showLine();return;}
        this.lines=null;document.getElementById('dialogue-next').hidden=true;
        const done=this.dialogueDone;this.dialogueDone=null;if(done)done();
    }
    closeDialogue() {
        this.game.clearTimer();this.game.hideTimer();this.game.choicesReady=false;
        document.getElementById('world-dialogue').hidden=true;
        this.mode='explore';this.lines=null;this.keys.clear();
    }

    addEvidenceQuestion() {
        if([...this.clues.values()].filter(c=>c.evidence).length<2)return;
        const routes={1:'c1_search',2:'c2_price',3:'c3_roster',4:'c4_credentials'};
        const key=routes[this.chapter];
        if(this.game.currentScenarioKey===key)return;
        const b=document.createElement('button');b.className='choice-btn evidence-choice';
        b.textContent='▤ 수첩에 모은 단서를 보여주며 구체적으로 묻는다';
        b.onclick=()=>{if(!this.game.choicesReady)return;this.game.clearTimer();this.game.selectChoice({text:b.textContent,next:key,doubt:10});};
        document.getElementById('choices-container').append(b);
    }

    onChoice(choice) {
        this.exposure += choice.exposure || 0;
        if(choice.mentalDmg)this.trust++;
        if(choice.doubt)this.trust=Math.max(0,this.trust-1);
        this.closeDialogue();this.mode='transition';this.updateState();this.notice('선택이 남았다. 잠시 뒤 상황이 이어진다.');
    }

    useItem(key) {
        const item=this.game.items[key];
        if(!item||!item.count||!this.game.choicesReady||!this.game.availableItems().includes(key)){this.game.showToast('지금은 사용할 수 없어. 대화 중 소지품을 확인해봐.');return;}
        item.count--;this.game.clearTimer();this.game.hideTimer();
        this.game.mental=Math.min(100,this.game.mental+10);this.game.updateHUD();this.game.renderInventory();
        this.updateState();
        this.game.history.push({location:this.scene.location,text:`[소지품] ${item.name}으로 생각할 시간을 확보했다.`});
        const messages={airpods:'이어폰을 끼고 한발 물러섰다. 대답하기 전 생각할 여유가 생겼다.',sinbul:'금전적인 여유가 없다고 말했다. 상대가 돈 이야기를 어떻게 바꾸는지 지켜보자.',safety_app:'신고 화면과 현재 위치를 준비했다. 실제 위험에는 지체하지 말고 도움을 요청하자.',fake_call:'친구의 전화인 척 잠깐 대화를 끊었다. 주변을 살필 시간이 생겼다.'};
        this.notice(messages[key]);
        // 아이템은 시간을 벌어준다. 그 자체로 엔딩을 확정하지 않는다.
    }

    toggleJournal(force) {
        const panel=document.getElementById('field-journal');
        panel.hidden=typeof force==='boolean'?!force:!panel.hidden;
        if(!panel.hidden){this.game.clearTimer();this.game.hideTimer();}
        const list=document.getElementById('clue-list');list.replaceChildren();
        if(!this.clues.size){const li=document.createElement('li');li.textContent='아직 기록이 없다. 반짝이는 물건을 조사해보자.';list.append(li);}
        this.clues.forEach(c=>{const li=document.createElement('li'),strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=c.title;p.textContent=c.text;li.append(strong,p);list.append(li);});
    }
    updateState() {
        document.getElementById('clue-count').textContent=this.clues.size;
        document.getElementById('world-state').textContent=`평정 ${Math.max(0,this.game.mental)}  ·  단서 ${this.clues.size}  ·  노출 ${this.exposure}`;
    }
    notice(text) { document.getElementById('world-notice').textContent=text;this.noticeUntil=performance.now()+5000; }

    frame(now) {
        const dt=Math.min((now-this.lastTime)/1000,.04);this.lastTime=now;
        if(this.active()){
            if(this.mode==='explore'&&!this.blocked()){
                let dx=(this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0);
                let dy=(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0);
                if(dx||dy)this.target=null;
                if(this.target){const x=this.target.x-this.player.x,y=this.target.y-this.player.y,dist=Math.hypot(x,y);if(dist<4){const o=this.target.object;this.target=null;if(o)this.interact(o);}else{dx=x/dist;dy=y/dist;}}
                this.walking=!!(dx||dy);this.player.x=Math.max(18,Math.min(462,this.player.x+dx*100*dt));this.player.y=Math.max(178,Math.min(245,this.player.y+dy*70*dt));
            }else this.walking=false;
            this.draw(now);
            if(now>this.noticeUntil)document.getElementById('world-notice').textContent='';
        }
        requestAnimationFrame(this.frame);
    }

    draw(now) {
        const stage=document.getElementById('adventure-stage');
        const width=Math.min(480,Math.round(stage.clientWidth/stage.clientHeight*270));
        if(this.canvas.width!==width)this.canvas.width=width;
        this.cameraX=Math.max(0,Math.min(480-width,this.player.x-width/2));
        const c=this.ctx;c.setTransform(1,0,0,1,-this.cameraX,0);c.imageSmoothingEnabled=false;
        c.fillStyle='#101b29';c.fillRect(0,0,480,270);
        for(const b of document.querySelectorAll('.world-hotspot')){
            const o=this.objects.find(o=>o.id===b.dataset.objectId);const x=(o.x-this.cameraX)/width*100;
            b.style.left=`${x}%`;b.hidden=x<3||x>97;
        }
        if(this.background.complete&&this.background.naturalWidth){
            const image=this.background;
            let index=this.chapter-1;
            if(this.scene.bg==='bg-cafe'||this.scene.bg==='bg-altar'||this.scene.bg==='bg-center')index=1;
            if(this.scene.bg==='bg-bar')index=2;
            if(this.fallback){const w=image.width/4,h=w/480*270;c.drawImage(image,index*w,(image.height-h)*.6,w,h,0,0,480,270);}
            else{const w=image.width/2,h=image.height/2;c.drawImage(image,index%2*w,Math.floor(index/2)*h,w,h,0,0,480,270);}
        }
        c.fillStyle='rgba(4,9,21,.2)';c.fillRect(0,0,480,270);
        // 주변 물건과 캐릭터도 같은 저해상도로 그린다.
        for(const o of this.objects||[]){
            if(o.type==='person')this.sprite(o.x,o.y,'#dfad78','#d8bf9d','#242937',false,now);
            else{c.fillStyle='#080f1b';c.fillRect(o.x-7,o.y-3,15,5);c.fillStyle=o.type==='phone'?'#91efdb':'#c8ad75';c.fillRect(o.x-5,o.y-13,10,11);c.fillStyle='#314452';c.fillRect(o.x-3,o.y-11,6,5);}
        }
        this.sprite(this.player.x,this.player.y,'#dfb697','#83ced1','#1a2639',this.walking,now);
        c.fillStyle='rgba(111,216,217,.16)';
        for(let i=0;i<14;i++){const x=(i*37+now*.018)%480,y=(i*59+now*.04)%270;c.fillRect(x|0,y|0,1,3);}
        c.fillStyle='rgba(4,8,17,.12)';for(let y=0;y<270;y+=3)c.fillRect(0,y,480,1);
    }
    sprite(x,y,skin,shirt,pants,walking,now){
        const c=this.ctx;x=Math.round(x);y=Math.round(y);const step=walking?(Math.floor(now/130)%2?2:-2):0;
        c.fillStyle='rgba(0,0,0,.4)';c.fillRect(x-9,y+1,18,3);
        c.fillStyle='#171c26';c.fillRect(x-5,y-31,10,5);c.fillRect(x-6,y-27,12,5);
        c.fillStyle=skin;c.fillRect(x-4,y-26,8,8);c.fillStyle='#171c26';c.fillRect(x-5,y-29,10,4);
        c.fillStyle=shirt;c.fillRect(x-6,y-17,12,12);c.fillRect(x-8,y-15,3,9);c.fillRect(x+5,y-15,3,9);
        c.fillStyle=skin;c.fillRect(x-8,y-7,3,3);c.fillRect(x+5,y-7,3,3);
        c.fillStyle=pants;c.fillRect(x-5,y-5,4,7+step);c.fillRect(x+1,y-5,4,7-step);
        c.fillStyle='#ddd7bf';c.fillRect(x-6,y+1+step,5,2);c.fillRect(x+1,y+1-step,5,2);
    }
}
const adventure = new PixelAdventure(game);
