import json

with open("data/blazing_blade/classes.json") as f:
    classes = json.load(f)
with open("data/blazing_blade/units.json") as f:
    units = json.load(f)

class_ids = {c["id"] for c in classes}
print(f"Total classes: {len(classes)}")
print(f"Unique class IDs: {len(class_ids)}")

errors = []

for u in units:
    if u["class"] not in class_ids:
        errors.append(f"Unit {u['name']} has invalid class: {u['class']}")

for c in classes:
    for p in c.get("promotesTo", []):
        if p not in class_ids:
            errors.append(f"Class {c['id']} promotes to non-existent: {p}")

promoted_no_bonus = []
for c in classes:
    if c["type"] == "promoted" and (not c.get("promotionBonus") or len(c["promotionBonus"]) == 0):
        promoted_no_bonus.append(c["id"])
if promoted_no_bonus:
    errors.append(f"Promoted classes with empty promotion bonus: {promoted_no_bonus}")

missing_game = [c["id"] for c in classes if "game" not in c]
if missing_game:
    errors.append(f"Classes missing game: {missing_game}")

for e in errors:
    print(f"ERROR: {e}")

if not errors:
    print("All checks passed!")
else:
    print(f"\n{len(errors)} error(s) found.")
