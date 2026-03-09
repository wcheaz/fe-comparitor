import json
import pandas as pd

with open("dev/awakening_scraped_raw.json", "r") as f:
    raw = json.load(f)

def n(name):
    if pd.isna(name) or not isinstance(name, str): return ""
    return name.replace(" ", "").replace("'", "").replace("’", "").lower()

def safe_int(val):
    if pd.isna(val) or val == "" or val is None: return 0
    try: return int(float(val))
    except: return 0

def get_key(row):
    return n(row.get("Name") or row.get("Character") or "")

bases_map = {get_key(row): row for row in raw["bases"]}
growths_map = {get_key(row): row for row in raw["growths"]}
mod_map = {get_key(row): row for row in raw["modifiers"]}
recruit_map = {get_key(row): row for row in raw["recruitment"]}

gen1_chars = [
    "Chrom", "Robin_M", "Robin_F", "Lissa", "Frederick", "Sully", "Virion", "Stahl",
    "Vaike", "Miriel", "Sumia", "Kellam", "Donnel", "Lon'qu", "Ricken",
    "Maribelle", "Panne", "Gaius", "Cordelia", "Gregor", "Nowi", "Libra",
    "Tharja", "Anna", "Olivia", "Cherche", "Henry", "Say'ri", "Tiki", "Basilio", "Flavia"
]

units = []
for char in gen1_chars:
    key = n(char)
    if char == "Robin_M" or char == "Robin_F":
        b = {"HP": 19, "Str": 6, "Mag": 5, "Skl": 5, "Spd": 6, "Lck": 4, "Def": 6, "Res": 4, "Class": "Tactician", "Lv": 1, "Weapon Rank": "E", "Skills": "Veteran"}
        g = growths_map.get("avatar")
        m = mod_map.get("avatar(neutral)") or {"Str":0,"Mag":0,"Skl":0,"Spd":0,"Lck":0,"Def":0,"Res":0}
        r = recruit_map.get("avatar")
    else:
        b = bases_map.get(key)
        g = growths_map.get(key)
        m = mod_map.get(key)
        r = recruit_map.get(key)

    if not b or not g:
        print(f"Missing data for {char}: b={bool(b)} g={bool(g)}")
        continue
    
    if not m: m = {"Str":0,"Mag":0,"Skl":0,"Spd":0,"Lck":0,"Def":0,"Res":0}

    stats = {
        "hp": safe_int(b.get("HP", 0)),
        "str": safe_int(b.get("Str", 0)),
        "mag": safe_int(b.get("Mag", 0)),
        "skl": safe_int(b.get("Skl", 0)),
        "spd": safe_int(b.get("Spd", 0)),
        "lck": safe_int(b.get("Lck", 0)),
        "def": safe_int(b.get("Def", 0)),
        "res": safe_int(b.get("Res", 0))
    }
    growth_rates = {
        "hp": safe_int(g.get("HP", 0)),
        "str": safe_int(g.get("Str", 0)),
        "mag": safe_int(g.get("Mag", 0)),
        "skl": safe_int(g.get("Skl", 0)),
        "spd": safe_int(g.get("Spd", 0)),
        "lck": safe_int(g.get("Lck", 0)),
        "def": safe_int(g.get("Def", 0)),
        "res": safe_int(g.get("Res", 0))
    }
    mod_rates = {
        "str": safe_int(m.get("Str", 0)),
        "mag": safe_int(m.get("Mag", 0)),
        "skl": safe_int(m.get("Skl", 0)),
        "spd": safe_int(m.get("Spd", 0)),
        "lck": safe_int(m.get("Lck", 0)),
        "def": safe_int(m.get("Def", 0)),
        "res": safe_int(m.get("Res", 0))
    }
    cls = str(b.get("Class", "")).lower().replace(" ", "_").replace("_(f)","").replace("_(m)","")
    lvl = safe_int(b.get("Lv", 1))
    
    wk = str(b.get("Weapon Rank", ""))
    w_ranks = {}
    if isinstance(wk, str):
        parts = wk.replace(" (+10)", "").replace(" (+20)", "").replace(" (+30)", "").split()
        for i in range(len(parts)-1):
            if len(parts[i+1]) == 1 and parts[i+1].isalpha():
                w_ranks[parts[i]] = parts[i+1]
                
    skills_raw = b.get("Skills", "")
    skills = [s.strip() for s in str(skills_raw).split(",")] if isinstance(skills_raw, str) and not pd.isna(skills_raw) and skills_raw else []
    
    gender = "F" if char == "Robin_F" or "F" in char or char in ["Lissa", "Sully", "Miriel", "Sumia", "Maribelle", "Panne", "Cordelia", "Nowi", "Tharja", "Anna", "Olivia", "Cherche", "Say'ri", "Tiki", "Flavia"] else "M"
    id_name = char.replace("'", "").lower()
    name = char.split("_")[0] if "_" in char else char
    
    unit_obj = {
        "id": id_name,
        "name": name.replace("'", ""),
        "game": "Awakening",
        "class": cls,
        "joinChapter": str(r.get("Chapter", "") if r and not pd.isna(r.get("Chapter")) else "").split("/")[0].strip(),
        "level": lvl,
        "stats": stats,
        "growths": growth_rates,
        "statModifiers": mod_rates,
        "startingSkills": skills,
        "innateWeaknesses": [],
        "gender": gender,
        "baseWeaponRanks": w_ranks,
        "supports": []
    }
    units.append(unit_obj)

with open("data/awakening/units.json", "w") as f:
    json.dump(units, f, indent=2)

print(f"Parsed {len(units)} units")
