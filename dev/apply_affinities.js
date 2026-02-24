const fs = require('fs');
const unitsPath = 'data/blazing_blade/units.json';
const scrapedPath = 'scraped_fe7.json';

const unitsData = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

let modified = false;

for (const unit of unitsData) {
    let searchName = unit.name;
    if (searchName.endsWith(' (FE7)')) {
        searchName = searchName.replace(' (FE7)', '');
    }

    let scrapedUnit = scrapedData.bases[searchName];
    if (!scrapedUnit && searchName === 'Wallace') {
        scrapedUnit = scrapedData.bases['Wallace *'] || scrapedData.bases['Wallace'];
    }

    if (scrapedUnit && scrapedUnit.affinity) {
        let affin = scrapedUnit.affinity;
        if (affin.startsWith('Affin_')) {
            affin = affin.replace('Affin_', '').replace('.png', '');
        }

        // Map to application specific affinity strings
        if (affin === 'Anima') affin = 'AffinAnima';
        else if (affin === 'Light') affin = 'AffinLight';
        else if (affin === 'Dark') affin = 'AffinDark';

        // Wind, Thunder, Ice, Fire keep their names (but capitalized correctly)

        if (unit.affinity !== affin && affin !== 'None' && affin !== '') {
            unit.affinity = affin;
            console.log(`Updated affinity for ${unit.name} to ${affin}`);
            modified = true;
        }
    }
}

if (modified) {
    fs.writeFileSync(unitsPath, JSON.stringify(unitsData, null, 4));
    console.log('Successfully updated affinities.');
} else {
    console.log('No affinities needed updating.');
}
