import json

with open("dev/extracted_fe7_classes.json") as f:
    extracted = json.load(f)

bases = extracted["bases"]
max_stats = extracted["max"]
promos = extracted["promos"]

def get_max_stats(c_id, type_):
    if type_ == "unpromoted" and "non-promoted" in max_stats:
        return max_stats["non-promoted"]
    if c_id in max_stats:
        return max_stats[c_id]
    
    # Try stripping _m / _f
    base_id = c_id.replace("_m", "").replace("_f", "")
    if base_id in max_stats: return max_stats[base_id]
    
    # Fallback default
    if type_ == "unpromoted":
        return max_stats["non-promoted"]
    else:
        # Just return generic promoted maxes
        # Looking at Serenes, defaults are 60 hp, 30 str/mag, 30 skl, 30 spd, 30 def, 30 res, 25 con...
        print(f"Warning: No max stats for {c_id}, using default promoted maxes")
        return {
            "hp": 60, "str": 30, "skl": 30, "spd": 30,
            "def": 30, "res": 30, "con": 25, "mov": 15
        }

with open("data/blazing_blade/classes.json") as f:
    old_classes = json.load(f)

# Keep track of old classes by ID
old_map = {c["id"]: c for c in old_classes}

# Define the full set of classes want based on the wiki:
# (Note: Magic Seal, Prince, Peer, Civilian, Child, Fire Dragon are special/npc classes. 
# We'll include Fire Dragon, Magic Seal, Bramimond and we can include others if needed,
# but we just want playable ones minimum plus major bosses).

