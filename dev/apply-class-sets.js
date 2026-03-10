const fs = require('fs');

const classSetsText = fs.readFileSync('/tmp/class_sets.txt', 'utf8');
const unitsJson = JSON.parse(fs.readFileSync('data/awakening/units.json', 'utf8'));

const lines = classSetsText.split('\n');
const charClassMap = {};

for (const line of lines) {
  if (!line || line.startsWith('---') || line.startsWith('Character')) continue;
  const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
  if (parts.length < 2) continue;
  
  let name = parts[0];
  // sanitize name e.g. Lon&#8217;qu -> Lonqu
  name = name.replace(/&#8217;/g, '');
  
  const options = parts.slice(1);
  if (options[0] === 'Class varies' || options[0] === 'Initial class' || options[0] === 'Options') continue;
  if (name === 'Avatar') continue; // Handled Robin
  
  const mappedOptions = options.map(opt => opt.toLowerCase().replace(/ /g, '_'));
  
  charClassMap[name.toLowerCase()] = mappedOptions;
}

// Special case for Robin
charClassMap['robin'] = ['tactician', 'cavalier', 'knight', 'myrmidon', 'mercenary', 'fighter', 'barbarian', 'archer', 'thief', 'pegasus_knight', 'wyvern_rider', 'mage', 'dark_mage', 'priest', 'cleric', 'troubadour'];

let modified = 0;
for (const unit of unitsJson) {
  let lookupName = unit.name.toLowerCase();
  
  let options = charClassMap[lookupName];
  if (options) {
    // Filter out invalid classes for gender
    if (unit.gender === 'M') {
      options = options.filter(c => c !== 'pegasus_knight' && c !== 'troubadour' && c !== 'cleric');
      // If cleric is in original options and they are male, replace with priest
      if (charClassMap[lookupName].includes('cleric') && !options.includes('priest')) options.push('priest');
    } else if (unit.gender === 'F') {
      options = options.filter(c => c !== 'fighter' && c !== 'barbarian' && c !== 'priest');
      // If priest is in original options and they are female, replace with cleric
      if (charClassMap[lookupName].includes('priest') && !options.includes('cleric')) options.push('cleric');
    }

    unit.reclassOptions = [...new Set(options)];
    modified++;
  }
}

fs.writeFileSync('data/awakening/units.json', JSON.stringify(unitsJson, null, 2));
console.log(`Updated ${modified} units with reclassOptions.`);
