import json
import re

with open('/tmp/class_sets.txt', 'r') as f:
    lines = f.readlines()

char_class_map = {}
for line in lines:
    line = line.strip()
    if not line or line.startswith('---') or line.startswith('Character'):
        continue
    
    parts = [p.strip() for p in line.split('\t') if p.strip()]
    if len(parts) < 2:
        continue
    
    name = parts[0]
    name = name.replace('&#8217;', '')
    
    options = parts[1:]
    if options[0] in ('Class varies', 'Initial class', 'Options'):
        continue
    if name == 'Avatar':
        continue
        
    mapped_options = [opt.lower().replace(' ', '_') for opt in options]
    char_class_map[name.lower()] = mapped_options

char_class_map['robin'] = [
    'tactician', 'cavalier', 'knight', 'myrmidon', 'mercenary', 'fighter',
    'barbarian', 'archer', 'thief', 'pegasus_knight', 'wyvern_rider',
    'mage', 'dark_mage', 'priest', 'cleric', 'troubadour'
]

with open('data/awakening/units.json', 'r') as f:
    units = json.load(f)

modified = 0
for unit in units:
    lookup_name = unit['name'].lower()
    
    if lookup_name in char_class_map:
        options = list(char_class_map[lookup_name])
        
        if unit.get('gender') == 'M':
            options = [c for c in options if c not in ('pegasus_knight', 'troubadour', 'cleric')]
            if 'cleric' in char_class_map[lookup_name] and 'priest' not in options:
                options.append('priest')
        elif unit.get('gender') == 'F':
            options = [c for c in options if c not in ('fighter', 'barbarian', 'priest')]
            if 'priest' in char_class_map[lookup_name] and 'cleric' not in options:
                options.append('cleric')
                
        # unique options
        # maintain order roughly
        seen = set()
        uniq_options = []
        for o in options:
            if o not in seen:
                seen.add(o)
                uniq_options.append(o)
                
        unit['reclassOptions'] = uniq_options
        modified += 1

with open('data/awakening/units.json', 'w') as f:
    json.dump(units, f, indent=2)

print(f"Updated {modified} units with reclassOptions.")
