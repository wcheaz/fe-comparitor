import pandas as pd
import json

url = "https://fireemblemwiki.org/wiki/List_of_classes_in_Fire_Emblem_Awakening"
storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    print(f"Fetching tables from {url}...")
    dfs = pd.read_html(url, storage_options=storage_options)
    print(f"Found {len(dfs)} tables.")
    
    raw_data = []
    for i, df in enumerate(dfs):
        raw_data.append(df.to_dict('records'))
        
    with open("dev/awakening_classes_raw.json", "w") as f:
        json.dump(raw_data, f, indent=2)
    print("Saved tables to dev/awakening_classes_raw.json")
except Exception as e:
    print(f"Error: {e}")
