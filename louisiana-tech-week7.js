
(() => {

(() => {
 // Translate the defensive staff's ALL_BREAKDOWN_GAMES tags onto matching LA Tech PFF play signatures.
 const tagText=(r,k)=>{const x=r&&r[k];return x===undefined||x===null?'':String(x).trim()};
 const tagNorm=x=>String(x||'').trim().toUpperCase().replace(/\s+/g,' ');
 function defensiveRefParts(r){
   const name=tagText(r,'Name');
   const m=name.match(/LATC\s+O\s+(?:@|vs)\s+([A-Z0-9]+),\s*Play\s+(\d+)/i);
   return m?{opponent:m[1].toUpperCase(),play:Number(m[2])}:null;
 }
 function refCandidates(play, refs){
   const opponent=tagText(play,'pff_DEFTEAM').toUpperCase();
   const same=refs.filter(x=>x._opponent===opponent);
   const levels=[
     ['pff_OFFFORMATIONGROUP','pff_OFFPERSONNELBASIC','pff_RUNPASS','pff_RUNCONCEPTPRIMARY'],
     ['pff_OFFFORMATIONGROUP','pff_OFFPERSONNELBASIC','pff_RUNPASS'],
     ['pff_OFFFORMATIONGROUP','pff_OFFPERSONNELBASIC'],
     ['pff_OFFFORMATIONGROUP']
   ];
   for(const keys of levels){
     const usable=keys.filter(k=>tagText(play,k));
     if(!usable.length)continue;
     const found=same.filter(ref=>usable.every(k=>tagNorm(ref[k])===tagNorm(play[k])));
     if(found.length)return found;
   }
   return [];
 }
 function staffTag(play,refs,key){
   const candidates=refCandidates(play,refs);
   const values=candidates.map(r=>tagText(r,key)).filter(Boolean);
   if(!values.length)return '';
   const counts=new Map();values.forEach(x=>counts.set(x,(counts.get(x)||0)+1));
   return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];
 }
 const oldHybridMap=mapDefensiveIntelHybrid;
 mapDefensiveIntelHybrid=function(){
   if(team!=='LT')return oldHybridMap();
   dIntelHybridMap=new WeakMap();dIntelHybridReady=false;dIntelHybridRate=0;
   const plays=rawPlays||[];
   const refs=(data.languageReference||[]).map(r=>{const id=defensiveRefParts(r);return id?{...r,_opponent:id.opponent,_staffPlay:id.play}:null}).filter(Boolean);
   let translated=0;
   for(const play of plays){
     const translatedRow={...play};
     for(const field of ['Formation','Personnel','Backfield','Form Var','Motion','FIB','Y Location','Run Concept','Play Type','Pass Concept','Proctection','Front','Front Type','Stunt','Pressure Type']){
       const value=staffTag(play,refs,field);
       if(value)translatedRow[field]=value;
     }
     if(translatedRow.Formation||translatedRow['Run Concept']||translatedRow.Backfield)translated++;
     dIntelHybridMap.set(play,translatedRow);
   }
   dIntelHybridReady=plays.length>0;dIntelHybridRate=plays.length?translated/plays.length:0;
   return dIntelHybridReady;
 };
 const oldLTFormation=ulmFormationOnly;
 ulmFormationOnly=function(r){
   if(team!=='LT')return oldLTFormation(r);
   const staff=dIntelField(r,'Formation','');
   return canonicalULMFormationNormalized(staff)||String(staff||'').trim();
 };
 const oldLTStuntRows=currentStuntRows;
 currentStuntRows=function(){
   if(team!=='LT')return oldLTStuntRows();
   return passFilteredRows().map(r=>Object.assign({},r,{
     Stunt:dIntelField(r,'Stunt',v(r,'pff_STUNT','Stunt')),
     'Pass Result':v(r,'pff_PASSRESULT','Pass Result'),Gain:gain(r),
     Down:v(r,'pff_DOWN','Down'),Distance:v(r,'pff_DISTANCE','Distance'),Personnel:pers(r),
     Formation:ulmFormationOnly(r)||'Unknown',
     'Play Type':dIntelField(r,'Play Type',v(r,'pff_PLAYTYPE','pff_DROPBACKTYPE')),
     Proctection:dIntelField(r,'Proctection',v(r,'Proctection')),
     _ttt:rowTTT(r),_feed:r
   }));
 };
 const oldRenderLanguage=renderULMLanguage;
 renderULMLanguage=function(){
   oldRenderLanguage();
   if(team==='LT'){const badge=$('ulmMatchBadge');if(badge)badge.textContent='LOUISIANA TECH · DEFENSIVE STAFF LANGUAGE';}
 };
})();
 const oldSeason=setSeasonView;setSeasonView=function(y){if(team!=='LT')return oldSeason(y);seasonView='2026';syncSeasonUI();apply()};
 const oldSet=setOpponent,oldLoad=load,oldApply=apply,oldDepth=renderDepthChart,oldOL=renderOL;
 CFG.LT={name:'Louisiana Tech',week:'Week 7 Opponent'};
 const btn=document.createElement('button');btn.id='ltBtn';btn.textContent='Louisiana Tech · Week 7';document.querySelector('.controls').insertBefore(btn,$('reloadBtn'));
 function pendingPanels(){$('kpis').innerHTML=LaTech.pending('Summary');document.querySelectorAll('.tabview:not(#depth):not(#ol)').forEach(section=>{section.querySelectorAll('.lt-pending').forEach(x=>x.remove());const el=document.createElement('div');el.className='lt-pending';el.innerHTML=LaTech.pending('Analytics');section.prepend(el);section.querySelectorAll('.card,.runHitCard,.passRushLaneCard,.stuntCard,.persHero,.surfaceGrid').forEach(x=>{if(!x.closest('.lt-pending')){if(x.style.display)x.dataset.ltDisplay=x.style.display;x.style.display='none';x.dataset.ltHidden='1'}})});}
 function restorePanels(){document.querySelectorAll('.lt-pending').forEach(x=>x.remove());document.querySelectorAll('[data-lt-hidden]').forEach(x=>{x.style.display=x.dataset.ltDisplay||'';delete x.dataset.ltHidden})}
 apply=function(){if(team==='LT'){data=LaTech.state.data;rawPlays=(data.plays||[]).slice();}if(team==='LT'&&!data.plays?.length){pendingPanels();return}restorePanels();return oldApply()};
 renderDepthChart=function(){if(team!=='LT')return oldDepth();$('depthTitle').textContent='Louisiana Tech Offensive Depth Chart';$('depthSource').innerHTML=`Week 7 · Ourlads · ${LaTech.depth.updated} · <a href="${LaTech.depth.sourceUrl}" target="_blank" rel="noopener">Source ↗</a>`;$('depthTable').innerHTML=LaTech.table('offense').match(/<table[^>]*>([\s\S]*)<\/table>/)[1]};
 renderOL=function(){if(team!=='LT')return oldOL();$('olGrid').innerHTML=LaTech.roster(['offense']).filter(p=>['LT','LG','C','RG','RT'].includes(p.position)).map(p=>`<div class="card"><b>#${p.number} ${LaTech.esc(p.name)}</b><p>${p.position} · ${p.class}</p><p>Biography and blocking grades awaiting upload.</p></div>`).join('');$('olBoard').innerHTML=LaTech.pending('OL Blocking');};
 load=async function(){if(team!=='LT')return oldLoad();restorePanels();['fDown','fPers','fForm','fHash'].forEach(id=>setSel(id,[]));data={};roster=[];rawPlays=[];liveDepthChart=LaTech.depth;dIntelHybridMap=new WeakMap();dIntelHybridReady=false;dIntelHybridRate=0;seasonView='2026';syncSeasonUI();$('opp').textContent='Louisiana Tech';$('wk').textContent='Week 7 · October 17, 2026';$('status').textContent='Louisiana Tech · Checking uploads…';renderDepthChart();renderOL();apply();const result=await LaTech.load(csv);if(!result||team!=='LT')return;data=result.data;roster=result.roster||LaTech.roster(['offense']);rawPlays=(data.plays||[]).slice();$('status').textContent='Louisiana Tech · '+(rawPlays.length?'2026 play feed loaded':'Awaiting upload');setSel('fDown',rawPlays.map(r=>v(r,'pff_DOWN','Down')));setSel('fPers',rawPlays.map(pers));setSel('fForm',[]);setSel('fHash',rawPlays.map(r=>v(r,'pff_HASHDEF','pff_HASH','Hash')));renderDepthChart();renderOL();apply()};
 setOpponent=function(t){restorePanels();btn.classList.toggle('active',t==='LT');if(t!=='LT')return oldSet(t);team='LT';['uabBtn','msstBtn','selBtn','fauBtn','saBtn'].forEach(id=>$(id)?.classList.remove('active'));seasonView='2026';load()};
 btn.onclick=()=>setOpponent('LT');$('reloadBtn').onclick=()=>load();if(LaTech.initial())setOpponent('LT');
})();
