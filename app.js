const STORAGE_KEY = 'barStorage.presets.v2';
const MAX_SLOTS = 14;
const STYLE_WEAPONS = {
  Necromancy: ['Death guard + lantern', 'Death guard', 'Necromancy'],
  Magic: ['Dual wield magic', 'Staff', 'Wand + orb/book', 'Magic shield switch'],
  Ranged: ['Bow', 'Crossbows', 'Dual wield ranged', 'Thrown', 'Ranged shield switch'],
  Melee: ['2H melee', 'Dual wield melee', 'Scythe / halberd range', 'Sword and shield'],
  Hybrid: ['Hybrid', 'Style switch'],
  'Skilling/Utility': ['Utility', 'Defensives', 'Movement']
};
const state = { bars: [], filters: { q: '', category: 'all', style: 'all', mode: 'all', weapon: 'all' } };
const $ = id => document.getElementById(id);
const splitList = text => text.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
const uid = () => 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function load() {
  const saved = safeJson(localStorage.getItem(STORAGE_KEY), []);
  state.bars = [...window.SEED_BARS.map(normalizeBar), ...saved.map(normalizeBar)];
  populateFilters();
  renderList();
}
function safeJson(text, fallback) { try { return JSON.parse(text || ''); } catch { return fallback; } }
function normalizeBar(b) { return {...b, abilities: (b.abilities || []).slice(0, MAX_SLOTS)}; }
function saveUserBars() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bars.filter(b => b.source === 'user'))); }
function fillSelect(id, values, keep='all') {
  const el = $(id); const firstText = el.options[0]?.text || 'All'; el.innerHTML = ''; el.add(new Option(firstText, 'all'));
  [...new Set(values.filter(Boolean))].sort().forEach(v => el.add(new Option(v, v)));
  el.value = [...el.options].some(o => o.value === keep) ? keep : 'all';
}
function populateFilters() {
  fillSelect('categoryFilter', state.bars.map(b => b.category), state.filters.category);
  fillSelect('styleFilter', state.bars.map(b => b.style), state.filters.style);
  fillSelect('modeFilter', state.bars.map(b => b.mode), state.filters.mode);
  refreshWeaponFilter();
  fillBasic('presetCategory', ['Recommended','Boss','Slayer','User']);
  fillBasic('presetStyle', Object.keys(STYLE_WEAPONS));
  fillBasic('presetMode', ['Revolution','Revolution++','Full Manual','Hybrid Manual/Revo']);
  refreshEditorWeapons();
}
function fillBasic(id, values) { const el = $(id); el.innerHTML = ''; values.forEach(v => el.add(new Option(v, v))); }
function refreshWeaponFilter() {
  const style = state.filters.style;
  const allowed = style === 'all' ? state.bars.map(b => b.weapon) : state.bars.filter(b => b.style === style).map(b => b.weapon);
  fillSelect('weaponFilter', allowed, state.filters.weapon);
  state.filters.weapon = $('weaponFilter').value;
}
function refreshEditorWeapons(selected) {
  const style = $('presetStyle')?.value || 'Necromancy';
  const el = $('presetWeapon'); if (!el) return;
  el.innerHTML = '';
  (STYLE_WEAPONS[style] || []).forEach(w => el.add(new Option(w, w)));
  if (selected && [...el.options].some(o => o.value === selected)) el.value = selected;
}
function filteredBars() {
  const q = state.filters.q.toLowerCase();
  return state.bars.filter(b =>
    (!q || [b.name,b.category,b.style,b.mode,b.weapon,b.target,(b.tags||[]).join(' '),(b.abilities||[]).join(' ')].join(' ').toLowerCase().includes(q)) &&
    (state.filters.category === 'all' || b.category === state.filters.category) &&
    (state.filters.style === 'all' || b.style === state.filters.style) &&
    (state.filters.mode === 'all' || b.mode === state.filters.mode) &&
    (state.filters.weapon === 'all' || b.weapon === state.filters.weapon)
  );
}
function renderList() {
  const bars = filteredBars();
  $('resultCount').textContent = `${bars.length} shown`;
  const list = $('barList'); list.innerHTML = '';
  if (!bars.length) { list.innerHTML = '<p class="muted">No bars match your filters.</p>'; return; }
  bars.forEach(b => {
    const row = document.createElement('article'); row.className = 'bar-card';
    row.innerHTML = `
      <div class="name-tag">
        <strong>${esc(b.name)}</strong>
        <span>${esc(b.style)} • ${esc(b.mode)} • ${esc(b.weapon)}</span>
      </div>
      <div class="action-bar">${renderSlots(b)}</div>
      <div class="row-actions">
        ${b.source === 'user' ? '<button data-action="edit">Edit</button><button data-action="delete" class="danger">Delete</button>' : '<button data-action="duplicate">Duplicate</button>'}
        <button data-action="view" class="secondary">Details</button>
      </div>`;
    row.querySelector('[data-action="view"]').onclick = () => openDetail(b);
    row.querySelector('[data-action="duplicate"]')?.addEventListener('click', () => openEditor({...b, id:'', name:b.name + ' Copy', source:'user'}));
    row.querySelector('[data-action="edit"]')?.addEventListener('click', () => openEditor(b));
    row.querySelector('[data-action="delete"]')?.addEventListener('click', () => deleteBar(b.id));
    list.append(row);
  });
}
function renderSlots(b) {
  const slots = [...(b.abilities || []).slice(0, MAX_SLOTS)];
  while (slots.length < MAX_SLOTS) slots.push('');
  return slots.map((a,i) => `<div class="slot" title="${esc(a || 'Empty slot')}"><b>${i+1}</b><span>${esc(shortAbility(a))}</span></div>`).join('');
}
function shortAbility(a) { return !a ? '' : a.split(/\s+/).map(w => w[0]).join('').slice(0,4).toUpperCase(); }
function openDetail(b) {
  $('detailPanel').innerHTML = `
    <button class="close" onclick="document.getElementById('detailDialog').close()">×</button>
    <h2>${esc(b.name)}</h2>
    <p class="muted">${esc(b.category)} • ${esc(b.style)} • ${esc(b.mode)} • ${esc(b.weapon)} • ${esc(b.target)}</p>
    ${b.sourceName ? `<p class="source-line">Source: ${b.sourceUrl ? `<a href="${esc(b.sourceUrl)}" target="_blank" rel="noopener">${esc(b.sourceName)}</a>` : esc(b.sourceName)}</p>` : ''}
    <div class="action-bar large">${renderSlots(b)}</div>
    <h3>Abilities</h3><ol>${(b.abilities||[]).map(a => `<li>${esc(a)}</li>`).join('')}</ol>
    <h3>Unlock requirements</h3><ul>${(b.requirements||[]).map(r => `<li>${esc(r)}</li>`).join('') || '<li>No special unlocks listed.</li>'}</ul>
    <h3>Notes</h3><p>${esc(b.notes || 'No notes.')}</p>`;
  $('detailDialog').showModal();
}
function openEditor(bar) {
  $('editorTitle').textContent = bar?.id ? 'Edit bar' : 'New bar';
  $('presetId').value = bar?.id || '';
  $('presetName').value = bar?.name || '';
  $('presetCategory').value = bar?.category || 'User';
  $('presetStyle').value = bar?.style || 'Necromancy';
  refreshEditorWeapons(bar?.weapon);
  $('presetMode').value = bar?.mode || 'Revolution';
  $('presetTarget').value = bar?.target || '';
  $('presetTags').value = (bar?.tags || []).join(', ');
  $('presetAbilities').value = (bar?.abilities || []).slice(0, MAX_SLOTS).join('\n');
  $('presetRequirements').value = (bar?.requirements || []).join('\n');
  $('presetNotes').value = bar?.notes || '';
  checkAbilityCount();
  $('editorDialog').showModal();
}
function formToBar(existingId) {
  return normalizeBar({ id: existingId || uid(), source: 'user', name: $('presetName').value.trim(), category: $('presetCategory').value, style: $('presetStyle').value, mode: $('presetMode').value, weapon: $('presetWeapon').value, target: $('presetTarget').value.trim() || 'Custom', tags: splitList($('presetTags').value), abilities: splitList($('presetAbilities').value), requirements: splitList($('presetRequirements').value), notes: $('presetNotes').value.trim() });
}
function deleteBar(id) { state.bars = state.bars.filter(b => b.id !== id); saveUserBars(); populateFilters(); renderList(); }
function checkAbilityCount() { $('abilityWarning').classList.toggle('hidden', splitList($('presetAbilities').value).length <= MAX_SLOTS); }

