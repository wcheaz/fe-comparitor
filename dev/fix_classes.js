const fs = require('fs');
const path = './data/blazing_blade/classes.json';
const classes = JSON.parse(fs.readFileSync(path, 'utf8'));

// Build a map of valid IDs
const validIds = new Set(classes.map(c => c.id));

let modified = false;
classes.forEach(c => {
  if (c.promotesTo && c.promotesTo.length > 0) {
    c.promotesTo = c.promotesTo.map(promoId => {
      if (!validIds.has(promoId)) {
        const fallback = promoId.replace(/_[mf]$/, '');
        if (validIds.has(fallback)) {
          console.log(`Fixing ${promoId} -> ${fallback} in ${c.id}`);
          modified = true;
          return fallback;
        }
      }
      return promoId;
    });
  }
});

if (modified) {
  fs.writeFileSync(path, JSON.stringify(classes, null, 4));
  console.log('Successfully updated classes.json');
} else {
  console.log('No modifications needed.');
}
