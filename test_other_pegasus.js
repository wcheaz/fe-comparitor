const fs = require('fs');
const engageClasses = JSON.parse(fs.readFileSync('data/engage/classes.json', 'utf8'));
const thClasses = JSON.parse(fs.readFileSync('data/three_houses/classes.json', 'utf8'));
const peg1 = engageClasses.find(c => c.id === 'pegasus_knight');
const peg2 = thClasses.find(c => c.id === 'pegasus_knight');

if (peg1) {
    console.log('Engage Pegasus:', peg1.id, 'PromotesTo:', peg1.promotesTo);
    const promo = engageClasses.filter(c => peg1.promotesTo.includes(c.id));
    console.log('Promo Classes:', promo.map(p => ({ id: p.id, hpBonus: p.promotionBonus?.hp })));
}

if (peg2) {
    console.log('TH Pegasus:', peg2.id, 'PromotesTo:', peg2.promotesTo);
    const promo = thClasses.filter(c => peg2.promotesTo.includes(c.id));
    console.log('Promo Classes:', promo.map(p => ({ id: p.id, hpBonus: p.promotionBonus?.hp })));
}
