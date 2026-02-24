import json

with open("data/blazing_blade/units.json") as f:
    units = json.load(f)
    
with open("data/blazing_blade/classes.json") as f:
    classes = json.load(f)
    
valid_classes = {c["id"]: c for c in classes}

mapping = {
    "knight": "knight_m", # Oswin, Wallace
    "general": "general_m",
    "priest": "cleric", # Serra
    "paladin": "paladin_m", 
    "cavalier": "cavalier_m",
    "archer": "archer_m",
    "sniper": "sniper_m",
    "mercenary": "mercenary_m",
    "hero": "hero_m",
    "myrmidon": "myrmidon_m",
    "swordmaster": "swordmaster_m",
    "fighter": "fighter",
    "warrior": "warrior",
    "mage": "mage_m",
    "sage": "sage_m",
    "monk": "monk",
    "bishop": "bishop_m",
    "shaman": "shaman_m",
    "druid": "druid_m",
    "nomad": "nomad_m",
    "thief": "thief_m",
    "assassin": "assassin",
    "wyvern_rider": "wyvern_rider_m",
    "wyvern_lord": "wyvern_lord_m",
    "transporter": "transporter_tent"
}

female_overrides = {
    "Florina": "pegasus_knight",
    "Fiora": "pegasus_knight",
    "Farina": "pegasus_knight",
    "Serra": "cleric", # renamed from priest
    "Priscilla": "troubadour",
    "Lucius": "monk", # he is male
    "Erk": "mage_m",
    "Nino": "mage_f",
    "Renault": "bishop_m",
    "Rebecca": "archer_f",
    "Louise": "sniper_f",
    "Karla": "swordmaster_f",
    "Isadora": "paladin_f",
    "Vaida": "wyvern_lord_f"
}

for u in units:
    c_id = u["class"]
    name = u["name"]
    
    if name in female_overrides:
        new_id = female_overrides[name]
    else:
        new_id = mapping.get(c_id, c_id)
        
    if new_id not in valid_classes:
        print(f"Warning: {name} assigned to invalid class {new_id}")
    else:
        u["class"] = new_id
        
with open("data/blazing_blade/units.json", "w") as f:
    json.dump(units, f, indent=4)
print("Updated units.json")
