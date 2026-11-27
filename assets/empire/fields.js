export const LIMIT = 40;

function integer(value, name, maximum = 99999) {
  if (value == null || String(value).trim() === '' || !/^\d+$/.test(String(value))) {
    throw Error('Enter a whole number for ' + name + '.');
  }
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n > maximum) throw Error(name + ' exceeds ' + maximum + '.');
  return n;
}

export function project(rows, {bonus, universeState, terraformState}) {
  if (!rows.length || rows.length > LIMIT) throw Error('Include 1–40 visible colonies.');
  if (!['before','included','unknown'].includes(universeState) || !['before','included','omit'].includes(terraformState)) {
    throw Error('Choose which changes the screenshot already includes.');
  }
  const universeGain = universeState === 'unknown' ? null : universeState === 'included' ? 0 : 70 - integer(bonus, 'previous universe field bonus', 70);
  const results = rows.map((r, index) => {
    const slot = 'colony ' + (index + 1);
    const name = String(r.name || '').trim().slice(0,64) || 'Colony ' + (index + 1);
    const used = integer(r.used, slot + ' fields used');
    const capacity = integer(r.capacity, slot + ' capacity');
    const terraGain = terraformState === 'before' ? integer(r.level, slot + ' Terraformer level', 100) : 0;
    const projected = universeGain === null ? null : capacity + universeGain + terraGain;
    return {name, free:capacity-used, projected, freeAfter:projected===null?null:projected-used, gain:projected===null?null:projected-capacity, terraGain};
  });
  return {rows:results, universeGain, terraformState, total:results.reduce((s,r)=>({
    free:s.free+r.free, projected:universeGain===null?null:s.projected+r.projected, freeAfter:universeGain===null?null:s.freeAfter+r.freeAfter, gain:universeGain===null?null:s.gain+r.gain
  }), {free:0, projected:0, freeAfter:0, gain:0})};
}
