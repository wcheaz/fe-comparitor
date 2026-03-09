import pandas as pd
import json

urls = {
    "bases": "https://serenesforest.net/awakening/characters/base-stats/main-story/",
    "growths": "https://serenesforest.net/awakening/characters/growth-rates/base/",
    "modifiers": "https://serenesforest.net/awakening/characters/maximum-stats/modifiers/",
    "recruitment": "https://serenesforest.net/awakening/characters/recruitment/main-story/"
}

storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def get_table(url, match_str):
    dfs = pd.read_html(url, storage_options=storage_options, match=match_str)
    return dfs[0]

bases_df = get_table(urls["bases"], "Chrom")
growths_df = get_table(urls["growths"], "Chrom")
modifiers_df = get_table(urls["modifiers"], "Chrom")
recruit_df = get_table(urls["recruitment"], "Chrom")

with open("dev/awakening_scraped_raw.json", "w") as f:
    json.dump({
        "bases": bases_df.to_dict('records') if not bases_df.empty else [],
        "growths": growths_df.to_dict('records') if not growths_df.empty else [],
        "modifiers": modifiers_df.to_dict('records') if not modifiers_df.empty else [],
        "recruitment": recruit_df.to_dict('records') if not recruit_df.empty else []
    }, f, indent=2)

print("Scraped data written to dev/awakening_scraped_raw.json")
