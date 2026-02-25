import json

with open('data/sacred_stones/units.json', 'r') as f:
    units = json.load(f)

# The map from current failed string -> correct class id 
class_fixes = {
    'pegasus_knight_f': 'pegasus_knight',
    'priest_m': 'priest',
    'journeyman_m': 'journeyman',
    'fighter_m': 'fighter',
    'thief_m': 'thief',
    'monk_m': 'monk',
    'cleric_f': 'cleric',
    'recruit_f': 'recruit',
    "troubadour_f": 'troubadour',
    'berserker_m': 'berserker',
    'pupil_m': 'pupil',
    'wyvern_rider_m': 'wyvern_rider',
    'rogue_m': 'rogue',
    'shaman_m': 'shaman',
    'falcoknight_f': 'falcoknight'
}

for u in units:
    if u['class'] in class_fixes:
        u['class'] = class_fixes[u['class']]

with open('data/sacred_stones/units.json', 'w') as f:
    json.dump(units, f, indent=2)

print('Fixed remaining class mapping failures')
