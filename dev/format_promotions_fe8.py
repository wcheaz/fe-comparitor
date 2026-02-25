import json

with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

for c in classes:
    if c['id'] == 'sage_f':
        print(c)
