const $=s=>document.querySelector(s);
const KEY='fl-progress';
let S={l:[],c:[],s:0,f:[],r:[],q:0,rw:[]};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
function say(t){if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.8;speechSynthesis.speak(u)}
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1800)}
const add=(a,v)=>{if(!a.includes(v))a.push(v)};

/* menu */
const mb=$('.menu-btn');mb.onclick=()=>{const o=$('#menu').classList.toggle('open');mb.setAttribute('aria-expanded',o)};
$('#menu').onclick=()=>{$('#menu').classList.remove('open')};

/* what we learn */
const learn=[['🔤','الحروف','نتعلم شكل الحروف الإنجليزية ونطقها.','#3b82d6'],['🔊','أصوات الحروف','نتعلم الصوت الذي يصدره كل حرف.','#ff6a5c'],['🧩','CVC Words','نتعلم دمج الحروف معًا لتكوين كلمات بسيطة.','#35b987'],['📖','القراءة','نتدرب على قراءة الكلمات والجمل القصيرة.','#ffc43d'],['📚','القصص','نقرأ قصصًا قصيرة باستخدام الكلمات التي تعلمناها.','#3b82d6'],['🃏','Flash Cards','نراجع الكلمات بطريقة سهلة وممتعة.','#ff6a5c']];
$('#learnGrid').innerHTML=learn.map(c=>`<article class="card" style="--c:${c[3]}"><div class="ic">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></article>`).join('');

/* letters */
const L={A:['Apple','🍎'],B:['Ball','⚽'],C:['Cat','🐱'],D:['Dog','🐶'],M:['Man','👨'],S:['Sun','☀️']};
$('#letterRow').innerHTML=Object.keys(L).map(k=>`<button data-k="${k}" class="${S.l.includes(k)?'done':''}" aria-label="Letter ${k}">${k} ${k.toLowerCase()}</button>`).join('');
$('#letterRow').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k,[w,em]=L[k];
 $('#letterShow').innerHTML=`<div><b>${k} ${k.toLowerCase()}</b><div style="font-size:3.5rem">${em}</div><div class="en"><strong>${k}</strong> is for <strong>${w}</strong></div></div>`;
 say(`${k}. ${w}`);b.classList.add('done');add(S.l,k);if(S.l.length==6)toast('أحسنت! عرفت كل الحروف 🎉');update()};

/* CVC */
const CVC=[['C','A','T','🐱'],['D','O','G','🐶'],['S','U','N','☀️'],['B','A','T','🦇'],['P','E','N','🖊️'],['H','E','N','🐔'],['B','E','D','🛏️'],['B','I','G','🐘'],['P','I','G','🐷'],['F','O','X','🦊'],['C','U','P','☕'],['B','U','S','🚌']];
let cur=0,pos=0;
$('#cvcChips').innerHTML=CVC.map((w,i)=>`<button data-i="${i}">${w.slice(0,3).join('')}</button>`).join('');
$('#cvcChips').onclick=e=>{const b=e.target.closest('button');if(b)build(+b.dataset.i)};
function build(i){cur=i;pos=0;const w=CVC[i];
 document.querySelectorAll('#cvcChips button').forEach((b,j)=>b.classList.toggle('on',j==i));
 $('#slots').innerHTML='<span></span><span></span><span></span>';
 const sh=w.slice(0,3).map((l,k)=>[l,k]).sort(()=>Math.random()-.5);
 $('#tray').innerHTML=sh.map(([l,k])=>`<button data-k="${k}">${l}</button>`).join('');
 $('#cvcResult').textContent='اضغط الحروف بالترتيب';}
$('#tray').onclick=e=>{const b=e.target.closest('button');if(!b)return;const w=CVC[cur];
 if(+b.dataset.k!==pos){b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),300);$('#cvcResult').textContent='محاولة رائعة! جرّب حرفًا آخر';return}
 const s=$('#slots').children[pos];s.textContent=w[pos];s.classList.add('fill');b.disabled=true;say(w[pos]);pos++;
 if(pos==3){const word=w.slice(0,3).join('');$('#cvcResult').innerHTML=`<b>${word}</b> ${w[3]}<br>Great Job! 🎉`;setTimeout(()=>say(word.toLowerCase()),500);add(S.c,word);update()}};
build(0);

/* reading */
const RW=['CAT','DOG','SUN','PEN','BED'],RS=['The cat is big.','The dog can run.','The sun is hot.'];
$('#readWords').innerHTML=RW.map(w=>`<button data-w="${w}" data-t="w">${w}</button>`).join('');
$('#readSent').innerHTML=RS.map(w=>`<button data-w="${w}" data-t="s">${w}</button>`).join('');
$('.read-grid').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;say(b.dataset.w.toLowerCase());
 if(b.classList.contains('ok'))return;b.classList.add('ok');add(S.r,b.dataset.w);toast('أنا أستطيع! ✔');update()});
let qa;function quiz(){const w=CVC[Math.floor(Math.random()*CVC.length)];qa=w.slice(0,3).join('');
 const o=[qa];while(o.length<3){const x=CVC[Math.floor(Math.random()*CVC.length)].slice(0,3).join('');if(!o.includes(x))o.push(x)}
 $('#qEmoji').textContent=w[3];$('#qOpts').innerHTML=o.sort(()=>Math.random()-.5).map(x=>`<button>${x}</button>`).join('')}
