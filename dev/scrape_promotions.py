import urllib.request
from bs4 import BeautifulSoup
import json
import re

def get_soup(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read()
    return BeautifulSoup(html, 'html.parser')

def parse_stat(txt):
    try: return int(txt.replace("+", "").replace('%', '').strip())
    except: return 0

def scrape_promotions():
    url = "https://serenesforest.net/blazing-sword/classes/promotion-gains/"
    soup = get_soup(url)
    
    promo_map = {}
    
    for table in soup.find_all('table'):
        rows = table.find_all('tr')
        if not rows: continue
        headers = [th.text.strip().lower() for th in rows[0].find_all('th')]
        if "class" not in headers or "hp" not in headers:
            continue
            
        c_idx = headers.index("class")
        hp_idx = headers.index("hp")
        str_idx = headers.index("s/m")
        skl_idx = headers.index("skl")
        spd_idx = headers.index("spd")
        def_idx = headers.index("def")
        res_idx = headers.index("res")
        con_idx = headers.index("con")
        mov_idx = headers.index("mov")
        
        for row in rows[1:]:
            cells = row.find_all('td')
            if len(cells) <= max(c_idx, hp_idx, res_idx): continue
            
            cls_name = cells[c_idx].text.strip().lower().replace(" ", "_").replace(".", "")
            
            # Map Serenes Forest Names to our ID format
            # e.g., 'knight lord', 'great lord', 'blade lord'
            promo_map[cls_name] = {
                "hp": parse_stat(cells[hp_idx].text),
                "str": parse_stat(cells[str_idx].text),
                "skl": parse_stat(cells[skl_idx].text),
                "spd": parse_stat(cells[spd_idx].text),
                "def": parse_stat(cells[def_idx].text),
                "res": parse_stat(cells[res_idx].text),
                "con": parse_stat(cells[con_idx].text),
                "mov": parse_stat(cells[mov_idx].text),
            }
            
    return promo_map

def map_class_name(cls_id, promo_map):
    base_id = cls_id.replace("_m", "").replace("_f", "")
    
    # special cases
    if base_id == "falcoknight": return "falcon_knight"
    if base_id == "wyvern_lord": return "wyvern_lord_m" # Serenes lists "Wyvern Lord M" and "Wyvern Lord F"
    
    # exact match
    if cls_id in promo_map: return cls_id
    if base_id in promo_map: return base_id
    
    # Check if gendered exists in promo_map
    if base_id + "_m" in promo_map: return base_id + "_m"
    if base_id + "_f" in promo_map: return base_id + "_f"
    
    return None

if __name__ == "__main__":
    promo_map = scrape_promotions()
    
    with open("data/blazing_blade/classes.json") as f:
        classes = json.load(f)
        
    for c in classes:
        if c["type"] == "promoted":
            matched_id = map_class_name(c["id"], promo_map)
            # The lords promote to knight lord, great lord, blade lord
            if c["id"] == "knight_lord": matched_id = "knight_lord"
            if c["id"] == "great_lord": matched_id = "great_lord"
            if c["id"] == "blade_lord": matched_id = "blade_lord"
            
            if matched_id and matched_id in promo_map:
                c["promotionBonus"] = promo_map[matched_id]
            else:
                print(f"Warning: Could not find promotion mapped for {c['id']}")
                
    with open("data/blazing_blade/classes.json", "w") as f:
        json.dump(classes, f, indent=4)
        
    print("Updated promotion bonuses!")
