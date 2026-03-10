import json
import pandas as pd
from bs4 import BeautifulSoup

def main():
    with open('awakening_bases.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    dfs = pd.read_html(html)
    
    if not dfs:
        print("No tables found")
        return
        
    print(f"Found {len(dfs)} tables")
    
    # We expect the first table to contain the regular classes base stats
    table = dfs[0]
    
    with open("../dev/awakening_class_bases_raw.json", "w") as f:
        json.dump(table.to_dict('records'), f, indent=2)
        
    print("Saved raw table to ../dev/awakening_class_bases_raw.json")

if __name__ == "__main__":
    main()
