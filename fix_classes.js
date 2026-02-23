const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/binding_blade/classes.json', 'utf8'));

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

let changed = false;
for (const cls of data) {
    if (magicClasses.has(cls.id) || magicClasses.has(cls.name.toLowerCase())) {
        if (cls.baseStats && cls.baseStats.str !== undefined) {
            cls.baseStats.mag = cls.baseStats.str;
            delete cls.baseStats.str;
            changed = true;
        }
        if (cls.promotionBonus && cls.promotionBonus.str !== undefined) {
            cls.promotionBonus.mag = cls.promotionBonus.str;
            delete cls.promotionBonus.str;
            changed = true;
        }
    }
}
if (changed) {
    fs.writeFileSync('data/binding_blade/classes.json', JSON.stringify(data, null, 4));
    console.log('Updated classes.json');
} else {
    console.log('No changes made');
}
