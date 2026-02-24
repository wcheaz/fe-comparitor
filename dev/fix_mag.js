const fs = require('fs');

const magicClasses = new Set([
  'mage', 'mage_m', 'mage_f',
  'sage', 'sage_m', 'sage_f',
  'priest', 'priest_m', 'priest_f',
  'cleric', 'cleric_f',
  'bishop', 'bishop_m', 'bishop_f',
  'troubadour', 'troubadour_f',
  'valkyrie', 'valkyrie_f',
  'shaman', 'shaman_m', 'shaman_f',
  'druid', 'druid_m', 'druid_f',
  'monk', 'monk_m',
  'archsage', 'dark_druid'
]);

function fixFile(filename) {
  if (!fs.existsSync(filename)) return;
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  let changed = false;
  for (const unit of data) {
    if (magicClasses.has(unit.class)) {
      if (unit.str !== undefined) {
        unit.mag = unit.str;
        delete unit.str;
        changed = true;
      }
      if (unit.growths && unit.growths.str !== undefined) {
        unit.growths.mag = unit.growths.str;
        delete unit.growths.str;
        changed = true;
      }
      if (unit.maxStats && unit.maxStats.str !== undefined) {
        unit.maxStats.mag = unit.maxStats.str;
        delete unit.maxStats.str;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    console.log(`Updated ${filename}`);
  }
}

fixFile('data/binding_blade/units.json');
fixFile('data/blazing_blade/units.json');

