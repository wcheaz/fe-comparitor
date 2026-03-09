import pandas as pd
import json

urls = {
    "bases": "https://serenesforest.net/awakening/classes/base-stats/",
    "growths": "https://serenesforest.net/awakening/classes/growth-rates/",
    "max": "https://serenesforest.net/awakening/classes/maximum-stats/"
}
storage_options = {'User-Agent': 'Mozilla/5.0'}

base_dfs = pd.read_html(urls["bases"], storage_options=storage_options)
growths_dfs = pd.read_html(urls["growths"], storage_options=storage_options)
max_dfs = pd.read_html(urls["max"], storage_options=storage_options)

def merge_dfs(dfs):
    all_recs = []
    for df in dfs:
        all_recs.extend(df.to_dict('records'))
    return all_recs

out = {
    "bases": merge_dfs(base_dfs),
    "growths": merge_dfs(growths_dfs),
    "max": merge_dfs(max_dfs)
}

with open("dev/awakening_classes_raw.json", "w") as f:
    json.dump(out, f, indent=2)

print("Class data scraped")
