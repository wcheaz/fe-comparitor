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
    
    gains = []
    for table in tables:
        for row in table.find_all('tr'):
            cols = [col.text.strip() for col in row.find_all(['td', 'th'])]
            if len(cols) >= 10 and cols[0] != 'Class':
                source_name = cols[0]
                dest_name = cols[1]
                
                def parse_stat(s):
                    s = s.replace('+', '')
                    try:
                        return int(s)
                    except:
                        return 0
                        
                bonus = {
                    'hp': parse_stat(cols[2]),
                    'str': parse_stat(cols[3]),
                    'mag': parse_stat(cols[3]), # since S/M is combined
                    'skl': parse_stat(cols[4]),
                    'spd': parse_stat(cols[5]),
                    'def': parse_stat(cols[6]),
                    'res': parse_stat(cols[7]),
                    'con': parse_stat(cols[8]),
                    'mov': parse_stat(cols[9])
                }
                gains.append({'source': source_name, 'dest': dest_name, 'bonus': bonus})
                
    with open('data/sacred_stones/classes.json', 'r') as f:
        classes = json.load(f)
        
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
        'assassin (m)': 'assassin', # Note: FE8 Assassin is mostly gender neutral in our json? Let's check!
        'assassin (f)': 'assassin',
        'assassin': 'assassin',
        'hero (m)': 'hero_m',
        'hero (f)': 'hero_f',
        'hero': 'hero_m', # Wait, FE8 Journeyman 2 -> Hero uses hero_m?
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
        'mage (m)': 'sage_m', # Wait, Mage -> Sage / Mage Knight
        'mage (f)': 'sage_f',
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
        'falcoknight': 'falcoknight',
        'wyvern lord': 'wyvern_lord',
        'wyvern rider': 'wyvern_rider',
        'thief': 'thief',
        'rogue': 'rogue',
        'mercenary': 'mercenary_m', # F merc is separate
        'pupil': 'pupil',
        'shaman (m)': 'shaman',
        'shaman': 'shaman',
        'druid': 'druid',
        'summoner': 'summoner',
        'priest': 'priest',
        'monk': 'monk',
        'cleric': 'cleric',
        'valkyrie': 'valkyrie',
        'journeyman': 'journeyman',
        'fighter': 'fighter',
        'pirate': 'pirate',
        'warrior': 'warrior',
        'berserker': 'berserker',
        'pegasus knight': 'pegasus_knight',
        'troubadour': 'troubadour',
    }
    
    def get_class_id(name):
        name_lower = name.lower()
        if name_lower in hardcoded_map:
            return hardcoded_map[name_lower]
        # try removing gender hints if no match
        base = re.sub(r'\s*\([mf]\)', '', name_lower)
        if base in hardcoded_map:
            return hardcoded_map[base]
        return None
        
    for c in classes:
        # Clear out wrong data on unpromoted classes and ensure arrays exist
        c['promotesTo'] = []
        c.pop('promotionBonus', None) # We will only set it on the TARGET class

    for g in gains:
        src_name = g['source']
        dst_name = g['dest']
        bonus = g['bonus']
        
        src_id = get_class_id(src_name)
        dst_id = get_class_id(dst_name)
        
        # In FE8, Mercenary -> Hero vs Hero(F), depends on if it's Mercenary(M) or Mercenary(F)
        if src_name == 'Mercenary':
            src_id_list = ['mercenary_m']
        elif src_name == 'Mercenary (F)':
            src_id_list = ['mercenary_f']
        elif src_name == 'Myrmidon (M)':
            src_id_list = ['myrmidon_m']
        else:
            if src_id:
                src_id_list = [src_id]
            else:
                src_id_list = []
                
        # Handle special cases for genders missing in the table
        if dst_name == 'Assassin':
            if src_name == 'Thief':
                dst_id = 'assassin'
        
        for s_id in src_id_list:
            # Map promotesTo
            for c in classes:
                if c['id'] == s_id:
                    if dst_id and dst_id not in c['promotesTo']:
                        c['promotesTo'].append(dst_id)
        
        # Map promotionBonus to target class
        if dst_id:
            for c in classes:
                if c['id'] == dst_id:
                    c['promotionBonus'] = bonus
                    
    # Let's handle some edge cases for gender splits missing in Serenes Forest
    # For example, Mercenary (F) -> Hero (F)
    # The table has Mercenary -> Hero. We should clone it to F.
    female_clones = {
        'mercenary_f': [('hero_f', 'hero_m'), ('ranger_f', 'ranger_m')]
    }
    for src_f, targets in female_clones.items():
        for dst_f, dst_m in targets:
            # Add to promotesTo
            for c in classes:
                if c['id'] == src_f and dst_f not in c['promotesTo']:
                    c['promotesTo'].append(dst_f)
            # Copy bonus from M to F if missing
            m_bonus = next((c.get('promotionBonus') for c in classes if c['id'] == dst_m), None)
            if m_bonus:
                for c in classes:
                    if c['id'] == dst_f:
                        c['promotionBonus'] = m_bonus
                        
    # Ensure every class at least has empty dict/array if missing
    for c in classes:
        if 'promotesTo' not in c:
            c['promotesTo'] = []
        if 'promotionBonus' not in c:
            c['promotionBonus'] = {}

    with open('data/sacred_stones/classes.json', 'w') as f:
        json.dump(classes, f, indent=2)
    print("Successfully updated classes.json")
    
except Exception as e:
    import traceback
    traceback.print_exc()
