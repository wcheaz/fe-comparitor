import json

# Fix classes.json
with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for c in classes:
    if c['id'] == 'mage_f':
        if 'sage_f' not in c['promotesTo']:
            c['promotesTo'].extend(['sage_f', 'mage_knight_f'])
    elif c['id'] == 'myrmidon_f':
        if 'swordmaster_f' not in c['promotesTo']:
            c['promotesTo'].extend(['swordmaster_f', 'assassin'])

with open('data/sacred_stones/classes.json', 'w') as f:
    json.dump(classes, f, indent=2)

# Fix units.json
with open('data/sacred_stones/units.json', 'r') as f:
    units = json.load(f)

for unit in units:
    c_id_base = unit['class']
    
    cls = next((c for c in classes if c['id'] == c_id_base), None)
            
    unit['promotions'] = []
    
    if cls and cls.get('promotesTo'):
        for target_id in cls['promotesTo']:
            target_cls = next((c for c in classes if c['id'] == target_id), None)
            if target_cls and target_cls.get('promotionBonus'):
                unit['promotions'].append({
                    'class': target_cls['name'],
                    'promoGains': target_cls['promotionBonus']
                })

with open('data/sacred_stones/units.json', 'w') as f:
    json.dump(units, f, indent=2)

print("Fixed Lute and Marisa promotions.")
