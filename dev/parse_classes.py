import json
import pandas as pd

with open("dev/awakening_classes_raw.json", "r") as f:
    raw = json.load(f)

# The keys in the actual tables are often "Class"
def n(name):
    if pd.isna(name) or not isinstance(name, str): return ""
    return name.replace(" ", "").replace("(m)", "").replace("(f)", "").replace("’", "").replace(",", "").lower()

def safe_int(val):
    if pd.isna(val) or val == "" or val is None: return 0
    try: return int(float(val))
    except: return 0

base_map = {n(row.get("Class", "")): row for row in raw["bases"]}
growths_map = {n(row.get("Class", "")): row for row in raw["growths"]}
max_map = {n(row.get("Class", "")): row for row in raw["max"]}

# Read existing classes
with open("data/awakening/classes.json", "r") as f:
    existing_classes = json.load(f)

# Metadata dictionary for filling generic properties
metadata = {
    "war_monk": {"weapons": ["Axes", "Staffs"], "movementType": "Infantry", "tier": "2", "type": "promoted", "description": "Promoted healers who can wield axes in combat."},
    "taguel": {"weapons": ["Beaststones"], "movementType": "Infantry", "tier": "1", "type": "unpromoted",  "description": "Shape-shifting beasts with high speed and skill."},
    "manakete": {"weapons": ["Dragonstones"], "movementType": "Dragon", "tier": "1", "type": "unpromoted", "description": "Ancient dragons with incredible lifespan and defensive stats."},
    "archer": {"weapons": ["Bows"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Ranged fighters that strike from afar using bows. Vulnerable up close."},
    "pegasus_knight": {"weapons": ["Lances"], "movementType": "Flying", "tier": "1", "type": "unpromoted", "description": "High-mobility flyers with great resistance, but vulnerable to bows."},
    "warrior": {"weapons": ["Axes", "Bows"], "movementType": "Infantry", "tier": "2", "type": "promoted", "description": "Incredibly powerful fighters with staggering HP and Strength."},
    "lord": {"weapons": ["Swords"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "A noble leader fighting for their kingdom."},
    "great_lord": {"weapons": ["Swords", "Lances"], "movementType": "Infantry", "tier": "2", "type": "promoted", "description": "A seasoned commander with mastery over swords and lances."},
    "wyvern_rider": {"weapons": ["Axes"], "movementType": "Wyvern", "tier": "1", "type": "unpromoted", "description": "Heavily armored airborne units with immense physical stats."},
    "cleric": {"weapons": ["Staffs"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Dedicated healers supporting the army from the backlines."},
    "troubadour": {"weapons": ["Staffs"], "movementType": "Cavalry", "tier": "1", "type": "unpromoted", "description": "Mounted healers who offer excellent mobility and support."},
    "villager": {"weapons": ["Lances"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Inexperienced fighters with extremely high growth potentials."},
    "dancer": {"weapons": ["Swords"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Performers whose graceful dances allow an ally to move again."},
    "dark_mage": {"weapons": ["Tomes"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Spellcasters who dabble in the forbidden dark arts."},
    "trickster": {"weapons": ["Swords", "Staffs"], "movementType": "Infantry", "tier": "2", "type": "promoted", "description": "Agile rogues who have picked up healing utility."},
    "thief": {"weapons": ["Swords"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Nimble units capable of unlocking doors and chests."},
    "fighter": {"weapons": ["Axes"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Reckless axe wielders boasting incredibly high Health and Strength."},
    "mage": {"weapons": ["Tomes"], "movementType": "Infantry", "tier": "1", "type": "unpromoted", "description": "Anima magic users striking enemies with elemental tomes."}
}

# Update all existing classes with proper maps
for cls in existing_classes:
    cls_id = cls["id"]
    cls_name = cls["name"]
    
    mapped_name = n(cls_name)
    if mapped_name == "cleric":
        mapped_name = "priestcleric" # Serenes Forest puts them together sometimes
    if "cleric" in mapped_name and "priest" not in mapped_name:
         b_test = base_map.get("priestcleric")
         if b_test: mapped_name = "priestcleric"

    b = base_map.get(mapped_name) or {}
    g = growths_map.get(mapped_name) or {}
    mx = max_map.get(mapped_name) or {}

    if not b:
        # Check alternatives
        alt_name = mapped_name.replace("great", "great ").replace("dark", "dark ").replace("war", "war ")
        b = base_map.get(n(alt_name)) or getattr(base_map.get(mapped_name+"(m)"), "get", lambda x: None)(mapped_name) or {}
        g = growths_map.get(n(alt_name)) or {}
        mx = max_map.get(n(alt_name)) or {}

    # Update maxStats properly
    cls["maxStats"] = {
        "hp": safe_int(mx.get("HP", cls["maxStats"].get("hp", 0))),
        "str": safe_int(mx.get("Str", cls["maxStats"].get("str", 0))),
        "mag": safe_int(mx.get("Mag", cls["maxStats"].get("mag", 0))),
        "skl": safe_int(mx.get("Skl", cls["maxStats"].get("skl", 0))),
        "spd": safe_int(mx.get("Spd", cls["maxStats"].get("spd", 0))),
        "lck": safe_int(mx.get("Lck", cls["maxStats"].get("lck", 0))),
        "def": safe_int(mx.get("Def", cls["maxStats"].get("def", 0))),
        "res": safe_int(mx.get("Res", cls["maxStats"].get("res", 0)))
    }
    
    # If the class was scaffolded, inject real metadata
    if "Scaffolded" in cls.get("description", "") or cls_id in metadata:
        meta = metadata.get(cls_id, {})
        if meta:
            if not cls["weapons"]: cls["weapons"] = meta.get("weapons", [])
            cls["movementType"] = meta.get("movementType", "Infantry")
            cls["tier"] = meta.get("tier", cls["tier"])
            cls["type"] = meta.get("type", cls["type"])
            cls["description"] = meta.get("description", cls["description"])

# Write back
with open("data/awakening/classes.json", "w") as f:
    json.dump(existing_classes, f, indent=2)

print(f"Updated {len(existing_classes)} classes with maxStats and metadata.")
