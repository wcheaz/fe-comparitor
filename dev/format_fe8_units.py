import json

with open('data/sacred_stones/units.json', 'r') as f:
    units = json.load(f)

for u in units:
    # Fix chapters
    if isinstance(u.get('joinChapter'), list):
        new_chaps = []
        for chap in u['joinChapter']:
            if chap.isdigit() or chap in ["5x", "15E", "15E/16E", "15", "16"]:
                new_chaps.append(f"Chapter {chap}")
            else:
                new_chaps.append(chap) # fallback
        u['joinChapter'] = new_chaps
    elif isinstance(u.get('joinChapter'), str):
        if u['joinChapter'].isdigit() or u['joinChapter'] in ["5x", "15E"]:
            u['joinChapter'] = [f"Chapter {u['joinChapter']}"]
        else:
            u['joinChapter'] = [u['joinChapter']]
            
    # Now for promotions: we need to match the promotions schema from other games (like FE7)
    # So if you are unpromoted, the "promotions" array in units.json lists WHICH class you promote *into*.
    # Actually wait! The `promotions` array in `units.json` in fe7/fe6 is usually empty or it contains class IDs.
    pass

    
with open('data/sacred_stones/units.json', 'w') as f:
    json.dump(units, f, indent=2)
    
print("Reformatted chapters for FE8 units.")
