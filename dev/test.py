import pandas as pd
url = "https://fireemblemwiki.org/wiki/Class_change/Nintendo_3DS_games"
storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
dfs = pd.read_html(url, storage_options=storage_options, match="Promotion options")
df = dfs[0]
print(df.head(10).to_string())
