import json
import os

def main():
    raw_path = "../dev/awakening_classes_raw.json"
    if not os.path.exists(raw_path):
        print("Raw data not found")
        return
        
    with open(raw_path, "r") as f:
        raw_data = json.load(f)
        
    classes_path = os.path.abspath("../data/awakening/classes.json")
    with open(classes_path, "r") as f:
        classes = json.load(f)
        
    def n(name):
        return name.lower().replace(" ", "_")
        
    raw_bases = raw_data.get("bases", [])
    raw_map = { n(r["Class"]): r for r in raw_bases if "Class" in r }
    
    updated = 0
    for cls in classes:
        # Remove promotionBonus completely
        if "promotionBonus" in cls:
            del cls["promotionBonus"]
            
        key = cls["id"]
        
        # Match class names
        target = None
        if key in raw_map:
            target = raw_map[key]
        elif key == "lord":
            target = raw_map.get("lord_(m)") 
        elif key == "great_lord":
            target = raw_map.get("great_lord_(m)")
        elif key == "priest":
            target = raw_map.get("priest,_cleric")
        elif key == "cleric":
            target = raw_map.get("priest,_cleric")
        elif key == "war_monk":
            target = raw_map.get("war_monk/cleric")
        elif key == "taguel":
            target = raw_map.get("taguel_*")
        elif key == "manakete":
            target = raw_map.get("manakete_*")
            
        if target:
            def sf(val):
                if not val or val == '-': return 0
                try: return int(val)
                except: return 0
                
            cls["baseStats"] = {
                "hp": sf(target.get("HP", 0)),
                "str": sf(target.get("Str", 0)),
                "mag": sf(target.get("Mag", 0)),
                "skl": sf(target.get("Skl", 0)),
                "spd": sf(target.get("Spd", 0)),
                "lck": sf(target.get("Lck", 0)),  # Lck is apparently missing in this specific table? wait, is it?
                # looking at the raw json: it has HP, Str, Mag, Skl, Spd, Def, Res, Mov. 
                # Wow, Lck is not in awakening_classes_raw.json 
                # Let me keep the existing luck base stat if it's there
                "def": sf(target.get("Def", 0)),
                "res": sf(target.get("Res", 0))
            }
            if "Lck" in target:
                 cls["baseStats"]["lck"] = sf(target["Lck"])
            else:
                 # Default luck is 0 usually from Serenes Forest class bases, they don't have base luck.
                 cls["baseStats"]["lck"] = 0
            
            updated += 1
            
    with open(classes_path, "w") as f:
        json.dump(classes, f, indent=2)
        
    print(f"Updated {updated} classes with new base stats and removed promotion bonuses.")

if __name__ == "__main__":
    main()
