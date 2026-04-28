import pandas as pd
import json

url = "https://serenesforest.net/awakening/characters/base-stats/main-story/"
storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def main():
    print(f"Fetching tables from {url}...")
    dfs = pd.read_html(url, storage_options=storage_options)
    print(f"Found {len(dfs)} tables.")

    all_units = []
    for i, df in enumerate(dfs):
        cols = [str(c).strip() for c in df.columns]
        if "Name" in cols and "HP" in cols:
            print(f"Table {i}: {len(df)} rows, columns={cols}")
            for _, row in df.iterrows():
                name = str(row.get("Name", "")).strip()
                if "(H)" in name or "(L)" in name:
                    continue
                entry = {}
                for col in df.columns:
                    entry[col] = str(row[col]).strip()
                all_units.append(entry)

    with open("dev/awakening_unit_bases_raw.json", "w") as f:
        json.dump(all_units, f, indent=2)

    print(f"Saved {len(all_units)} unit rows to dev/awakening_unit_bases_raw.json")

if __name__ == "__main__":
    main()