expected_classes = {
    # Unpromoted
    "lord_eliwood": {"name": "Lord", "weapons": ["Sword"], "promotesTo": ["knight_lord"]},
    "lord_hector": {"name": "Lord", "weapons": ["Axe"], "promotesTo": ["great_lord"]},
    "lord_lyn": {"name": "Lord", "weapons": ["Sword"], "promotesTo": ["blade_lord"]},
    "cavalier_m": {"name": "Cavalier", "weapons": ["Swords", "Lances"], "promotesTo": ["paladin_m"], "movementType": "Cavalry"},
    "cavalier_f": {"name": "Cavalier", "weapons": ["Swords", "Lances"], "promotesTo": ["paladin_f"], "movementType": "Cavalry"},
    "knight_m": {"name": "Knight", "weapons": ["Lances"], "promotesTo": ["general_m"], "movementType": "Armored"},
    "knight_f": {"name": "Knight", "weapons": ["Lances"], "promotesTo": ["general_f"], "movementType": "Armored"},
    "thief_m": {"name": "Thief", "weapons": ["Swords"], "promotesTo": ["assassin"], "classAbilities": ["Locktouch"]},
    "thief_f": {"name": "Thief", "weapons": ["Swords"], "promotesTo": ["assassin"], "classAbilities": ["Locktouch"]},
    "mercenary_m": {"name": "Mercenary", "weapons": ["Swords"], "promotesTo": ["hero_m"]},
    "mercenary_f": {"name": "Mercenary", "weapons": ["Swords"], "promotesTo": ["hero_f"]},
    "myrmidon_m": {"name": "Myrmidon", "weapons": ["Swords"], "promotesTo": ["swordmaster_m"]},
    "myrmidon_f": {"name": "Myrmidon", "weapons": ["Swords"], "promotesTo": ["swordmaster_f"]},
    "archer_m": {"name": "Archer", "weapons": ["Bows"], "promotesTo": ["sniper_m"]},
    "archer_f": {"name": "Archer", "weapons": ["Bows"], "promotesTo": ["sniper_f"]},
    "nomad_m": {"name": "Nomad", "weapons": ["Bows"], "promotesTo": ["nomadic_trooper_m"], "movementType": "Cavalry"},
    "nomad_f": {"name": "Nomad", "weapons": ["Bows"], "promotesTo": ["nomadic_trooper_f"], "movementType": "Cavalry"},
    "fighter": {"name": "Fighter", "weapons": ["Axes"], "promotesTo": ["warrior"]},
    "brigand": {"name": "Brigand", "weapons": ["Axes"], "promotesTo": ["berserker"], "movementType": "Infantry", "classAbilities": ["Peak Walk"]},
    "pirate": {"name": "Pirate", "weapons": ["Axes"], "promotesTo": ["berserker"], "movementType": "Infantry", "classAbilities": ["Water Walk"]},
    "corsair": {"name": "Corsair", "weapons": ["Axes"], "promotesTo": ["berserker"], "movementType": "Infantry", "classAbilities": ["Water Walk"]},
    "pegasus_knight": {"name": "Pegasus Knight", "weapons": ["Lances"], "promotesTo": ["falcon_knight"], "movementType": "Flying"},
    "wyvern_rider_m": {"name": "Wyvern Rider", "weapons": ["Lances"], "promotesTo": ["wyvern_lord_m"], "movementType": "Wyvern"},
    "wyvern_rider_f": {"name": "Wyvern Rider", "weapons": ["Lances"], "promotesTo": ["wyvern_lord_f"], "movementType": "Wyvern"},
    "mage_m": {"name": "Mage", "weapons": ["Anima"], "promotesTo": ["sage_m"]},
    "mage_f": {"name": "Mage", "weapons": ["Anima"], "promotesTo": ["sage_f"]},
    "monk": {"name": "Monk", "weapons": ["Light"], "promotesTo": ["bishop_m"]},
    "cleric": {"name": "Cleric", "weapons": ["Staves"], "promotesTo": ["bishop_f"]},
    "shaman_m": {"name": "Shaman", "weapons": ["Dark"], "promotesTo": ["druid_m"]},
    "shaman_f": {"name": "Shaman", "weapons": ["Dark"], "promotesTo": ["druid_f"]},
    "troubadour": {"name": "Troubadour", "weapons": ["Staves"], "promotesTo": ["valkyrie"], "movementType": "Cavalry"},
    "soldier": {"name": "Soldier", "weapons": ["Lances"], "promotesTo": []},
    
    # Dancers / Bards
    "dancer": {"name": "Dancer", "weapons": [], "promotesTo": [], "classAbilities": ["Play"]},
    "bard": {"name": "Bard", "weapons": [], "promotesTo": [], "classAbilities": ["Play"]},

    # Promoted
    "knight_lord": {"name": "Knight Lord", "weapons": ["Sword", "Lance"], "movementType": "Cavalry", "type": "promoted"},
    "great_lord": {"name": "Great Lord", "weapons": ["Axe", "Sword"], "type": "promoted"},
    "blade_lord": {"name": "Blade Lord", "weapons": ["Sword", "Bow"], "type": "promoted"},
    "paladin_m": {"name": "Paladin", "weapons": ["Sword", "Lance", "Axe"], "movementType": "Cavalry", "type": "promoted"},
    "paladin_f": {"name": "Paladin", "weapons": ["Sword", "Lance", "Axe"], "movementType": "Cavalry", "type": "promoted"},
    "general_m": {"name": "General", "weapons": ["Lance", "Axe"], "movementType": "Armored", "type": "promoted"},
    "general_f": {"name": "General", "weapons": ["Lance", "Axe", "Sword"], "movementType": "Armored", "type": "promoted"},
    "hero_m": {"name": "Hero", "weapons": ["Sword", "Axe"], "type": "promoted"},
    "hero_f": {"name": "Hero", "weapons": ["Sword", "Axe"], "type": "promoted"},
    "swordmaster_m": {"name": "Swordmaster", "weapons": ["Sword"], "classAbilities": ["+15 Crit"], "type": "promoted"},
    "swordmaster_f": {"name": "Swordmaster", "weapons": ["Sword"], "classAbilities": ["+15 Crit"], "type": "promoted"},
    "assassin": {"name": "Assassin", "weapons": ["Sword"], "classAbilities": ["Silencer", "Locktouch", "Steal"], "type": "promoted"},
    "sniper_m": {"name": "Sniper", "weapons": ["Bow"], "type": "promoted"},
    "sniper_f": {"name": "Sniper", "weapons": ["Bow"], "type": "promoted"},
    "nomadic_trooper_m": {"name": "Nomadic Trooper", "weapons": ["Bow", "Sword"], "movementType": "Cavalry", "type": "promoted"},
    "nomadic_trooper_f": {"name": "Nomadic Trooper", "weapons": ["Bow", "Sword"], "movementType": "Cavalry", "type": "promoted"},
    "warrior": {"name": "Warrior", "weapons": ["Axe", "Bow"], "type": "promoted"},
    "berserker": {"name": "Berserker", "weapons": ["Axe"], "classAbilities": ["+15 Crit", "Peak Walk", "Water Walk"], "type": "promoted"},
    "falcon_knight": {"name": "Falcon Knight", "weapons": ["Lance", "Sword"], "movementType": "Flying", "type": "promoted"},
    "wyvern_lord_m": {"name": "Wyvern Lord", "weapons": ["Lance", "Sword"], "movementType": "Wyvern", "type": "promoted"},
    "wyvern_lord_f": {"name": "Wyvern Lord", "weapons": ["Lance", "Sword"], "movementType": "Wyvern", "type": "promoted"},
    "sage_m": {"name": "Sage", "weapons": ["Anima", "Staff"], "type": "promoted"},
    "sage_f": {"name": "Sage", "weapons": ["Anima", "Staff"], "type": "promoted"},
    "bishop_m": {"name": "Bishop", "weapons": ["Light", "Staff"], "type": "promoted"},
    "bishop_f": {"name": "Bishop", "weapons": ["Light", "Staff"], "type": "promoted"},
    "druid_m": {"name": "Druid", "weapons": ["Dark", "Staff"], "type": "promoted"},
    "druid_f": {"name": "Druid", "weapons": ["Dark", "Anima", "Staff"], "type": "promoted"},
    "valkyrie": {"name": "Valkyrie", "weapons": ["Anima", "Staff"], "movementType": "Cavalry", "type": "promoted"},
    "archsage": {"name": "Archsage", "weapons": ["Anima", "Light", "Dark", "Staff"], "type": "promoted"},
    "dark_druid": {"name": "Dark Druid", "weapons": ["Dark", "Staff"], "type": "promoted"},
    
    # Specials
    "magic_seal": {"name": "Magic Seal", "weapons": [], "promotesTo": []},
    "bramimond": {"name": "Bramimond", "weapons": ["Dark"], "promotesTo": []},
    "fire_dragon": {"name": "Fire Dragon", "weapons": ["Dragonstone"], "promotesTo": [], "movementType": "Dragon"},
    "transporter_tent": {"name": "Transporter (Tent)", "weapons": [], "promotesTo": []},
    "transporter_wagon": {"name": "Transporter (Wagon)", "weapons": [], "promotesTo": ["transporter_tent"]} # wagon doesn't promote to tent lol, just levels
}