$('searchInput').oninput = e => { state.filters.q = e.target.value; renderList(); };
['categoryFilter','modeFilter','weaponFilter'].forEach(id => $(id).onchange = e => { state.filters[id.replace('Filter','')] = e.target.value; renderList(); });
$('styleFilter').onchange = e => { state.filters.style = e.target.value; state.filters.weapon = 'all'; refreshWeaponFilter(); renderList(); };
$('presetStyle').onchange = () => refreshEditorWeapons();
$('presetAbilities').oninput = checkAbilityCount;
$('newPresetBtn').onclick = () => openEditor(null);
$('editorForm').onsubmit = e => { e.preventDefault(); const id = $('presetId').value; const bar = formToBar(id); if (id) state.bars = state.bars.map(b => b.id === id ? bar : b); else state.bars.push(bar); saveUserBars(); $('editorDialog').close(); populateFilters(); renderList(); };
$('exportBtn').onclick = () => { const blob = new Blob([JSON.stringify(state.bars.filter(b => b.source === 'user'), null, 2)], {type:'application/json'}); const a = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download:'bar-storage-presets.json'}); a.click(); URL.revokeObjectURL(a.href); };
$('importInput').onchange = async e => { const file = e.target.files[0]; if (!file) return; const imported = safeJson(await file.text(), []).map(b => normalizeBar({...b, id: uid(), source:'user'})); state.bars.push(...imported); saveUserBars(); populateFilters(); renderList(); e.target.value = ''; };
load();
