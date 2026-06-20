(function () {
'use strict';

var STORAGE_KEY = 'barStorage.presets.v6';
var OLD_STORAGE_KEYS = ['barStorage.presets.v5', 'barStorage.presets.v4'];
var LEARNED_ICON_KEY = 'barStorage.learnedIcons.v1';
var MAX_SLOTS = 14;
var SCAN_ICON_SIZE = 30;
var SCAN_STEP = 36;
var SCAN_BAR_WIDTH = MAX_SLOTS * SCAN_STEP;
var STYLE_WEAPONS = {
  'Melee':['Any melee','Dual wield melee','2H melee','Scythe / halberd range','Spear','Sword + shield'],
  'Magic':['Any magic','Dual wield magic','Staff','Wand + orb/book','Wand + shield'],
  'Ranged':['Any ranged','Bow','Crossbows','2H crossbow','Thrown','Crossbow + shield'],
  'Necromancy':['Death guard + lantern','Death guard + shield'],
  'Hybrid':['Any compatible weapons','Melee + ranged switch','Melee + magic switch','Ranged + magic switch','Tri-style switches'],
  'Skilling/Utility':['Utility bar']
};
var ABILITY_ICON_OVERRIDES = {"Assault":"https://cdn.discordapp.com/emojis/535532855191928842.png","Hurricane":"https://cdn.discordapp.com/emojis/535532878969438210.png","Dismember":"https://img.pvme.io/images/qPRMFCsp23.webp","Overpower":"https://cdn.discordapp.com/emojis/535532879334080517.png","Berserk":"https://cdn.discordapp.com/emojis/535532854004678657.png","Meteor Strike":"https://img.pvme.io/images/81HMxObool.webp","Greater Barge":"https://cdn.discordapp.com/emojis/535532879250456578.png","Greater Fury":"https://cdn.discordapp.com/emojis/535532879334080527.png","Piercing Shot":"https://img.pvme.io/images/y8dBjmQZSJ.webp","Binding Shot":"https://cdn.discordapp.com/emojis/535541306563231790.png","Ricochet":"https://img.pvme.io/images/hQduTi7o4o.webp","Greater Ricochet":"https://cdn.discordapp.com/emojis/787904334812807238.png","Snapshot":"https://img.pvme.io/images/WHTscLhdbk.webp","Snipe":"https://img.pvme.io/images/ouNQwWo9MM.webp","Bombardment":"https://cdn.discordapp.com/emojis/535541306391265284.png","Rapid Fire":"https://cdn.discordapp.com/emojis/535541270521708566.png","Corruption Shot":"https://cdn.discordapp.com/emojis/535541306294796299.png","Death's Swiftness":"https://img.pvme.io/images/M35wETJU2P.webp","Escape":"https://cdn.discordapp.com/emojis/535541258832052231.png","Sonic Wave":"https://img.pvme.io/images/Ct4XTMUwZZ.webp","Dragon Breath":"https://cdn.discordapp.com/emojis/535533833391702017.png","Impact":"https://cdn.discordapp.com/emojis/535533809655873556.png","Combust":"https://img.pvme.io/images/W5h1lGupxA.webp","Chain":"https://img.pvme.io/images/82PXXSsEWB.webp","Greater Concentrated Blast":"https://img.pvme.io/images/vQl3485ZuQ.webp","Wild Magic":"https://cdn.discordapp.com/emojis/535533809978966037.png","Asphyxiate":"https://cdn.discordapp.com/emojis/535533833072672778.png","Corruption Blast":"https://img.pvme.io/images/JkOw1LoeZj.webp","Omnipower":"https://cdn.discordapp.com/emojis/535533809664262179.png","Sunshine":"https://cdn.discordapp.com/emojis/994921119381463070.png","Tsunami":"https://cdn.discordapp.com/emojis/535533809995874304.png","Surge":"https://cdn.discordapp.com/emojis/799457167182659586.png","Necromancy Auto Attack":"https://cdn.discordapp.com/emojis/1137809137401602109.png","Conjure Skeleton Warrior":"https://cdn.discordapp.com/emojis/1159434516658651147.png","Finger of Death":"https://cdn.discordapp.com/emojis/1159434801938432010.png","Touch of Death":"https://cdn.discordapp.com/emojis/1137809175980810380.png","Death Skulls":"https://cdn.discordapp.com/emojis/1159434663903899728.png","Conjure Putrid Zombie":"https://cdn.discordapp.com/emojis/1137809200219684924.png","Conjure Vengeful Ghost":"https://cdn.discordapp.com/emojis/1137809206423060632.png","Bloat":"https://cdn.discordapp.com/emojis/1159433682403201044.png","Soul Sap":"https://cdn.discordapp.com/emojis/1137809140476031057.png","Spectral Scythe":"https://cdn.discordapp.com/emojis/1137809145706319892.png","Volley of Souls":"https://cdn.discordapp.com/emojis/1159435029592686642.png","Living Death":"https://cdn.discordapp.com/emojis/1159434908486357072.png","Devotion":"https://cdn.discordapp.com/emojis/513190158728953857.png","Anticipation":"https://cdn.discordapp.com/emojis/535541306475151390.png","Freedom":"https://cdn.discordapp.com/emojis/535541258240786434.png","Reflect":"https://cdn.discordapp.com/emojis/535541258786177064.png","Resonance":"https://cdn.discordapp.com/emojis/535541258844635148.png","Debilitate":"https://cdn.discordapp.com/emojis/535541278264393729.png","Weapon Special Attack":"https://cdn.discordapp.com/emojis/537340400273195028.png"};

var EXTRA_ABILITY_ICONS = {"Melee Auto Attack":"https://img.pvme.io/images/FLBzCBbLxz.webp","Adaptive Strike":"https://img.pvme.io/images/OKgWLQZr6u.webp","Rend":"https://cdn.discordapp.com/emojis/535532879820619786.png","Fury":"https://cdn.discordapp.com/emojis/535532879510372352.png","Backhand":"https://cdn.discordapp.com/emojis/535532854302605333.png","Punish":"https://cdn.discordapp.com/emojis/535532879439069184.png","Barge":"https://cdn.discordapp.com/emojis/535532853916860437.png","Chaos Roar":"https://img.pvme.io/images/SBxKhzUNKE.webp","Flurry":"https://cdn.discordapp.com/emojis/864492981763702834.png","Greater Flurry":"https://cdn.discordapp.com/emojis/535532879283879977.png","Pulverise":"https://cdn.discordapp.com/emojis/535532879053062146.png","Dive":"https://cdn.discordapp.com/emojis/1049378668197195808.png","Bladed Dive":"https://cdn.discordapp.com/emojis/535532854281764884.png","Ranged Auto Attack":"https://img.pvme.io/images/HAc5xYqGUV.webp","Imbue Gale":"https://img.pvme.io/images/YeiRAAxXYB.webp","Shadow Tendrils":"https://cdn.discordapp.com/emojis/642713547142332416.png","Imbue Shadows":"https://img.pvme.io/images/INpvAsW5Jc.webp","Deadshot":"https://img.pvme.io/images/LLYuG5lgRv.webp","Greater Death\u2019s Swiftness":"https://cdn.discordapp.com/emojis/994644354536837121.png","Magic Auto Attack":"https://img.pvme.io/images/a51JSKPdfz.webp","Greater Sonic Wave":"https://img.pvme.io/images/zxtNbofl8y.webp","Concentrated Blast":"https://img.pvme.io/images/qcvRxP2Sy7.webp","Greater Chain":"https://img.pvme.io/images/0w0DrNzSRH.webp","Smoke Tendrils":"https://cdn.discordapp.com/emojis/536257336130404372.png","Magma Tempest":"https://cdn.discordapp.com/emojis/902209626509025290.png","Magma Tempest (Targeted)":"https://cdn.discordapp.com/emojis/924741973858996284.png","Greater Sunshine":"https://cdn.discordapp.com/emojis/994644352871714836.png","Runic Charge":"https://img.pvme.io/images/9hZoj9PK9n.webp","Blood Siphon":"https://cdn.discordapp.com/emojis/1159434279311380532.png","Soul Strike":"https://cdn.discordapp.com/emojis/1137809142376058910.png","Conjure Phantom Guardian":"https://cdn.discordapp.com/emojis/1280109199069806604.png","Conjure Army":"https://cdn.discordapp.com/emojis/1166094935066423348.png","Lesser Bone Shield":"https://cdn.discordapp.com/emojis/1137809125590450276.png","Threads of Fate":"https://cdn.discordapp.com/emojis/1137809172335951933.png","Greater Bone Shield":"https://cdn.discordapp.com/emojis/1137809118283976814.png","Life Transfer":"https://cdn.discordapp.com/emojis/1137809128136388819.png","Invoke Lord of Bones":"https://cdn.discordapp.com/emojis/1176968330582700174.png","Invoke Death":"https://cdn.discordapp.com/emojis/1137809121983336548.png","Darkness":"https://cdn.discordapp.com/emojis/1137809209782698024.png","Split Soul":"https://cdn.discordapp.com/emojis/1137809168368148490.png","Unsullied":"https://img.pvme.io/images/urJ4nkOcNi.png","Aggression":"https://cdn.discordapp.com/emojis/909338509234569216.png","Cease":"https://cdn.discordapp.com/emojis/864235458464186418.png","Bash":"https://cdn.discordapp.com/emojis/535541306546716692.png","Revenge":"https://cdn.discordapp.com/emojis/535541259645878302.png","Provoke":"https://cdn.discordapp.com/emojis/535541259465392143.png","Immortality":"https://cdn.discordapp.com/emojis/535541258538582017.png","Divert":"https://cdn.discordapp.com/emojis/787904334377648130.png","Rejuvenate":"https://cdn.discordapp.com/emojis/535541258873995284.png","Preparation":"https://cdn.discordapp.com/emojis/535541258546970624.png","Barricade":"https://cdn.discordapp.com/emojis/535541306353778689.png","Natural Instinct":"https://cdn.discordapp.com/emojis/535541258131865633.png","Eat Food":"https://cdn.discordapp.com/emojis/1073883122069934182.png","Regenerate":"https://cdn.discordapp.com/emojis/1137770309315997836.png","Sacrifice":"https://cdn.discordapp.com/emojis/513201065907322880.png","Transfigure":"https://cdn.discordapp.com/emojis/553050196523876354.png","Ingenuity of the Humans":"https://cdn.discordapp.com/emojis/641339234111848463.png","Demon Slayer":"https://cdn.discordapp.com/emojis/641339921675845633.png","Dragon Slayer":"https://cdn.discordapp.com/emojis/641339921814126594.png","Undead Slayer":"https://cdn.discordapp.com/emojis/641339922019516416.png","Limitless":"https://cdn.discordapp.com/emojis/641339233638023179.png","Slayer\u2019s Insight":"https://img.pvme.io/images/4w06xbygZg.png","Kuradal\u2019s Favour":"https://img.pvme.io/images/ANesID4R2c.png","Essence of Finality Special Attack":"https://cdn.discordapp.com/emojis/1257438999794946099.png","Siphon":"https://cdn.discordapp.com/emojis/553050198012854275.png","Incite":"https://cdn.discordapp.com/emojis/553050196725071893.png","Tuska\u2019s Wrath":"https://cdn.discordapp.com/emojis/513201065513058306.png","Storm Shards":"https://cdn.discordapp.com/emojis/536256663641128971.png","Shatter":"https://cdn.discordapp.com/emojis/536256673904328704.png","Guthix\u2019s Blessing":"https://cdn.discordapp.com/emojis/553050196767145995.png","Reprisal":"https://cdn.discordapp.com/emojis/513190159462694912.png","Onslaught":"https://cdn.discordapp.com/emojis/513190159085207555.png","Ice Asylum":"https://cdn.discordapp.com/emojis/553050196817215491.png"};
Object.keys(EXTRA_ABILITY_ICONS).forEach(function(name){if(!ABILITY_ICON_OVERRIDES[name])ABILITY_ICON_OVERRIDES[name]=EXTRA_ABILITY_ICONS[name]});
var ABILITY_ICON_VARIANTS = {"Backhand":["https://cdn.discordapp.com/emojis/867678153854025779.png"],"Binding Shot":["https://cdn.discordapp.com/emojis/867678153400647701.png"],"Greater Ricochet":["https://cdn.discordapp.com/emojis/867678153966878740.png"],"Impact":["https://cdn.discordapp.com/emojis/867678154369400862.png"],"Chain":["https://cdn.discordapp.com/emojis/867678153962684426.png"],"Greater Chain":["https://cdn.discordapp.com/emojis/867678153882861568.png"],"Overpower":["https://cdn.discordapp.com/emojis/959089455640215633.png"],"Deadshot":["https://cdn.discordapp.com/emojis/959089455283728386.png"],"Omnipower":["https://cdn.discordapp.com/emojis/1179505745654448208.png"],"Death Skulls":["https://cdn.discordapp.com/emojis/1179505729367969863.png"],"Soul Strike":["https://cdn.discordapp.com/emojis/1156683164593430579.png"],"Anticipation":["https://cdn.discordapp.com/emojis/867678154071998464.png","https://cdn.discordapp.com/emojis/998692900135252078.png"],"Barricade":["https://cdn.discordapp.com/emojis/867678153883516958.png"]};
var state = {
  bars: [],
  filters: {q:'', source:'all', category:'all', style:'all', mode:'all', weapon:'all'},
  scan: {results:[], sourceRef:null, preview:null, templateRecords:[], templatesPromise:null, abilityNames:[]},
  learnedIcons: loadLearnedIcons()
};

function $(id){return document.getElementById(id)}
function esc(value){return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
function uid(){return 'bar-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function safeJson(value,fallback){try{return JSON.parse(value)}catch(e){return fallback}}
function dedupe(values){return values.filter(function(v,i,a){return v && a.indexOf(v)===i})}
function splitComma(value){return String(value||'').split(',').map(function(v){return v.trim()}).filter(Boolean)}
function splitLines(value){return String(value||'').split(/\r?\n/).map(function(v){return v.trim()}).filter(Boolean)}
function parseAbilitySlots(value){
  var text=String(value||'').replace(/\r/g,'');
  var slots=text.indexOf('\n')>-1?text.split('\n'):text.split(',');
  return slots.map(function(v){return v.trim()}).slice(0,MAX_SLOTS);
}
function providerOf(bar){
  if(bar.source==='user')return 'User';
  var text=[bar.sourceName,bar.sourceUrl,(bar.tags||[]).join(' ')].join(' ').toLowerCase();
  if(text.indexOf('pvme')>-1)return 'PvME';
  if(text.indexOf('wiki')>-1||text.indexOf('runescape.wiki')>-1)return 'RuneScape Wiki';
  return 'Reference';
}
function normalizeBar(bar){
  var abilities=Array.isArray(bar.abilities)?bar.abilities.map(function(a){return String(a||'').trim()}):[];
  return {
    id:bar.id||uid(), source:bar.source||'reference', sourceName:bar.sourceName||'', sourceUrl:bar.sourceUrl||'',
    name:bar.name||'Untitled Bar', category:bar.category||'User', style:bar.style||'Necromancy',
    mode:bar.mode||'Revolution', weapon:bar.weapon||((STYLE_WEAPONS[bar.style]||['Any'])[0]), target:bar.target||'General',
    tags:Array.isArray(bar.tags)?bar.tags:splitComma(bar.tags), abilities:abilities.slice(0,MAX_SLOTS),
    requirements:Array.isArray(bar.requirements)?bar.requirements:splitLines(bar.requirements), notes:bar.notes||''
  };
}
function loadLearnedIcons(){
  var parsed=safeJson(localStorage.getItem(LEARNED_ICON_KEY),{});
  return parsed && typeof parsed==='object'?parsed:{};
}
function saveLearnedIcons(){
  try{localStorage.setItem(LEARNED_ICON_KEY,JSON.stringify(state.learnedIcons))}catch(e){console.warn('Could not save learned icons',e)}
}
function saveUserBars(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state.bars.filter(function(b){return b.source==='user'})));
}
function migrateSavedBars(){
  var current=safeJson(localStorage.getItem(STORAGE_KEY),null);
  if(Array.isArray(current))return current;
  for(var i=0;i<OLD_STORAGE_KEYS.length;i++){
    var old=safeJson(localStorage.getItem(OLD_STORAGE_KEYS[i]),null);
    if(Array.isArray(old)){localStorage.setItem(STORAGE_KEY,JSON.stringify(old));return old}
  }
  return [];
}
function fillBasic(id,values,selected){
  var el=$(id);if(!el)return;
  el.innerHTML=values.map(function(v){return '<option value="'+esc(v)+'"'+(v===selected?' selected':'')+'>'+esc(v)+'</option>'}).join('');
}
function fillFilter(id,values,selected,label){
  var el=$(id);var list=dedupe(values.filter(Boolean)).sort(function(a,b){return a.localeCompare(b)});
  el.innerHTML='<option value="all">'+esc(label)+'</option>'+list.map(function(v){return '<option value="'+esc(v)+'"'+(v===selected?' selected':'')+'>'+esc(v)+'</option>'}).join('');
  el.value=list.indexOf(selected)>-1?selected:'all';
}
function weaponsForStyle(style){return STYLE_WEAPONS[style]||['Any compatible weapon']}
function refreshWeaponFilter(){
  var bars=state.filters.style==='all'?state.bars:state.bars.filter(function(b){return b.style===state.filters.style});
  fillFilter('weaponFilter',bars.map(function(b){return b.weapon}),state.filters.weapon,'All weapons');
}
function refreshEditorWeapons(selected){
  var values=weaponsForStyle($('presetStyle').value);fillBasic('presetWeapon',values,values.indexOf(selected)>-1?selected:values[0]);
}
function refreshScanWeapons(selected){
  var values=weaponsForStyle($('scanPresetStyle').value);fillBasic('scanPresetWeapon',values,values.indexOf(selected)>-1?selected:values[0]);
}
function populateFilters(){
  fillFilter('categoryFilter',state.bars.map(function(b){return b.category}),state.filters.category,'All categories');
  fillFilter('styleFilter',state.bars.map(function(b){return b.style}),state.filters.style,'All styles');
  fillFilter('modeFilter',state.bars.map(function(b){return b.mode}),state.filters.mode,'All modes');
  refreshWeaponFilter();
  fillBasic('presetCategory',['Recommended','Boss','Slayer','User'],'User');
  fillBasic('presetStyle',Object.keys(STYLE_WEAPONS),'Necromancy');
  fillBasic('presetMode',['Revolution','Revolution++','Full Manual','Hybrid Manual/Revo'],'Revolution');
  refreshEditorWeapons();
  fillBasic('scanPresetStyle',Object.keys(STYLE_WEAPONS),'Necromancy');
  fillBasic('scanPresetMode',['Revolution','Revolution++','Full Manual','Hybrid Manual/Revo'],'Revolution');
  refreshScanWeapons();
}
function filteredBars(){
  var q=state.filters.q.toLowerCase();
  return state.bars.filter(function(b){
    var hay=[b.name,b.category,b.style,b.mode,b.weapon,b.target,providerOf(b),(b.tags||[]).join(' '),(b.abilities||[]).join(' ')].join(' ').toLowerCase();
    return (!q||hay.indexOf(q)>-1) &&
      (state.filters.source==='all'||providerOf(b)===state.filters.source) &&
      (state.filters.category==='all'||b.category===state.filters.category) &&
      (state.filters.style==='all'||b.style===state.filters.style) &&
      (state.filters.mode==='all'||b.mode===state.filters.mode) &&
      (state.filters.weapon==='all'||b.weapon===state.filters.weapon);
  });
}
function wikiFileName(name){
  var aliases={'Necromancy Auto Attack':'Necromancy','Area Loot':'Area loot','Weapon Special Attack':'Weapon Special attack'};
  return (aliases[name]||name).replace(/ /g,'_');
}
function iconCandidates(name){
  if(!name)return [];
  var file=wikiFileName(name)+'.png';var values=[];
  if(ABILITY_ICON_OVERRIDES[name])values.push(ABILITY_ICON_OVERRIDES[name]);
  if(ABILITY_ICON_VARIANTS[name])values=values.concat(ABILITY_ICON_VARIANTS[name]);
  values.push('https://runescape.wiki/images/'+encodeURIComponent(file).replace(/%2F/g,'/'));
  values.push('https://runescape.wiki/w/Special:Redirect/file/'+encodeURIComponent(file));
  return dedupe(values);
}
function fallbackIcon(name,style){
  var initials=String(name||'?').split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,3).toUpperCase();
  var colors={'Melee':['#7d251f','#e76c5c'],'Magic':['#244d83','#67aaf9'],'Ranged':['#41611c','#9ed15c'],'Necromancy':['#39264f','#af78df'],'Hybrid':['#62491d','#d9b15f'],'Skilling/Utility':['#355965','#79c6d9']};
  var c=colors[style]||['#3b4655','#aeb8c7'];
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="'+c[1]+'"/><stop offset="1" stop-color="'+c[0]+'"/></linearGradient></defs><rect width="40" height="40" rx="4" fill="#10151d"/><rect x="2" y="2" width="36" height="36" rx="3" fill="url(#g)" stroke="#d6dce5" stroke-opacity=".35"/><text x="20" y="24" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="white" stroke="#000" stroke-width="1.3" paint-order="stroke">'+initials+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function hydrateIcons(root){
  Array.prototype.forEach.call(root.querySelectorAll('img.ability-icon'),function(img){
    var ability=img.getAttribute('data-ability')||'';var style=img.getAttribute('data-style')||'';var sources=iconCandidates(ability);var index=0;
    function next(){if(index<sources.length){img.src=sources[index++];return}img.onerror=null;img.src=fallbackIcon(ability,style);img.classList.add('fallback-icon')}
    img.onerror=next;next();
  });
}
function renderSlots(bar){
  var slots=(bar.abilities||[]).slice(0,MAX_SLOTS);while(slots.length<MAX_SLOTS)slots.push('');
  return slots.map(function(a,i){return '<div class="slot'+(a?' filled':'')+'" title="'+esc(a||'Empty slot')+'"><span class="slot-number">'+(i+1)+'</span>'+(a?'<img class="ability-icon" data-ability="'+esc(a)+'" data-style="'+esc(bar.style)+'" alt=""><span class="sr-only">'+esc(a)+'</span>':'')+'</div>'}).join('');
}
function renderList(){
  var bars=filteredBars();$('resultCount').textContent=bars.length+' shown';var list=$('barList');list.innerHTML='';
  if(!bars.length){list.innerHTML='<p class="muted empty-state">No bars match your filters.</p>';return}
  bars.forEach(function(b){
    var row=document.createElement('article');row.className='bar-card';
    row.innerHTML='<div class="name-tag"><strong>'+esc(b.name)+'</strong><span>'+esc(b.style)+' • '+esc(b.mode)+' • '+esc(b.weapon)+'</span><em>'+esc(providerOf(b))+'</em></div><div class="action-wrap"><div class="action-bar">'+renderSlots(b)+'</div></div><div class="row-actions">'+(b.source==='user'?'<button data-action="edit">Edit</button><button data-action="delete" class="danger">Delete</button>':'<button data-action="duplicate">Duplicate</button>')+'<button data-action="view" class="secondary">Details</button></div>';
    hydrateIcons(row);
    row.querySelector('[data-action="view"]').onclick=function(){openDetail(b)};
    var duplicate=row.querySelector('[data-action="duplicate"]');if(duplicate)duplicate.onclick=function(){var copy=JSON.parse(JSON.stringify(b));copy.id='';copy.name=b.name+' Copy';copy.source='user';copy.sourceName='';copy.sourceUrl='';openEditor(copy)};
    var edit=row.querySelector('[data-action="edit"]');if(edit)edit.onclick=function(){openEditor(b)};
    var remove=row.querySelector('[data-action="delete"]');if(remove)remove.onclick=function(){deleteBar(b.id)};
    list.appendChild(row);
  });
}
function openDetail(b){
  var panel=$('detailPanel');var slots=(b.abilities||[]).slice(0,MAX_SLOTS);while(slots.length<MAX_SLOTS)slots.push('');
  panel.innerHTML='<button type="button" class="detail-close icon-button secondary" aria-label="Close">×</button><h2>'+esc(b.name)+'</h2><p class="detail-meta">'+esc(b.category)+' • '+esc(b.style)+' • '+esc(b.mode)+' • '+esc(b.weapon)+' • '+esc(b.target)+'</p><p class="source-line">Source: '+(b.sourceUrl?'<a href="'+esc(b.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(b.sourceName||providerOf(b))+'</a>':esc(providerOf(b)))+'</p><div class="action-wrap detail-bar"><div class="action-bar">'+renderSlots(b)+'</div></div><div class="detail-columns"><section><h3>Slots</h3><ol class="ability-list">'+slots.map(function(a){return '<li>'+esc(a||'Empty slot')+'</li>'}).join('')+'</ol></section><section><h3>Unlock requirements</h3><ul>'+((b.requirements||[]).length?(b.requirements||[]).map(function(r){return '<li>'+esc(r)+'</li>'}).join(''):'<li>No special unlocks listed.</li>')+'</ul><h3>Notes</h3><p>'+esc(b.notes||'No notes.')+'</p></section></div>';
  panel.querySelector('.detail-close').onclick=function(){$('detailDialog').close()};hydrateIcons(panel);$('detailDialog').showModal();
}
function openEditor(bar){
  bar=bar||{};$('editorTitle').textContent=bar.id?'Edit bar':'New bar';$('presetId').value=bar.id||'';$('presetName').value=bar.name||'';$('presetCategory').value=bar.category||'User';$('presetStyle').value=bar.style||'Necromancy';refreshEditorWeapons(bar.weapon);$('presetMode').value=bar.mode||'Revolution';$('presetTarget').value=bar.target||'';$('presetTags').value=(bar.tags||[]).join(', ');$('presetAbilities').value=(bar.abilities||[]).slice(0,MAX_SLOTS).join('\n');$('presetRequirements').value=(bar.requirements||[]).join('\n');$('presetNotes').value=bar.notes||'';checkAbilityCount();$('editorDialog').showModal();
}
function formToBar(id){return normalizeBar({id:id||uid(),source:'user',name:$('presetName').value.trim(),category:$('presetCategory').value,style:$('presetStyle').value,mode:$('presetMode').value,weapon:$('presetWeapon').value,target:$('presetTarget').value.trim()||'Custom',tags:splitComma($('presetTags').value),abilities:parseAbilitySlots($('presetAbilities').value),requirements:splitLines($('presetRequirements').value),notes:$('presetNotes').value.trim()})}
function deleteBar(id){if(!confirm('Delete this saved bar?'))return;state.bars=state.bars.filter(function(b){return b.id!==id});saveUserBars();populateFilters();renderList()}
function checkAbilityCount(){var lines=String($('presetAbilities').value||'').replace(/\r/g,'').split('\n');$('abilityWarning').classList.toggle('hidden',lines.length<=MAX_SLOTS)}
function exportBars(){var payload={app:'Bar Storage',version:2,presets:state.bars.filter(function(b){return b.source==='user'})};var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bar-storage-presets.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function importBars(file){var reader=new FileReader();reader.onload=function(){var parsed=safeJson(reader.result,[]);var items=Array.isArray(parsed)?parsed:(parsed.presets||[]);var imported=items.map(function(b){return normalizeBar(Object.assign({},b,{id:uid(),source:'user',sourceName:'',sourceUrl:''}))});state.bars=state.bars.concat(imported);saveUserBars();populateFilters();renderList();$('importInput').value=''};reader.readAsText(file)}

/* Main navigation */
function setTab(name){
  Array.prototype.forEach.call(document.querySelectorAll('.tab'),function(tab){tab.classList.toggle('active',tab.getAttribute('data-tab')===name)});
  Array.prototype.forEach.call(document.querySelectorAll('.view'),function(view){view.classList.remove('active')});
  var view=$(name+'View');if(view)view.classList.add('active');
  if(name==='scanner')prepareScannerTemplates();
}

/* Scanner */
function allAbilityNames(){
  var fromBars=state.bars.reduce(function(out,b){return out.concat((b.abilities||[]).filter(Boolean))},[]);
  return dedupe(fromBars.concat(Object.keys(ABILITY_ICON_OVERRIDES))).sort(function(a,b){return a.localeCompare(b)});
}
function imageDataToUrl(data){
  var c=document.createElement('canvas');c.width=data.width;c.height=data.height;var ctx=c.getContext('2d');ctx.putImageData(data,0,0);return c.toDataURL('image/png');
}
function urlToImageData(url,timeoutMs){
  return new Promise(function(resolve,reject){
    var settled=false;var img=new Image();img.crossOrigin='anonymous';
    var timer=setTimeout(function(){if(!settled){settled=true;img.src='';reject(new Error('timeout'))}},timeoutMs||3500);
    img.onload=function(){if(settled)return;try{var c=document.createElement('canvas');c.width=SCAN_ICON_SIZE;c.height=SCAN_ICON_SIZE;var ctx=c.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,SCAN_ICON_SIZE,SCAN_ICON_SIZE);var data=ctx.getImageData(0,0,SCAN_ICON_SIZE,SCAN_ICON_SIZE);settled=true;clearTimeout(timer);resolve(data)}catch(e){settled=true;clearTimeout(timer);reject(e)}};
    img.onerror=function(){if(!settled){settled=true;clearTimeout(timer);reject(new Error('load failed'))}};img.src=url;
  });
}
function loadFirstTemplate(name,urls){
  var index=0;function next(){if(index>=urls.length)return Promise.reject(new Error('no template'));return urlToImageData(urls[index++],1200).catch(next)}return next().then(function(data){return {name:name,data:data,learned:false}});
}
function learnedTemplatePromises(name){
  var entries=state.learnedIcons[name]||[];if(typeof entries==='string')entries=[entries];
  return entries.slice(0,3).map(function(url){return urlToImageData(url,1000).then(function(data){return {name:name,data:data,learned:true}}).catch(function(){return null})});
}
function runLimited(tasks,limit){
  return new Promise(function(resolve){var results=new Array(tasks.length),next=0,active=0,done=0;if(!tasks.length)return resolve([]);function pump(){while(active<limit&&next<tasks.length){(function(i){active++;Promise.resolve().then(tasks[i]).then(function(v){results[i]=v}).catch(function(){results[i]=null}).then(function(){active--;done++;if(done===tasks.length)resolve(results);else pump()})})(next++)}}pump()});
}
function prepareScannerTemplates(force){
  if(state.scan.templatesPromise&&!force)return state.scan.templatesPromise;
  state.scan.abilityNames=allAbilityNames();$('scannerTemplateStatus').textContent='Loading icon templates…';
  var tasks=[];
  state.scan.abilityNames.forEach(function(name){
    learnedTemplatePromises(name).forEach(function(p){tasks.push(function(){return p})});
    tasks.push(function(){return loadFirstTemplate(name,iconCandidates(name)).catch(function(){return null})});
  });
  state.scan.templatesPromise=runLimited(tasks,24).then(function(records){
    state.scan.templateRecords=records.filter(Boolean);var unique=dedupe(state.scan.templateRecords.map(function(r){return r.name}));
    $('scannerTemplateStatus').textContent=unique.length+' of '+state.scan.abilityNames.length+' abilities ready';
    if(!unique.length)$('scannerTemplateStatus').classList.add('warning-pill');else $('scannerTemplateStatus').classList.remove('warning-pill');
    return state.scan.templateRecords;
  });
  return state.scan.templatesPromise;
}
function brightnessStats(data){
  var sum=0,sum2=0,count=0;for(var y=2;y<28;y++){for(var x=2;x<28;x++){if(x<12&&y>19)continue;var i=(y*30+x)*4;var v=(data.data[i]+data.data[i+1]+data.data[i+2])/3;sum+=v;sum2+=v*v;count++}}
  var mean=sum/count;return {mean:mean,std:Math.sqrt(Math.max(0,sum2/count-mean*mean))};
}
function compareIcon(sample,template){
  var factors=[1,0.82,0.65,0.48,0.33,0.2];var best=Infinity;
  for(var f=0;f<factors.length;f++){
    var factor=factors[f],score=0,count=0;
    for(var y=1;y<29;y++){for(var x=1;x<29;x++){
      if((x<12&&y>19)||(x>21&&y<11))continue;
      var i=(y*30+x)*4;
      var dr=Math.abs(sample.data[i]-template.data[i]*factor);
      var dg=Math.abs(sample.data[i+1]-template.data[i+1]*factor);
      var db=Math.abs(sample.data[i+2]-template.data[i+2]*factor);
      score+=Math.min(100,(dr+dg+db)/3);count++;
    }}
    score/=count;if(score<best)best=score;
  }
  return best;
}
function matchSlot(crop){
  var stats=brightnessStats(crop);if(stats.std<4.2&&stats.mean<24)return {ability:'',score:0,confidence:100,second:100};
  if(!state.scan.templateRecords.length)return {ability:'',score:999,confidence:0,second:999};
  var byName={};state.scan.templateRecords.forEach(function(record){var s=compareIcon(crop,record.data);if(!byName[record.name]||s<byName[record.name].score)byName[record.name]={ability:record.name,score:s,learned:record.learned}});
  var ranked=Object.keys(byName).map(function(k){return byName[k]}).sort(function(a,b){return a.score-b.score});var best=ranked[0],second=ranked[1]||{score:100};
  var separation=Math.max(0,second.score-best.score);var quality=Math.max(0,100-best.score*1.55);var confidence=Math.round(Math.max(0,Math.min(100,quality+separation*1.6+(best.learned?12:0))));
  return {ability:best.score<58?best.ability:'',score:best.score,confidence:confidence,second:second.score};
}
function drawScanPreview(data){
  var canvas=$('scannerPreview');canvas.width=data.width;canvas.height=data.height;var ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.putImageData(data,0,0);$('scannerPreviewWrap').classList.remove('hidden');
}
function cropToThumb(crop){return imageDataToUrl(crop)}
function abilitySelectHtml(selected){
  return '<option value="">Empty / unknown</option>'+state.scan.abilityNames.map(function(name){return '<option value="'+esc(name)+'"'+(name===selected?' selected':'')+'>'+esc(name)+'</option>'}).join('');
}
function renderScanResults(){
  var wrap=$('scanSlotEditor');wrap.innerHTML='';var confidences=[];
  state.scan.results.forEach(function(result,index){
    var card=document.createElement('label');card.className='scan-slot'+(result.confidence<45?' uncertain':'');card.innerHTML='<span class="scan-slot-number">'+(index+1)+'</span><img src="'+cropToThumb(result.crop)+'" alt="Scanned slot '+(index+1)+'"><select aria-label="Ability in slot '+(index+1)+'">'+abilitySelectHtml(result.ability)+'</select><small>'+(result.ability?(result.confidence+'% match'):'Empty / unknown')+'</small>';
    var select=card.querySelector('select');select.onchange=function(){var ability=select.value;state.scan.results[index].ability=ability;card.classList.remove('uncertain');card.querySelector('small').textContent=ability?'Confirmed':'Empty / unknown';if(ability)learnIcon(ability,result.crop)};wrap.appendChild(card);if(result.ability)confidences.push(result.confidence);
  });
  var avg=confidences.length?Math.round(confidences.reduce(function(a,b){return a+b},0)/confidences.length):0;$('scanConfidence').textContent=confidences.length?(avg+'% average match'):'Manual confirmation needed';$('scanResultsCard').classList.remove('hidden');
}
function learnIcon(name,crop){
  var url=imageDataToUrl(crop);var list=state.learnedIcons[name]||[];if(typeof list==='string')list=[list];if(list.indexOf(url)===-1)list.unshift(url);state.learnedIcons[name]=list.slice(0,3);saveLearnedIcons();
  state.scan.templateRecords.unshift({name:name,data:crop,learned:true});
}
function sleep(ms){return new Promise(function(resolve){setTimeout(resolve,ms)})}
function findActionbarReader(imgRef,attempt){
  attempt=attempt||0;try{var reader=new Ability.ActionbarReader();if(reader.find(imgRef))return Promise.resolve(reader)}catch(e){if(attempt>=4)return Promise.reject(e)}
  if(attempt>=4)return Promise.resolve(null);return sleep(180).then(function(){return findActionbarReader(imgRef,attempt+1)});
}
function scanImageRef(imgRef,label){
  $('scannerStatus').textContent='Locating the main resource display and active action bar…';
  state.scan.abilityNames=allAbilityNames();
  return findActionbarReader(imgRef).then(function(reader){
    if(!reader||!reader.pos)throw new Error('The main health/adrenaline/prayer/summoning display was not found. Use a full RuneScape screenshot at 100% interface scaling.');
    if(reader.pos.layout.type!=='mainflat')throw new Error('This version scans the standard horizontal main action bar. Switch to the flat horizontal layout and try again.');
    var pos=reader.pos;var iconX=pos.x-3;var iconY=pos.y+27;var previewX=pos.x-6;var previewY=pos.y+25;
    var needed={x:iconX,y:iconY,width:(MAX_SLOTS-1)*SCAN_STEP+SCAN_ICON_SIZE,height:SCAN_ICON_SIZE};
    if(!imgRef.containsArea(needed))throw new Error('The active bar is cut off. Capture the complete main bar, including all 14 slots.');
    var preview=imgRef.toData(previewX,previewY,SCAN_BAR_WIDTH,36);drawScanPreview(preview);state.scan.preview=preview;state.scan.sourceRef=imgRef;
    state.scan.results=[];for(var i=0;i<MAX_SLOTS;i++){state.scan.results.push({ability:'',score:999,confidence:0,second:999,crop:imgRef.toData(iconX+i*SCAN_STEP,iconY,SCAN_ICON_SIZE,SCAN_ICON_SIZE)})}
    renderScanResults();
    $('scannerStatus').textContent='Active main bar found. Loading ability icon templates for matching…';
    return prepareScannerTemplates().then(function(){
      state.scan.results=state.scan.results.map(function(result){var matched=matchSlot(result.crop);matched.crop=result.crop;return matched});
      renderScanResults();$('scannerStatus').textContent='Scanned '+label+'. Only the active main bar beneath the four resource displays was read; '+MAX_SLOTS+' slots are preserved in order.';
      var uncertain=state.scan.results.filter(function(r){return r.ability&&r.confidence<45}).length;if(uncertain)$('scannerStatus').textContent+=' Review '+uncertain+' low-confidence match'+(uncertain===1?'':'es')+'.';
    });
  }).catch(function(error){$('scannerStatus').textContent=error.message;console.error(error)});
}
function scanAlt1(){
  if(!window.A1lib){$('scannerStatus').textContent='Alt1 libraries did not load.';return}
  if(!window.alt1&&!A1lib.hasAlt1){$('scannerStatus').textContent='Alt1 was not detected. Open the app inside Alt1 or upload/paste a screenshot.';return}
  var ref=null;try{ref=A1lib.captureHoldFullRs()}catch(e){console.error(e)}
  if(!ref){$('scannerStatus').textContent='Screen capture is unavailable. Grant Bar Storage permission to read RuneScape screen pixels, then try again.';return}
  scanImageRef(ref,'the live RuneScape window');
}
function imageFileToRef(file){
  return new Promise(function(resolve,reject){var img=new Image();var url=URL.createObjectURL(file);img.onload=function(){try{var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;var ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);var data=ctx.getImageData(0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(new A1lib.ImgRefData(data))}catch(e){reject(e)}};img.onerror=function(){URL.revokeObjectURL(url);reject(new Error('Could not open the screenshot.'))};img.src=url});
}
function scanFile(file){if(!file)return;imageFileToRef(file).then(function(ref){return scanImageRef(ref,file.name||'the screenshot')}).catch(function(e){$('scannerStatus').textContent=e.message})}
function pasteScreenshot(){
  if(navigator.clipboard&&navigator.clipboard.read){$('scannerStatus').textContent='Reading an image from the clipboard…';navigator.clipboard.read().then(function(items){for(var i=0;i<items.length;i++){for(var j=0;j<items[i].types.length;j++){if(items[i].types[j].indexOf('image/')===0)return items[i].getType(items[i].types[j]).then(scanFile)}}throw new Error('No image was found on the clipboard.')}).catch(function(){$('scannerStatus').textContent='Press Ctrl+V while Bar Storage is focused to paste a screenshot.'})}
  else $('scannerStatus').textContent='Press Ctrl+V while Bar Storage is focused to paste a screenshot.';
}
function handlePaste(event){
  var items=(event.clipboardData&&event.clipboardData.items)||[];for(var i=0;i<items.length;i++){if(items[i].type.indexOf('image/')===0){event.preventDefault();scanFile(items[i].getAsFile());return}}
}
function clearScan(){state.scan.results=[];state.scan.sourceRef=null;state.scan.preview=null;$('scanResultsCard').classList.add('hidden');$('scannerPreviewWrap').classList.add('hidden');$('scanSlotEditor').innerHTML='';$('scanFileInput').value='';$('scannerStatus').textContent='Open this tab in Alt1 and select Scan active bar, or paste/upload a RuneScape screenshot.'}
function saveScannedBar(){
  if(state.scan.results.length!==MAX_SLOTS){$('scannerStatus').textContent='Scan a complete active bar before saving.';return}
  var bar=normalizeBar({id:uid(),source:'user',name:$('scanPresetName').value.trim()||'Scanned Bar',category:'User',style:$('scanPresetStyle').value,mode:$('scanPresetMode').value,weapon:$('scanPresetWeapon').value,target:$('scanPresetTarget').value.trim()||'Custom',tags:['scanned'],abilities:state.scan.results.map(function(r){return r.ability||''}),requirements:[],notes:'Scanned from the active RuneScape main action bar. Slot order preserved.'});
  state.bars.push(bar);saveUserBars();populateFilters();state.filters.source='User';$('sourceFilter').value='User';renderList();setTab('library');
}

function init(){
  try{var saved=migrateSavedBars();state.bars=(window.SEED_BARS||[]).map(normalizeBar).concat(saved.map(normalizeBar));populateFilters();renderList()}
  catch(e){$('barList').innerHTML='<p class="warning">Bar Storage failed to load: '+esc(e.message)+'</p>';console.error(e)}
}
window.addEventListener('DOMContentLoaded',function(){
  Array.prototype.forEach.call(document.querySelectorAll('.tab'),function(tab){tab.onclick=function(){setTab(tab.getAttribute('data-tab'))}});
  $('searchInput').oninput=function(e){state.filters.q=e.target.value;renderList()};
  $('sourceFilter').onchange=function(e){state.filters.source=e.target.value;renderList()};
  ['categoryFilter','modeFilter','weaponFilter'].forEach(function(id){$(id).onchange=function(e){state.filters[id.replace('Filter','')]=e.target.value;renderList()}});
  $('styleFilter').onchange=function(e){state.filters.style=e.target.value;state.filters.weapon='all';refreshWeaponFilter();renderList()};
  $('presetStyle').onchange=function(){refreshEditorWeapons()};$('presetAbilities').oninput=checkAbilityCount;$('newPresetBtn').onclick=function(){openEditor(null)};
  $('cancelEdit').onclick=$('cancelEditBottom').onclick=function(){$('editorDialog').close()};
  $('editorForm').onsubmit=function(e){e.preventDefault();var id=$('presetId').value;var bar=formToBar(id);if(id)state.bars=state.bars.map(function(b){return b.id===id?bar:b});else state.bars.push(bar);saveUserBars();$('editorDialog').close();populateFilters();renderList()};
  $('exportBtn').onclick=exportBars;$('importInput').onchange=function(e){var file=e.target.files[0];if(file)importBars(file)};
  $('scanAlt1Btn').onclick=scanAlt1;$('scanFileInput').onchange=function(e){scanFile(e.target.files[0])};$('pasteHelpBtn').onclick=pasteScreenshot;$('clearScanBtn').onclick=clearScan;$('saveScanBtn').onclick=saveScannedBar;$('scanPresetStyle').onchange=function(){refreshScanWeapons()};document.addEventListener('paste',handlePaste);
  init();
});
})();
