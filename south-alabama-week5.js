/* Tony D-Line Week 5 South Alabama add-on.
   Extends the stable FAU v2.1 app without changing any existing chart or layout. */
(() => {
  const SA_BASE='https://hzrosmevuejjlxigdxmg.supabase.co/storage/v1/object/public/Defensive%20Intelligence/Opponents/South%20Alabama/';
  const SA_FILES={
    plays:'play_feed.csv', qb:'pff-qb.csv', routes:'pff-routes.csv', dropbacks:'pff-dropbacks.csv',
    passOverall:'pff-pass-overall.csv', pressure:'pff-pressure.csv', receiving:'pff-receiving.csv',
    rushing:'pff-rushing.csv', runConcepts:'pff-run-concepts.csv', runDirections:'pff-run-directions.csv',
    runBlocking:'pff-run-blocking.csv', passBlocking:'pff-pass-blocking.csv', formations:'pff-formations.csv',
    personnel:'pff-personnel.csv', personnelByWeek:'pff-personnel-by-week.csv',
    personnel10:'pff-personnel-10-player.csv', personnel11:'pff-personnel-11-player.csv',
    personnel12:'pff-personnel-12-player.csv', personnel20:'pff-personnel-20-player.csv',
    personnel21:'pff-personnel-21-player.csv', personnelPlayers:'pff-personnel-player-summary.csv'
  };
  const SA_ROSTER='roster.json', SA_DEPTH='depth-chart.json';
  const SA_DEFENSIVE_FORMATION_MAP={"PRO - CLOSED":"I-FLUTE","PRO - OPEN":"SPIN","PRO - PRO":"DIAMOND","QUADS WING - NIX":"FLANK","QUAY - NIX":"TRIO XTRA","QUAY - OPEN":"TRIO XTRA","SLOT - CLOSED":"FLANK FIB","SLOT - OPEN":"TRIO","SLOT - PRO":"DUO","SLOT - SLOT":"DICE","SLOT - WING":"FLANK FIB","TOAD WING - OPEN":"TOP","TREY - CLOSED":"FLANK","TREY - NIX":"TRIPS XTRA","TREY - OPEN":"TRIO","TREY - PRO":"TRUST FIB","TREY - SLOT":"TRUST","TRIPS - CLOSED":"FIST","TRIPS - OPEN":"TOP","TRIPS - SLOT":"TOP"};

  CFG.SA={name:'South Alabama',week:'Week 5 Opponent',base:SA_BASE,files:SA_FILES,roster:SA_ROSTER,depth:SA_DEPTH};
  if(CFG.FAU) CFG.FAU.week='Week 4 Archive';

  const controls=document.querySelector('.controls');
  let saBtn=document.getElementById('saBtn');
  if(!saBtn){
    saBtn=document.createElement('button');
    saBtn.id='saBtn'; saBtn.textContent='South Alabama';
    const reload=document.getElementById('reloadBtn');
    controls.insertBefore(saBtn,reload||null);
  }

  const txt=(r,...keys)=>{for(const k of keys){const x=r?.[k];if(x!==undefined&&x!==null&&String(x).trim()!=='')return String(x).trim()}return ''};
  const flag=(r,...keys)=>keys.some(k=>['1','TRUE','YES','Y'].includes(String(r?.[k]??'').trim().toUpperCase()));
  const saFormation=r=>{
    // ULM defensive scout language only: exact charted defensive tag first, workbook translation second.
    const exact=txt(r,'Formation');if(exact)return exact;
    const pff=txt(r,'pff_OFFENSIVE_FORMATION_NAME','pff_STARTING_OFFENSIVE_FORMATION_NAME').toUpperCase();
    return SA_DEFENSIVE_FORMATION_MAP[pff]||'';
  };
  const saRunConcept=r=>{
    const direct=txt(r,'Run Concept').toUpperCase(); if(direct)return direct;
    const x=txt(r,'pff_RUNCONCEPTPRIMARY').toUpperCase();
    const map={'INSIDE ZONE':'INSIDE ZONE','OUTSIDE ZONE':'OUTSIDE ZONE','COUNTER':'COUNTER','QB RUNS':'QB RUN','READ OPTION':'READ OPTION','PULL LEAD':'PULL LEAD'};
    return map[x]||x||'—';
  };
  const saPlayType=r=>{
    const direct=txt(r,'Play Type').toUpperCase(); if(direct)return direct;
    const rp=txt(r,'pff_RUNPASS').toUpperCase(),rc=saRunConcept(r);
    if(rp==='R'){
      if(/ZONE|READ OPTION/.test(rc))return 'ZONE';
      if(/COUNTER|POWER|PULL|LEAD|MAN/.test(rc))return 'GAP';
      if(/DRAW/.test(rc))return 'DRAW';
    }
    if(flag(r,'pff_RUNPASSOPTION'))return 'RPO';
    if(flag(r,'pff_SCREEN'))return 'SCREEN';
    if(flag(r,'pff_PLAYACTION'))return 'PA';
    return rp==='P'?'DROPBACK':'';
  };
  const saMotion=r=>txt(r,'Motion','Motion 1')||'';
  const saBackfield=r=>txt(r,'Backfield','Backfield Set')||'';
  const saY=r=>txt(r,'Y Location','Y Open/Close')||'—';
  const saProtection=r=>{
    // Do not synthesize offensive protection language from PFF blocking counts.
    return txt(r,'Proctection','Protection','PROTSTYLE')||'';
  };

  const oldSeasonRows=seasonRows;
  seasonRows=function(rows){
    if(team!=='SA')return oldSeasonRows(rows);
    rows=rows||[];const tagged=rows.filter(r=>seasonYear(r));
    return tagged.length?rows.filter(r=>seasonYear(r)==='2026'):rows;
  };
  const oldULMFormation=ulmFormationOnly;
  ulmFormationOnly=function(r){return team==='SA'?(saFormation(r)||''):oldULMFormation(r)};
  const oldUnmapped=unmappedFormationLabel;
  unmappedFormationLabel=function(r){return team==='SA'?'':oldUnmapped(r)};
  const oldYLocation=yLocation;
  yLocation=function(r){return team==='SA'?saY(r):oldYLocation(r)};
  const oldHybridBackfield=hybridBackfield;
  hybridBackfield=function(r){return team==='SA'?saBackfield(r):oldHybridBackfield(r)};
  const oldHybridMotion=hybridMotion;
  hybridMotion=function(r){return team==='SA'?saMotion(r):oldHybridMotion(r)};
  const oldHybridRun=hybridRunConcept;
  hybridRunConcept=function(r){return team==='SA'?saRunConcept(r):oldHybridRun(r)};
  const oldRunConcept=runConcept;
  runConcept=function(r){return team==='SA'?saRunConcept(r):oldRunConcept(r)};
  const oldScoutingRun=scoutingRunConcept;
  scoutingRunConcept=function(r){return team==='SA'?saRunConcept(r):oldScoutingRun(r)};
  const oldProt=prot;
  prot=function(r){return team==='SA'?saProtection(r):oldProt(r)};

  const oldHybrid=mapDefensiveIntelHybrid;
  mapDefensiveIntelHybrid=function(){
    if(team!=='SA')return oldHybrid();
    dIntelHybridMap=new WeakMap();dIntelHybridReady=false;dIntelHybridRate=0;
    const plays=rawPlays||[];
    plays.forEach(r=>dIntelHybridMap.set(r,{
      ...r,
      Personnel:txt(r,'Personnel','pff_OFFPERSONNELBASIC','pff_OFF_PERSONNEL_GROUP'),
      Formation:saFormation(r),'Form Var':txt(r,'Form Var'),Motion:saMotion(r),'Y Location':saY(r),
      Backfield:saBackfield(r),'Run Concept':saRunConcept(r),'Pass Concept':txt(r,'Pass Concept'),
      'Play Type':saPlayType(r),Proctection:saProtection(r)
    }));
    dIntelHybridReady=plays.length>0;dIntelHybridRate=plays.length?1:0;return dIntelHybridReady;
  };

  const oldActiveFive=activeStarterFive;
  activeStarterFive=function(){
    if(team!=='SA')return oldActiveFive();
    const pos=liveDepthChart?.offense?.positions||liveDepthChart?.offense||liveDepthChart?.positions||{};
    return ['LT','LG','C','RG','RT'].map(slot=>{
      const arr=pos[slot]||[],s=arr[0]||null,b=arr[1]||null;
      if(!s)return {slot,starter:null,backup:null};
      const conv=x=>Array.isArray(x)?{number:String(x[0]||''),name:String(x[1]||''),class:String(x[2]||'')}:{number:String(x?.number||x?.jersey||''),name:String(x?.name||''),class:String(x?.class||'')};
      return {slot,starter:conv(s),backup:b?conv(b):null};
    });
  };

  const oldDepth=renderDepthChart;
  renderDepthChart=function(){
    if(team!=='SA')return oldDepth();
    const tbl=$('depthTable'),src=$('depthSource'),ttl=$('depthTitle');if(!tbl)return;
    const d=liveDepthChart||{},pos=d?.offense?.positions||d?.offense||d?.positions||{},entries=Object.entries(pos);
    const maxDepth=Math.max(2,...entries.map(([,a])=>Array.isArray(a)?a.length:0));
    const heads=['Position',...Array.from({length:maxDepth},(_,i)=>`${i+1}${i===0?'st':i===1?'nd':i===2?'rd':'th'}`)];
    tbl.innerHTML=`<thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`+
      entries.map(([position,players])=>`<tr class="${isOLDepthPos(position)?'olDepth':''}"><td class="depthPos">${esc(position)}</td>${Array.from({length:maxDepth},(_,i)=>`<td>${depthPlayerHTML(position,players?.[i])}</td>`).join('')}</tr>`).join('')+'</tbody>';
    ttl.textContent='South Alabama Offensive Depth Chart';
    src.innerHTML=`Week 5 · ${esc(String(d.season||'2026'))}<br><span style="color:#ffd85a">OL names open Tony's OL bios</span>`;
  };

  const oldStuntRows=currentStuntRows;
  currentStuntRows=function(){
    if(team!=='SA')return oldStuntRows();
    return passFilteredRows().map(r=>Object.assign({},r,{
      Stunt:flag(r,'pff_STUNT','Stunt')?'STUNT':'','Pass Result':txt(r,'pff_PASSRESULT','Pass Result'),
      Gain:gain(r),Down:txt(r,'pff_DOWN','Down'),Distance:txt(r,'pff_DISTANCE','Distance'),Personnel:pers(r),
      Formation:saFormation(r)||'Unknown','Play Type':saPlayType(r),_ttt:rowTTT(r),_feed:r
    }));
  };

  const oldRenderULM=renderULMLanguage;
  renderULMLanguage=function(){oldRenderULM();if(team==='SA'){const b=$('ulmMatchBadge');if(b)b.textContent='SOUTH ALABAMA · ULM DEFENSIVE LANGUAGE'}};

  const oldLoad=load;
  load=async function(){
    if(team!=='SA')return oldLoad();
    seasonView='2026';localStorage.setItem('tonyDLSeasonV1','2026');syncSeasonUI();
    const c=CFG.SA;$('opp').textContent=c.name;$('wk').textContent=c.week;$('status').textContent='Loading South Alabama Defensive Intelligence…';
    data={};liveDepthChart=null;
    for(const [k,f] of Object.entries(SA_FILES)){
      try{const r=await fetch(SA_BASE+encodeURIComponent(f)+'?t='+Date.now(),{cache:'no-store'});data[k]=r.ok?csv(await r.text()):[]}catch(e){data[k]=[]}
    }
    try{const r=await fetch(SA_BASE+SA_ROSTER+'?t='+Date.now(),{cache:'no-store'});roster=r.ok?await r.json():[]}catch(e){roster=[]}
    try{const r=await fetch(SA_BASE+SA_DEPTH+'?t='+Date.now(),{cache:'no-store'});liveDepthChart=r.ok?await r.json():null}catch(e){liveDepthChart=null}
    rawPlays=(data.plays||[]).slice();mapDefensiveIntelHybrid();const plays=seasonRows(rawPlays);
    setSel('fDown',plays.map(r=>v(r,'pff_DOWN','Down')));setSel('fPers',plays.map(pers));setSel('fForm',plays.map(ulmFormationOnly).filter(Boolean));setSel('fHash',plays.map(r=>v(r,'pff_HASHDEF','pff_HASH','Hash')));
    const live=Object.values(data).filter(x=>Array.isArray(x)&&x.length).length,expected=Object.keys(SA_FILES).length;
    const eligible=plays.filter(r=>!['1','1.0'].includes(v(r,'pff_NOPLAY'))).length;
    $('status').textContent=`Loaded ${eligible.toLocaleString()} eligible South Alabama plays · ${live}/${expected} Defensive Intel datasets live${liveDepthChart?' · depth chart live':' · depth chart missing'}`;
    renderDepthChart();renderOL();apply();
  };

  const oldSeason=setSeasonView;
  setSeasonView=function(y){
    if(team!=='SA')return oldSeason(y);
    seasonView='2026';localStorage.setItem('tonyDLSeasonV1','2026');syncSeasonUI();mapDefensiveIntelHybrid();
    const plays=seasonRows(rawPlays);setSel('fDown',plays.map(r=>v(r,'pff_DOWN','Down')));setSel('fPers',plays.map(pers));setSel('fForm',plays.map(ulmFormationOnly).filter(Boolean));setSel('fHash',plays.map(r=>v(r,'pff_HASHDEF','pff_HASH','Hash')));renderDepthChart();renderOL();apply();
  };

  const oldOpponent=setOpponent;
  setOpponent=function(t){
    saBtn.classList.remove('active');
    if(t!=='SA')return oldOpponent(t);
    team='SA';seasonView='2026';localStorage.setItem('tonyDLSeasonV1','2026');
    ['uabBtn','msstBtn','selBtn','fauBtn','saBtn'].forEach(id=>$(id)?.classList.remove('active'));saBtn.classList.add('active');load();
  };
  saBtn.onclick=()=>setOpponent('SA');

  // Make Week 5 the current view after the unchanged base app has initialized.
  setOpponent('SA');
})();
