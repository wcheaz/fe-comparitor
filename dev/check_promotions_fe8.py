import json

with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for cls in classes:
    if not cls.get('promotesTo'):
        print(f"Missing promotesTo: {cls['id']} ({cls['name']})")
    if not cls.get('promotionBonus'):
        print(f"Missing promotionBonus: {cls['id']} ({cls['name']})")
