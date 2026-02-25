import json
with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for cid in ['sage_f', 'mage_knight_f', 'swordmaster_f', 'assassin']:
    c = next((c for c in classes if c['id'] == cid), None)
    if c:
        print(f"{cid}: {c.get('promotionBonus')}")
    else:
        print(f"{cid} not found")
