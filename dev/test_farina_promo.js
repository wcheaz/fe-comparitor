const { generateProgressionArray } = require('./lib/stats');
const fs = require('fs');

const fe7classes = JSON.parse(fs.readFileSync('data/blazing_blade/classes.json', 'utf8'));
const fe7units = JSON.parse(fs.readFileSync('data/blazing_blade/units.json', 'utf8'));

const farina = fe7units.find(u => u.name === 'Farina');
console.log('Farina:', farina);

const farinaBaseClass = fe7classes.find(c => c.id === 'pegasus_knight' && c.game === 'blazing_blade');
const falcoknight = fe7classes.find(c => c.id === 'falcoknight' && c.game === 'blazing_blade');

console.log('Pegasus Knight:', farinaBaseClass);
console.log('Falcoknight:', falcoknight);

const prog = generateProgressionArray(farina, 1, 40, fe7classes, [{level: 20, selectedClassId: 'falcoknight'}]);

console.log('Row 20 (Level 20 pre promo):', prog.find(r => r.internalLevel === 20 && r.displayLevel === 'Level 20'));
console.log('Row 21 (Level 1 Tier 2 post promo):', prog.find(r => r.internalLevel === 21));

