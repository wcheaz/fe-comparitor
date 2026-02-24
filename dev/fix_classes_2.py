import json

# Add explicit mappings from FE7 unit class ID back to FE6 class ID
class_fe7_to_fe6 = {
    "knight": "armor_knight_m",
    "cleric": "priest_f",
    "pegasus_knight": "pegasus_knight_f",
    "dancer": "dancer_f",
    "troubadour": "troubadour_f"
}

# The fully custom ones for FE7 not in FE6
custom_classes = [
    {
        "id": "monk",
        "name": "Monk",
        "type": "unpromoted",
        "baseStats": {
            "hp": 18, "str": 1, "mag": 1, "skl": 1, "spd": 2, "lck": 0, "def": 1, "res": 4, "con": 5, "mov": 5
        },
        "promotionBonus": {},
        "promotesTo": ["bishop_m"],
        "hiddenModifiers": [],
        "weapons": ["Light"],
        "maxStats": {"hp": 60, "str": 20, "mag": 20, "skl": 20, "dex": 20, "spd": 20, "lck": 30, "def": 20, "res": 20, "con": 20, "bld": 20, "mov": 15, "cha": 30},
        "gender": "M",
        "movementType": "Infantry"
    },
    {
        "id": "transporter",
        "name": "Transporter",
        "type": "unpromoted",
        "baseStats": {
            "hp": 15, "str": 0, "mag": 0, "skl": 0, "spd": 0, "lck": 0, "def": 3, "res": 0, "con": 25, "mov": 5
        },
        "promotionBonus": {},
        "promotesTo": [],
        "hiddenModifiers": [],
        "weapons": [],
        "maxStats": {"hp": 60, "str": 20, "mag": 20, "skl": 20, "dex": 20, "spd": 20, "lck": 30, "def": 20, "res": 20, "con": 25, "bld": 20, "mov": 15, "cha": 30},
        "gender": "M",
        "movementType": "Armored"
    },
    {
        "id": "archsage",
        "name": "Archsage",
        "type": "promoted",
        "baseStats": {
            "hp": 40, "str": 15, "mag": 15, "skl": 15, "spd": 15, "lck": 15, "def": 15, "res": 15, "con": 9, "mov": 6
        },
        "promotionBonus": {},
        "promotesTo": [],
        "hiddenModifiers": [],
        "weapons": ["Anima", "Light", "Dark", "Staves"],
        "maxStats": {"hp": 60, "str": 30, "mag": 30, "skl": 30, "dex": 30, "spd": 30, "lck": 30, "def": 30, "res": 30, "con": 20, "bld": 20, "mov": 15, "cha": 40},
        "gender": "M",
        "movementType": "Infantry"
    },
    {
        "id": "assassin",
        "name": "Assassin",
        "type": "promoted",
        "baseStats": {
            "hp": 26, "str": 6, "mag": 6, "skl": 11, "spd": 11, "lck": 0, "def": 4, "res": 2, "con": 6, "mov": 6
        },
        "promotionBonus": {"hp": 3, "str": 1, "skl": 0, "spd": 0, "def": 2, "res": 2, "con": 0, "mov": 0},
        "promotesTo": [],
        "hiddenModifiers": ["Silencer", "+15 Crit"],
        "weapons": ["Swords"],
        "maxStats": {"hp": 60, "str": 20, "mag": 20, "skl": 30, "dex": 30, "spd": 30, "lck": 30, "def": 20, "res": 20, "con": 20, "bld": 20, "mov": 15, "cha": 40},
        "gender": "M",
        "movementType": "Infantry"
    }
]

with open("data/blazing_blade/units.json") as f:
    units = json.load(f)

with open("data/blazing_blade/classes.json") as f:
    fe7_classes = json.load(f)
    
with open("data/binding_blade/classes.json") as f:
    fe6_classes = json.load(f)

fe7_class_map = {c["id"]: c for c in fe7_classes}
fe6_class_map = {c["id"]: c for c in fe6_classes}

missing_classes = set()

for unit in units:
    cls_id = unit["class"]
    if cls_id not in fe7_class_map:
        
        found = False
        mapped_id = class_fe7_to_fe6.get(cls_id, cls_id)
        
        if mapped_id in fe6_class_map:
            new_cls = fe6_class_map[mapped_id].copy()
            new_cls["id"] = cls_id
            fe7_classes.append(new_cls)
            fe7_class_map[cls_id] = new_cls
            found = True
        else:
            gender = unit.get("gender", "male")
            g_suffix = "_m" if gender == "male" else "_f"
            if mapped_id + g_suffix in fe6_class_map:
                new_cls = fe6_class_map[mapped_id + g_suffix].copy()
                new_cls["id"] = cls_id
                fe7_classes.append(new_cls)
                fe7_class_map[cls_id] = new_cls
                found = True
                
        if not found:
            # Check custom
            for c in custom_classes:
                if c["id"] == cls_id:
                    fe7_classes.append(c)
                    fe7_class_map[cls_id] = c
                    found = True
                    break
                    
        if not found:
            missing_classes.add((cls_id, unit["name"]))

if missing_classes:
    print("Still missing classes:", missing_classes)

with open("data/blazing_blade/classes.json", "w") as f:
    json.dump(fe7_classes, f, indent=4)
    
print("Added mappings and custom classes.")
