import json

with open('data/sacred_stones/units.json', 'r') as f:
    units = json.load(f)

for u in units:
    print(u['name'], len(u.get('promotions', [])))
