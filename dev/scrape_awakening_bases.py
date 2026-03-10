import json
import requests
import pandas as pd
from bs4 import BeautifulSoup

def main():
    url = "https://serenesforest.net/awakening/classes/base-stats/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    # Try using pandas read_html first
    dfs = pd.read_html(url, storage_options=headers)
    
    if not dfs:
        print("No tables found")
        return
        
    print(f"Found {len(dfs)} tables")
    
    # We expect tables for base stats.
    # Usually the first table contains the regular classes.
    table = dfs[0]
    
    with open("../dev/awakening_class_bases_raw.json", "w") as f:
        json.dump(table.to_dict('records'), f, indent=2)
        
    print("Saved raw table to ../dev/awakening_class_bases_raw.json")

if __name__ == "__main__":
    main()
