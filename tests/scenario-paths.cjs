const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({localStorage:{getItem:()=>null}});
for (const file of ['endings','scenarios','expanded-scenarios','story-prologues']) {
    vm.runInContext(fs.readFileSync(`js/${file}.js`,'utf8'), context);
}
const {scenes,endings,chapters} = vm.runInContext('({scenes:SCENARIOS,endings:ENDINGS,chapters:CHAPTER_INFO})',context);
const reached = new Set(), unlocked = new Set();
const paths = {};
for (const chapter of chapters) {
    const queue = [[chapter.startKey,100,0,500000,[]]], seen = new Set();
    while (queue.length) {
        const [key,mental,doubt,money,path] = queue.pop();
        const signature = [key,mental,doubt,money].join(':');
        if (seen.has(signature)) continue;
        seen.add(signature);
        if (endings[key]) { unlocked.add(key); paths[key] ||= path; continue; }
        const scene = scenes[key];
        assert.ok(scene,`Missing destination ${key}`);
        assert.equal(scene.chapter,chapter.id,`Wrong chapter ${key}`);
        assert.ok(scene.messages.length,`No messages ${key}`);
        reached.add(key);
        if (scene.minigame) {
            queue.push([scene.nextAfterMinigame,mental,doubt,money,[...path,key]]);
            if (scene.minigame === 'tap_cancel') queue.push([scene.failEnding,mental-30,doubt,Math.max(0,money-500000),[...path,key]]);
            continue;
        }
        assert.ok(scene.choices.length >= 1,`No choices ${key}`);
        for (const action of [...scene.choices,scene.timeout].filter(Boolean)) {
            const m=mental-(action.mentalDmg||0), d=Math.min(100,doubt+(action.doubt||0)), b=Math.max(0,money-(action.moneyDmg||0));
            const next=m<=0?({2:'ending_ancestor_debt',3:'ending_cult_leaf',4:'ending_crew_center'}[chapter.id]||'ending_center_114'):b<=0?'ending_broke':action.next;
            queue.push([next,m,d,b,[...path,key]]);
        }
    }
}
assert.deepEqual(Object.keys(scenes).filter(k=>!reached.has(k)),[], 'Unreachable scenes');
assert.deepEqual(Object.keys(endings).filter(k=>!unlocked.has(k)),[], 'Unreachable endings');
assert.match(scenes.c2_minigame_tap.messages[2],/15/);
assert.equal(scenes.c1_center_inside.choices[0].fakeButton,false);
console.log(`${reached.size} scenes and ${unlocked.size} endings reachable. All destinations valid.`);
console.log('Hidden ending:', paths.ending_fake_glitch.join(' → '));
