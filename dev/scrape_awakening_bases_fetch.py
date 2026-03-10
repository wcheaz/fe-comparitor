import requests
from bs4 import BeautifulSoup
import json

def fetch():
    url = "https://serenesforest.net/awakening/classes/base-stats/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        
        tables = soup.find_all('table')
        target_table = None
        for t in tables:
            headers_text = [th.text.strip() for th in t.find_all('th')]
            if 'Class' in headers_text and 'HP' in headers_text and 'Str' in headers_text:
                target_table = t
                break
                
        if not target_table:
            print("Target table not found")
            return
            
        headers = [th.text.strip() for th in target_table.find_all('th')]
        data = []
        for row in target_table.find_all('tr')[1:]:
            cols = row.find_all('td')
            if len(cols) == len(headers):
                row_data = {h: cols[i].text.strip() for i, h in enumerate(headers)}
                data.append(row_data)
                
        with open("../dev/awakening_class_bases_raw.json", "w") as f:
            json.dump(data, f, indent=2)
            
        print(f"Saved {len(data)} rows.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch()
