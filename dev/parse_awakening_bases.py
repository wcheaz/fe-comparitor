import json
import os

def main():
    raw_path = "../dev/awakening_class_bases_raw.json"
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
        
    raw_map = { n(r["Class"]): r for r in raw_data if "Class" in r }
    
    updated = 0
    for cls in classes:
        # Remove promotionBonus completely
        if "promotionBonus" in cls:
            del cls["promotionBonus"]
            
        key = cls["id"]
        # Special case: Lord (Chrom) vs Lord (Lucina), but our id is just "lord". Let's match based on name/id.
        if key in raw_map:
            r = raw_map[key]
        elif key == "lord":
            r = raw_map.get("lord_(chrom)") 
        elif key == "war_monk":
            r = raw_map.get("war_monk/cleric")
        else:
            r = None
            
        if r:
            def sf(val):
                if not val or val == '-': return 0
                try: return int(val)
                except: return 0
                
            cls["baseStats"] = {
                "hp": sf(r.get("HP", 0)),
                "str": sf(r.get("Str", 0)),
                "mag": sf(r.get("Mag", 0)),
                "skl": sf(r.get("Skl", 0)),
                "spd": sf(r.get("Spd", 0)),
                "lck": sf(r.get("Lck", 0)),
                "def": sf(r.get("Def", 0)),
                "res": sf(r.get("Res", 0))
            }
            updated += 1
            
    with open(classes_path, "w") as f:
        json.dump(classes, f, indent=2)
        
    print(f"Updated {updated} classes with new base stats and removed promotion bonuses.")

if __name__ == "__main__":
    main()
