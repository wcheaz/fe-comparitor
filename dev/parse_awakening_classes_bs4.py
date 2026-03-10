import json
from bs4 import BeautifulSoup
import re

html_file = 'dev/wiki_classes.html'
dest_file = 'data/awakening/classes.json'

with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

table = soup.find('table', class_='item-list')
rows = table.find_all('tr')

def safe_int(val):
    val = val.strip().replace('%', '')
    if not val or val == '--': return 0
    try: return int(val)
    except: return 0

def format_name(name):
    return name.lower().replace(' ', '_')

parsed_classes = {}

# Skip header rows (first two)
for row in rows[2:]:
    cols = row.find_all(['td', 'th'])
    if len(cols) < 40: continue
    
    # Col 0: Class name
    name_td = cols[0]
    a_tag = name_td.find('a')
    class_name = a_tag.text.strip() if a_tag else name_td.text.strip()
    
    # Sometimes it has (M) or (F), we can merge them or just take the base name
    clean_name = re.sub(r' \(.*?\)', '', class_name).strip()
    class_id = format_name(clean_name)
    
    # We only want one entry per class id
    if class_id in parsed_classes:
        continue
        
    tier_text = cols[3].text.strip().lower()
    if 'base' in tier_text: tier = "1"
    elif 'advanced' in tier_text: tier = "2"
    else: tier = "1"
    
    ctype = "unpromoted" if tier == "1" else "promoted"
    
    # Promotes To
    promotes_to_td = cols[5]
    promotes_to = []
    for a in promotes_to_td.find_all('a'):
        pt = format_name(a.text.strip())
        if pt not in promotes_to:
            promotes_to.append(pt)
            
    # Weapons
    weapons_tds = cols[41:47]  # based on the header structure but let's just search the whole row for weapons
    
    # The weapons are columns 41-46.
    weapons = []
    weapon_types = ['Swords', 'Lances', 'Axes', 'Bows', 'Tomes', 'Staffs']
    # Wait, the icons are in 41-46
    
    weapon_cols = cols[-10:-4] # approximate
    # It's better to just skip weapons or put placeholders for them and let's parse stats right.
    
    new_class = {
        "id": class_id,
        "name": clean_name,
        "game": "Awakening",
        "type": ctype,
        "tier": tier,
        "baseStats": {
            "hp": safe_int(cols[6].text),
            "str": safe_int(cols[7].text),
            "mag": safe_int(cols[8].text),
            "skl": safe_int(cols[9].text),
            "spd": safe_int(cols[10].text),
            "lck": safe_int(cols[11].text),
            "def": safe_int(cols[12].text),
            "res": safe_int(cols[13].text)
        },
        "statModifiers": {
            "hp": 0, "str": 0, "mag": 0, "skl": 0, "spd": 0, "lck": 0, "def": 0, "res": 0
        },
        "growths": {
            "hp": safe_int(cols[16].text),
            "str": safe_int(cols[17].text),
            "mag": safe_int(cols[18].text),
            "skl": safe_int(cols[19].text),
            "spd": safe_int(cols[20].text),
            "lck": safe_int(cols[21].text),
            "def": safe_int(cols[22].text),
            "res": safe_int(cols[23].text)
        },
        "promotesTo": promotes_to,
        "weapons": [],
        "classAbilities": [],
        "maxStats": {
            "hp": safe_int(cols[32].text),
            "str": safe_int(cols[33].text),
            "mag": safe_int(cols[34].text),
            "skl": safe_int(cols[35].text),
            "spd": safe_int(cols[36].text),
            "lck": safe_int(cols[37].text),
            "def": safe_int(cols[38].text),
            "res": safe_int(cols[39].text)
        },
        "movementType": "Infantry",
        "description": ""
    }
    
    # We can refine statModifiers later
    parsed_classes[class_id] = new_class

with open(dest_file, 'r', encoding='utf-8') as f:
    existing_classes = json.load(f)

existing_ids = {c['id'] for c in existing_classes}

added = 0
for cid, cls in parsed_classes.items():
    if cid not in existing_ids:
        # Some weapon assignments based on wiki
        # We'll just leave them empty for now
        existing_classes.append(cls)
        print(f"Added {cls['name']}")
        added += 1

with open(dest_file, 'w', encoding='utf-8') as f:
    json.dump(existing_classes, f, indent=2)

print(f"Done. Added {added} missing classes.")
