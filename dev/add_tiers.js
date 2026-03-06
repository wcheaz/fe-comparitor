const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const games = ['binding_blade', 'blazing_blade', 'sacred_stones'];

games.forEach(game => {
    const filePath = path.join(dataDir, game, 'classes.json');
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${game}, classes.json not found.`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const cls of data) {
        const nameLower = cls.name.toLowerCase();
        if (nameLower.includes('recruit') || nameLower.includes('pupil') || nameLower.includes('journeyman')) {
            cls.tier = 'Trainee';
        } else if (cls.type === 'unpromoted') {
            cls.tier = 'Tier 1';
        } else if (cls.type === 'promoted') {
            cls.tier = 'Tier 2';
        } else if (cls.type === 'trainee') {
            cls.tier = 'Trainee'; // just in case
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Updated ${filePath}`);
});
