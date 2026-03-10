const fs = require('fs');

async function scrapeClassSets() {
  try {
    const res = await fetch('https://serenesforest.net/awakening/characters/class-sets/');
    const text = await res.text();
    // Use regex to locate <table> tags and extract th/td
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;

    let tables = text.match(tableRegex);
    if (!tables) {
      console.log("No tables found");
      return;
    }

    tables.forEach((tableHtml, i) => {
      console.log(`\n--- Table ${i} ---`);
      let rows = tableHtml.match(rowRegex);
      if (!rows) return;
      rows.forEach(rowHtml => {
        let cells = rowHtml.match(cellRegex);
        if (cells) {
          const rowText = cells.map(c => c.replace(/<[^>]+>/g, '').trim()).join('\t');
          console.log(rowText);
        }
      });
    });
  } catch(e) { console.error(e); }
}

scrapeClassSets();
