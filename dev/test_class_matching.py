import json

with open('data/sacred_stones/units.json', 'r') as f:
    units = json.load(f)

with open('data/sacred_stones/classes.json', 'r') as f:
    classes = json.load(f)

fails = 0
for u in units:
    found = False
    for c in classes:
        if c['id'] == u['class']:
            found = True
            break
    if not found:
        print(f"Failed to find class for {u['name']} (class: {u['class']})")
        fails += 1
print(f"Total fails: {fails}")
