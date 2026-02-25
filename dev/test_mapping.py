import json

with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for c in classes:
    if c['id'] == 'ranger_m' or c['id'] == 'paladin_m' or c['id'] == 'great_knight_m':
        print(f"{c['id']} promotionBonus: {c.get('promotionBonus')}")
