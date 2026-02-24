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

    // Special cases if any
    if (!scrapedUnit && searchName === 'Wallace') {
        scrapedUnit = scrapedData.bases['Wallace *'] || scrapedData.bases['Wallace'];
    }

    if (scrapedUnit && scrapedUnit.affinity) {
        if (unit.affinity !== scrapedUnit.affinity) {
            unit.affinity = scrapedUnit.affinity;
            console.log(`Updated affinity for ${unit.name} to ${unit.affinity}`);
            modified = true;
        }
    } else {
        console.log(`Could not find scraped affinity for ${unit.name}`);
    }
}

if (modified) {
    fs.writeFileSync(unitsPath, JSON.stringify(unitsData, null, 4));
    console.log('Successfully updated affinities.');
} else {
    console.log('No affinities needed updating.');
}
