const fs = require('fs');

const fixClasses = (path) => {
  if (!fs.existsSync(path)) return;
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
            console.log(`[${path}] Fixing ${promoId} -> ${fallback} in ${c.id}`);
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
    console.log(`Successfully updated ${path}`);
  }
};

fixClasses('./data/binding_blade/classes.json');
fixClasses('./data/three_houses/classes.json');
fixClasses('./data/engage/classes.json');
