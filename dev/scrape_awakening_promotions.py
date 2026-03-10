import json
import requests
from bs4 import BeautifulSoup

# Define the target URLs
urls = {
    "promotions": "https://fireemblemwiki.org/wiki/Class_change/Nintendo_3DS_games"
}

def parse_table_grid(table):
    rows = table.find_all("tr")
    grid = {}
    for r_idx, row in enumerate(rows):
        cells = row.find_all(["th", "td"])
        c_idx = 0
        for cell in cells:
            while (r_idx, c_idx) in grid:
                c_idx += 1
                
            colspan = int(cell.get("colspan", 1))
            rowspan = int(cell.get("rowspan", 1))
            
            for i in range(rowspan):
                for j in range(colspan):
                    grid[(r_idx + i, c_idx + j)] = cell
            c_idx += colspan
            
    if not grid:
        return []
        
    max_col = max(c for (r, c) in grid.keys())
    
    headers = None
    header_row_idx = 0
    for r in range(3):
        h = [grid.get((r, c)).text.strip() if grid.get((r, c)) else "" for c in range(max_col + 1)]
        if "Base class" in h and "Advanced class" in h:
            headers = h
            header_row_idx = r
            break
            
    if not headers:
        print("Required headers not found.")
        return []
        
    class_idx = headers.index("Base class")
    promo_idx = headers.index("Advanced class")
    
    max_row = max(r for (r, c) in grid.keys())
    
    data_dict = {}
    
    for r in range(header_row_idx + 1, max_row + 1):
        if (r, class_idx) not in grid or (r, promo_idx) not in grid:
            continue
            
        base_class_cell = grid[(r, class_idx)]
        promo_cell = grid[(r, promo_idx)]
        
        # Remove (Character) from Lord (Chrom) etc.
        base_class = base_class_cell.text.strip().split('(')[0].strip()
        
        links = promo_cell.find_all("a")
        promos = [link.text.strip().split('(')[0].strip() for link in links if link.text.strip()]
        
        if not promos:
            text = promo_cell.text.strip().split('(')[0].strip()
            if text and text != "—" and text != "-":
                promos = [text]
                
        if base_class not in data_dict:
            data_dict[base_class] = set()
        data_dict[base_class].update(promos)
        
    res = [{"Class": k, "Promotion options": list(v)} for k, v in data_dict.items() if k]
    return res

def get_table(url, header_id):
    """Fetches the table directly under the given header id."""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    heading = soup.find(id=header_id)
    if not heading:
        print(f"Could not find heading {header_id}")
        return []
        
    table = heading.find_next("table")
    if not table:
        print("Could not find the table.")
        return []
        
    return parse_table_grid(table)

# Scrape the data
promotions_data = get_table(urls["promotions"], "Fire_Emblem_Awakening")

# Cache the raw data to JSON
with open("../dev/awakening_scraped_raw.json", "w") as f:
    json.dump({
        "promotions": promotions_data
    }, f, indent=2)

print(f"Scraped data written to dev/awakening_scraped_raw.json. Found {len(promotions_data)} classes.")
