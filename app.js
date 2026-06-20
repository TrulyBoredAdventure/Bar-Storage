const STORAGE_KEY = 'abilityBarReference.presets.v1';
const state = { bars: [], selectedId: null, filters: { q: '', category: 'all', style: 'all', mode: 'all', weapon: 'all' } };
const $ = id => document.getElementById(id);
const splitList = text => text.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
const uid = () => 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);

function load() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  state.bars = [...window.SEED_BARS, ...saved];
  state.selectedId = state.bars[0]?.id || null;
  populateFilters(); renderList(); renderDetail();
}
function saveUserBars() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bars.filter(b => b.source === 'user')));
}
function populateFilters() {
  const fill = (id, values) => { const el = $(id); const first = el.options[0]; el.innerHTML = ''; el.append(first); [...new Set(values)].sort().forEach(v => el.add(new Option(v, v))); };
  fill('categoryFilter', state.bars.map(b => b.category)); fill('styleFilter', state.bars.map(b => b.style)); fill('modeFilter', state.bars.map(b => b.mode)); fill('weaponFilter', state.bars.map(b => b.weapon));
  ['Recommended','Boss','Slayer','User'].forEach(v => $('presetCategory').add(new Option(v, v)));
  ['Necromancy','Magic','Ranged','Melee','Hybrid','Skilling/Utility'].forEach(v => $('presetStyle').add(new Option(v, v)));
  ['Revolution','Revolution++','Full Manual','Hybrid Manual/Revo'].forEach(v => $('presetMode').add(new Option(v, v)));
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
  const list = $('barList'); list.innerHTML = '';
  filteredBars().forEach(b => {
    const row = document.createElement('button'); row.className = 'bar-row' + (b.id === state.selectedId ? ' active' : '');
    row.innerHTML = `<strong>${escapeHtml(b.name)}</strong><span>${escapeHtml(b.category)} • ${escapeHtml(b.style)} • ${escapeHtml(b.mode)}</span>`;
    row.onclick = () => { state.selectedId = b.id; renderList(); renderDetail(); };
    list.append(row);
  });
  if (!list.children.length) list.innerHTML = '<p class="muted">No bars match your filters.</p>';
}
function renderDetail() {
  const b = state.bars.find(x => x.id === state.selectedId);
  $('emptyState').classList.toggle('hidden', !!b); $('detailPanel').classList.toggle('hidden', !b); if (!b) return;
  $('detailType').textContent = b.source === 'user' ? 'User preset' : b.category + ' reference';
  $('detailName').textContent = b.name; $('detailSubtitle').textContent = `${b.style} • ${b.mode} • ${b.weapon} • ${b.target}`;
  $('tags').innerHTML = (b.tags||[]).map(t => `<span>${escapeHtml(t)}</span>`).join('');
  $('abilityGrid').innerHTML = (b.abilities||[]).map((a,i) => `<div class="slot"><b>${i+1}</b><span>${escapeHtml(a)}</span></div>`).join('');
  $('requirements').innerHTML = (b.requirements||[]).map(r => `<li>${escapeHtml(r)}</li>`).join('') || '<li>No special unlocks listed.</li>';
  $('notes').textContent = b.notes || 'No notes.'; $('deleteBtn').classList.toggle('hidden', b.source !== 'user');
}
function openEditor(bar) {
  $('editorTitle').textContent = bar ? 'Edit preset' : 'New preset'; $('presetId').value = bar?.id || '';
  $('presetName').value = bar?.name || ''; $('presetCategory').value = bar?.category || 'User'; $('presetStyle').value = bar?.style || 'Necromancy'; $('presetMode').value = bar?.mode || 'Revolution';
  $('presetWeapon').value = bar?.weapon || ''; $('presetTarget').value = bar?.target || ''; $('presetTags').value = (bar?.tags || []).join(', ');
  $('presetAbilities').value = (bar?.abilities || []).join('\n'); $('presetRequirements').value = (bar?.requirements || []).join('\n'); $('presetNotes').value = bar?.notes || '';
  $('editorDialog').showModal();
}
function formToBar(existingId) { return { id: existingId || uid(), source: 'user', name: $('presetName').value.trim(), category: $('presetCategory').value, style: $('presetStyle').value, mode: $('presetMode').value, weapon: $('presetWeapon').value.trim() || 'Custom', target: $('presetTarget').value.trim() || 'Custom', tags: splitList($('presetTags').value), abilities: splitList($('presetAbilities').value), requirements: splitList($('presetRequirements').value), notes: $('presetNotes').value.trim() }; }
function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

$('searchInput').oninput = e => { state.filters.q = e.target.value; renderList(); };
['categoryFilter','styleFilter','modeFilter','weaponFilter'].forEach(id => $(id).onchange = e => { state.filters[id.replace('Filter','')] = e.target.value; renderList(); });
$('newPresetBtn').onclick = () => openEditor(null);
$('editBtn').onclick = () => { const b = state.bars.find(x => x.id === state.selectedId); openEditor(b.source === 'user' ? b : {...b, id: ''}); };
$('duplicateBtn').onclick = () => { const b = state.bars.find(x => x.id === state.selectedId); openEditor({...b, id: '', name: b.name + ' Copy'}); };
$('deleteBtn').onclick = () => { state.bars = state.bars.filter(b => b.id !== state.selectedId); saveUserBars(); state.selectedId = state.bars[0]?.id || null; populateFilters(); renderList(); renderDetail(); };
$('editorForm').onsubmit = e => { e.preventDefault(); const id = $('presetId').value; const bar = formToBar(id); if (id) state.bars = state.bars.map(b => b.id === id ? bar : b); else state.bars.push(bar); saveUserBars(); state.selectedId = bar.id; $('editorDialog').close(); populateFilters(); renderList(); renderDetail(); };
$('exportBtn').onclick = () => { const blob = new Blob([JSON.stringify(state.bars.filter(b => b.source === 'user'), null, 2)], {type:'application/json'}); const a = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download:'ability-bar-presets.json'}); a.click(); URL.revokeObjectURL(a.href); };
$('importInput').onchange = async e => { const file = e.target.files[0]; if (!file) return; const imported = JSON.parse(await file.text()).map(b => ({...b, id: uid(), source:'user'})); state.bars.push(...imported); saveUserBars(); populateFilters(); renderList(); };
load();