$('#qOpts').onclick=e=>{const b=e.target.closest('button');if(!b)return;
 if(b.textContent==qa){S.q++;$('#qMsg').textContent='Amazing! Keep going! 🌟';update();setTimeout(()=>{$('#qMsg').textContent='';quiz()},900)}
 else{b.classList.add('shake');$('#qMsg').textContent='محاولة رائعة! حاول مرة أخرى'}};
quiz();

/* story */
const ST=[['The cat is on the bed.','🐱🛏️'],['The cat has a hat.','🐱🎩'],['The cat can sit.','🐈'],['The cat is happy.','😸']];
let si=0;
function story(){const [t,e]=ST[si];
 $('#story').innerHTML=`<div class="scene" role="img" aria-label="${t}">${e}</div><div><h3>The Cat</h3>${ST.map((s,i)=>`<button class="line ${i==si?'on':''}" data-i="${i}">${s[0]}</button>`).join('')}<button class="btn" id="nxt">${si<3?'التالي':'أنهيت القصة!'}</button></div>`;
 say(t)}
$('#story').onclick=e=>{const l=e.target.closest('.line');if(l){si=+l.dataset.i;story();return}
 if(e.target.id=='nxt'){if(si<3){si++;story()}else{S.s=1;update();toast('Great Job! 🎉');si=0;story()}}};
story();

/* videos */
const V=[['Letters','Learn the English letters one by one.','#3b82d6'],['Letter Sounds','Learn the sounds of English letters.','#ff6a5c'],['Learn CVC Words','Learn how to blend letters and read simple CVC words.','#35b987'],['Phonics','Practice phonics with fun examples.','#ffc43d'],['Reading','Read short words and sentences.','#3b82d6'],['Simple English Words','Meet simple words for everyday things.','#ff6a5c']];
$('#videoGrid').innerHTML=V.map(v=>`<article class="card" style="--c:${v[2]}"><div class="vid" data-src="" role="button" tabindex="0" aria-label="Play ${v[0]}">▶</div><h3 class="en">${v[0]}</h3><p class="en">${v[1]}</p></article>`).join('');
$('#videoGrid').onclick=e=>{const v=e.target.closest('.vid');if(v)toast(v.dataset.src?'جارٍ التشغيل':'الفيديو سيُضاف قريبًا 🎬')};

/* flash */
const F=[['🐱','CAT'],['🍔','HAM'],['☀️','SUN'],['🚌','BUS'],['🐶','DOG'],['🐷','PIG'],['🦊','FOX'],['🛏️','BED']];
$('#flashGrid').innerHTML=F.map((f,i)=>`<button class="fc" data-i="${i}" aria-label="Flash card ${f[1]}"><i><span>${f[0]}</span><span>${f[1]}</span></i></button>`).join('');
$('#flashGrid').onclick=e=>{const c=e.target.closest('.fc');if(!c)return;c.classList.toggle('flip');
 if(c.classList.contains('flip')){const w=F[c.dataset.i][1];say(w.toLowerCase());add(S.f,w);update()}};

/* rewards */
const R=[['⭐','Reading Star','Amazing Reading!',()=>S.l.length>=6],['🏆','Little Reader','Well done!',()=>S.c.length>=3],['🌟','English Hero','Great flipping!',()=>S.f.length>=6],['🎖️','Super Reader','Wonderful story!',()=>S.s>=1],['🚀','Future Leader','You did it!',()=>S.q>=3&&S.r.length>=4]];
function card(r,x=''){return `<article class="reward ${x}"><div class="ic">${r[0]}</div><b>${r[1]}</b><p>${r[2]}</p><small>Keep learning and keep shining!</small></article>`}
function update(){
 R.forEach(r=>{if(r[3]()&&!S.rw.includes(r[1])){S.rw.push(r[1]);const m=$('#modal');m.innerHTML=card(r)+'';m.hidden=false;say('Great job!')}});
 save();render()}
$('#modal').onclick=()=>{$('#modal').hidden=true};
function render(){
 $('#rewardCount').textContent=`لقد حصلت على ${S.rw.length} بطاقات!`;
 $('#rewardGrid').innerHTML=R.map(r=>card(r,S.rw.includes(r[1])?'':'locked')).join('');
 const p=(n,t)=>Math.min(100,Math.round(n/t*100));
 const B=[['Letters',p(S.l.length,6)],['Sounds',p(S.l.length,6)],['CVC Words',p(S.c.length,12)],['Stories',S.s?100:0],['Reading',p(S.r.length+S.q,8)]];
 $('#bars').innerHTML=B.map(b=>`<div class="bar"><b><span class="en">${b[0]}</span><span>${b[1]==100?'✓':b[1]+'%'}</span></b><div><i style="width:${b[1]}%"></i></div></div>`).join('')}
$('#resetBtn').onclick=()=>{if(confirm('نبدأ من جديد؟')){S={l:[],c:[],s:0,f:[],r:[],q:0,rw:[]};save();location.reload()}};
render();
