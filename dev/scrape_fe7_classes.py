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

def format_id(name):
    # Some special remapping
    name = name.lower().strip()
    if name == "armor knight": return "knight"
    if name == "falcon knight": return "falcon_knight"   
    if name == "falcoknight": return "falcon_knight"
    if name == "nomadic trooper (m)": return "nomadic_trooper_m"
    if name == "nomadic trooper (f)": return "nomadic_trooper_f"
    if name == "wyvern lord (m)": return "wyvern_lord_m"
    if name == "wyvern lord (f)": return "wyvern_lord_f"
    if name == "druid (f)": return "druid_f"
    if name == "druid (m)": return "druid_m"
    
    return name.replace(" ", "_").replace("(", "").replace(")", "").replace(".", "")

def parse_table(url, is_promo=False):
    soup = get_soup(url)
    data = {}
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
            
            cls_name = cells[c_idx].text.strip()
            
            if is_promo and cls_name == "Pegasus Knight/Wyvern Rider":
                # Special cases where Serenes groups them
                pass
            
            c_id = format_id(cls_name)
            
            stats = {
                "hp": parse_stat(cells[hp_idx].text),
                "str": parse_stat(cells[str_idx].text),
                "skl": parse_stat(cells[skl_idx].text),
                "spd": parse_stat(cells[spd_idx].text),
                "def": parse_stat(cells[def_idx].text),
                "res": parse_stat(cells[res_idx].text),
                "con": parse_stat(cells[con_idx].text),
                "mov": parse_stat(cells[mov_idx].text),
            }
            if c_id not in data:
                data[c_id] = {}
            data[c_id] = stats
    return data

if __name__ == "__main__":
    bases = parse_table("https://serenesforest.net/blazing-sword/classes/base-stats/")
    max_stats = parse_table("https://serenesforest.net/blazing-sword/classes/maximum-stats/")
    promos = parse_table("https://serenesforest.net/blazing-sword/classes/promotion-gains/", is_promo=True)
    
    with open("dev/extracted_fe7_classes.json", "w") as f:
        json.dump({"bases": bases, "max": max_stats, "promos": promos}, f, indent=4)
    print("Extracted class data to dev/extracted_fe7_classes.json")
