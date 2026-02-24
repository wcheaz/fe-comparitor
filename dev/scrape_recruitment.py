import urllib.request
from bs4 import BeautifulSoup
import json
import re

def get_soup(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read()
    return BeautifulSoup(html, 'html.parser')

def scrape_recruitment():
    url = "https://serenesforest.net/blazing-sword/characters/recruitment/"
    soup = get_soup(url)
    
    recruitment_map = {}
    
    for table in soup.find_all('table'):
        rows = table.find_all('tr')
        if not rows: continue
        headers = [th.text.strip().lower() for th in rows[0].find_all('th')]
        if "name" not in headers:
            continue
            
        name_idx = headers.index("name")
        ch_idx = None
        if "ch e" in headers:
            ch_idx = headers.index("ch e")
        elif "ch" in headers:
            ch_idx = headers.index("ch")
        
        for row in rows[1:]:
            cells = row.find_all('td')
            if len(cells) <= max(name_idx, ch_idx): continue
            
            names_text = cells[name_idx].text.strip()
            ch_text = cells[ch_idx].text.strip()
            
            if not ch_text: continue
            
            # Usually chapter is like "11", "Prologue", "23 (E) / 24 (H)"
            # Let's clean it up a bit if needed. Actually the original table says "11" "P" etc.
            if ch_text == "P": ch_text = "Prologue"
            elif ch_text.isdigit(): ch_text = f"Chapter {ch_text}"
            elif ch_text.endswith("x"): ch_text = f"Chapter {ch_text}"
            
            names = names_text.split(" / ")
            for n in names:
                if n not in recruitment_map:
                    recruitment_map[n] = ch_text

    return recruitment_map

if __name__ == "__main__":
    rmap = scrape_recruitment()
    
    with open("data/blazing_blade/units.json") as f:
        units = json.load(f)
        
    for unit in units:
        name = unit["name"]
        search_name = name
        if name.endswith(" (FE7)"):
            search_name = name[:-6]
            
        if search_name in rmap:
            unit["joinChapter"] = rmap[search_name]
        elif search_name == "Nils":
            unit["joinChapter"] = rmap.get("Nils", "Chapter 7")
            
    with open("data/blazing_blade/units.json", "w") as f:
        json.dump(units, f, indent=4)
    print("Updated join chapters.")
