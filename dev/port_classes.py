import json

with open("data/blazing_blade/units.json") as f:
    units = json.load(f)

with open("data/blazing_blade/classes.json") as f:
    fe7_classes = json.load(f)
    
with open("data/binding_blade/classes.json") as f:
    fe6_classes = json.load(f)
    
fe7_class_map = {c["id"]: c for c in fe7_classes}

# Try mapping gendered vs non-gendered. If unit is Male and class is myrmidon, try myrmidon_m
fe6_class_map = {c["id"]: c for c in fe6_classes}

missing_classes = set()

# Special handling for missing FE7 specific classes or renamed
# e.g., bard, assassin
for unit in units:
    cls_id = unit["class"]
    if cls_id not in fe7_class_map:
        # We need to add it. Let's see if we can find it in fe6.
        # Check pure id
        found = False
        if cls_id in fe6_class_map:
            new_cls = fe6_class_map[cls_id].copy()
            fe7_classes.append(new_cls)
            fe7_class_map[cls_id] = new_cls
            found = True
        else:
            # Maybe it's gendered in FE6
            gender = unit.get("gender", "male")
            g_suffix = "_m" if gender == "male" else "_f"
            if cls_id + g_suffix in fe6_class_map:
                new_cls = fe6_class_map[cls_id + g_suffix].copy()
                new_cls["id"] = cls_id # store under generic ID so it matches unit
                fe7_classes.append(new_cls)
                fe7_class_map[cls_id] = new_cls
                found = True
                
        if not found:
            missing_classes.add((cls_id, unit["name"]))
            
if missing_classes:
    print("Still missing classes:", missing_classes)
    
with open("data/blazing_blade/classes.json", "w") as f:
    json.dump(fe7_classes, f, indent=4)
    
print("Ported missing classes from FE6.")
