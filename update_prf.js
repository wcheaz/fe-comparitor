const fs = require('fs');
const filepath = './data/binding_blade_units.json';
const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

data.forEach(unit => {
    if (unit.id === 'roy') {
        unit.prf = ['Rapier', 'Sword of Seals'];
    } else if (unit.id === 'fae') {
        unit.prf = ['Divinestone'];
    } else {
        unit.prf = [];
    }
});

fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
console.log('Updated', filepath);
