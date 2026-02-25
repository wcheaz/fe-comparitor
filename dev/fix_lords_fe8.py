import json

with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for c in classes:
    if c['id'] == 'great_lord_eirika':
        c['promotionBonus'] = {
            'hp': 4, 'str': 2, 'mag': 2, 'skl': 2, 'spd': 1, 'def': 3, 'res': 5, 'con': 2, 'mov': 2
        }
    elif c['id'] == 'great_lord_ephraim':
        c['promotionBonus'] = {
            'hp': 4, 'str': 2, 'mag': 2, 'skl': 3, 'spd': 2, 'def': 2, 'res': 5, 'con': 2, 'mov': 2
        }
    # Fix the missing promotesTo on lord_eirika and lord_ephraim
    if c['id'] == 'lord_eirika':
        c['promotesTo'] = ['great_lord_eirika']
    elif c['id'] == 'lord_ephraim':
        c['promotesTo'] = ['great_lord_ephraim']
        
with open('data/sacred_stones/classes.json', 'w') as f:
    json.dump(classes, f, indent=2)

print("Fixed lords.")
