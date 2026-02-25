import json
import urllib.request
from bs4 import BeautifulSoup
import re

url = "https://serenesforest.net/the-sacred-stones/classes/promotion-gains/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read()
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    
    # Extract
    gains = []
    for table in tables:
        for row in table.find_all('tr'):
            cols = [col.text.strip() for col in row.find_all(['td', 'th'])]
            if len(cols) >= 10 and cols[0] != 'Class':
                # Class | Promotion | HP | S/M | Skl | Spd | Def | Res | Con | Mov | Weapon Ranks
                source_name = cols[0]
                dest_name = cols[1]
                
                def parse_stat(s):
                    # +4 -> 4, -1 -> -1
                    s = s.replace('+', '')
                    try:
                        return int(s)
                    except:
                        return 0
                        
                bonus = {
                    'hp': parse_stat(cols[2]),
                    'str': parse_stat(cols[3]), # since s/m
                    'skl': parse_stat(cols[4]),
                    'spd': parse_stat(cols[5]),
                    'def': parse_stat(cols[6]),
                    'res': parse_stat(cols[7]),
                    'con': parse_stat(cols[8]),
                    'mov': parse_stat(cols[9])
                }
                gains.append({'source': source_name, 'dest': dest_name, 'bonus': bonus})
                
    # Now map to JSON
    with open('data/sacred_stones/classes.json', 'r') as f:
        classes = json.load(f)
        
    class_map = {c['name'].lower():c['id'] for c in classes}
    # Add manual overrides for specific gendered/weird names
    hardcoded_map = {
        'lord (eirika)': 'lord_eirika',
        'great lord (f)': 'great_lord_eirika',
        'lord (ephraim)': 'lord_ephraim',
        'great lord (m)': 'great_lord_ephraim',
        'recruit': 'recruit',
        'recruit (2)': 'recruit_2',
        'recruit (3)': 'recruit_3',
        'cavalier (m)': 'cavalier_m',
        'cavalier (f)': 'cavalier_f',
        'paladin (m)': 'paladin_m',
        'paladin (f)': 'paladin_f',
        'great knight (m)': 'great_knight_m',
        'great knight (f)': 'great_knight_f',
        'knight (m)': 'knight_m',
        'knight (f)': 'knight_f',
        'general (m)': 'general_m',
        'general (f)': 'general_f',
        'assassin (m)': 'assassin_m',
        'assassin (f)': 'assassin_f',
        'hero (m)': 'hero_m',
        'hero (f)': 'hero_f',
        'swordmaster (m)': 'swordmaster_m',
        'swordmaster (f)': 'swordmaster_f',
        'archer (m)': 'archer_m',
        'archer (f)': 'archer_f',
        'sniper (m)': 'sniper_m',
        'sniper (f)': 'sniper_f',
        'ranger (m)': 'ranger_m',
        'ranger (f)': 'ranger_f',
        'wyvern knight (m)': 'wyvern_knight_m',
        'wyvern knight (f)': 'wyvern_knight_f',
        'mage (m)': 'mage_m',
        'mage (f)': 'mage_f',
        'sage (m)': 'sage_m',
        'sage (f)': 'sage_f',
        'mage knight (m)': 'mage_knight_m',
        'mage knight (f)': 'mage_knight_f',
        'bishop (m)': 'bishop_m',
        'bishop (f)': 'bishop_f',
        'pupil (2)': 'pupil_2',
        'pupil (3)': 'pupil_3',
        'journeyman (2)': 'journeyman_2',
        'journeyman (3)': 'journeyman_3',
        'falcoknight': 'falcon_knight' # or falcoknight, need to check
    }
    
    def get_class_id(name, hint_gender=None):
        name_lower = name.lower()
        if name_lower in hardcoded_map:
            return hardcoded_map[name_lower]
        # remove (M) / (F)
        base_name = re.sub(r'\s*\([mf]\)', '', name_lower)
        # find matching class with gender
        for c in classes:
            if c['name'].lower() == base_name:
                if hint_gender and c.get('gender') == hint_gender:
                    return c['id']
                elif not hint_gender:
                    return c['id']
        return None
        
    for c in classes:
        c['promotesTo'] = []
        c['promotionBonus'] = {}

    for g in gains:
        src_name = g['source']
        dst_name = g['dest']
        # Extract gender hint from dest if any
        gender_hint = 'M' if '(M)' in src_name else 'F' if '(F)' in src_name else None
        
        src_id = get_class_id(src_name, gender_hint)
        dst_id = get_class_id(dst_name, gender_hint)
        
        if not dst_id:
            # fallback try to get simply by dest_name
            dst_id = get_class_id(dst_name)
            
        if src_id and dst_id:
            for c in classes:
                if c['id'] == src_id:
                    if dst_id not in c['promotesTo']:
                        c['promotesTo'].append(dst_id)
                    # Note: in FE, promotion bonuses are tied to the TARGET class, but our schema puts it on the source class?
                    # Wait, no. In classes.json, does it go onto the target or source?
                    # Wait, if Cavalier -> Paladin AND Cavalier -> Great Knight, how does our schema handle it?
                    # Ah, wait! The user's schema says `promotionBonus` is on the Class. 
                    # If C -> P is +2, C -> GK is +3, wait! In FE8 it depends on the target class.
                    pass
        else:
            print(f"Could not map {src_name} -> {dst_name}")
            
    # Check schema properly:
    # Wait, our `classes.json` has `promotionBonus` INSIDE the class definition. 
    # BUT wait, does our schema support per-promotion bonuses? 
    # Let me read types/unit.ts
except Exception as e:
    print(f"Error: {e}")
