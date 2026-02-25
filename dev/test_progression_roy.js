import fs from 'fs';
// Manual implementation check
import classes from './data/binding_blade/classes.json' assert { type: "json" };
import units from './data/binding_blade/units.json' assert { type: "json" };

const roy = units.find(u => u.name === 'Roy');

let promotionEvents = [];
const internalLevel = 21;

let pastPromotions = promotionEvents.filter(event => event.level < internalLevel);

let currentClass = classes.find(c => c.id === roy.class);

if (pastPromotions.length === 0 && internalLevel > 20 && currentClass?.promotesTo?.length > 0 && !roy.isPromoted) {
   pastPromotions = [{ level: 20, selectedClassId: currentClass.promotesTo[0] }];
}

const tier = pastPromotions.length + 1;
console.log(`Roy level 21 tier: ${tier}`); // Should be 2

