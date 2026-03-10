import json
from bs4 import BeautifulSoup

def main():
    with open('awakening_bases.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # In Serenes Forest, the table usually has headers: Class, HP, Str, Mag, Skl, Spd, Lck, Def, Res, Mov
    tables = soup.find_all('table')
    target_table = None
    
    for t in tables:
        headers = [th.text.strip() for th in t.find_all('th')]
        if 'Class' in headers and 'HP' in headers and 'Str' in headers:
            target_table = t
            break
            
    if not target_table:
        print("No matching table found")
        return
        
    headers = [th.text.strip() for th in target_table.find_all('th')]
    
    data = []
    for row in target_table.find_all('tr')[1:]:
        cols = row.find_all('td')
        if len(cols) == len(headers):
            row_data = {}
            for i, h in enumerate(headers):
                row_data[h] = cols[i].text.strip()
            data.append(row_data)
            
    with open("../dev/awakening_class_bases_raw.json", "w") as f:
        json.dump(data, f, indent=2)
        
    print(f"Saved {len(data)} rows to ../dev/awakening_class_bases_raw.json")

if __name__ == "__main__":
    main()