for k in ["magic_seal", "bramimond", "fire_dragon", "transporter_tent", "transporter_wagon"]:
    expected_classes[k]["type"] = "unpromoted"
expected_classes["transporter_wagon"]["type"] = "promoted" # let's just make it promoted since it gains move

new_classes = []

for c_id, conf in expected_classes.items():
    type_ = conf.get("type", "unpromoted")
    
    # Try getting actual bases/max stats
    b = bases.get(c_id, {"hp": 0, "str": 0, "skl": 0, "spd": 0, "def": 0, "res": 0, "con": 0, "mov": 5})
    # If c_id is nomadic_trooper_m, it's nmd_trooper_m in stats
    lookup_id = c_id
    if c_id == "nomadic_trooper_m": lookup_id = "nmd_trooper_m"
    if c_id == "nomadic_trooper_f": lookup_id = "nmd_trooper_f"
    if c_id == "falcon_knight": lookup_id = "falcon_knight"
    b = bases.get(lookup_id, b)
    
    m = get_max_stats(lookup_id, type_)
    
    c_obj = {
        "id": c_id,
        "name": conf["name"],
        "type": type_,
        "baseStats": b,
        "promotionBonus": promos.get(lookup_id, {}) if type_ == "promoted" else {},
    }
    
    # Get promo bonus
    promo = {}
    special_classes = ["archsage", "dark_druid", "transporter_wagon"]
    if type_ == "promoted" and c_id not in special_classes:
        promo = promos.get(lookup_id, {})
        # Fallback: if female variant not found, try female -> male
        if not promo and c_id.endswith("_f"):
            male_id = c_id.replace("_f", "_m")
            male_lookup = male_id
            if male_id == "nomadic_trooper_m": male_lookup = "nmd_trooper_m"
            promo = promos.get(male_lookup, {})
            if promo:
                print(f"  Using male promo bonus for {c_id} (from {male_lookup})")
    
    c_obj["promotionBonus"] = promo
    
    if type_ == "unpromoted":
        c_obj["promotesTo"] = conf.get("promotesTo", [])
    else:
        c_obj["promotesTo"] = []
        
    c_obj["classAbilities"] = conf.get("hiddenModifiers", [])
    c_obj["weapons"] = conf.get("weapons", [])
    
    c_obj["maxStats"] = m
    # Always include LCK = 30
    c_obj["maxStats"]["lck"] = 30
    
    gender = "M" if c_id.endswith("_m") else ("F" if c_id.endswith("_f") else "M")
    # For some female classes without _f suffix like pegasus knight, valkyrie it's female
    f_classes = ["lord_lyn", "blade_lord", "cleric", "valkyrie", "pegasus_knight", "falcon_knight", "dancer", "troubadour"]
    if c_id in f_classes: gender = "F"
    
    c_obj["gender"] = gender
    c_obj["movementType"] = conf.get("movementType", "Infantry")
    if "description" in conf:
        c_obj["description"] = conf["description"]
        
    new_classes.append(c_obj)

with open("data/blazing_blade/classes.json", "w") as f:
    json.dump(new_classes, f, indent=4)
print("Updated classes.json")
