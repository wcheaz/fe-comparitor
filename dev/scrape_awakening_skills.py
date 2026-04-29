import pandas as pd
import json

url = "https://serenesforest.net/awakening/miscellaneous/skills/"
storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    print(f"Fetching tables from {url}...")
    dfs = pd.read_html(url, storage_options=storage_options)
    print(f"Found {len(dfs)} tables.")

    obtainable_table = None
    for i, df in enumerate(dfs):
        cols = [str(c) for c in df.columns]
        if 'Skill' in cols and 'Class' in cols and 'Level' in cols:
            obtainable_table = df
            print(f"Found Obtainable Skills table at index {i} with {len(df)} rows.")
            print(f"Columns: {list(df.columns)}")
            break

    if obtainable_table is None:
        print("ERROR: Could not find the Obtainable Skills table.")
        for i, df in enumerate(dfs):
            print(f"Table {i}: columns={list(df.columns)}, rows={len(df)}")
        exit(1)

    records = obtainable_table.to_dict('records')

    with open("dev/awakening_skills_raw.json", "w") as f:
        json.dump(records, f, indent=2)
    print(f"Saved {len(records)} skill entries to dev/awakening_skills_raw.json")
except Exception as e:
    print(f"Error: {e}")
