import json

with open("scraped_fe7.json") as f:
    scraped = json.load(f)

with open("data/blazing_blade/classes.json") as f:
    classes = json.load(f)
class_map = {c["name"].lower(): c for c in classes}
# Add manual overrides for class names
class_name_overrides = {
    "lord": "lord_eliwood", # Default, will fix per lord
    "pegasus knight": "pegasus_knight",
    "nomad": "nomad",
    "wyvern rider": "wyvern_rider",
    "wyvern lord": "wyvern_lord",
    "falcon knight": "falcon_knight",
    "paladin": "paladin",
    "cavalier": "cavalier",
    "valkyrie": "valkyrie"
}

def get_class_id(cls_name, unit_name):
    # Lord specific
    if cls_name == "Lord":
        if unit_name == "Eliwood": return "lord_eliwood"
        if unit_name == "Lyn": return "lord_lyn"
        if unit_name == "Hector": return "lord_hector"
    
    nm = cls_name.lower()
    if nm in class_name_overrides:
        return class_name_overrides[nm]
    
    # Try finding an exact match
    for c in classes:
        if c["name"].lower() == nm:
            return c["id"]
            
    # Fallback formatting
    return nm.replace(" ", "_")

def get_aid(con, cls_id):
    # Find class
    cls_data = next((c for c in classes if c["id"] == cls_id), None)
    if cls_data:
        mov_type = cls_data.get("movementType", "")
        gender = cls_data.get("gender", "male")
        if mov_type == "Cavalry" or mov_type == "Flying":
            if gender == "female":
                return 20 - con
            else:
                return 25 - con
    return con - 1

def map_weapon_ranks(rank_str):
    if not rank_str or rank_str == "\u2013":
        return {}
        
    ranks = {}
    tokens = rank_str.replace(" ", "").split(",")
    # Wait, the scraped ranks look like "E,  D" for Sain (Sword, Lance)
    # This is missing the weapon type. We might have to assign them default based on class
    return {} # Let's just leave it empty for now, or we can hardcode baseWeaponRanks later or extract properly

with open("data/blazing_blade/units.json") as f:
    existing_units = json.load(f)
    
existing_map = {u["name"]: u for u in existing_units}

new_units = []

for name, base_data in scraped["bases"].items():
    # Fix Nils/Ninian name
    if name == "Nils/Ninian":
        # Serenes growth uses Nils/Ninian, bases uses Nils
        continue
        
    growth_name = name
    if name == "Nils" or name == "Ninian":
        growth_name = "Nils/Ninian"
        
    if growth_name not in scraped["growths"]:
        # Try to find by partial match
        for g_name in scraped["growths"]:
            if name in g_name:
                growth_name = g_name
                break
                
    growths = scraped["growths"].get(growth_name, {})
    
    cls_str = base_data["class"]
    cls_id = get_class_id(cls_str, name)
    
    con = base_data["stats"]["con"]
    aid = get_aid(con, cls_id)
    
    # Check if already exists in existing_map
    # Some names are "Marcus (FE7)"
    mapped_name = name
    if name == "Marcus":
        mapped_name = "Marcus (FE7)"
    elif name == "Bartre":
        mapped_name = "Bartre (FE7)"
    elif name == "Karel":
        mapped_name = "Karel (FE7)"
    elif name == "Merlinus":
        mapped_name = "Merlinus (FE7)"
        
    if mapped_name in existing_map:
        unit = existing_map[mapped_name]
    else:
        unit = {
            "id": mapped_name.lower().replace(" ", "_").replace("(", "").replace(")", ""),
            "name": mapped_name,
            "game": "The Blazing Blade",
            "class": cls_id,
            "joinChapter": "Unknown",
            "level": base_data["level"],
            "gender": "male", # Not scraped, assume male and fix later
            "affinity": base_data["affinity"],
            "isPromoted": False, # Will need heuristic
            "stats": base_data["stats"].copy(),
            "growths": growths.copy(),
            "baseWeaponRanks": {},
            "promotions": [],
            "prf": []
        }
        unit["stats"]["aid"] = aid
        
        # Promotion heuristic: level > 1 with high stats or specific class
        if cls_str in ["Paladin", "Sniper", "General", "Hero", "Swordmaster", "Warrior", "Berserker", "Falcoknight", "Wyvern Lord", "Bishop", "Sage", "Druid", "Valkyrie", "Assassin", "Rogue"]:
            unit["isPromoted"] = True
            
        new_units.append(unit)
        
combined = existing_units + new_units

# Deduplicate based on ID just in case
seen = set()
final_units = []
for u in combined:
    if u["id"] not in seen:
        seen.add(u["id"])
        final_units.append(u)

with open("data/blazing_blade/units.json", "w") as f:
    json.dump(final_units, f, indent=4)
    
print("Merged into units.json")
