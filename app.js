(function () {
'use strict';

var STORAGE_KEY = 'barStorage.presets.v5';
var MAX_SLOTS = 14;
var STYLE_WEAPONS = {
  'Melee':['Any melee','Dual wield melee','2H melee','Scythe / halberd range','Spear','Sword + shield'],
  'Magic':['Any magic','Dual wield magic','Staff','Wand + orb/book','Wand + shield'],
  'Ranged':['Any ranged','Bow','Crossbows','2H crossbow','Thrown','Crossbow + shield'],
  'Necromancy':['Death guard + lantern','Death guard + shield'],
  'Hybrid':['Any compatible weapons','Melee + ranged switch','Melee + magic switch','Ranged + magic switch','Tri-style switches'],
  'Skilling/Utility':['Utility bar']
};
var ABILITY_ICON_OVERRIDES = {"Assault":"https://cdn.discordapp.com/emojis/535532855191928842.png","Hurricane":"https://cdn.discordapp.com/emojis/535532878969438210.png","Dismember":"https://img.pvme.io/images/qPRMFCsp23.webp","Overpower":"https://cdn.discordapp.com/emojis/535532879334080517.png","Berserk":"https://cdn.discordapp.com/emojis/535532854004678657.png","Meteor Strike":"https://img.pvme.io/images/81HMxObool.webp","Greater Barge":"https://cdn.discordapp.com/emojis/535532879250456578.png","Greater Fury":"https://cdn.discordapp.com/emojis/535532879334080527.png","Piercing Shot":"https://img.pvme.io/images/y8dBjmQZSJ.webp","Binding Shot":"https://cdn.discordapp.com/emojis/535541306563231790.png","Ricochet":"https://img.pvme.io/images/hQduTi7o4o.webp","Greater Ricochet":"https://cdn.discordapp.com/emojis/787904334812807238.png","Snapshot":"https://img.pvme.io/images/WHTscLhdbk.webp","Snipe":"https://img.pvme.io/images/ouNQwWo9MM.webp","Bombardment":"https://cdn.discordapp.com/emojis/535541306391265284.png","Rapid Fire":"https://cdn.discordapp.com/emojis/535541270521708566.png","Corruption Shot":"https://cdn.discordapp.com/emojis/535541306294796299.png","Death's Swiftness":"https://img.pvme.io/images/M35wETJU2P.webp","Escape":"https://cdn.discordapp.com/emojis/535541258832052231.png","Sonic Wave":"https://img.pvme.io/images/Ct4XTMUwZZ.webp","Dragon Breath":"https://cdn.discordapp.com/emojis/535533833391702017.png","Impact":"https://cdn.discordapp.com/emojis/535533809655873556.png","Combust":"https://img.pvme.io/images/W5h1lGupxA.webp","Chain":"https://img.pvme.io/images/82PXXSsEWB.webp","Greater Concentrated Blast":"https://img.pvme.io/images/vQl3485ZuQ.webp","Wild Magic":"https://cdn.discordapp.com/emojis/535533809978966037.png","Asphyxiate":"https://cdn.discordapp.com/emojis/535533833072672778.png","Corruption Blast":"https://img.pvme.io/images/JkOw1LoeZj.webp","Omnipower":"https://cdn.discordapp.com/emojis/535533809664262179.png","Sunshine":"https://cdn.discordapp.com/emojis/994921119381463070.png","Tsunami":"https://cdn.discordapp.com/emojis/535533809995874304.png","Surge":"https://cdn.discordapp.com/emojis/799457167182659586.png","Necromancy Auto Attack":"https://cdn.discordapp.com/emojis/1137809137401602109.png","Conjure Skeleton Warrior":"https://cdn.discordapp.com/emojis/1159434516658651147.png","Finger of Death":"https://cdn.discordapp.com/emojis/1159434801938432010.png","Touch of Death":"https://cdn.discordapp.com/emojis/1137809175980810380.png","Death Skulls":"https://cdn.discordapp.com/emojis/1159434663903899728.png","Conjure Putrid Zombie":"https://cdn.discordapp.com/emojis/1137809200219684924.png","Conjure Vengeful Ghost":"https://cdn.discordapp.com/emojis/1137809206423060632.png","Bloat":"https://cdn.discordapp.com/emojis/1159433682403201044.png","Soul Sap":"https://cdn.discordapp.com/emojis/1137809140476031057.png","Spectral Scythe":"https://cdn.discordapp.com/emojis/1137809145706319892.png","Volley of Souls":"https://cdn.discordapp.com/emojis/1159435029592686642.png","Living Death":"https://cdn.discordapp.com/emojis/1159434908486357072.png","Devotion":"https://cdn.discordapp.com/emojis/513190158728953857.png","Anticipation":"https://cdn.discordapp.com/emojis/535541306475151390.png","Freedom":"https://cdn.discordapp.com/emojis/535541258240786434.png","Reflect":"https://cdn.discordapp.com/emojis/535541258786177064.png","Resonance":"https://cdn.discordapp.com/emojis/535541258844635148.png","Debilitate":"https://cdn.discordapp.com/emojis/535541278264393729.png","Weapon Special Attack":"https://cdn.discordapp.com/emojis/537340400273195028.png"};
var state = {bars:[],filters:{q:'',category:'all',style:'all',mode:'all',weapon:'all'}};

function $(id){return document.getElementById(id)}
function safeJson(text,fallback){try{return JSON.parse(text)||fallback}catch(e){return fallback}}
function esc(value){return String(value == null ? '' : value).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
function splitList(text){return String(text||'').split(/[\n,]/).map(function(s){return s.trim()}).filter(Boolean)}
function uid(){return 'user-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function normalizeBar(bar){
  bar=bar||{};
  return Object.assign({},bar,{abilities:(bar.abilities||[]).slice(0,MAX_SLOTS),tags:bar.tags||[],requirements:bar.requirements||[],source:bar.source||'user'});
}
function saveUserBars(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.bars.filter(function(b){return b.source==='user'})))}
function dedupe(values){var seen={};return values.filter(Boolean).filter(function(v){if(seen[v])return false;seen[v]=true;return true})}
function unique(values){return dedupe(values).sort()}
function fillFilter(id,values,keep,label){var el=$(id);el.innerHTML='';el.add(new Option(label,'all'));unique(values).forEach(function(v){el.add(new Option(v,v))});el.value=Array.prototype.some.call(el.options,function(o){return o.value===keep})?keep:'all'}
function fillBasic(id,values){var el=$(id);el.innerHTML='';values.forEach(function(v){el.add(new Option(v,v))})}
function refreshWeaponFilter(){
  var bars=state.filters.style==='all'?state.bars:state.bars.filter(function(b){return b.style===state.filters.style});
  fillFilter('weaponFilter',bars.map(function(b){return b.weapon}),state.filters.weapon,'All weapons');
  state.filters.weapon=$('weaponFilter').value;
}
function refreshEditorWeapons(selected){
  var style=$('presetStyle').value||'Necromancy';var el=$('presetWeapon');el.innerHTML='';
  (STYLE_WEAPONS[style]||['Custom']).forEach(function(w){el.add(new Option(w,w))});
  if(selected && !Array.prototype.some.call(el.options,function(o){return o.value===selected})){el.add(new Option(selected,selected))}
  if(selected)el.value=selected;
}
function populateFilters(){
  fillFilter('categoryFilter',state.bars.map(function(b){return b.category}),state.filters.category,'All categories');
  fillFilter('styleFilter',state.bars.map(function(b){return b.style}),state.filters.style,'All styles');
  fillFilter('modeFilter',state.bars.map(function(b){return b.mode}),state.filters.mode,'All modes');
  refreshWeaponFilter();
  fillBasic('presetCategory',['Recommended','Boss','Slayer','User']);
  fillBasic('presetStyle',Object.keys(STYLE_WEAPONS));
  fillBasic('presetMode',['Revolution','Revolution++','Full Manual','Hybrid Manual/Revo']);
  refreshEditorWeapons();
}
function filteredBars(){
  var q=state.filters.q.toLowerCase();
  return state.bars.filter(function(b){
    var hay=[b.name,b.category,b.style,b.mode,b.weapon,b.target,(b.tags||[]).join(' '),(b.abilities||[]).join(' ')].join(' ').toLowerCase();
    return (!q||hay.indexOf(q)>-1) &&
      (state.filters.category==='all'||b.category===state.filters.category) &&
      (state.filters.style==='all'||b.style===state.filters.style) &&
      (state.filters.mode==='all'||b.mode===state.filters.mode) &&
      (state.filters.weapon==='all'||b.weapon===state.filters.weapon);
  });
}
function wikiFileName(name){
  var aliases={'Necromancy Auto Attack':'Necromancy','Area Loot':'Area loot'};
  return (aliases[name]||name).replace(/ /g,'_');
}
function iconCandidates(name){
  if(!name)return [];
  var file=wikiFileName(name)+'.png';
  var values=[];
  if(ABILITY_ICON_OVERRIDES[name])values.push(ABILITY_ICON_OVERRIDES[name]);
  values.push('https://runescape.wiki/images/'+encodeURIComponent(file).replace(/%2F/g,'/'));
  values.push('https://runescape.wiki/w/Special:Redirect/file/'+encodeURIComponent(file));
  return dedupe(values);
}
function fallbackIcon(name,style){
  var initials=String(name||'?').split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,3).toUpperCase();
  var colors={'Melee':['#7d251f','#e76c5c'],'Magic':['#244d83','#67aaf9'],'Ranged':['#41611c','#9ed15c'],'Necromancy':['#39264f','#af78df'],'Hybrid':['#62491d','#d9b15f'],'Skilling/Utility':['#355965','#79c6d9']};
  var c=colors[style]||['#3b4655','#aeb8c7'];
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="'+c[1]+'"/><stop offset="1" stop-color="'+c[0]+'"/></linearGradient></defs><rect width="40" height="40" rx="4" fill="#10151d"/><rect x="2" y="2" width="36" height="36" rx="3" fill="url(#g)" stroke="#d6dce5" stroke-opacity=".35"/><path d="M5 31L20 7l15 24" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="3"/><text x="20" y="24" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="white" stroke="#000" stroke-width="1.3" paint-order="stroke">'+initials+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function hydrateIcons(root){
  Array.prototype.forEach.call(root.querySelectorAll('img.ability-icon'),function(img){
    var ability=img.getAttribute('data-ability')||'';var style=img.getAttribute('data-style')||'';var sources=iconCandidates(ability);var index=0;
    function next(){
      if(index<sources.length){img.src=sources[index++];return}
      img.onerror=null;img.src=fallbackIcon(ability,style);img.classList.add('fallback-icon');
    }
    img.onerror=next;next();
  });
}
function renderSlots(bar){
  var slots=(bar.abilities||[]).slice(0,MAX_SLOTS);while(slots.length<MAX_SLOTS)slots.push('');
  return slots.map(function(a,i){
    return '<div class="slot'+(a?' filled':'')+'" title="'+esc(a||'Empty slot')+'"><span class="slot-number">'+(i+1)+'</span>'+
      (a?'<img class="ability-icon" data-ability="'+esc(a)+'" data-style="'+esc(bar.style)+'" alt=""><span class="sr-only">'+esc(a)+'</span>':'')+'</div>';
  }).join('');
}
function renderList(){
  var bars=filteredBars();$('resultCount').textContent=bars.length+' shown';var list=$('barList');list.innerHTML='';
  if(!bars.length){list.innerHTML='<p class="muted">No bars match your filters.</p>';return}
  bars.forEach(function(b){
    var row=document.createElement('article');row.className='bar-card';
    row.innerHTML='<div class="name-tag"><strong>'+esc(b.name)+'</strong><span>'+esc(b.style)+' • '+esc(b.mode)+' • '+esc(b.weapon)+'</span></div>'+
      '<div class="action-wrap"><div class="action-bar">'+renderSlots(b)+'</div></div>'+
      '<div class="row-actions">'+(b.source==='user'?'<button data-action="edit">Edit</button><button data-action="delete" class="danger">Delete</button>':'<button data-action="duplicate">Duplicate</button>')+'<button data-action="view" class="secondary">Details</button></div>';
    hydrateIcons(row);
    row.querySelector('[data-action="view"]').onclick=function(){openDetail(b)};
    var duplicate=row.querySelector('[data-action="duplicate"]');if(duplicate)duplicate.onclick=function(){var copy=JSON.parse(JSON.stringify(b));copy.id='';copy.name=b.name+' Copy';copy.source='user';openEditor(copy)};
    var edit=row.querySelector('[data-action="edit"]');if(edit)edit.onclick=function(){openEditor(b)};
    var remove=row.querySelector('[data-action="delete"]');if(remove)remove.onclick=function(){deleteBar(b.id)};
    list.appendChild(row);
  });
}
function openDetail(b){
  var panel=$('detailPanel');
  panel.innerHTML='<button type="button" class="detail-close icon-button secondary" aria-label="Close">×</button><h2>'+esc(b.name)+'</h2><p class="detail-meta">'+esc(b.category)+' • '+esc(b.style)+' • '+esc(b.mode)+' • '+esc(b.weapon)+' • '+esc(b.target)+'</p>'+
    (b.sourceName?'<p class="source-line">Source: '+(b.sourceUrl?'<a href="'+esc(b.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(b.sourceName)+'</a>':esc(b.sourceName))+'</p>':'')+
    '<div class="action-wrap detail-bar"><div class="action-bar">'+renderSlots(b)+'</div></div><div class="detail-columns"><section><h3>Abilities</h3><ol class="ability-list">'+(b.abilities||[]).map(function(a){return '<li>'+esc(a)+'</li>'}).join('')+'</ol></section><section><h3>Unlock requirements</h3><ul>'+((b.requirements||[]).length?(b.requirements||[]).map(function(r){return '<li>'+esc(r)+'</li>'}).join(''):'<li>No special unlocks listed.</li>')+'</ul><h3>Notes</h3><p>'+esc(b.notes||'No notes.')+'</p></section></div>';
  panel.querySelector('.detail-close').onclick=function(){$('detailDialog').close()};hydrateIcons(panel);$('detailDialog').showModal();
}
function openEditor(bar){
  bar=bar||{};$('editorTitle').textContent=bar.id?'Edit bar':'New bar';$('presetId').value=bar.id||'';$('presetName').value=bar.name||'';$('presetCategory').value=bar.category||'User';$('presetStyle').value=bar.style||'Necromancy';refreshEditorWeapons(bar.weapon);$('presetMode').value=bar.mode||'Revolution';$('presetTarget').value=bar.target||'';$('presetTags').value=(bar.tags||[]).join(', ');$('presetAbilities').value=(bar.abilities||[]).slice(0,MAX_SLOTS).join('\n');$('presetRequirements').value=(bar.requirements||[]).join('\n');$('presetNotes').value=bar.notes||'';checkAbilityCount();$('editorDialog').showModal();
}
function formToBar(id){return normalizeBar({id:id||uid(),source:'user',name:$('presetName').value.trim(),category:$('presetCategory').value,style:$('presetStyle').value,mode:$('presetMode').value,weapon:$('presetWeapon').value,target:$('presetTarget').value.trim()||'Custom',tags:splitList($('presetTags').value),abilities:splitList($('presetAbilities').value),requirements:splitList($('presetRequirements').value),notes:$('presetNotes').value.trim()})}
function deleteBar(id){if(!confirm('Delete this saved bar?'))return;state.bars=state.bars.filter(function(b){return b.id!==id});saveUserBars();populateFilters();renderList()}
function checkAbilityCount(){$('abilityWarning').classList.toggle('hidden',splitList($('presetAbilities').value).length<=MAX_SLOTS)}
function exportBars(){var payload={app:'Bar Storage',version:1,presets:state.bars.filter(function(b){return b.source==='user'})};var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bar-storage-presets.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}
function importBars(file){var reader=new FileReader();reader.onload=function(){var parsed=safeJson(reader.result,[]);var items=Array.isArray(parsed)?parsed:(parsed.presets||[]);var imported=items.map(function(b){return normalizeBar(Object.assign({},b,{id:uid(),source:'user'}))});state.bars=state.bars.concat(imported);saveUserBars();populateFilters();renderList();$('importInput').value=''};reader.readAsText(file)}
function init(){
  try{var saved=safeJson(localStorage.getItem(STORAGE_KEY),[]);state.bars=(window.SEED_BARS||[]).map(normalizeBar).concat(saved.map(normalizeBar));populateFilters();renderList()}
  catch(e){$('barList').innerHTML='<p class="warning">Bar Storage failed to load: '+esc(e.message)+'</p>';console.error(e)}
}
window.addEventListener('DOMContentLoaded',function(){
  $('searchInput').oninput=function(e){state.filters.q=e.target.value;renderList()};
  ['categoryFilter','modeFilter','weaponFilter'].forEach(function(id){$(id).onchange=function(e){state.filters[id.replace('Filter','')]=e.target.value;renderList()}});
  $('styleFilter').onchange=function(e){state.filters.style=e.target.value;state.filters.weapon='all';refreshWeaponFilter();renderList()};
  $('presetStyle').onchange=function(){refreshEditorWeapons()};$('presetAbilities').oninput=checkAbilityCount;$('newPresetBtn').onclick=function(){openEditor(null)};
  $('cancelEdit').onclick=$('cancelEditBottom').onclick=function(){$('editorDialog').close()};
  $('editorForm').onsubmit=function(e){e.preventDefault();var id=$('presetId').value;var bar=formToBar(id);if(id)state.bars=state.bars.map(function(b){return b.id===id?bar:b});else state.bars.push(bar);saveUserBars();$('editorDialog').close();populateFilters();renderList()};
  $('exportBtn').onclick=exportBars;$('importInput').onchange=function(e){var file=e.target.files[0];if(file)importBars(file)};init();
});
})();
