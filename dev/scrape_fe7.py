import urllib.request
from bs4 import BeautifulSoup
import json
import re

def get_soup(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read()
    return BeautifulSoup(html, 'html.parser')

def parse_wiki_names():
    url = "https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_The_Blazing_Blade"
    soup = get_soup(url)
    names = set()
    for tr in soup.find_all('tr'):
        tds = tr.find_all('td')
        if not tds:
            continue
        # Usually the first or second td has the name
        a_tag = tds[0].find('a')
        if a_tag:
            name = a_tag.text.strip()
            names.add(name)
            
    # Hardcode some mappings because Serenes uses different names sometimes or FE7 has multiple
    # e.g., 'Eleanora' vs 'Eleanor', etc. Actually, let's just get the list of playable characters.
    # We really only care about playable ones from Serenes.
    return names

def parse_serenes_bases():
    url = "https://serenesforest.net/blazing-sword/characters/base-stats/"
    soup = get_soup(url)
    
    bases = {}
    
    # Tables are inside <div class="page-content"> usually
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        headers = [th.text.strip() for th in rows[0].find_all('th')]
        
        # Determine format based on headers
        # Expected: Name, Class, Lv, HP, S/M, Skl, Spd, Lck, Def, Res, Con, Mov, Affin, Weapon Ranks
        if "Name" not in headers or "Class" not in headers:
            continue
            
        ranks_idx = None
        headers_lower = [h.lower() for h in headers]
        for r_name in ["weapon ranks", "weapon rank", "weapon"]:
            if r_name in headers_lower:
                ranks_idx = headers_lower.index(r_name)
                break
        
        if ranks_idx is None:
            continue
        
        # also update other indices to use the first occurrence
        name_idx = headers_lower.index("name")
        class_idx = headers_lower.index("class")
        lv_idx = headers_lower.index("lv")
        hp_idx = headers_lower.index("hp")
        str_idx = headers_lower.index("s/m")
        skl_idx = headers_lower.index("skl")
        spd_idx = headers_lower.index("spd")
        lck_idx = headers_lower.index("lck")
        def_idx = headers_lower.index("def")
        res_idx = headers_lower.index("res")
        con_idx = headers_lower.index("con")
        mov_idx = headers_lower.index("mov")
        affin_idx = headers_lower.index("affin")
        
        for row in rows[1:]:
            tbodies = row.find_parent('tbody')
            if tbodies is None and row.parent.name != 'table': continue
                
            cells = row.find_all('td')
            if len(cells) < ranks_idx:
                continue
            
            name = cells[name_idx].text.strip()
            # Handle double names like "Nils / Ninian"
            if " / " in name:
                names = name.split(" / ")
            else:
                names = [name]
                
            for n in names:
                if n == "Nils" or n == "Ninian":
                    # They share stats mostly but let's separate
                    pass

                cls = cells[class_idx].text.strip()
                try:
                    lv = int(cells[lv_idx].text.strip())
                except:
                    lv = 1
                    
                def parse_stat(txt):
                    try: return int(txt)
                    except: return 0
                
                affin = ""
                img_tag = cells[affin_idx].find('img')
                if img_tag:
                    affin = img_tag.get('title') or img_tag.get('alt') or ""
                if not affin:
                    affin = cells[affin_idx].text.strip()
                if affin == "-": affin = "None"
                
                ranks_str = cells[ranks_idx].text.strip()
                
                bases[n] = {
                    "class": cls,
                    "level": lv,
                    "stats": {
                        "hp": parse_stat(cells[hp_idx].text),
                        "str": parse_stat(cells[str_idx].text),
                        "skl": parse_stat(cells[skl_idx].text),
                        "spd": parse_stat(cells[spd_idx].text),
                        "lck": parse_stat(cells[lck_idx].text),
                        "def": parse_stat(cells[def_idx].text),
                        "res": parse_stat(cells[res_idx].text),
                        "con": parse_stat(cells[con_idx].text),
                        "mov": parse_stat(cells[mov_idx].text)
                    },
                    "affinity": affin,
                    "ranks_str": ranks_str
                }
                
    return bases

def parse_serenes_growths():
    url = "https://serenesforest.net/blazing-sword/characters/growth-rates/"
    soup = get_soup(url)
    
    growths = {}
    
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        headers = [th.text.strip() for th in rows[0].find_all('th')]
        
        if "Name" not in headers:
            continue
            
        name_idx = headers.index("Name")
        hp_idx = headers.index("HP")
        str_idx = headers.index("S/M")
        skl_idx = headers.index("Skl")
        spd_idx = headers.index("Spd")
        lck_idx = headers.index("Lck")
        def_idx = headers.index("Def")
        res_idx = headers.index("Res")
        
        for row in rows[1:]:
            cells = row.find_all('td')
            if len(cells) < res_idx:
                continue
                
            name = cells[name_idx].text.strip()
            
            def parse_stat(txt):
                try: return int(txt.replace('%', ''))
                except: return 0
                
            if " / " in name:
                names = name.split(" / ")
            else:
                names = [name]
                
            for n in names:
                growths[n] = {
                    "hp": parse_stat(cells[hp_idx].text),
                    "str": parse_stat(cells[str_idx].text),
                    "skl": parse_stat(cells[skl_idx].text),
                    "spd": parse_stat(cells[spd_idx].text),
                    "lck": parse_stat(cells[lck_idx].text),
                    "def": parse_stat(cells[def_idx].text),
                    "res": parse_stat(cells[res_idx].text)
                }
                
    return growths

def get_weapon_ranks(rank_str):
    # e.g., "Sword A, Lance B" -> {"sword": "A", "lance": "B"}
    # Need to convert weapon names like Swa to sword etc.
    # Actually Serenes says: "Sword D" or just "Sword" with an icon? 
    pass

import sys
if __name__ == "__main__":
    bases = parse_serenes_bases()
    growths = parse_serenes_growths()
    # Let's just dump them to see what it looks like
    with open("scraped_fe7.json", "w") as f:
        json.dump({"bases": bases, "growths": growths}, f, indent=4)
    print("Scraped data and saved to scraped_fe7.json")
