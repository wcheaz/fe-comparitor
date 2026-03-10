import json
from bs4 import BeautifulSoup

def process_local_html():
    with open('awakening_classes.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    heading = soup.find(id='Fire_Emblem_Awakening')
    table = heading.find_next('table')
    
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
    
    # Check row 0, 1, 2 for headers
    headers = None
    header_row_idx = 0
    for r in range(3):
        h = [grid.get((r, c)).text.strip() if grid.get((r, c)) else "" for c in range(max_col + 1)]
        if "Class" in h and "Promotion options" in h:
            headers = h
            header_row_idx = r
            break
            
    if not headers:
        print("Required headers not found.")
        return []
        
    class_idx = headers.index("Class")
    promo_idx = headers.index("Promotion options")
    
    max_row = max(r for (r, c) in grid.keys())
    
    data_dict = {}
    
    for r in range(header_row_idx + 1, max_row + 1):
        if (r, class_idx) not in grid or (r, promo_idx) not in grid:
            continue
            
        base_class_cell = grid[(r, class_idx)]
        promo_cell = grid[(r, promo_idx)]
        
        base_class = base_class_cell.text.strip()
        
        # Promotions are usually links
        links = promo_cell.find_all("a")
        promos = [link.text.strip() for link in links if link.text.strip()]
        
        # If there are no links, just get the text if it's not empty, though often "—" means none.
        if not promos:
            text = promo_cell.text.strip()
            if text and text != "—" and text != "-":
                promos = [text]
                
        if base_class not in data_dict:
            data_dict[base_class] = set()
        data_dict[base_class].update(promos)
        
    res = [{"Class": k, "Promotion options": list(v)} for k, v in data_dict.items() if k]
    return res

if __name__ == "__main__":
    promotions = process_local_html()
    with open("../dev/awakening_scraped_raw.json", "w") as f:
        json.dump({"promotions": promotions}, f, indent=2)
    print(f"Scraped data written to dev/awakening_scraped_raw.json. Found {len(promotions)} classes.")
